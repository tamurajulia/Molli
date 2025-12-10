import { criarPdv, buscarPdvAberto, fecharPdv } from '../models/Pdv.js';
import { lerVendasPdv } from '../models/Vendas.js';

const abrirCaixaController = async (req, res) => {
  try {
    const id_funcionario = req.func.id;
    const id_filial = req.func.id_filial;
    const caixasAbertos = await buscarPdvAberto(id_funcionario);

    if (caixasAbertos && caixasAbertos.length > 0) {
      let total = 0;
      const idAntigo = caixasAbertos[0].id;
      const vendasDoPdv = await lerVendasPdv(idAntigo);
      vendasDoPdv.map((pedido) => (total += Number(pedido.valor_total)));
      const quantidade = vendasDoPdv.length;
      const ticketMedioCalc = quantidade > 0 ? total / quantidade : 0;

      const dadosFechar = {
        fechado: new Date(),
        total_vendas: Number(total),
        qtd_vendas: quantidade,
        ticket_medio: Number(ticketMedioCalc),
      };

      await fecharPdv(idAntigo, dadosFechar);
    }

    const novoCaixa = await criarPdv({
      id_funcionario,
      id_filial,
    });

    return res.status(201).json({
      message: 'Caixa aberto com sucesso',
      dados: novoCaixa,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Erro ao processar abertura de caixa' });
  }
};

const lerCaixaController = async (req, res) => {
  try {
    const id_funcionario = req.func.id;
    const caixasAbertos = await buscarPdvAberto(id_funcionario);
    const id = caixasAbertos[0].id;

    const vendas = await lerVendasPdv(id);
    const credito = vendas.filter(
      (forma) => forma.metodo_pagamento === 'crédito'
    );
    const debito = vendas.filter(
      (forma) => forma.metodo_pagamento === 'débito'
    );
    const pix = vendas.filter((forma) => forma.metodo_pagamento === 'pix');

    let total = 0;
    let totalCredito = 0;
    let totalDebito = 0;
    let totalPix = 0;
    vendas.map((cada) => {
      total += Number(cada.valor_total);
    });
    credito.map((cada) => {
      totalCredito += Number(cada.valor_total);
    });
    debito.map((cada) => {
      totalDebito += Number(cada.valor_total);
    });
    pix.map((cada) => {
      totalPix += Number(cada.valor_total);
    });

    const data = {
      totalVendas: total,
      qtdVendas: vendas.length,
      ticketMedio: total / vendas.length,
      data: caixasAbertos[0].criado,
      credito: {
        totalVendas: totalCredito,
        qtdVendas: credito.length,
      },
      debito: {
        totalVendas: totalDebito,
        qtdVendas: debito.length,
      },
      pix: {
        totalVendas: totalPix,
        qtdVendas: pix.length,
      },
    };

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao ler vendas do pdv' });
  }
};

const fecharPdvController = async (req, res) => {
  try {
    const id_funcionario = req.func.id;
    const { total_vendas, qtd_vendas, ticket_medio } = req.body;
    const caixasAbertos = await buscarPdvAberto(id_funcionario);
    const id = caixasAbertos[0].id;

    const data = {
      total_vendas,
      qtd_vendas,
      ticket_medio,
      fechado: new Date(),
    };

    await fecharPdv(id, data);

    return res.status(201).json({ mensagem: 'Caixa fechado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao fechar pdv' });
  }
};

export { abrirCaixaController, lerCaixaController, fecharPdvController };
