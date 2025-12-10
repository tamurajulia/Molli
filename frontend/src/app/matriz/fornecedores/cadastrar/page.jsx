"use client";

import React, { useState } from "react";
import "./cadastrar.css";
import { Building2 } from "lucide-react";

export default function CadastroFornecedor() {
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    categoria: "",
    cnpj: "",
    telefone: "",
  });

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const enviar = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensagem);
        return;
      }

      alert("Fornecedor cadastrado!");
      window.location.href = "/matriz/fornecedores";

    } catch (err) {
      alert("Erro ao cadastrar fornecedor");
      console.error(err);
    }
  };

  return (
    <div className="cadastro-container">
      <h2 className="titulo">
        <Building2 className="iconeTitulo" size={22} />
        <span className="titulo-preto">Cadastro de</span>
        <span className="titulo-verde"> Fornecedores</span>
      </h2>

      <form className="formulario" onSubmit={enviar}>
        <div className="campo">
          <label>Nome do fornecedor:</label>
          <input
          required
            type="text"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            placeholder="INSIRA O NOME DO FORNECEDOR"
          />
        </div>

        <div className="campo">
          <label>Endereço:</label>
          <input
          required
            type="text"
            value={form.endereco}
            onChange={(e) => atualizar("endereco", e.target.value)}
            placeholder="INSIRA O ENDEREÇO"
          />
        </div>

        <div className="campo">
          <label>Produtos fornecidos / Categoria:</label>
          <input
          required
            type="text"
            value={form.categoria}
            onChange={(e) => atualizar("categoria", e.target.value)}
            placeholder="Ex: Roupas, acessórios..."
          />
        </div>

        <div className="linha tres-colunas">
          <div className="campo">
            <label>CNPJ:</label>
            <input
            required
              type="text"
              value={form.cnpj}
              onChange={(e) => atualizar("cnpj", e.target.value)}
              placeholder="INSIRA O CNPJ"
            />
          </div>

          <div className="campo">
            <label>Telefone:</label>
            <input
            required
              type="text"
              value={form.telefone}
              onChange={(e) => atualizar("telefone", e.target.value)}
              placeholder="INSIRA O TELEFONE"
            />
          </div>
        </div>

        <div className="rodape">
          <span className="logo">Molli</span>
          <button type="submit" className="botao-criar">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}
