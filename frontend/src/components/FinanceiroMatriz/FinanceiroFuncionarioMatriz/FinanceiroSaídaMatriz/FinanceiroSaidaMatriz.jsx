'use client';

import React, { useState, useEffect } from "react";
import { ChartNoAxesCombined, Edit3, Trash2, Plus, CheckCircle, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";
import "./FinanceiroSaidaMatriz.css";

export default function FinanceiroSaida() {
  const [despesas, setDespesas] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroFilial, setFiltroFilial] = useState(""); 
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [novaConta, setNovaConta] = useState({
    descricao: "", valor: "", vencimento: "", status: "Pendente", id_filial: ""
  });

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function carregarDados() {
    const token = getCookie("token");
    try {
      const [resContas, resFiliais] = await Promise.all([
        fetch("http://localhost:3001/contas", { headers: { Authorization: token } }),
        fetch("http://localhost:3001/filial", { headers: { Authorization: token } })
      ]);

      if (resContas.ok && resFiliais.ok) {
        const dataContas = await resContas.json();
        const dataFiliais = await resFiliais.json();
        setDespesas(dataContas);
        setFiliais(dataFiliais);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

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
        setNovaConta({ descricao: "", valor: "", vencimento: "", status: "Pendente", id_filial: "" });
        carregarDados();
      }
    } catch (error) { console.error(error); }
  };

  const mudarStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === "Pago" ? "Pendente" : "Pago";
    const token = getCookie("token");
    try {
      await fetch(`http://localhost:3001/contas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ status: novoStatus })
      });
      carregarDados();
    } catch (error) { console.error(error); }
  };

  const excluirConta = async (id) => {
    if (!confirm("Excluir conta?")) return;
    const token = getCookie("token");
    try {
      await fetch(`http://localhost:3001/contas/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      carregarDados();
    } catch (error) { console.error(error); }
  };

  const getNomeFilial = (id) => {
    if (!id) return "N/A";
    const filial = filiais.find(f => f.id === id);
    return filial ? `Filial ${filial.id}` : "Matriz/Outra"; 
  };

  const despesasFiltradas = despesas.filter((item) => {
    const valorItemStr = String(item.valor);
    const matchValor = filtroValor ? valorItemStr.includes(filtroValor) : true;
    const matchStatus = filtroStatus ? item.status === filtroStatus : true;
    const matchFilial = filtroFilial ? String(item.id_filial) === filtroFilial : true;
    
    return matchValor && matchStatus && matchFilial;
  });

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = despesasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(despesasFiltradas.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container-financeiro tabelaContainer">
      <div className="flex justify-between items-center mb-4">
        <h2 className="titulo d-flex align-items-center gap-2">
            <ChartNoAxesCombined className="iconeTitulo" size={22} />
            <span className="titulo-preto">Saídas do</span>
            <span className="titulo-verde">Caixa (Contas):</span>
        </h2>
        <button 
            onClick={() => setModalAberto(true)}
            className="bg-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-[#465252]"
        >
            <Plus size={18} /> Nova Saída
        </button>
      </div>

      <div className="filtros mt-5 mb-3 flex gap-4 flex-wrap">
        <div className="campo">
          <label className="tituloinput">Valor:</label>
          <input
            type="text"
            className="inputFocus"
            placeholder="Ex: 150"
            value={filtroValor}
            onChange={(e) => setFiltroValor(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="tituloinput">Status:</label>
          <select
            className="inputFocus"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Atrasado">Atrasado</option>
          </select>
        </div>

        <div className="campo">
          <label className="tituloinput">Filial:</label>
          <select
            className="inputFocus"
            value={filtroFilial}
            onChange={(e) => setFiltroFilial(e.target.value)}
          >
            <option value="">Todas</option>
            {filiais.map(f => (
                <option key={f.id} value={f.id}>{f.endereco ? f.endereco.substring(0, 25) + "..." : `Filial ${f.id}`}</option>
            ))}
          </select>
        </div>
      </div>

      <span className="titulofinanceiro">Resultados:</span>

 <h3 className="subtitulo bg-[#566363] mt-5">saída do caixa</h3>
      <div className="tabelaContainer ">
        <table className="tabela table table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Vencimento</th>
              <th>Filial</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Status</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="text-center p-4">Carregando...</td></tr>
            ) : itensAtuais.length > 0 ? (
              itensAtuais.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.vencimento).toLocaleDateString("pt-BR")}</td>
                  <td className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Building2 size={14}/> {getNomeFilial(item.id_filial)}
                    </div>
                  </td>
                  <td>{item.descricao}</td>
                  <td>{Number(item.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                  <td className={`font-semibold ${item.status === 'Pago' ? 'text-green-600' : item.status === 'Atrasado' ? 'text-red-500' : 'text-orange-500'}`}>
                    {item.status}
                  </td>
                  <td className="text-center flex justify-center gap-3">
                    <button onClick={() => mudarStatus(item.id, item.status)} title="Alterar Status">
                        <CheckCircle size={18} className={item.status === 'Pago' ? 'text-green-600' : 'text-gray-400'} />
                    </button>
                    <button onClick={() => excluirConta(item.id)} title="Excluir">
                        <Trash2 size={18} className="text-red-400 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  Nenhuma conta encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {despesasFiltradas.length > itensPorPagina && (
        <div className="paginacao-container flex justify-end pt-4 pb-4">
          <button className="btn-paginacao" onClick={paginaAnterior} disabled={paginaAtual === 1}>
            <ChevronLeft />
          </button>

          <span className="info-paginacao">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button className="btn-paginacao" onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
            <ChevronRight />
          </button>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="font-bold text-lg mb-4 text-[#2e4d49]">Nova Conta a Pagar</h3>
                <form onSubmit={handleCriar} className="flex flex-col gap-3">
                    <input 
                        type="text" placeholder="Descrição" required 
                        className="p-2 border rounded"
                        value={novaConta.descricao} onChange={e => setNovaConta({...novaConta, descricao: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Valor" required 
                        className="p-2 border rounded"
                        value={novaConta.valor} onChange={e => setNovaConta({...novaConta, valor: e.target.value})}
                    />
                    <input 
                        type="date" required 
                        className="p-2 border rounded"
                        value={novaConta.vencimento} onChange={e => setNovaConta({...novaConta, vencimento: e.target.value})}
                    />
                    <select
                        className="p-2 border rounded"
                        value={novaConta.id_filial}
                        onChange={e => setNovaConta({...novaConta, id_filial: e.target.value})}
                        required
                    >
                        <option value="">Selecione a Filial</option>
                        {filiais.map(f => (
                            <option key={f.id} value={f.id}>{f.endereco || `Filial ${f.id}`}</option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => setModalAberto(false)} className="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
                        <button type="submit" className="px-3 py-1 bg-[#566363] text-white rounded">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
