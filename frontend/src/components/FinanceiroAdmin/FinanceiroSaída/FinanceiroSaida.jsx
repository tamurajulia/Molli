"use client";

import React, { useState, useEffect } from "react";
import { ChartNoAxesCombined, Plus, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";
import "./FinanceiroAdmSaida.css";

export default function FinanceiroSaida() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [novaConta, setNovaConta] = useState({ descricao: "", valor: "", vencimento: "", status: "Pendente" });

  // 🔥 NOVOS ESTADOS
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  async function carregarDados() {
    const token = getCookie("token");
    try {
      const res = await fetch("http://localhost:3001/contas", { headers: { Authorization: token } });
      if (res.ok) setDespesas(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarDados(); }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    try {
      const res = await fetch("http://localhost:3001/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(novaConta)
      });
      if (res.ok) {
        alert("Conta criada!");
        setModalAberto(false);
        setNovaConta({ descricao: "", valor: "", vencimento: "", status: "Pendente" });
        carregarDados();
      }
    } catch (error) { console.error(error); }
  };

  // 🔥 NOVA FUNÇÃO: Confirmar pagamento
  const mudarStatus = async () => {
    if (!contaSelecionada) return;
    const token = getCookie("token");

    await fetch(`http://localhost:3001/contas/${contaSelecionada.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ status: "Pago" })
    });

    setModalConfirmar(false);
    setContaSelecionada(null);
    carregarDados();
  };

  const despesasFiltradas = despesas.filter(i => filtroStatus ? i.status === filtroStatus : true);

  // Paginação lógica
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = despesasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(despesasFiltradas.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="titulo d-flex align-items-center gap-2">
          <ChartNoAxesCombined className="iconeTitulo" size={22} />
          <span className="titulo-preto">Despesas da</span>
          <span className="titulo-verde">Filial:</span>
        </h2>
        <button onClick={() => setModalAberto(true)} className="btn-add flex items-center gap-2 bg-[#566363] text-white px-4 py-2 rounded">
          <Plus size={18} /> Nova Saída
        </button>
      </div>

      <div className="filtros mt-5">
        <div className="campo">
          <label className="tituloinput">Status:</label>
          <select className="inputFocus" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Atrasado">Atrasado</option>
          </select>
        </div>
      </div>

      <span className="titulofinanceiro mt-4 block">Resultados:</span>

      <div className="tabelaContainer mb-13">
        <h3 className="subtitulo">Despesas</h3>
        <div className="tabelaContainer">
          <table className="tabela table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Vencimento</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Carregando...</td></tr>
              ) : (
                itensAtuais.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.vencimento).toLocaleDateString("pt-BR")}</td>
                    <td>{item.descricao}</td>
                    <td>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className={item.status === 'Pago' ? 'text-green-600 font-bold' : 'text-red-500'}>{item.status}</td>
                    <td className="text-center">

                      {/* 🔥 Botão desativado quando Pago */}
                      <button
                        onClick={() => {
                          if (item.status === "Pago") return;
                          setContaSelecionada(item);
                          setModalConfirmar(true);
                        }}
                        title={item.status === "Pago" ? "Conta já paga" : "Marcar como paga"}
                        disabled={item.status === "Pago"}
                        className={item.status === "Pago" ? "opacity-40 cursor-not-allowed" : ""}
                      >
                        <CheckCircle size={18} className="text-gray-500 hover:text-green-600" />
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {despesasFiltradas.length > itensPorPagina && (
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

      {/* Modal Criar Conta */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="font-bold text-lg mb-4">Nova Conta</h3>
            <form onSubmit={handleCriar} className="flex flex-col gap-3">
              <input type="text" placeholder="Descrição" required className="p-2 border rounded"
                value={novaConta.descricao} onChange={e => setNovaConta({ ...novaConta, descricao: e.target.value })} />
              <input type="number" placeholder="Valor" required className="p-2 border rounded"
                value={novaConta.valor} onChange={e => setNovaConta({ ...novaConta, valor: e.target.value })} />
              <input type="date" required className="p-2 border rounded"
                value={novaConta.vencimento} onChange={e => setNovaConta({ ...novaConta, vencimento: e.target.value })} />

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setModalAberto(false)} className="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1 bg-[#566363] text-white rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DE CONFIRMAÇÃO DE PAGAMENTO */}
      {modalConfirmar && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="font-bold text-lg mb-4">Confirmar Pagamento</h3>

            <p className="mb-4">
              Deseja realmente marcar
              <span className="font-bold text-green-600"> {contaSelecionada?.descricao} </span>
              como <span className="font-bold">Paga</span>? <br />
              (essa ação não pode ser desfeita)
            </p>

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => { setModalConfirmar(false); setContaSelecionada(null); }}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={mudarStatus}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
