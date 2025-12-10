'use client';

import { ChartNoAxesCombined } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import "./financeiroAdm.css"; // Use seu CSS ou o global
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FinanceiroEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroRegistro, setFiltroRegistro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8; // Número de itens por página

  useEffect(() => {
    async function carregarDados() {
        const token = getCookie("token");
        try {
            const res = await fetch("http://localhost:3001/financeiro/entradas", {
                headers: { Authorization: token }
            });
            if (res.ok) {
                setEntradas(await res.json());
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
    const valorMatch = filtroValor ? String(item.valor).includes(filtroValor) : true;
    const registroMatch = filtroRegistro ? 
        (item.Registro || "").toLowerCase().includes(filtroRegistro.toLowerCase()) : true;
    return valorMatch && registroMatch;
  });

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = entradasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(entradasFiltradas.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo d-flex align-items-center gap-2 mb-4">
        <ChartNoAxesCombined className="iconeTitulo" size={22} />
        <span className="titulo-preto">Entradas do</span>
        <span className="titulo-verde">Caixa:</span>
      </h2>

      <div className="filtros mt-5">
        <div className="campo">
          <label className="tituloinput">Vendedor:</label>
          <input
            type="text" placeholder="Ex: João" className="inputFocus"
            value={filtroRegistro} onChange={(e) => setFiltroRegistro(e.target.value)}
          />
        </div>
        <div className="campo">
          <label className="tituloinput">Valor:</label>
          <input
            type="text" placeholder="Ex: 150" className="inputFocus"
            value={filtroValor} onChange={(e) => setFiltroValor(e.target.value)}
          />
        </div>
      </div>

      <span className="titulofinanceiro mt-4 block">Resultados:</span>

      <div className="tabelaContainer mb-13">
        <h3 className="subtitulo">Entradas</h3>
        <div className="tabelaContainer">
          <table className="tabela table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Pagamento</th>
                <th>Valor</th>
                <th>Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan="6" className="text-center p-4">Carregando...</td></tr>
              ) : itensAtuais.length > 0 ? (
                itensAtuais.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                    <td>{item.descricao}</td>
                    <td>{item.tipoEntrada}</td>
                    <td>{item.formaPagamento}</td>
                    <td className="font-bold text-green-600">
                      {Number(item.valor).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                    </td>
                    <td>{item.Registro}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center text-muted">Nenhuma entrada encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {entradasFiltradas.length > itensPorPagina && (
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
