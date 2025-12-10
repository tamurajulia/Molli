'use client';

import { ChartNoAxesCombined } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function FinanceiroFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  useEffect(() => {
    async function carregarDados() {
        const token = getCookie("token");
        try {
            const res = await fetch("http://localhost:3001/financeiro/salarios", { headers: { Authorization: token } });
            if (res.ok) setFuncionarios(await res.json());
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    carregarDados();
  }, []);

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosAtuais = funcionarios.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(funcionarios.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo d-flex align-items-center gap-2 mb-4">
        <ChartNoAxesCombined className="iconeTitulo" size={22} />
        <span className="titulo-preto">Folha de</span>
        <span className="titulo-verde"> Pagamento (Previsão):</span>
      </h2>

      <span className="titulofinanceiro mt-4 block">Resultados:</span>

      <div className="tabelaContainer mb-13">
        <h3 className="subtitulo">pagamento</h3>
        <div className="tabelaContainer">
          <table className="tabela table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Salário Base</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="3" className="text-center p-4">Carregando...</td></tr> :
                funcionariosAtuais.map(f => (
                  <tr key={f.id}>
                    <td>{f.funcionario}</td>
                    <td>{f.cargo}</td>
                    <td>{Number(f.salario).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {funcionarios.length > itensPorPagina && (
        <div className="paginacao-container flex justify-end pt-4 pb-4">
          <button className="btn-paginacao" onClick={paginaAnterior} disabled={paginaAtual === 1}>
            <ChevronLeft size={20} />
          </button>

          <span className="info-paginacao">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button className="btn-paginacao" onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
