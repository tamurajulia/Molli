'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './estoque.css';
import {
  BarChart3,
  Edit3,
  PackageSearch,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Hash,
  DoorOpen
} from 'lucide-react';
import { getCookie } from 'cookies-next';
import { logout } from '@/components/functions/logout';

export default function EstoqueTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [dados, setDados] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [semEstoque, setSemEstoque] = useState([]);

  const [filtroId, setFiltroId] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const [idExcluir, setIdExcluir] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [editarInfo, setEditarInfo] = useState(null);
  const [novaQtd, setNovaQtd] = useState(null);
  const [abrirCadastro, setAbrirCadastro] = useState(null);
  const [novoEstoque, setNovoEstoque] = useState(null);
  const [novoEstoqueQtd, setNovoEstoqueQtd] = useState(null);

  const [nome, setNome] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function pegarDados() {
    const franquia = getCookie('id_filial');
    if (franquia != undefined) {
      try {
        const response = await fetch(
          `http://localhost:3001/estoque/${franquia}`
        );
        if (response.ok) {
          const data = await response.json();
          setDados(data);
          setDadosFiltrados(data);
        } else {
          alert('error');
        }
      } catch (error) {
        console.error('Erro interno:', error);
      }

      const token = getCookie('token');
      try {
        const response = await fetch(
          `http://localhost:3001/estoque/semestoque`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSemEstoque(data);
        } else {
          alert('error');
        }
      } catch (error) {
        console.error('Erro interno ao buscar sem estoque:', error);
      }
    } else {
      return (window.location.href = '/');
    }
  }

  useEffect(() => {
    pegarDados();
    const nomeConst = getCookie('nome');
    setNome(nomeConst);

    const handleResize = () => setIsMobile(window.innerWidth <= 780);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editarInfo]);

  useEffect(() => {
    let resultado = dados;

    if (filtroId) {
      resultado = resultado.filter((item) =>
        String(item.id).includes(filtroId)
      );
    }

    if (filtroNome) {
      resultado = resultado.filter((item) =>
        item.produto.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    if (filtroStatus) {
      resultado = resultado.filter((item) => item.status === filtroStatus);
    }

    setDadosFiltrados(resultado);
    setPaginaAtual(1);
  }, [filtroId, filtroNome, filtroStatus, dados]);

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = dadosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const proximaPagina = () =>
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const abrirDetalhes = (item) => {
    setProdutoSelecionado(item);
  };

  async function editarEstoque(id_estoque) {
    if (novaQtd === null) return;
    if (novaQtd < 0) return;

    const token = getCookie('token');
    try {
      const res = await fetch(
        `http://localhost:3001/estoque/${id_estoque}?quantidade=${novaQtd}`,
        {
          method: 'PUT',
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEditarInfo(null);
        setNovaQtd(null);
        pegarDados();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro interno:', error);
    }
  }

  async function excluirItem(id_estoque) {
    const token = getCookie('token');
    try {
      const res = await fetch(`http://localhost:3001/estoque/${id_estoque}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIdExcluir(null);
        pegarDados();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro interno:', error);
    }
  }

  async function criarNovoEstoque() {
    if (novoEstoque === null) return;
    if (novoEstoqueQtd === null) return;
    const token = getCookie('token');
    try {
      const res = await fetch(
        `http://localhost:3001/estoque?id_produto=${novoEstoque}&quantidade=${novoEstoqueQtd}`,
        {
          method: 'POST',
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAbrirCadastro(null);
        setNovoEstoqueQtd(null);
        setNovoEstoque(null);
        pegarDados();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro interno:', error);
    }
  }

  return (
    <div className="container">
      {nome && <p className="text-lg mb-3 flex justify-between">Olá, {nome} <span className="flex cursor-pointer gap-1" onClick={logout}><DoorOpen /> Sair</span></p>}
      <h2 className="titulo">
        <BarChart3 className="iconeTitulo" size={22} />
        <span className="titulo-preto">Controle de</span>
        <span className="titulo-verde"> Estoque:</span>
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <button
          className="botao-cadastrar"
          onClick={() => {
            setAbrirCadastro('aa');
          }}
        >
          Cadastrar
        </button>

        {abrirCadastro && (
          <div className="modal-overlay" onClick={() => setAbrirCadastro(null)}>
            <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
              <h1 className="text-[22px] text-center mb-4">
                Adicionar um produto ao estoque
              </h1>
              {semEstoque.length > 0 ? (
                <>
                  <div className="flex flex-col justify-start items-start gap-3">
                    <div className="flex flex-col justify-start items-start w-full gap-1">
                      <label className="mb-[5px]">
                        Selecione o produto que deseja
                      </label>
                      <select
                        name="antigo"
                        className="p-2 border-1 rounded-2xl ps-3 w-full pr-5 bg-white"
                        value={novoEstoque || ''}
                        onChange={(e) => {
                          const valor = e.target.value;
                          setNovoEstoque(valor === '' ? null : Number(valor));
                        }}
                      >
                        <option value="">Selecione um</option>
                        {semEstoque.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full">
                      <label className="mb-[5px]">Quantidade: </label>
                      <input
                        name="novo"
                        type="number"
                        value={novoEstoqueQtd || ''}
                        onChange={(e) => setNovoEstoqueQtd(e.target.value)}
                        className="p-1 py-[6px] border-1 rounded-2xl ps-3 w-full"
                      />
                    </div>
                  </div>

                  <div className="botoes-modal mt-10">
                    <button
                      className="btn-confirmar w-[35%]"
                      onClick={() => {
                        setAbrirCadastro(null);
                        setNovoEstoque(null);
                        setNovaQtd(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn-confirmar w-[65%]"
                      onClick={() => {
                        criarNovoEstoque();
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6">
                  <h1 className="text-gray-600 text-lg mt-14">
                    Você já tem estoque de todos os produtos cadastrados.
                    <br />
                    Apenas altere os valores na tabela.
                  </h1>
                  <button
                    className="btn-confirmar w-[100%] mt-14"
                    onClick={() => setAbrirCadastro(null)}
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex items-center w-full md:w-32">
            <Hash className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ID"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:border-green-500"
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
            />
          </div>

          <div className="relative flex items-center w-full md:w-64">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar produto..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:border-green-500"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>

          <div className="relative flex items-center w-full md:w-48">
            <Filter className="absolute left-3 text-gray-400" size={18} />
            <select
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:border-green-500 bg-white appearance-none cursor-pointer"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="Em estoque">Em estoque</option>
              <option value="Atenção">Atenção</option>
              <option value="Sem estoque">Sem estoque</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tabelaContainer mb-13">
        <h3 className="subtitulo">Estoque</h3>
        {!isMobile ? (
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Preço</th>
                <th>Atualizado por</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.length > 0 ? (
                itensAtuais.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.produto}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.categoria}</td>
                    <td>{item.status}</td>
                    <td>
                      {Number(item.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td>{item.atualizado_por}</td>
                    <td className="acoes">
                      <XCircle
                        className="icone icone-excluir"
                        title="Excluir"
                        onClick={() => setIdExcluir(item)}
                      />
                      <Edit3
                        className="icone"
                        title="Editar"
                        onClick={() => setEditarInfo(item)}
                      />
                      <PackageSearch
                        className="icone"
                        title="Detalhes"
                        onClick={() => abrirDetalhes(item)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    Nenhum produto encontrado com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <>
            {itensAtuais.length > 0 ? (
              itensAtuais.map((item) => (
                <div className="card-estoque ps-3 pt-3" key={item.id}>
                  <div>
                    <strong>ID:</strong> {item.id}
                  </div>
                  <div>
                    <strong>Produto:</strong> {item.produto}
                  </div>
                  <div>
                    <strong>Quantidade:</strong> {item.quantidade}
                  </div>
                  <div>
                    <strong>Categoria:</strong> {item.categoria}
                  </div>
                  <div>
                    <strong>Status:</strong> {item.status}
                  </div>
                  <div>
                    <strong>Atualizado Por:</strong> {item.atualizado_por}
                  </div>
                  <div>
                    <strong>Preço:</strong>
                    {Number(item.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                  <div className="acoes pt-5">
                    <XCircle
                      className="icone icone-excluir"
                      title="Excluir"
                      onClick={() => setIdExcluir(item)}
                    />
                    <Edit3
                      className="icone"
                      title="Editar"
                      onClick={() => setEditarInfo(item)}
                    />
                    <PackageSearch
                      className="icone"
                      title="Detalhes"
                      onClick={() => abrirDetalhes(item)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum produto encontrado.
              </div>
            )}
          </>
        )}

        {dadosFiltrados.length > itensPorPagina && (
          <div className="paginacao-container flex justify-end pt-4 pb-4">
            <button
              className="btn-paginacao"
              onClick={paginaAnterior}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="info-paginacao">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              className="btn-paginacao"
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {idExcluir && (
        <div className="modal-overlay" onClick={() => setIdExcluir(null)}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertTriangle size={22} className="icone-modal" />
              <h3>Confirmar exclusão do estoque do produto</h3>
            </div>
            <div className="mb-2">
              <strong>{idExcluir.produto}</strong>
            </div>
            <div className="pt-5">
              <p>Tem certeza que deseja excluir este produto do estoque?</p>
            </div>
            <div className="botoes-modal">
              <button
                className="btn-cancelar"
                onClick={() => setIdExcluir(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-confirmar"
                onClick={() => {
                  excluirItem(idExcluir.id);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {editarInfo && (
        <div
          className="modal-overlay"
          onClick={() => setProdutoSelecionado(null)}
        >
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-[22px] text-center mb-4">
              Editar Estoque de {editarInfo.produto}
            </h1>
            <div className="flex flex-col justify-start items-start gap-3">
              <div className="flex flex-col justify-start items-start w-full gap-1  ">
                <label className="mb-[5px]">Quantidade antiga: </label>
                <input
                  name="antigo"
                  type="text"
                  value={editarInfo.quantidade}
                  readOnly
                  className="p-1 border-1 rounded-2xl ps-3 w-full"
                />
              </div>

              <div className="flex flex-col justify-start items-start w-full">
                <label className="mb-[5px]">Quantidade Nova: </label>
                <input
                  name="novo"
                  type="number"
                  value={novaQtd || ''}
                  onChange={(e) => setNovaQtd(e.target.value)}
                  className="p-1 border-1 rounded-2xl ps-3 w-full"
                />
              </div>
            </div>
            <div className="botoes-modal mt-10">
              <button
                className="btn-confirmar w-[35%]"
                onClick={() => {
                  setEditarInfo(null);
                  setNovaQtd(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-confirmar w-[65%]"
                onClick={() => {
                  editarEstoque(editarInfo.id);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {produtoSelecionado && (
        <div
          className="modal-overlay"
          onClick={() => setProdutoSelecionado(null)}
        >
          <div className="modal-excluir2" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <PackageSearch size={22} className="icone-modal" />
              <h3 className="text-nowrap truncate">Detalhes do Produto</h3>
            </div>
            <div className="detalhes-produto">
              <p className="truncate">
                <strong>ID:</strong> {produtoSelecionado.id}
              </p>
              <p className="truncate">
                <strong>Produto:</strong> {produtoSelecionado.produto}
              </p>
              <p className="truncate">
                <strong>Categoria:</strong> {produtoSelecionado.categoria}
              </p>
              <p className="truncate">
                <strong>Quantidade:</strong> {produtoSelecionado.quantidade}
              </p>
              <p className="truncate">
                <strong>Status:</strong> {produtoSelecionado.status}
              </p>
              <p className="truncate">
                <strong>Preço:</strong>{' '}
                {Number(produtoSelecionado.preco).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <div className="botoes-modal">
              <button
                className="btn-confirmar"
                onClick={() => setProdutoSelecionado(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
