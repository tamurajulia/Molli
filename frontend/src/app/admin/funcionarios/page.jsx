'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Users, XCircle, Edit3, UserCheck, AlertTriangle, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";
import './funcionarios.css';

export default function Funcionarios() {
  const [isMobile, setIsMobile] = useState(false);
  const [cargoFiltro, setCargoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [cargosUnicos, setCargosUnicos] = useState([]);
  const [userIdLogado, setUserIdLogado] = useState(null); // Novo estado para ID do usuário logado
  
  const [idExcluir, setIdExcluir] = useState(null);
  const [idStatus, setIdStatus] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // Função de carregamento inicial
  async function carregarDados() {
    const token = getCookie("token");
    const userId = getCookie("id_user"); // Pegamos o ID do usuário logado
    setUserIdLogado(userId ? parseInt(userId) : null);
    
    try {
        // Rota que retorna SÓ os funcionários da filial logada
        const resFunc = await fetch("http://localhost:3001/funcionario", { 
            headers: { Authorization: token } 
        });

        if (resFunc.ok) {
            let data = await resFunc.json();
            
            // FILTRO DE SEGURANÇA NO FRONT: Remove o próprio usuário logado (o Gerente)
            if (userId) {
                data = data.filter(f => String(f.id) !== userId);
            }

            setFuncionarios(data);
            setDadosFiltrados(data);

            // Extrai cargos únicos para o filtro
            const cargos = Array.from(new Set(data.map((f) => f.cargo)));
            setCargosUnicos(cargos);
        }
    } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
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

  // Aplica filtros (localmente no frontend)
  const filtrarFuncionarios = () => {
    const filtrados = funcionarios.filter((item) => {
      const cargoMatch = cargoFiltro ? item.cargo === cargoFiltro : true; 
      const statusMatch = statusFiltro ? String(item.ativo) === statusFiltro : true; 
      const nomeMatch = nomeFiltro
        ? item.nome.toLowerCase().includes(nomeFiltro.toLowerCase())
        : true;
        
      return cargoMatch && statusMatch && nomeMatch;
    });
    setDadosFiltrados(filtrados);
  };

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosAtuais = dadosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  // 1. Excluir Funcionário (DELETE)
  const excluirFuncionario = async () => {
    const token = getCookie("token");
    try {
        const res = await fetch(`http://localhost:3001/funcionario/${idExcluir}`, {
            method: 'DELETE',
            headers: { Authorization: token }
        });
        if (res.ok) {
            alert('Funcionário excluído!');
            carregarDados();
        } else {
            alert('Erro ao excluir funcionário.');
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
    } finally {
        setIdExcluir(null);
    }
  };

  // 2. Alternar status (Ativo/Desativado) (PUT)
  const confirmarStatusFuncionario = async () => {
    const token = getCookie("token");
    const func = funcionarios.find((f) => f.id === idStatus);
    const novoStatus = func.ativo ? 0 : 1; // Inverte o status (1 é Ativo, 0 é Desativado)

    try {
        const res = await fetch(`http://localhost:3001/funcionario/${idStatus}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify({ ativo: novoStatus })
        });
        if (res.ok) {
            alert(`Status alterado para ${novoStatus === 1 ? 'Ativo' : 'Desativado'}.`);
            carregarDados();
        } else {
            alert('Erro ao alterar status.');
        }
    } catch (error) {
        console.error("Erro ao alterar status:", error);
    } finally {
        setIdStatus(null);
    }
  };
  
  // Helper para formatar o status 0/1 em texto
  const formatStatus = (ativo) => (ativo ? "Ativo" : "Desativado");

  // Helper para formatar salário
  const formatSalario = (salario) => (
      Number(salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  );

  return (
    <div className="container">
      {/* Título */}
      <h2 className="titulo">
        <Users className="iconeTitulo" size={22} />
        <span className="titulo-preto">Gerenciamento de</span>
        <span className="titulo-verde"> Funcionários:</span>
      </h2>

      {/* FILTROS */}
      <div className="filtros">
        <div className="campo">
          <label className="tituloInput">Nome:</label>
          <input
            type="text"
            placeholder="Buscar por nome"
            className="inputFocus"
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="tituloInput">Cargo:</label>
          <select
            className="inputFocus"
            value={cargoFiltro}
            onChange={(e) => setCargoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {cargosUnicos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label className="tituloInput">Status:</label>
          <select
            className="inputFocus"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Ativo</option>
            <option value="0">Desativado</option>
          </select>
        </div>

        <button className="btnFiltrar" onClick={filtrarFuncionarios}>
          Filtrar
        </button>
      </div>

      {/* BOTÃO CADASTRAR */}
      <Link href="/admin/funcionarios/cadastrar">
        <button className="botao-cadastrar">Cadastrar</button>
      </Link>

      {/* TABELA */}
      <div className="tabelaContainer">
        <h3 className="subtitulo">Funcionários da sua Filial</h3>

        {loading ? (
            <p className="p-4 text-center">Carregando dados da equipe...</p>
        ) : !isMobile ? (
          <table className="tabela">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Salário</th>
                <th>Status</th>
                <th className="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nome}</td>
                    <td>{item.cargo}</td>
                    <td>{formatSalario(item.salario)}</td>
                    <td>{formatStatus(item.ativo)}</td>
                    <td className="acoes text-center">
                      <XCircle
                        className="icone icone-excluir"
                        title="Excluir"
                        onClick={() => setIdExcluir(item.id)}
                      />
                      {/* Link para Edição Dinâmica */}
                      <Link href={`/admin/funcionarios/editar/${item.id}`}>
                        <Edit3 className="icone" title="Editar" />
                      </Link>
                      <UserCheck
                        className="icone icone-status"
                        title={item.ativo ? "Desativar" : "Ativar"}
                        onClick={() => setIdStatus(item.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* Cards Mobile */
          dadosFiltrados.map((item) => (
            <div className="card-fornecedor" key={item.id}>
              <div><strong>ID:</strong> {item.id}</div>
              <div><strong>Funcionário:</strong> {item.nome}</div>
              <div><strong>Cargo:</strong> {item.cargo}</div>
              <div><strong>Salário:</strong> {formatSalario(item.salario)}</div>
              <div><strong>Status:</strong> {formatStatus(item.ativo)}</div>
              <div className="acoes">
                <XCircle className="icone icone-excluir" onClick={() => setIdExcluir(item.id)} />
                <Link href={`/admin/funcionarios/editar/${item.id}`}>
                  <Edit3 className="icone" />
                </Link>
                <UserCheck className="icone icone-status" onClick={() => setIdStatus(item.id)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL EXCLUIR */}
      {idExcluir && (
        <div className="modal-overlay" onClick={() => setIdExcluir(null)}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertTriangle size={22} className="icone-modal" />
              <h3>Confirmar exclusão</h3>
            </div>
            <p>Tem certeza que deseja excluir este funcionário?</p>
            <div className="botoes-modal">
              <button className="btn-cancelar" onClick={() => setIdExcluir(null)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={excluirFuncionario}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ATIVAR/DESATIVAR */}
      {idStatus && (
        <div className="modal-overlay" onClick={() => setIdStatus(null)}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <UserCheck size={22} className="icone-modal" style={{ color: "#8FAAA3" }} />
              <h3>Alterar status</h3>
            </div>
            <p>
              {formatStatus(funcionarios.find((f) => f.id === idStatus)?.ativo) === "Ativo"
                ? "Tem certeza que deseja desativar este funcionário?"
                : "Tem certeza que deseja ativar este funcionário?"}
            </p>
            <div className="botoes-modal">
              <button className="btn-cancelar" onClick={() => setIdStatus(null)}>
                Cancelar
              </button>
              <button
                className="btn-confirmar"
                style={{ backgroundColor: "#8FAAA3" }}
                onClick={confirmarStatusFuncionario}
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
