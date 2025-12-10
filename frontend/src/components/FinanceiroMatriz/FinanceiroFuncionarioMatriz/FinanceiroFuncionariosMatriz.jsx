'use client';

import { ChartNoAxesCombined, Edit3, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import './funcionariosmatriz.css';

const FinanceiroFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroFilial, setFiltroFilial] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  // Busca dados iniciais
  useEffect(() => {
    async function carregarDados() {
      const token = getCookie("token");
      try {
        const [resSalarios, resFiliais] = await Promise.all([
          fetch("http://localhost:3001/financeiro/salarios", { headers: { Authorization: token } }),
          fetch("http://localhost:3001/filial", { headers: { Authorization: token } })
        ]);

        if (resSalarios.ok && resFiliais.ok) {
          const dataSalarios = await resSalarios.json();
          const dataFiliais = await resFiliais.json();

          const hoje = new Date();
          const dataPagto = `05/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;

          const dataFormatada = dataSalarios.map(f => ({
            ...f,
            dataPagamento: dataPagto
          }));

          setFuncionarios(dataFormatada);
          setFiliais(dataFiliais);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const funcionariosFiltrados = funcionarios.filter((item) => {
    const salarioMatch = filtroValor
      ? Number(item.salario) >= parseFloat(filtroValor.replace(",", "."))
      : true;

    const cargoMatch = filtroCargo ? item.cargo === filtroCargo : true;

    const statusMatch = filtroStatus ? item.status === filtroStatus : true;

    const filialMatch = filtroFilial ? String(item.id_filial) === filtroFilial : true;

    return salarioMatch && cargoMatch && statusMatch && filialMatch;
  });

  const cargosUnicos = [...new Set(funcionarios.map(f => f.cargo))];

  const getNomeFilial = (id) => {
    const f = filiais.find(item => item.id === id);
    return f ? f.endereco.split("-")[0].trim() : "Geral";
  };

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = funcionariosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo d-flex align-items-center gap-2 mb-4">
        <ChartNoAxesCombined className="iconeTitulo" size={22} />
        <span className="titulo-preto">Financeiro dos</span>
        <span className="titulo-verde"> Funcionários:</span>
      </h2>

      {/* ------------------- FILTROS ------------------- */}
      <div className="filtros mt-5 mb-4 p-1 flex flex-wrap gap-4">
        
        <div className="campo">
          <label className="tituloinput flex items-center gap-1">
            <Building2 size={14}/> Filial:
          </label>
          <select
            className="form-select inputFocus"
            value={filtroFilial}
            onChange={(e) => setFiltroFilial(e.target.value)}
          >
            <option value="">Todas as Filiais</option>
            {filiais.map(f => (
              <option key={f.id} value={f.id}>{f.endereco.split("-")[0]}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label className="tituloinput">Cargo:</label>
          <select
            className="form-select inputFocus"
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
          >
            <option value="">Todos</option>
            {cargosUnicos.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label className="tituloinput">Salário Mínimo:</label>
          <input
            type="text"
            className="inputFocus"
            placeholder="Ex: 2000"
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
          </select>
        </div>
      </div>

      {/* ------------------- TABELA ------------------- */}
      <div className="tabelaContainer mb-13">

        <span className="titulofinanceiro d-block mb-4">
          Projeção de Folha de Pagamento:
        </span>

        <h3 className="subtitulo">Funcionários</h3>

        <div className="tabelaContainer">
          <table className="tabela table table-striped align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Data Prevista</th>
                <th>Filial</th>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Salário</th>
                <th>Status</th>
                <th>Método</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center p-4">Carregando...</td></tr>
              ) : itensAtuais.length > 0 ? (
                itensAtuais.map((item) => (
                  <tr key={item.id}>
                    <td>{item.dataPagamento}</td>
                    <td>{getNomeFilial(item.id_filial)}</td>
                    <td>{item.funcionario}</td>
                    <td>{item.cargo}</td>
                    <td className="fw-bold text-[#2e4d49]">
                      {Number(item.salario).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Pago' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.metodo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    Nenhum funcionário encontrado com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- CARDS MOBILE ------------------- */}
      <div className="cardsMobile">
        {itensAtuais.map((item) => (
          <div className="cardFinanceiro" key={item.id}>
            <div className="linha-info"><strong>Data Pagto:</strong> <span>{item.dataPagamento}</span></div>
            <div className="linha-info"><strong>Filial:</strong> <span>{getNomeFilial(item.id_filial)}</span></div>
            <div className="linha-info"><strong>Funcionário:</strong> <span>{item.funcionario}</span></div>
            <div className="linha-info"><strong>Cargo:</strong> <span>{item.cargo}</span></div>
            <div className="linha-info">
              <strong>Salário:</strong>{" "}
              <span className="fw-bold text-[#2e4d49]">
                {Number(item.salario).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="linha-info"><strong>Status:</strong> <span>{item.status}</span></div>
          </div>
        ))}
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {funcionariosFiltrados.length > itensPorPagina && (
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
    </div>
  );
};

export default FinanceiroFuncionarios;
