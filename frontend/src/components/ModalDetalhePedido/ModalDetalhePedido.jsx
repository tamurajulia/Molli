'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReceiptText, ArrowRight, ArrowLeft } from 'lucide-react';
import { getCookie } from 'cookies-next';
import { gerarNotaFiscal } from '@/components/functions/notaFiscal';

export default function DialogDemo({ pedido }) {
  const [itensPedido, setItensPedido] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    if (!pedido) return;
    setPagina(1);

    const fetchItensPedido = async () => {
      setCarregando(true);
      const token = getCookie('token');
      try {
        const response = await fetch(
          `http://localhost:3001/pedido/itens/${pedido.id}`,
          { headers: { Authorization: token } }
        );
        if (response.ok) {
          const data = await response.json();
          setItensPedido(data);
        } else {
          setItensPedido([]);
        }
      } catch {
        setItensPedido([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchItensPedido();
  }, [pedido]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-md hover:bg-gray-100 transition">
          <ReceiptText title="Ver Detalhes" className="text-gray-600" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 bg-white rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex justify-between items-center">
            <span>Detalhes do Pedido #{pedido?.id}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            {pagina === 1
              ? 'Visão geral financeira e dados do pedido.'
              : 'Lista detalhada dos produtos neste pedido.'}
          </DialogDescription>
        </DialogHeader>

        {pagina === 1 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">Valor Total:</span>
              <span className="text-[#8faaa3] font-semibold">
                {Number(pedido?.valor_total).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">Método:</span>
              <span className="capitalize">{pedido?.metodo_pagamento}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">Lucro:</span>
              <span className="text-[#485552] font-semibold">
                {Number(pedido?.lucro).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">Data:</span>
              <span>
                {pedido?.criado &&
                  new Date(pedido.criado).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">PDV:</span>
              <span>{pedido?.id_pdv}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-medium text-gray-600">Funcionário:</span>
              <span>{pedido?.id_funcionario}</span>
            </div>
            {pedido?.parcelas && (
              <div className="flex justify-between w-full bg-gray-50 p-3 rounded-lg shadow-sm sm:col-span-2">
                <span className="font-medium text-gray-600">Parcelas:</span>
                <span>{pedido?.parcelas}</span>
              </div>
            )}
          </div>
        )}

        {pagina === 2 && (
          <div className="mt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="font-semibold text-gray-700 mb-2">
              Itens do Pedido
            </h4>
            <div className="max-h-[300px] overflow-y-auto pr-1">
              {carregando ? (
                <p className="text-gray-500 text-center py-8">
                  Carregando itens...
                </p>
              ) : itensPedido.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="bg-gray-100">
                      <th className="p-2 border-b">Produto</th>
                      <th className="p-2 border-b text-center">Qtd</th>
                      <th className="p-2 border-b text-right">Unit.</th>
                      <th className="p-2 border-b text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensPedido.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 border-b">
                        <td className="p-2 text-sm">
                          {item.nome_produto || 'Produto sem nome'}
                        </td>
                        <td className="p-2 text-center text-sm">
                          {item.quantidade || 0}
                        </td>
                        <td className="p-2 text-right text-sm">
                          {item.preco_unitario
                            ? Number(item.preco_unitario).toLocaleString(
                                'pt-BR',
                                {
                                  style: 'currency',
                                  currency: 'BRL',
                                }
                              )
                            : '-'}
                        </td>
                        <td className="p-2 text-right font-medium text-sm">
                          {item.total
                            ? Number(item.total).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum item encontrado.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex flex-row justify-between items-center sm:justify-between w-full">
          <div>
            {pagina === 2 && (
              <Button
                variant="outline"
                onClick={() => setPagina(1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Voltar
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {pagina === 1 ? (
              <>
                <DialogClose asChild>
                  <Button variant="ghost">Fechar</Button>
                </DialogClose>
                <Button
                  className="bg-[#8faaa3] hover:bg-[#485552] text-white"
                  onClick={() =>
                    gerarNotaFiscal(
                      pedido.metodo_pagamento,
                      pedido.parcelas,
                      Number(pedido.valor_total),
                      itensPedido.map((item) => ({
                        nome: item.nome_produto,
                        qtd: item.quantidade,
                        preco: Number(item.preco_unitario),
                      }))
                    )
                  }
                >
                  Gerar Nota Fiscal <ReceiptText />
                </Button>
                <Button
                  onClick={() => setPagina(2)}
                  className="flex items-center gap-2 bg-[#485552] hover:bg-[#8faaa3]"
                >
                  Ver Itens <ArrowRight size={16} />
                </Button>
              </>
            ) : (
              <DialogClose asChild>
                <Button>Concluir</Button>
              </DialogClose>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
