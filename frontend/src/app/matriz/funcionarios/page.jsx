'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./funcionarios.css";
import { Users, XCircle, Edit3, UserCheck, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";

export default function Funcionarios() {
  const [isMobile, setIsMobile] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cargoFiltro, setCargoFiltro] = useState("");
  const [filialFiltro, setFilialFiltro] = useState("");
  
  const [idExcluir, setIdExcluir] = useState(null);
  const [idStatus, setIdStatus] = useState(null);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function carregarDados() {
    const token = getCookie("token");
    try {
      const [resFunc, resFilial] = await Promise.all([
        fetch("http://localhost:3001/funcionario", { headers: { Authorization: token } }),
        fetch("http://localhost:3001/filial", { headers: { Authorization: token } })
      ]);

      if (resFunc.ok && resFilial.ok) {
        const dataFunc = await resFunc.json();
        const dataFilial = await resFilial.json();
        setFuncionarios(dataFunc);
        setFiliais(dataFilial);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getNomeFilial = (id) => {
    const filial = filiais.find(f => f.id === id);
    return filial ? filial.endereco : "Matriz/N/A";
  };

  const getNomeCargo = (id) => {
    const cargos = { 1: "Admin", 2: "Gerente", 3: "Estoquista", 4: "Caixa" };
    return cargos[id] || `Cargo ${id}`;
  };

  const funcionariosFiltrados = funcionarios.filter((item) => {
    const cargoMatch = cargoFiltro ? String(item.id_funcao) === cargoFiltro : true;
    const filialMatch = filialFiltro ? String(item.id_filial) === filialFiltro : true;
    return cargoMatch && filialMatch;
  });

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = funcionariosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const alterarStatus = async () => {
    const token = getCookie("token");
    const func = funcionarios.find(f => f.id === idStatus);
    const novoStatus = func.ativo ? 0 : 1;

    try {
      await fetch(`http://localhost:3001/funcionario/${idStatus}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ ativo: novoStatus })
      });
      carregarDados();
      setIdStatus(null);
    } catch (error) {
      console.error(error);
    }
  };

  const formatarSalario = (valor) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container">
      <h2 className="titulo">
        <Users className="iconeTitulo" size={22} />
        <span className="titulo-preto">Gerenciamento de</span>
        <span className="titulo-verde"> Funcionários:</span>
      </h2>
      <div className="filtros">
        <div className="campo">
          <label className="titulo-preto">Cargo:</label>
          <select
            className="inputFocus"
            value={cargoFiltro}
            onChange={(e) => setCargoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="2">Gerente</option>
            <option value="3">Estoquista</option>
            <option value="4">Caixa</option>
          </select>
        </div>

        <div className="campo">
          <label className="titulo-preto">Filial vinculada:</label>
          <select
            className="inputFocus"
            value={filialFiltro}
            onChange={(e) => setFilialFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {filiais.map((f) => (
              <option key={f.id} value={f.id}>
                {f.endereco}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Link href="/matriz/funcionarios/cadastrar">
        <button className="botao-cadastrar">Cadastrar</button>
      </Link>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Funcionários</h3>

        {loading ? <p className="p-5 text-center">Carregando...</p> : !isMobile ? (
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Filial</th>
                <th>Salário</th>
                <th>Status</th>
                <th className="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.map((item) => (
                <tr key={item.id} className={!item.ativo ? "linha-desativado" : ""}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{getNomeCargo(item.id_funcao)}</td>
                  <td>{getNomeFilial(item.id_filial)}</td>
                  <td>{formatarSalario(item.salario)}</td>
                  <td className={item.ativo ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                    {item.ativo ? "Ativo" : "Inativo"}
                  </td>
                  <td className="acoes text-center">
                    <Link href={`/matriz/funcionarios/editar/${item.id}`}>
                      <Edit3 className="icone" title="Editar" />
                    </Link>
                    <UserCheck className="icone" title="Alterar Status" onClick={() => setIdStatus(item.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          itensAtuais.map((item) => (
            <div className={`card-fornecedor ${!item.ativo ? "desativado" : ""}`} key={item.id}>
              <div><strong>ID:</strong> {item.id}</div>
              <div><strong>Funcionário:</strong> {item.nome}</div>
              <div><strong>Cargo:</strong> {getNomeCargo(item.id_funcao)}</div>
              <div><strong>Filial:</strong> {getNomeFilial(item.id_filial)}</div>
              <div><strong>Salário:</strong> {formatarSalario(item.salario)}</div>
              <div><strong>Status:</strong> {item.ativo ? "Ativo" : "Inativo"}</div>
              <div className="acoes">
                <Link href={`/matriz/funcionarios/editar/${item.id}`}>
                  <Edit3 className="icone" />
                </Link>
                <UserCheck className="icone" onClick={() => setIdStatus(item.id)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {funcionariosFiltrados.length > itensPorPagina && (
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

      {idStatus && (
        <div className="modal-overlay" onClick={() => setIdStatus(null)}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <UserCheck size={22} className="icone-modal" style={{ color: "#8FAAA3" }} />
              <h3>Alterar status</h3>
            </div>
            <p>Deseja alterar o status deste funcionário?</p>
            <div className="botoes-modal">
              <button className="btn-cancelar" onClick={() => setIdStatus(null)}>Cancelar</button>
              <button className="btn-confirmar" style={{ backgroundColor: "#8FAAA3" }} onClick={alterarStatus}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
