"use client";
import React, { useState, useEffect, use } from "react";
import "./editar.css";
import { Users } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function EditarFuncionario({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nome: "",
    salario: "",
    id_funcao: "",
    email: "",
    ativo: 1,
    senha: "" // Opcional na edição
  });

  // Cargos fixos ou buscar do backend
  const funcoes = [
      { id: 2, nome: "Gerente" },
      { id: 3, nome: "Estoquista" },
      { id: 4, nome: "Caixa" },
  ];

  useEffect(() => {
    async function carregarDados() {
        const token = getCookie("token");
        try {
            // Busca dados do funcionário específico
            const res = await fetch(`http://localhost:3001/funcionario/${id}`, {
                headers: { Authorization: token }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    nome: data.nome,
                    salario: data.salario,
                    id_funcao: data.id_funcao,
                    email: data.email,
                    ativo: data.ativo,
                    senha: "" 
                });
            } else {
                alert("Funcionário não encontrado.");
                router.push("/admin/funcionarios");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    carregarDados();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    // Remove senha se estiver vazia para não alterar
    const payload = { ...formData };
    if (!payload.senha) delete payload.senha;

    try {
        const res = await fetch(`http://localhost:3001/funcionario/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Funcionário atualizado!");
            router.push("/admin/funcionarios");
        } else {
            alert("Erro ao atualizar.");
        }
    } catch (error) { console.error(error); }
  };

  if (loading) return <p className="text-center p-10">Carregando...</p>;

  return (
    <div className="cadastroContainer">
      <h2 className="titulo">
        <Users size={24} className="iconeTitulo" />
        <span>Editar o <strong>Funcionário</strong>:</span>
      </h2>

      <form className="formulario" onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome do funcionário:</label>
          <input 
            type="text" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            placeholder="Insira o nome completo" 
            required
          />
        </div>

        <div className="campo">
          <label>Cargo:</label>
          <select 
            name="id_funcao" 
            value={formData.id_funcao} 
            onChange={handleChange} 
            className="p-2 bg-[#fafafa] w-full rounded outline-none text-[#2e4d49]"
            required
          >
             <option value="">Selecione...</option>
             {funcoes.map(f => (
                 <option key={f.id} value={f.id}>{f.nome}</option>
             ))}
          </select>
        </div>

        <div className="campo sr-only">
          <label>Filial vinculada (Automático):</label>
          <input type="text" value="Mesma do Gerente" disabled className="opacity-50 cursor-not-allowed" />
        </div>

        <div className="linha">
          <div className="campo pequeno">
            <label>Salário:</label>
            <input 
                type="number" 
                name="salario" 
                value={formData.salario} 
                onChange={handleChange} 
                step="0.01"
                placeholder="Insira o salário" 
                required
            />
          </div>

          <div className="campo pequeno">
            <label>Status:</label>
            <select 
                name="ativo" 
                value={formData.ativo} 
                onChange={e => setFormData({...formData, ativo: Number(e.target.value)})} 
                className="p-2 bg-[#fafafa] w-full rounded outline-none text-[#2e4d49]"
            >
                <option value={1}>Ativo</option>
                <option value={0}>Desativado</option>
            </select>
          </div>
        </div>

        <div className="linha">
          <div className="campo pequeno">
            <label>ID:</label>
            <input type="text" value={id} disabled className="opacity-50" />
          </div>

          <div className="campo pequeno">
            <label>Email:</label>
            <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Insira o email" 
                required
            />
          </div>
        </div>

        <div className="campo">
            <label>Nova Senha (Opcional):</label>
            <input 
                type="password" 
                name="senha" 
                value={formData.senha} 
                onChange={handleChange} 
                placeholder="Deixe em branco para não alterar" 
            />
        </div>

        <button type="submit" className="botao">
          Concluir
        </button>
      </form>
    </div>
  );
}