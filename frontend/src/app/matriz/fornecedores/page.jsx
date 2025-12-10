'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./fornecedoresMatriz.css";
import { Settings, Edit3, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

export default function FornecedoresTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [fornecedorExcluir, setFornecedorExcluir] = useState(null);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function carregarFornecedores() {
    try {
      const res = await fetch("http://localhost:3001/fornecedores");
      const data = await res.json();
      setFornecedores(data);
      setDadosFiltrados(data);
    } catch (err) {
      console.log("Erro ao carregar fornecedores", err);
    }
  }

  useEffect(() => {
    carregarFornecedores();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const aplicarFiltro = () => {
    const filtrados = fornecedores.filter((item) => {
      const matchFornecedor = filtroFornecedor
        ? item.nome.toLowerCase().includes(filtroFornecedor.toLowerCase())
        : true;

      const matchCategoria = filtroCategoria
        ? item.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
        : true;

      return matchFornecedor && matchCategoria;
    });

    setDadosFiltrados(filtrados);
  };

  const confirmarExclusao = async () => {
    try {
      await fetch(
        `http://localhost:3001/fornecedores/${fornecedorExcluir.id}`,
        { method: "DELETE" }
      );

      setFornecedores((prev) =>
        prev.filter((f) => f.id !== fornecedorExcluir.id)
      );
      setDadosFiltrados((prev) =>
        prev.filter((f) => f.id !== fornecedorExcluir.id)
      );

      setFornecedorExcluir(null);
    } catch (err) {
      console.log("Erro ao excluir fornecedor", err);
    }
  };

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = dadosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo">
        <Settings className="iconeTitulo" size={22} />
        <span className="titulo-preto">Gerenciamento de</span>
        <span className="titulo-verde"> Fornecedores:</span>
      </h2>

      {/* FILTROS */}
      <div className="filtros mt-5">
        <div className="campo">
          <label className="tituloInput">Nome do Fornecedor:</label>
          <input
            type="text"
            className="inputFocus"
            placeholder="Insira o fornecedor"
            value={filtroFornecedor}
            onChange={(e) => setFiltroFornecedor(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="tituloInput">Categoria:</label>
          <input
            type="text"
            className="inputFocus"
            placeholder="Ex: Roupas"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          />
        </div>

        <button className="btnFiltrar" onClick={aplicarFiltro}>
          Filtrar
        </button>
      </div>

      <Link href="/matriz/fornecedores/cadastrar">
        <button className="botao-cadastrar">Cadastrar</button>
      </Link>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Fornecedores</h3>

        {!isMobile ? (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fornecedor</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Categoria</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensAtuais.length > 0 ? (
                  itensAtuais.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nome}</td>
                      <td>{item.cnpj}</td>
                      <td>{item.telefone}</td>
                      <td>{item.endereco}</td>
                      <td>{item.categoria}</td>
                      <td className="acoes text-center">
                        <Link
                          href={`/matriz/fornecedores/editar/${item.id}`}
                        >
                          <Edit3 className="icone" title="Editar" />
                        </Link>
                        <Trash2
                          className="icone icone-excluir"
                          title="Excluir"
                          onClick={() => setFornecedorExcluir(item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-3">
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          itensAtuais.map((item) => (
            <div className="card-fornecedor" key={item.id}>
              <div><strong>ID:</strong> {item.id}</div>
              <div><strong>Fornecedor:</strong> {item.nome}</div>
              <div><strong>CNPJ:</strong> {item.cnpj}</div>
              <div><strong>Telefone:</strong> {item.telefone}</div>
              <div><strong>Endereço:</strong> {item.endereco}</div>
              <div><strong>Categoria:</strong> {item.categoria}</div>
              <div className="acoes">
                <Link href={`/matriz/fornecedores/editar/${item.id}`}>
                  <Edit3 className="icone" />
                </Link>
                <Trash2
                  className="icone icone-excluir"
                  onClick={() => setFornecedorExcluir(item)}
                />
              </div>
            </div>
          ))
        )}

        {/* ------------------- PAGINAÇÃO ------------------- */}
        {dadosFiltrados.length > itensPorPagina && (
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

      {fornecedorExcluir && (
        <div className="modal-overlay">
          <div className="modal-excluir">
            <div className="modal-header">
              <AlertTriangle size={26} className="icone-modal" />
              <h3>Excluir Fornecedor</h3>
            </div>
            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{fornecedorExcluir.nome}</strong>?
            </p>
            <div className="botoes-modal">
              <button
                className="btn-cancelar"
                onClick={() => setFornecedorExcluir(null)}
              >
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
