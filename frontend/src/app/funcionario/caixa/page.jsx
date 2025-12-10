'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Minus,
  Search,
  SlidersHorizontal,
  X,
  Computer,
} from 'lucide-react';
import { Toaster } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getCookie } from 'cookies-next';
import PagamentoDialog from '@/components/Venda/Venda';
import { gerarNotaFiscal } from '@/components/functions/notaFiscal';

export default function PDVPage() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [pagamentoOpen, setPagamentoOpen] = useState(false);

  async function fetchProdutos() {
    const franquia = getCookie('id_filial');

    try {
      const response = await fetch(
        `http://localhost:3001/produtos?franquia=${franquia}`
      );
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const filtroOk = filtro === 'todos' || p.id_categoria === filtro;
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase());
      return filtroOk && buscaOk;
    });
  }, [produtos, filtro, busca]);

  const adicionarCarrinho = (produto) => {
    const itemExistente = carrinho.find((i) => i.id === produto.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map((i) =>
          i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1 }]);
    }
  };

  const alterarQtd = (id, delta) => {
    setCarrinho(
      carrinho.map((i) =>
        i.id === id ? { ...i, qtd: Math.max(i.qtd + delta, 1) } : i
      )
    );
  };

  const removerProduto = (id) => {
    setCarrinho(carrinho.filter((i) => i.id !== id));
  };

  const subtotal = useMemo(
    () => carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0),
    [carrinho]
  );

  async function handlePaymentSuccess(metodoPago, parcelasPagas) {
    const token = getCookie('token');
    try {
      const parcelas = parcelasPagas !== '' ? parcelasPagas : null;
      const dataToSend = {
        valor_total: subtotal,
        metodo_pagamento: metodoPago,
        parcelas,
        produtos: carrinho,
      };
      const res = await fetch(`http://localhost:3001/pedido`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (res.ok) {
        gerarNotaFiscal(metodoPago, parcelasPagas, subtotal, carrinho);
        setCarrinho([]);
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro interno ao criar pedido:', error);
    }
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#f9faf9]">
      <Toaster richColors position="top-right" />

      {/* COLUNA ESQUERDA */}
      <div className="flex-1 flex flex-col space-y-4 p-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="flex text-[#8faaa3] items-center text-3xl md:text-4xl">
              <Computer className="w-10 h-10 mr-2" />
              <span className="text-[#566363] mr-2 font-bold">Ponto</span>de
              venda
            </p>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Digite nome ou código..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="rounded-full w-[220px] md:w-[350px] h-12 bg-[#e7eeec] ps-5"
            />
            <Button className="bg-[#90A89A] text-white rounded-full w-12 h-12">
              <Search />
            </Button>
          </div>
        </div>

        {/* PRODUTOS */}
        <div className="bg-white border rounded-xl p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {produtosFiltrados.map((p) => (
              <Card
                key={p.id}
                className="text-center border-[#90A89A] hover:shadow-md transition cursor-pointer border-2"
                onClick={() => adicionarCarrinho(p)}
              >
                <CardContent className="p-4">
                  <img
                    src={`http://localhost:3001/uploads/produtos/${p.imagem}`}
                    alt={p.nome}
                    className="w-full mb-2 rounded-lg"
                  />
                  <p className="text-xl text-[#90A89A]">{p.nome}</p>
                  <p className="font-semibold text-[#90A89A]">
                    R$ {p.preco.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex justify-between items-center">
          <button className="flex items-center gap-2 border-2 border-[#90A89A] text-[#8faaa3] px-5 py-2 rounded-xl text-[18px]">
            <SlidersHorizontal className="w-5 h-5" /> Filtros
          </button>
          <button
            onClick={() => setFiltro('todos')}
            className="text-[#90A89A] font-semibold underline hover:opacity-80 transition text-[18px] cursor-pointer"
          >
            Limpar filtro
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2">
          {[
            {
              label: 'Acessorios',
              icon: '/IMG/iconsPDV/acessorios.png',
              value: 1,
            },
            { label: 'Roupas', icon: '/IMG/iconsPDV/roupas.png', value: 2 },
            { label: 'Cuidados', icon: '/IMG/iconsPDV/cuidado.png', value: 3 },
            { label: 'Conforto', icon: '/IMG/iconsPDV/conforto.png', value: 4 },
          ].map((f) => (
            <Tooltip key={f.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setFiltro(f.value)}
                  className={`flex flex-col items-center justify-center border-2 border-[#90A89A] bg-white rounded-xl h-28 transition-all duration-200 hover:border-4 ${
                    filtro === f.label ? 'border-4' : ''
                  }`}
                >
                  <img
                    src={f.icon}
                    alt={f.label}
                    className="w-20 h-20 object-contain"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#90A89A] text-white shadow-none px-2 py-1 rounded-md before:hidden">
                <p>{f.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div
        className="w-[360px] bg-white border-l rounded-l-xl p-4 
      flex flex-col justify-between overflow-hidden shrink-0"
      >
        {/* TÍTULO */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#90A89A] font-semibold text-xl pt-2">
            Check out
          </h2>

          <a
            className="bg-[#8faaa3] text-white px-3 py-1.5 w-40 flex justify-center rounded-2xl"
            href="/funcionario/caixa/fechamento"
          >
            Fechar caixa <i className="bi bi-cash-stack ms-3"></i>
          </a>
        </div>

        {/* CABEÇALHO */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 font-semibold mb-3 text-[#7d8f89] text-sm">
          <span className="text-left">Nome</span>
          <span className="text-center">Qtd</span>
          <span className="text-center">Preço</span>
          <span className="text-center">Ação</span>
        </div>

        {/* LISTA DO CARRINHO */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {carrinho.length === 0 ? (
            <p className="text-gray-400 text-md text-center mt-10">
              Carrinho vazio <i className="bi bi-basket2 ms-1"></i>
            </p>
          ) : (
            carrinho.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 items-center
                bg-white/70 p-2 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01]
                transition-all duration-200"
              >
                <span className="text-sm font-medium text-left text-[#5f6d69] truncate min-w-0">
                  {p.nome}
                </span>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    className="p-0 h-7 w-7 flex items-center justify-center rounded-full 
                    bg-[#90A89A]/25 hover:bg-[#90A89A]/40 shadow duration-200"
                    onClick={() => alterarQtd(p.id, -1)}
                  >
                    <Minus size={14} className="text-[#5b7068]" />
                  </Button>

                  <span
                    className="px-3 py-1 rounded-full bg-[#90A89A]/15 text-[#4e5d58] 
                  text-sm font-semibold shadow-inner"
                  >
                    {p.qtd}
                  </span>

                  <Button
                    variant="ghost"
                    className="p-0 h-7 w-7 flex items-center justify-center rounded-full 
                    bg-[#90A89A]/25 hover:bg-[#90A89A]/40 shadow duration-200"
                    onClick={() => alterarQtd(p.id, +1)}
                  >
                    <Plus size={14} className="text-[#5b7068]" />
                  </Button>
                </div>

                <span className="text-sm font-semibold text-[#6c837b]">
                  R${(p.preco * p.qtd).toFixed(2)}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-7 w-7 flex items-center justify-center rounded-full
                  hover:bg-red-100 duration-200"
                  onClick={() => removerProduto(p.id)}
                >
                  <X size={15} className="text-red-400 hover:text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* SUBTOTAL + TOTAL FIXADOS NO FUNDO */}
        {carrinho.length > 0 && (
          <div className="bg-[#90A89A]/10 rounded-xl p-3 mt-4 shadow-inner">
            <div className="flex justify-between font-semibold text-[#90A89A]">
              <span>Subtotal</span>
              <span>R${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#90A89A] text-lg mt-1">
              <span>Total</span>
              <span>R${subtotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* BOTÃO PAGAR */}
        <Button
          disabled={carrinho.length === 0}
          className="bg-[#90A89A] text-white mt-4 w-full h-11 rounded-xl 
          hover:bg-[#A9BDB0] hover:shadow-md hover:scale-[1.01] 
          transition-all duration-200 font-semibold"
          onClick={() => setPagamentoOpen(true)}
        >
          Pagar (R${subtotal.toFixed(2)})
        </Button>
      </div>

      {/* DIALOG */}
      <PagamentoDialog
        open={pagamentoOpen}
        onOpenChange={setPagamentoOpen}
        subtotal={subtotal}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
