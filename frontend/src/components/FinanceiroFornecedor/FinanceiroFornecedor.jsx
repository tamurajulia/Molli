'use client';

import { PackagePlus, History, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import "./FinanceiroFornecedor.css";

export default function FinanceiroFornecedor() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [novoPedido, setNovoPedido] = useState({ id_produto: "", quantidade: "", observacao: "" });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const token = getCookie("token");
    try {
        const resSolic = await fetch("http://localhost:3001/solicitacoes", { 
            headers: { Authorization: token } 
        });
        
        const resProd = await fetch("http://localhost:3001/produtos?franquia=1", { 
            headers: { Authorization: token } 
        });

        if (resSolic.ok) setSolicitacoes(await resSolic.json());
        
        if (resProd.ok) {
            const dataProd = await resProd.json();
            if (Array.isArray(dataProd)) {
                setProdutos(dataProd);
            }
        }

    } catch (error) { 
        console.error("Erro ao carregar dados:", error); 
    } finally { 
        setLoading(false); 
    }
  }

  const handleSolicitar = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    
    try {
        const res = await fetch("http://localhost:3001/solicitacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(novoPedido)
        });

        if (res.ok) {
            alert("Solicitação enviada à Matriz com sucesso!");
            setModalAberto(false);
            setNovoPedido({ id_produto: "", quantidade: "", observacao: "" });
            carregarDados(); // Atualiza a tabela
        } else {
            const erro = await res.json();
            alert(`Erro: ${erro.mensagem || "Falha ao enviar solicitação"}`);
        }
    } catch (error) { console.error(error); }
  };

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const solicitacoesAtuais = solicitacoes.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(solicitacoes.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="titulo d-flex align-items-center gap-2">
            <PackagePlus className="iconeTitulo" size={22} />
            <span className="titulo-preto">Reposição de</span>
            <span className="titulo-verde"> Estoque (Matriz):</span>
        </h2>
        <button onClick={() => setModalAberto(true)} className="btn-add-estoque flex items-center gap-2 bg-[#566363] text-white px-4 py-2 rounded">
            <Plus size={18} /> Solicitar Produto
        </button>
      </div>

      <div className="mt-6 tabelaContainer">
        <h3 className="subtitulo flex items-center gap-2 mb-3 text-gray-600 justify-center">
            <History size={18}/> Histórico de Pedidos da Loja
        </h3>
        
        <div className="tabelaContainer">
          <table className="tabela table align-middle">
            <thead className="table-light">
              <tr>
                <th>Data do Pedido</th>
                <th>Produto Solicitado</th>
                <th>Quantidade</th>
                <th>Status da Matriz</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center">Carregando...</td></tr>
              ) : solicitacoesAtuais.length > 0 ? (
                 solicitacoesAtuais.map((item) => (
                   <tr key={item.id}>
                     <td>{new Date(item.criado_em).toLocaleDateString("pt-BR")}</td>
                     <td className="font-medium">{item.produto_nome || `Produto #${item.id_produto}`}</td>
                     <td>{item.quantidade}</td>
                     <td>
                        <span className={`px-2 py-1 rounded text-xs font-bold 
                            ${item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 
                              item.status === 'Enviado' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Rejeitado' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                            {item.status}
                        </span>
                     </td>
                     <td className="text-sm text-gray-500 max-w-xs truncate" title={item.observacao}>
                        {item.observacao || "-"}
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr><td colSpan="5" className="p-6 text-center text-muted">Nenhuma solicitação feita por esta loja até o momento.</td></tr>
               )
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- PAGINAÇÃO ------------------- */}
      {solicitacoes.length > itensPorPagina && (
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

      {modalAberto && (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={() => setModalAberto(false)}>
            <div className="modal-conteudo-estoque bg-white p-6 rounded-xl w-96 shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="modal-header mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-[#2e4d49]">Pedir Produto à Matriz</h3>
                </div>
                
                <form onSubmit={handleSolicitar} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto:</label>
                        <select 
                            className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-[#8faaa3] outline-none"
                            value={novoPedido.id_produto} 
                            onChange={e => setNovoPedido({...novoPedido, id_produto: e.target.value})} 
                            required
                        >
                            <option value="">Selecione o produto...</option>
                            {produtos.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade:</label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Ex: 50" 
                            className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-[#8faaa3] outline-none"
                            value={novoPedido.quantidade} 
                            onChange={e => setNovoPedido({...novoPedido, quantidade: e.target.value})} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observação (Opcional):</label>
                        <textarea 
                            placeholder="Ex: Estoque crítico, cliente aguardando..." 
                            className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-[#8faaa3] outline-none"
                            rows="3"
                            value={novoPedido.observacao} 
                            onChange={e => setNovoPedido({...novoPedido, observacao: e.target.value})} 
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
                        <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded" onClick={() => setModalAberto(false)}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-[#566363] text-white rounded hover:bg-[#465252] font-medium">Enviar Pedido</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
