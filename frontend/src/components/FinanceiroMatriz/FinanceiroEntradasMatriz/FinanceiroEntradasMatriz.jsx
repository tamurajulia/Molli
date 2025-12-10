'use client';

import { ChevronLeft, ChevronRight,ChartNoAxesCombined } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import "./financeiroMatriz.css";

export default function FinanceiroEntradaMatriz() {
  const [entradas, setEntradas] = useState([]);
  const [filtroLoja, setFiltroLoja] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para a paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  // Busca dados reais
  useEffect(() => {
    async function carregarDados() {
      const token = getCookie("token");
      try {
        const res = await fetch("http://localhost:3001/financeiro/entradas", {
          headers: { Authorization: token },
        });
        if (res.ok) {
          const data = await res.json();
          setEntradas(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const entradasFiltradas = entradas.filter((item) => {
    const lojaMatch = filtroLoja ? item.loja.toLowerCase().includes(filtroLoja.toLowerCase()) : true;
    const valorMatch = filtroValor ? String(item.valor).includes(filtroValor) : true;
    return lojaMatch && valorMatch;
  });

  // Páginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = entradasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(entradasFiltradas.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container tabelaContainer">
      <h2 className="titulo d-flex align-items-center gap-2 mb-2">
        <ChartNoAxesCombined className="iconeTitulo" size={22} />
        <span className="titulo-preto">Entradas de Todas as</span>
        <span className="titulo-preto1">Lojas:</span>
      </h2>

      <div className="filtros mt-5">
        <div className="campo">
          <label className="tituloinput">Filtrar por Loja:</label>
          <input
            type="text"
            placeholder="Ex: Loja 1"
            className="inputFocus"
            value={filtroLoja}
            onChange={(e) => setFiltroLoja(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="tituloinput">Valor Aproximado:</label>
          <input
            type="text"
            placeholder="Ex: 150"
            className="inputFocus"
            value={filtroValor}
            onChange={(e) => setFiltroValor(e.target.value)}
          />
        </div>
      </div>

      <h3 className="subtituloMatriz mt-4">Entradas (Pedidos)</h3>

      <div className="tabelaContainer">
        <table className="tabelaMatriz table table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Loja</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Forma Pgto</th>
              <th>Valor</th>
              <th>Registro (Vendedor)</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center p-4">Carregando...</td></tr>
            ) : itensAtuais.length > 0 ? (
              itensAtuais.map((item) => (
                <tr key={item.id}>
                  <td>{item.loja}</td>
                  <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                  <td>{item.descricao}</td>
                  <td>{item.tipoEntrada}</td>
                  <td>{item.formaPagamento}</td>
                  <td className="fw-bold text-success">
                    {Number(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td>{item.Registro}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Nenhuma entrada encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {entradasFiltradas.length > itensPorPagina && (
          <div className="paginacao-container flex justify-end pt-4 pb-4">
            <button className="btn-paginacao cursor-pointer" onClick={paginaAnterior} disabled={paginaAtual === 1}>
              <ChevronLeft size={20} />
            </button>

            <span className="info-paginacao">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button className="btn-paginacao cursor-pointer" onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}