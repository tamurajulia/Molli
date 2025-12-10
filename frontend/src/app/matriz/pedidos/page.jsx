'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './pedidos.css';
import {
  BarChart3,
  Edit3,
  Search,
  Filter,
  Hash,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getCookie } from 'cookies-next';
import DialogDemo from '@/components/ModalDetalhePedido/ModalDetalhePedido';

export default function PedidosTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [dados, setDados] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [filtroId, setFiltroId] = useState('');
  const [filtroVendedor, setFiltroVendedor] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function pegarDados() {
    const token = getCookie('token');

    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/pedido', {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const listaVendas = Array.isArray(data) ? data : [];
        setDados(listaVendas);
        setDadosFiltrados(listaVendas);
      } else {
        console.error('Erro ao buscar pedidos');
      }
    } catch (error) {
      console.error('Erro interno:', error);
    }
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 780);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    pegarDados();
  }, []);

  useEffect(() => {
    let resultado = dados;

    if (filtroId) {
      resultado = resultado.filter((item) =>
        String(item.id).includes(filtroId)
      );
    }

    if (filtroVendedor) {
      resultado = resultado.filter((item) => {
        const vendedorNome =
          item.nome_funcionario ||
          item.vendedor ||
          String(item.id_funcionario || '');
        return vendedorNome
          .toLowerCase()
          .includes(filtroVendedor.toLowerCase());
      });
    }

    if (filtroMetodo) {
      resultado = resultado.filter(
        (item) =>
          item.metodo_pagamento?.toLowerCase() === filtroMetodo.toLowerCase()
      );
    }

    setDadosFiltrados(resultado);
    setPaginaAtual(1);
  }, [filtroId, filtroVendedor, filtroMetodo, dados]);

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = dadosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const proximaPagina = () =>
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container">
      <h2 className="titulo">
        <BarChart3 className="iconeTitulo" size={22} />
        <span className="titulo-preto">Controle de</span>
        <span className="titulo-verde"> Pedidos:</span>
      </h2>

      <div className="filtros" style={{ gap: '10px', alignItems: 'flex-end' }}>
        <div className="campo">
          <label className="tituloInput">ID Venda:</label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Hash
              className="absolute left-3 text-gray-400"
              size={18}
              style={{ position: 'absolute', left: '10px', color: '#9ca3af' }}
            />
            <input
              type="text"
              placeholder="ID"
              className="inputFocus"
              style={{ paddingLeft: '35px' }}
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label className="tituloInput">Vendedor:</label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              className="absolute left-3 text-gray-400"
              size={18}
              style={{ position: 'absolute', left: '10px', color: '#9ca3af' }}
            />
            <input
              type="text"
              placeholder="Buscar vendedor..."
              className="inputFocus"
              style={{ paddingLeft: '35px' }}
              value={filtroVendedor}
              onChange={(e) => setFiltroVendedor(e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label className="tituloInput">Método de Pagamento:</label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Filter
              className="absolute left-3 text-gray-400"
              size={18}
              style={{ position: 'absolute', left: '10px', color: '#9ca3af' }}
            />
            <select
              className="inputFocus"
              style={{ paddingLeft: '35px' }}
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="crédito">Crédito</option>
              <option value="débito">Débito</option>
            </select>
          </div>
        </div>
      </div>

      <p className="resultado-label">Resultados: {dadosFiltrados.length}</p>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Histórico de Vendas</h3>

        {!isMobile ? (
          <table className="tabela">
            <thead>
              <tr>
                <th>N° Venda</th>
                <th>Vendedor (ID)</th>
                <th>Data do Pedido</th>
                <th>Valor Total</th>
                <th>Método de Pagamento</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.length > 0 ? (
                itensAtuais.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.nome_funcionario ||
                        item.vendedor ||
                        item.id_funcionario}
                    </td>
                    <td>{formatarData(item.criado)}</td>
                    <td>{formatarMoeda(item.valor_total)}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {item.metodo_pagamento}
                    </td>
                    <td className="acoes">
                      <DialogDemo pedido={item} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-4"
                    style={{ textAlign: 'center', padding: '20px' }}
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <>
            {itensAtuais.length > 0 ? (
              itensAtuais.map((item) => (
                <div className="card-pedido" key={item.id}>
                  <div className="linha-info">
                    <strong>N° Venda:</strong> {item.id}
                  </div>
                  <div className="linha-info">
                    <strong>Vendedor:</strong>{' '}
                    {item.nome_funcionario || item.id_funcionario}
                  </div>
                  <div className="linha-info">
                    <strong>Data:</strong> {formatarData(item.criado)}
                  </div>
                  <div className="linha-info">
                    <strong>Total:</strong> {formatarMoeda(item.valor_total)}
                  </div>
                  <div className="linha-info">
                    <strong>Método:</strong> {item.metodo_pagamento}
                  </div>
                  <div className="acoes">
                    <DialogDemo pedido={item} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum pedido encontrado.
              </div>
            )}
          </>
        )}

        {dadosFiltrados.length > itensPorPagina && (
          <div
            className="paginacao-container flex justify-end pt-4 pb-4"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              gap: '10px',
            }}
          >
            <button
              className="btn-paginacao"
              onClick={paginaAnterior}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft size={20} />
            </button>

            <span
              className="info-paginacao"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              className=""
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
