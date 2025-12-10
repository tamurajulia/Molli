import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

async function carregarImagemComoBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function gerarNotaFiscal(metodo, parcelas, subtotal, carrinho) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Courier);

  const logoBase64 = await carregarImagemComoBase64(
    '/IMG/notaFiscal/imgnotafiscal.png'
  );
  const logoBytes = await fetch(logoBase64).then((res) => res.arrayBuffer());
  const logoImage = await pdf.embedPng(logoBytes);

  let page = pdf.addPage([400, 540]);
  const { width, height } = page.getSize();
  let y = height - 30;

  const desenharCabecalho = (paginaAtual) => {
    const logoWidth = 100;
    const logoHeight = 40;
    const logoX = (width - logoWidth) / 2;

    paginaAtual.drawImage(logoImage, {
      x: logoX,
      y: height - 60,
      width: logoWidth,
      height: logoHeight,
    });
    return height - 80;
  };

  y = desenharCabecalho(page);

  const checkPageBreak = () => {
    if (y < 60) {
      page = pdf.addPage([400, 540]);
      y = desenharCabecalho(page);
    }
  };

  const escreve = (texto, size = 12, offsetY = 16) => {
    checkPageBreak();
    page.drawText(texto, { x: 40, y, size, font, color: rgb(0, 0, 0) });
    y -= offsetY;
  };

  const dataAtual = new Date().toLocaleString('pt-BR');

  escreve(`Data: ${dataAtual}`);
  escreve('NOTA FISCAL', 16, 24);
  escreve('-------------------------------------');

  carrinho.forEach((item) => {
    escreve(`${item.nome}`);
    escreve(
      `Qtd: ${item.qtd} | Unit: R$${item.preco.toFixed(2)} | Total: R$${(
        item.qtd * item.preco
      ).toFixed(2)}`
    );
    escreve('-------------------------------------');
  });

  escreve(`Subtotal: R$${subtotal.toFixed(2)}`, 12, 18);
  escreve(`Total: R$${subtotal.toFixed(2)}`, 14, 22);

  checkPageBreak();
  escreve('----- MÉTODO DE PAGAMENTO -----', 12, 20);

  if (metodo === 'pix') {
    escreve('PIX - Pagamento à vista');
  } else if (metodo === 'débito') {
    escreve('Cartão de Débito - Pagamento à vista');
  } else if (metodo === 'crédito') {
    escreve('Cartão de Crédito');
    if (parcelas) {
      escreve(`Parcelado em ${parcelas}`);
    } else {
      escreve('Pagamento à vista');
    }
  }

  escreve('-------------------------------------');
  escreve('Obrigado pela preferência!', 10, 22);

  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `Nota_Fiscal_${Date.now()}.pdf`);
}
