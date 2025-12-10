"use client";

import React, { useEffect, useState } from "react";
import "./editar.css";
import { Building2 } from "lucide-react";

export default function EditarFornecedor({ params }) {
  const { id } = params;

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    categoria: "",
    cnpj: "",
    telefone: "",
    criado: "",
    atualizado: "",
  });

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  // Função para converter ISO -> MySQL
  function formatarParaMySQL(dataISO) {
    const d = new Date(dataISO);
    const pad = (n) => (n < 10 ? "0" + n : n);

    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  }

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`http://localhost:3001/fornecedores/${id}`);
        const dados = await res.json();

        if (!res.ok) {
          alert("Fornecedor não encontrado");
          return;
        }

        // Já deixa no estado
        setForm({
          nome: dados.nome,
          endereco: dados.endereco,
          categoria: dados.categoria,
          cnpj: dados.cnpj,
          telefone: dados.telefone,
          criado: dados.criado,        // vem do MySQL
          atualizado: dados.atualizado // vem do MySQL
        });

      } catch (err) {
        console.error(err);
      }
    }
    carregar();
  }, [id]);

  const salvar = async (e) => {
    e.preventDefault();

    try {
      // Converte datas ANTES de enviar
      const formCorrigido = {
        ...form,
        criado: formatarParaMySQL(form.criado),
        atualizado: formatarParaMySQL(new Date()) // atualização agora
      };

      const res = await fetch(`http://localhost:3001/fornecedores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCorrigido),
      });

      const data = await res.json();

      alert(data.mensagem);

      if (res.ok) {
        window.location.href = "/matriz/fornecedores";
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar fornecedor");
    }
  };

  return (
    <div className="cadastroContainer">
      <h2 className="titulo">
        <Building2 size={24} className="iconeTitulo" />
        <span>Editar o <strong>Fornecedor</strong> :</span>
      </h2>

      <form className="formulario" onSubmit={salvar}>
        <div className="campo">
          <label>Nome do fornecedor:</label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Endereço:</label>
          <input
            type="text"
            value={form.endereco}
            onChange={(e) => atualizar("endereco", e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Produtos fornecidos / Categoria:</label>
          <input
            type="text"
            value={form.categoria}
            onChange={(e) => atualizar("categoria", e.target.value)}
          />
        </div>

        <div className="linha">
          <div className="campo pequeno">
            <label>CNPJ:</label>
            <input
              type="text"
              value={form.cnpj}
              onChange={(e) => atualizar("cnpj", e.target.value)}
            />
          </div>

          <div className="campo pequeno">
            <label>Telefone:</label>
            <input
              type="text"
              value={form.telefone}
              onChange={(e) => atualizar("telefone", e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="botao">
          Concluir
        </button>
      </form>
    </div>
  );
}
