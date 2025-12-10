"use client";
import React, { useState } from "react";
import { FileText } from "lucide-react"; 

import FinanceiroEntradasMatriz from "@/components/FinanceiroMatriz/FinanceiroEntradasMatriz/FinanceiroEntradasMatriz";
import FinanceiroSaida from "@/components/FinanceiroMatriz/FinanceiroFuncionarioMatriz/FinanceiroSaídaMatriz/FinanceiroSaidaMatriz";
import FinanceiroFornecedor from "@/components/FinanceiroMatriz/FinanceiroFornecedorMatriz/FinanceiroFornecedorMatriz";
import FinanceiroFuncionarios from "@/components/FinanceiroMatriz/FinanceiroFuncionarioMatriz/FinanceiroFuncionariosMatriz";
import FinanceiroFluxoCaixa from "@/components/FinanceiroMatriz/FinanceiroFluxoCaixaMatriz/FinanceiroFluxoCaixaMatriz";
import ExportarRelatorios from "@/components/FinanceiroMatriz/RelatoriosMatriz/ExportarRelatorios"; 
import Chart from "@/components/FinanceiroMatriz/ChartsMatriz/charts";
import "./ModuleFinanceiroMatriz.css";

export default function Financeiro() {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowExportModal(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#566363] text-white p-4 rounded-full shadow-lg hover:bg-[#465252] transition-all flex items-center gap-2 group"
        title="Exportar Relatórios"
      >
        <FileText size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
          Exportar Relatórios
        </span>
      </button>

      <div className="FinanceiroInicial">
        <FinanceiroFluxoCaixa onExportClick={() => setShowExportModal(true)} />
      </div>
      
      <Chart />
      
      <div className="FinanceiroDivisao">
        <FinanceiroEntradasMatriz  />
      </div>

      

    

      <div className="FinanceiroDivisao">
        <FinanceiroFuncionarios />
      </div>

<div className="FinanceiroDivisao">
        <FinanceiroSaida />
      </div>

      

      {showExportModal && (
        <ExportarRelatorios onClose={() => setShowExportModal(false)} />
      )}
    </>
  );
}