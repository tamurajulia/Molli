"use client";

import React, { useEffect, useState } from "react";
import "./cadastrar.css";
import { Users, Mail, Phone, MapPin, Briefcase, DollarSign, Building2, UserCheck, KeyRound, FileText, ChevronLeft } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function CadastroFuncionarioMatriz() {
  const router = useRouter();
  const [filiais, setFiliais] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    id_filial: "",
    id_funcao: "",
    salario: ""
  });

  useEffect(() => {
    async function fetchFiliais() {
      const token = getCookie("token");
      try {
        const res = await fetch("http://localhost:3001/filial", {
          headers: { Authorization: token }
        });
        if (res.ok) {
          const data = await res.json();
          setFiliais(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchFiliais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      const res = await fetch("http://localhost:3001/funcionario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Funcionário cadastrado com sucesso!");
        router.push("/matriz/funcionarios");
      } else {
        const err = await res.json();
        alert("Erro: " + err.mensagem);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar");
    }
  };

  return (
    <div className="cadastro-container">
      <ChevronLeft size={24} onClick={() => router.back()} className="BtnVoltar"/>
      <h2 className="titulo">
        <Users className="iconeTitulo" size={26} />
        <span className="titulo-preto">Cadastro de</span>
        <span className="titulo-verde"> Funcionário</span>
      </h2>

      <form className="formulario" onSubmit={handleSubmit}>
        <div className="secao">
          <h3><UserCheck size={18} /> Dados Pessoais</h3>
          <div className="campo1">
            <label>Nome completo:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Nome completo" />
          </div>
          <div className="linha tres-colunas">
            <div className="campo1">
              <label>CPF:</label>
              <div className="inputIcone">
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                <FileText className="icone-input" size={18} />
              </div>
            </div>
            <div className="campo1">
              <label>Telefone:</label>
              <div className="inputIcone">
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />
                <Phone className="icone-input" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="secao">
          <h3><Briefcase size={18} /> Dados Profissionais</h3>
          <div className="linha tres-colunas">
            <div className="campo1">
              <label>Cargo:</label>
              <div className="inputIcone">
                <select name="id_funcao" value={formData.id_funcao} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  <option value="1">Administrador</option>
                  <option value="2">Gerente</option>
                  <option value="3">Repositor</option>
                  <option value="4">Caixa</option>
                </select>
              </div>
            </div>
            <div className="campo1">
              <label>Filial vinculada:</label>
              <div className="inputIcone">
                <select name="id_filial" value={formData.id_filial} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {filiais.map(f => (
                    <option key={f.id} value={f.id}>{f.endereco}</option>
                  ))}
                </select>
                <Building2 className="icone-input" size={18} />
              </div>
            </div>
            <div className="campo1">
              <label>Salário (R$):</label>
              <div className="inputIcone">
                <input type="number" name="salario" value={formData.salario} onChange={handleChange} required placeholder="0.00" />
                <DollarSign className="icone-input" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="secao">
          <h3><KeyRound size={18} /> Acesso e Segurança</h3>
          <div className="linha duas-colunas">
            <div className="campo1">
              <label>Email (Login):</label>
              <div className="inputIcone">
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@molli.com" />
                <Mail className="icone-input" size={18} />
              </div>
            </div>
            <div className="campo1">
              <label>Senha Provisória:</label>
              <div className="inputIcone">
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} required placeholder="********" />
              </div>
            </div>
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