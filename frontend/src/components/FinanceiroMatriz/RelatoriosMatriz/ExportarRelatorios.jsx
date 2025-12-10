"use client";
import React, { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function ExportarRelatorios({ onClose }) {
  const [tipoRelatorio, setTipoRelatorio] = useState("vendas"); 
  const [formato, setFormato] = useState("pdf");
  const [loading, setLoading] = useState(false);

  async function buscarDados(endpoint) {
    const token = getCookie("token");
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`, {
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error("Erro ao buscar dados");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const gerarPDF = (dados, titulo, colunas) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(titulo, 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

    const linhas = dados.map(item => colunas.map(col => item[col.key]));
    
    autoTable(doc, {
      startY: 40,
      head: [colunas.map(c => c.label)],
      body: linhas,
      theme: 'grid',
      headStyles: { fillColor: [86, 99, 99] }, 
      styles: { fontSize: 10 },
    });

    doc.save(`${titulo.toLowerCase().replace(/ /g, "_")}.pdf`);
  };

  const gerarCSV = (dados, titulo, colunas) => {
    const cabecalho = colunas.map(c => c.label).join(",");
    
    const linhas = dados.map(item => 
      colunas.map(col => `"${String(item[col.key] || '').replace(/"/g, '""')}"`).join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [cabecalho, ...linhas].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${titulo.toLowerCase().replace(/ /g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportar = async () => {
    setLoading(true);
    try {
      let dadosFormatados = [];
      let colunas = [];
      let titulo = "";

      if (tipoRelatorio === "vendas") {
        titulo = "Relatorio de Vendas e Entradas";
        const rawData = await buscarDados("financeiro/entradas");
        
        dadosFormatados = rawData.map(p => ({
            data: new Date(p.data).toLocaleDateString(),
            loja: p.loja,
            desc: p.descricao,
            tipo: p.tipoEntrada,
            pagto: p.formaPagamento,
            valor: Number(p.valor).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
        }));

        colunas = [
            { label: "Data", key: "data" },
            { label: "Loja", key: "loja" },
            { label: "Descrição", key: "desc" },
            { label: "Tipo", key: "tipo" },
            { label: "Pagamento", key: "pagto" },
            { label: "Valor", key: "valor" },
        ];

      } else if (tipoRelatorio === "contas") {
        titulo = "Relatorio de Contas a Pagar";
        const rawData = await buscarDados("contas");
        
        dadosFormatados = rawData.map(c => ({
            venc: new Date(c.vencimento).toLocaleDateString(),
            desc: c.descricao,
            status: c.status,
            valor: Number(c.valor).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
        }));

        colunas = [
            { label: "Vencimento", key: "venc" },
            { label: "Descrição", key: "desc" },
            { label: "Status", key: "status" },
            { label: "Valor", key: "valor" },
        ];
      }

      if (dadosFormatados.length === 0) {
        alert("Não há dados para exportar neste relatório.");
        setLoading(false);
        return;
      }

      if (formato === "pdf") {
        gerarPDF(dadosFormatados, titulo, colunas);
      } else {
        gerarCSV(dadosFormatados, titulo, colunas);
      }

      onClose(); 

    } catch (error) {
      console.error("Erro na exportação:", error);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-[#566363] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <FileText size={20} />
            <h3 className="font-semibold text-lg">Exportar Relatórios</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Selecione o Relatório:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTipoRelatorio("vendas")}
                className={`p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoRelatorio === "vendas"
                    ? "border-[#566363] bg-[#566363]/10 text-[#566363] ring-1 ring-[#566363]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>📈</span>
                Vendas & Entradas
              </button>
              <button
                onClick={() => setTipoRelatorio("contas")}
                className={`p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoRelatorio === "contas"
                    ? "border-[#566363] bg-[#566363]/10 text-[#566363] ring-1 ring-[#566363]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>💸</span>
                Contas a Pagar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Formato do Arquivo:</label>
            <div className="flex gap-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name="formato" 
                    checked={formato === "pdf"} 
                    onChange={() => setFormato("pdf")}
                    className="accent-[#566363] w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 font-medium">PDF (Documento)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name="formato" 
                    checked={formato === "csv"} 
                    onChange={() => setFormato("csv")}
                    className="accent-[#566363] w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 font-medium">CSV (Excel)</span>
              </label>
            </div>
          </div>

        </div>

        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleExportar}
            disabled={loading}
            className="px-6 py-2 bg-[#566363] hover:bg-[#454f4f] text-white rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-70 shadow-sm cursor-pointer"
          >
            {loading ? (
                <span>Gerando...</span>
            ) : (
                <>
                    <Download size={18} /> Baixar Arquivo
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}