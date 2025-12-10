"use client";

import React, { useState, useEffect, use } from "react";
import "./editar.css";
import { ChevronLeft, Users } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function EditarFuncionario({ params }) {
    const goBack = () => {
    router.back();
  };
  const { id } = use(params);
  const router = useRouter();
  const [filiais, setFiliais] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    id_filial: "",
    id_funcao: "",
    salario: "",
    ativo: 1
  });

  useEffect(() => {
    async function carregarDados() {
      const token = getCookie("token");
      try {
        const [resFunc, resFilial] = await Promise.all([
          fetch(`http://localhost:3001/funcionario/id?id=${id}`, {
             headers: { Authorization: token }
          }),
          fetch("http://localhost:3001/filial", { headers: { Authorization: token } })
        ]);
        const responseFunc = await fetch(`http://localhost:3001/funcionario/${id}`, { 
            headers: { Authorization: token }
        });
        
        const responseFiliais = await fetch("http://localhost:3001/filial", {
            headers: { Authorization: token }
        });

        if (responseFunc.ok && responseFiliais.ok) {
          const funcData = await responseFunc.json();
          const filiaisData = await responseFiliais.json();
          
          setFiliais(filiaisData);
          setFormData({
            nome: funcData.nome,
            cpf: funcData.cpf,
            telefone: funcData.telefone,
            email: funcData.email,
            id_filial: funcData.id_filial,
            id_funcao: funcData.id_funcao,
            salario: funcData.salario,
            ativo: funcData.ativo
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    carregarDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      const res = await fetch(`http://localhost:3001/funcionario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Funcionário atualizado com sucesso!");
        router.push("/matriz/funcionarios");
      } else {
        const err = await res.json();
        alert("Erro: " + err.mensagem);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar");
    }
  };

  return (
    <div className="cadastroContainer">
        <ChevronLeft size={24} onClick={goBack} className="BtnVoltar"/>
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
          />
        </div>

        <div className="campo">
          <label>Cargo:</label>
          <select 
            name="id_funcao" 
            value={formData.id_funcao} 
            onChange={handleChange}
            className="input-select"
          >
            <option value="">Selecione...</option>
            <option value="1">Administrador</option>
            <option value="2">Gerente</option>
            <option value="3">Repositor</option>
            <option value="4">Caixa</option>
          </select>
        </div>

        <div className="campo">
          <label>Filial vinculada:</label>
          <select 
            name="id_filial" 
            value={formData.id_filial} 
            onChange={handleChange}
            className="input-select"
          >
            <option value="">Selecione...</option>
            {filiais.map(f => (
                <option key={f.id} value={f.id}>{f.endereco}</option>
            ))}
          </select>
        </div>

        <div className="linha">
          <div className="campo pequeno">
            <label>Salário:</label>
            <input 
                type="number" 
                name="salario" 
                value={formData.salario} 
                onChange={handleChange} 
                placeholder="Insira o salário" 
            />
          </div>

          <div className="campo pequeno">
            <label>Status:</label>
            <select 
                name="ativo" 
                value={formData.ativo} 
                onChange={(e) => setFormData({...formData, ativo: Number(e.target.value)})}
                className="input-select"
            >
                <option value={1}>Ativo</option>
                <option value={0}>Inativo</option>
            </select>
          </div>
        </div>

        <div className="linha">
          <div className="campo pequeno">
            <label>ID:</label>
            <input type="text" value={id} disabled className="bg-gray-100" />
          </div>

          <div className="campo pequeno">
            <label>Email:</label>
            <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Insira o email" 
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