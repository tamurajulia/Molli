"use client";

import React, { useEffect, useState } from "react";
import "./editar.css";
import { Package, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditarProduto({ params }) {
  const router = useRouter();
  const { id } = params;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [imagemAtual, setImagemAtual] = useState("");

  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    preco_venda: "",
    preco_custo: "",
    codigo_barras: "",
  });

  const atualizar = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`http://localhost:3001/produtos/${id}`);

        if (!res.ok) {
          alert("Produto não encontrado.");
          router.push("/matriz/produtos");
          return;
        }

        const dados = await res.json();

        setForm({
          nome: dados.nome || "",
          categoria: dados.id_categoria?.toString() || "",
          preco_venda: dados.preco_venda?.toString() || "",
          preco_custo: dados.preco_custo?.toString() || "0",
          codigo_barras: dados.descricao || "",
        });

        setImagemAtual(dados.imagem || "");
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        alert("Erro ao carregar produto.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, router]);

  const salvar = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.categoria || !form.preco_venda) {
      alert("Preencha nome, categoria e preço de venda.");
      return;
    }

    setSalvando(true);

    try {
      const body = {
        nome: form.nome,
        descricao: form.codigo_barras,
        id_categoria: Number(form.categoria),
        preco_venda: Number(form.preco_venda),
        preco_custo: Number(form.preco_custo),
        imagem: imagemAtual || "sem_imagem.png",
      };

      const res = await fetch(`http://localhost:3001/produtos-matriz/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensagem || "Erro ao atualizar produto.");
        return;
      }

      alert("Produto atualizado com sucesso!");
      router.push("/matriz/produtos");
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      alert("Erro ao atualizar produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="cadastroContainer">
      <button type="button" className="botaoVoltar flex justify-start content-center" onClick={() => router.back()}>
        <ChevronLeft size={18} />
        Voltar
      </button>

      <h2 className="titulo">
        <Package size={24} className="iconeTitulo" />
        <span>
          Editar o <strong>Produto</strong> :
        </span>
      </h2>

      {carregando ? (
        <p className="textoCarregando">Carregando dados do produto...</p>
      ) : (
        <form className="formulario" onSubmit={salvar}>
          {/* imagem */}
          <div className="campo">
            <label>Imagem atual:</label>
            <div className="imagemAtualBox">
              {imagemAtual ? (
                <img
                  src={`http://localhost:3001/uploads/produtos/${imagemAtual}`}
                  className="imagemAtual w-20 h-20 object-cover"
                />
              ) : (
                <div className="imagemPlaceholder">
                  <ImageIcon size={32} />
                  <span>Produto sem imagem cadastrada</span>
                </div>
              )}
            </div>
          </div>

          {/* nome */}
          <div className="campo">
            <label>Nome do produto:</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              required
            />
          </div>

          {/* categoria */}
          <div className="campo">
            <label>Categoria:</label>
            <select
              value={form.categoria}
              onChange={(e) => atualizar("categoria", e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              <option value="1">Acessório</option>
              <option value="2">Roupa</option>
              <option value="3">Cuidado</option>
              <option value="4">Conforto</option>
            </select>
          </div>

          <div className="linha">
            {/* preco venda */}
            <div className="campo pequeno">
              <label>Preço de venda (R$):</label>
              <input
                type="number"
                value={form.preco_venda}
                onChange={(e) => atualizar("preco_venda", e.target.value)}
                required
              />
            </div>

            {/* preco custo */}
            <div className="campo pequeno">
              <label>Preço de custo (R$):</label>
              <input
                type="number"
                value={form.preco_custo}
                onChange={(e) => atualizar("preco_custo", e.target.value)}
              />
            </div>

            {/* codigo barras */}
            <div className="campo pequeno">
              <label>Código de barras:</label>
              <input
                type="text"
                value={form.codigo_barras}
                onChange={(e) => atualizar("codigo_barras", e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? "Salvando..." : "Concluir"}
          </button>
        </form>
      )}
    </div>
  );
}
