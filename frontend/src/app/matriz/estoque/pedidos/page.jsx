'use client';
import React, { useEffect, useState } from 'react';
import '../estoque.css';
import { Edit3, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import { getCookie } from 'cookies-next';

export default function SolicitacoesEstoqueTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [dados, setDados] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);

  const [filtroFilial, setFiltroFilial] = useState('');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const [editarInfo, setEditarInfo] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function pegarDados() {
    const token = getCookie('token');
    try {
      const response = await fetch(
        `http://localhost:3001/solicitacoes/matriz`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDados(data);
        setDadosFiltrados(data);
      } else {
        alert('Erro ao buscar solicitações');
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    pegarDados();
    const handleResize = () => setIsMobile(window.innerWidth <= 780);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editarInfo]);

  // Filtros
  useEffect(() => {
    let resultado = dados;
    if (filtroFilial)
      resultado = resultado.filter((item) =>
        String(item.id_filial).includes(filtroFilial)
      );
    if (filtroProduto)
      resultado = resultado.filter((item) =>
        String(item.id_produto).includes(filtroProduto)
      );
    if (filtroStatus)
      resultado = resultado.filter((item) => item.status === filtroStatus);
    setDadosFiltrados(resultado);
    setPaginaAtual(1);
  }, [filtroFilial, filtroProduto, filtroStatus, dados]);

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = dadosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const proximaPagina = () =>
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  async function confirmarEnvio(id, quantidade) {
    const token = getCookie('token');
    try {
      const res = await fetch(
        `http://localhost:3001/solicitacoes/${id}?quantidade=${quantidade}`,
        {
          method: 'PUT',
          headers: { Authorization: token },
        }
      );
      if (res.ok) {
        setEditarInfo(null);
        pegarDados();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao confirmar envio');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <button
        className="mb-4 cursor-pointer"
        onClick={() => {
          window.location.replace('/matriz/estoque');
        }}
      >
        Voltar ao estoque <i className="bi bi-arrow-right ms-1"></i>
      </button>
      <h2 className="titulo">Solicitações de Estoque</h2>

      <div className="flex gap-3 w-full md:w-auto mb-4">
        <input
          type="text"
          placeholder="Filial"
          className="input-filtro"
          value={filtroFilial}
          onChange={(e) => setFiltroFilial(e.target.value)}
        />
        <input
          type="text"
          placeholder="Produto"
          className="input-filtro"
          value={filtroProduto}
          onChange={(e) => setFiltroProduto(e.target.value)}
        />
        <select
          className="input-filtro"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Enviado">Enviado</option>
        </select>
      </div>

      <div className="tabelaContainer">
        {!isMobile ? (
          <table className="tabela">
            <thead>
              <tr className="">
                <th className="!bg-[#566363] !text-white">ID</th>
                <th className="!bg-[#566363] !text-white">Filial</th>
                <th className="!bg-[#566363] !text-white">Produto</th>
                <th className="!bg-[#566363] !text-white">Quantidade</th>
                <th className="!bg-[#566363] !text-white">Status</th>
                <th className="!bg-[#566363] !text-white">Observação</th>
                <th className="!bg-[#566363] !text-white">Criado em</th>
                <th className="!bg-[#566363] !text-white">Atualizado em</th>
                <th className="!bg-[#566363] !text-white">Ação</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.length > 0 ? (
                itensAtuais.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.id_filial}</td>
                    <td>{item.id_produto}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.status}</td>
                    <td>{item.observacao}</td>
                    <td>{new Date(item.criado_em).toLocaleString()}</td>
                    <td>{new Date(item.atualizado_em).toLocaleString()}</td>
                    <td className="acoes">
                      {item.status === 'Pendente' && (
                        <Edit3
                          className="icone"
                          title="Confirmar envio"
                          onClick={() => setEditarInfo(item)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          itensAtuais.map((item) => (
            <div className="card-estoque" key={item.id}>
              <p>
                <strong>ID:</strong> {item.id}
              </p>
              <p>
                <strong>Filial:</strong> {item.id_filial}
              </p>
              <p>
                <strong>Produto:</strong> {item.id_produto}
              </p>
              <p>
                <strong>Quantidade:</strong> {item.quantidade}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              <p>
                <strong>Observação:</strong> {item.observacao}
              </p>
              <p>
                <strong>Criado em:</strong>{' '}
                {new Date(item.criado_em).toLocaleString()}
              </p>
              <p>
                <strong>Atualizado em:</strong>{' '}
                {new Date(item.atualizado_em).toLocaleString()}
              </p>
              <div className="acoes">
                {item.status === 'Pendente' && (
                  <Edit3
                    className="icone"
                    title="Confirmar envio"
                    onClick={() => setEditarInfo(item)}
                  />
                )}
              </div>
            </div>
          ))
        )}

        {dadosFiltrados.length > itensPorPagina && (
          <div className="paginacao-container">
            <button onClick={paginaAnterior} disabled={paginaAtual === 1}>
              <ChevronLeft />
            </button>
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {editarInfo && (
        <div className="modal-overlay" onClick={() => setEditarInfo(null)}>
          <div
            className="bg-white p-5 pl-10 pr-10 rounded-2xl h-69 w-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-top text-2xl justify-center">
              <h3>Confirmar envio da solicitação</h3>
            </div>
            <p className="mt-8">
              Deseja confirmar o envio de {editarInfo.quantidade} itens da
              solicitação de ID {editarInfo.id}?
            </p>
            <div className="botoes-modal mt-10">
              <button
                className="border-1 p-2 rounded-2xl"
                onClick={() => setEditarInfo(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#566363] p-2 rounded-2xl text-white"
                onClick={() =>
                  confirmarEnvio(editarInfo.id, editarInfo.quantidade)
                }
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
