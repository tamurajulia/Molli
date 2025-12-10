"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./produtos.css";
import { Package, Edit3, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { getCookie } from "cookies-next"; 

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  
  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  // Estados para o Modal de Exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  const carregar = async () => {
    try {
      const res = await fetch("http://localhost:3001/produtos-matriz");
      const dados = await res.json();
      setProdutos(dados);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModalExclusao = (id) => {
    setProdutoParaExcluir(id);
    setModalExcluirAberto(true);
  };

  const fecharModal = () => {
    setModalExcluirAberto(false);
    setProdutoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    try {
        const res = await fetch(`http://localhost:3001/produtos-matriz/${produtoParaExcluir}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await res.json();

        if (res.ok) {
            carregar(); 
            fecharModal();
        } else {
            alert("Erro: " + data.mensagem);
        }

    } catch (error) {
        console.error("Erro na exclusão:", error);
        alert("Erro ao tentar excluir.");
    }
  };

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Lógica de Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = filtrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);

  const proximaPagina = () => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  const paginaAnterior = () => setPaginaAtual((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container">
      <h2 className="titulo">
        <Package size={22} className="iconeTitulo" />
        <span className="titulo-preto">Gerenciamento de</span>
        <span className="titulo-verde"> Produtos:</span>
      </h2>

      <div className="filtros">
        <input
          className="inputFocus"
          placeholder="Nome do produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <Link href="/matriz/produtos/cadastrar">
          <button className="botao-cadastrar">Cadastrar</button>
        </Link>
      </div>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Produtos</h3>

        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço venda</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {itensAtuais.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nome}</td>
                <td>{item.id_categoria}</td>
                <td>R${Number(item.preco_venda).toFixed(2)}</td>

                <td className="acoes">
                  <Link href={`/matriz/produtos/editar/${item.id}`}>
                    <Edit3 className="icone" />
                  </Link>

                  <Trash2
                    className="icone icone-excluir"
                    onClick={() => abrirModalExclusao(item.id)} 
                    style={{ cursor: "pointer", color: "#e74c3c" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ------------------- PAGINAÇÃO ------------------- */}
        {filtrados.length > itensPorPagina && (
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

      {/* --- MODAL DE EXCLUSÃO --- */}
      {modalExcluirAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertTriangle size={28} className="icone-modal text-red-500" />
              <h3>Confirmar Exclusão</h3>
            </div>
            <p>
              Tem certeza que deseja excluir este produto? <br/>
              Essa ação não pode ser desfeita.
            </p>
            <div className="botoes-modal">
              <button className="btn-cancelar" onClick={fecharModal}>
                Cancelar
              </button>
              <button className="btn-confirmar bg-red-500 hover:bg-red-600" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}