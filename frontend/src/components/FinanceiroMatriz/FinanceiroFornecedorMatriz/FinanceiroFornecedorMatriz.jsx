'use client';

import { ChartNoAxesCombined, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const FinanceiroFornecedor = () => {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  useEffect(() => {
    async function carregarDados() {
      const token = getCookie("token");
      try {
        // Busca as contas (que representam pagamentos a fornecedores)
        const res = await fetch("http://localhost:3001/contas", {
          headers: { Authorization: token }
        });
        if (res.ok) {
          const data = await res.json();
          setFornecedores(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const fornecedoresFiltrados = fornecedores.filter((item) => {
    const valorStr = String(item.valor);
    const matchValor = filtroValor ? valorStr.includes(filtroValor) : true;
    const matchStatus = filtroStatus ? item.status === filtroStatus : true;
    return matchValor && matchStatus;
  });

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = fornecedoresFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo d-flex align-items-center gap-2 mb-4">
        <ChartNoAxesCombined className="iconeTitulo" size={22} />
        <span className="titulo-preto">Financeiro dos</span>
        <span className="titulo-verde"> Fornecedores:</span>
      </h2>

      <div className="filtros mt-5 mb-4 p-1">
        <div className="campo">
          <label className="tituloinput">Valor:</label>
          <input
            type="text"
            className="inputFocus"
            placeholder="Ex: 1200"
            value={filtroValor}
            onChange={(e) => setFiltroValor(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="tituloinput">Status:</label>
          <select
            className="form-select inputFocus"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Atrasado">Atrasado</option>
          </select>
        </div>
      </div>

      <span className="titulofinanceiro  mt-5">Histórico de Pagamentos:</span>
      <div className="tabelaContainer mt-2">
        <h3 className="subtitulo bg-[#566363]">Pagamentos</h3>
        <table className="tabela table table-striped align-middle">
          <thead className="table-light bg-[#D1D5D5] ">
            <tr>
              <th>Vencimento</th>
              <th>Descrição (Fornecedor)</th>
              <th>Valor</th>
              <th>Status</th>
              <th className="text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Carregando...</td></tr>
            ) : itensAtuais.length > 0 ? (
              itensAtuais.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.vencimento).toLocaleDateString("pt-BR")}</td>
                  <td>{item.descricao}</td>
                  <td>
                    {Number(item.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </td>
                  <td className={`fw-semibold ${item.status === 'Pago' ? 'text-success' : item.status === 'Atrasado' ? 'text-danger' : 'text-warning'}`}>
                    {item.status}
                  </td>
                  <td className="text-center">
                    <Edit3
                      className="icone text-secondary"
                      size={18}
                      title="Editar"
                      role="button"
                      // Aqui você pode criar uma rota de edição específica se desejar
                      onClick={() => alert(`Editar conta ID: ${item.id}`)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">Nenhum resultado encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controle de Paginação */}
      {fornecedoresFiltrados.length > itensPorPagina && (
        <div className="paginacao-container flex justify-end pt-4 pb-4">
          <button className="btn-paginacao cursor-pointer" onClick={paginaAnterior} disabled={paginaAtual === 1}>
            <ChevronLeft />
          </button>

          <span className="info-paginacao">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button className="btn-paginacao cursor-pointer" onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default FinanceiroFornecedor;
