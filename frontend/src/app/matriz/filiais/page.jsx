"use client";

import React, { useState, useEffect } from "react";
import {
  Edit3,
  MapPin,
  Phone,
  Building2,
  X,
  Store,
  CheckCircle2,
  XCircle,
  Mail,
  Camera,
  Pencil,
} from "lucide-react";
import "./lojas.css";
import { getCookie } from "cookies-next";

export default function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [novaLoja, setNovaLoja] = useState({
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    ativo: 1,
  });

  const [arquivoCriar, setArquivoCriar] = useState(null);
  const [arquivoEditar, setArquivoEditar] = useState(null);

  const API_URL = "http://localhost:3001";

  async function carregarFiliais() {
    const token = getCookie("token");

    try {
      const response = await fetch(`${API_URL}/filial`, {
        method: "GET",
        headers: {
          ...(token && { Authorization: token }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLojas(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFiliais();
  }, []);

  const criarLoja = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      const formData = new FormData();
      formData.append("cnpj", novaLoja.cnpj);
      formData.append("endereco", novaLoja.endereco);
      formData.append("telefone", novaLoja.telefone);
      formData.append("email", novaLoja.email);
      formData.append("ativo", novaLoja.ativo);
      
      if (arquivoCriar) {
        formData.append("foto_filial", arquivoCriar);
      }

      const response = await fetch(`${API_URL}/filial`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Filial criada com sucesso!");
        carregarFiliais();
        fecharModalCriar();
        setNovaLoja({
          cnpj: "",
          endereco: "",
          telefone: "",
          email: "",
          ativo: 1,
        });
        setArquivoCriar(null);
      } else {
        const erro = await response.json();
        alert("Erro: " + erro.mensagem);
      }
    } catch (error) {
      console.error(error);
    }
  };


    const salvarEdicao = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      const formData = new FormData();
      formData.append("cnpj", lojaSelecionada.cnpj || ""); 
      formData.append("endereco", lojaSelecionada.endereco || "");
      formData.append("telefone", lojaSelecionada.telefone || "");
      formData.append("email", lojaSelecionada.email || "");
      formData.append("ativo", lojaSelecionada.ativo);

      if (arquivoEditar) {
        formData.append("foto_filial", arquivoEditar);
      }

      const response = await fetch(
        `${API_URL}/filial/${lojaSelecionada.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Filial atualizada!");
        carregarFiliais();
        fecharModalEditar();
        setArquivoEditar(null);
      } else {
        alert("Erro ao atualizar.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalEditar = (loja) => {
    setLojaSelecionada(loja);
    setArquivoEditar(null);
    setModalAberto(true);
  };

  const fecharModalEditar = () => {
    setModalAberto(false);
    setLojaSelecionada(null);
    setArquivoEditar(null);
  };

  const abrirModalCriar = () => {
    setArquivoCriar(null);
    setModalCriarAberto(true);
  };
  
  const fecharModalCriar = () => setModalCriarAberto(false);

  const total = lojas.length;
  const ativas = lojas.filter((l) => l.ativo === 1).length;
  const inativas = lojas.filter((l) => l.ativo === 0).length;

  return (
    <div className="lojas-container">
      <div className="top-header">
        <h2 className="titulo">
          <Store className="iconeTitulo" size={22} />
          <span className="titulo-preto">Filiais</span>
          <span className="titulo-verde"> da Molli:</span>
        </h2>
        <button className="btn-cadastrar" onClick={abrirModalCriar}>
          Nova Loja
        </button>
      </div>

      <div className="mini-cards-container mt-5">
        <div className="mini-card">
          <div className="mini-left">
            <Store size={32} className="mini-icon" />
          </div>
          <div className="mini-right">
            <h3>{total}</h3>
            <p>Filiais Vinculadas</p>
          </div>
        </div>

        <div className="mini-card">
          <div className="mini-left">
            <CheckCircle2 size={32} className="mini-icon" />
          </div>
          <div className="mini-right">
            <h3>{ativas}</h3>
            <p>Filiais Ativas</p>
          </div>
        </div>

        <div className="mini-card">
          <div className="mini-left">
            <XCircle size={32} className="mini-icon" />
          </div>
          <div className="mini-right">
            <h3>{inativas}</h3>
            <p>Filiais Inativas</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mt-5 text-center text-gray-500">Carregando filiais...</p>
      ) : (
        <div className="grid-lojas mt-5">
          {lojas.map((loja) => (
            <div key={loja.id} className="card-loja novo-card">
              
              <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                 {loja.foto_filial ? (
                    <img 
                        src={`${API_URL}/${loja.foto_filial.replace(/\\/g, '/')}`} 
                        alt={`Foto Filial ${loja.id}`} 
                        className="w-full h-full object-cover"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Store size={48} />
                    </div>
                 )}
              </div>

              <div className="header-card">
                <div className="header-info">
                  <Building2 size={22} className="icone-header" />
                  <h3 className="titulo-filial">Filial #{loja.id}</h3>
                </div>
                <Pencil
                    className="icone-editar"
                    size={34}
                    title="Editar loja"
                    onClick={() => abrirModalEditar(loja)}
                />
              </div>

              <div className="conteudo-card">
                <p className="linha">
                  <span className="label-bold">CNPJ:</span> {loja.cnpj}
                </p>

                <p className="linha">
                  <MapPin size={16} className="icon" />
                  {loja.endereco}
                </p>

                <p className="linha">
                  <Phone size={16} className="icon" />
                  <span className="label-bold">Tel:</span> {loja.telefone}
                </p>

                <p className="linha">
                  <Mail size={16} className="icon" />
                  <span className="label-bold">Email:</span> {loja.email}
                </p>

                <span className={`status-pill ${loja.ativo ? "ativa" : "inativa"}`}>
                  {loja.ativo ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalCriarAberto && (
        <div className="modal-overlay">
          <div className="modal-content-loja">
            <div className="modal-header">
              <h3>Nova Filial</h3>
              <X
                className="fechar-modal cursor-pointer"
                size={22}
                onClick={fecharModalCriar}
              />
            </div>

            <form className="form-modal" onSubmit={criarLoja}>
              <div className="w-full mb-4 flex justify-center">
                  <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-[#566363]">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          {arquivoCriar ? (
                              <img src={URL.createObjectURL(arquivoCriar)} className="w-full h-full rounded-full object-cover" />
                          ) : <Camera size={24} />}
                      </div>
                      <span className="text-xs font-bold">Adicionar Foto</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setArquivoCriar(e.target.files[0])} />
                  </label>
              </div>

              <label>
                CNPJ:
                <input
                  type="text"
                  value={novaLoja.cnpj}
                  placeholder="00.000.000/0000-00"
                  onChange={(e) => setNovaLoja({ ...novaLoja, cnpj: e.target.value })}
                  required
                />
              </label>

              <label>
                Endereço:
                <input
                  type="text"
                  value={novaLoja.endereco}
                  placeholder="Rua, Número - Cidade/UF"
                  onChange={(e) => setNovaLoja({ ...novaLoja, endereco: e.target.value })}
                  required
                />
              </label>

              <label>
                Telefone:
                <input
                  type="text"
                  value={novaLoja.telefone}
                  placeholder="(00) 0000-0000"
                  onChange={(e) => setNovaLoja({ ...novaLoja, telefone: e.target.value })}
                  required
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={novaLoja.email}
                  placeholder="email@molli.com"
                  onChange={(e) => setNovaLoja({ ...novaLoja, email: e.target.value })}
                  required
                />
              </label>

              <label>
                Status:
                <select
                  value={novaLoja.ativo}
                  onChange={(e) => setNovaLoja({ ...novaLoja, ativo: Number(e.target.value) })}
                >
                  <option value={1}>Ativa</option>
                  <option value={0}>Inativa</option>
                </select>
              </label>

              <div className="botoes-modal mt-4">
                <button type="button" className="btn-cancelar" onClick={fecharModalCriar}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Criar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAberto && lojaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content-loja w-700!">
            <div className="modal-header">
              <h3>Editar Filial #{lojaSelecionada.id}</h3>
              <X
                className="fechar-modal cursor-pointer"
                size={22}
                onClick={fecharModalEditar}
              />
            </div>
            <form className="form-modal" onSubmit={salvarEdicao}>
              
              <div className="w-full mb-4 flex justify-center">
                  <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-[#566363]">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          {arquivoEditar ? (
                              <img src={URL.createObjectURL(arquivoEditar)} className="w-full h-full rounded-full object-cover" />
                          ) : lojaSelecionada.foto_filial ? (
                              <img src={`${API_URL}/${lojaSelecionada.foto_filial.replace(/\\/g, '/')}`} className="w-full h-full rounded-full object-cover" />
                          ) : <Camera size={24} />}
                      </div>
                      <span className="text-xs font-bold">Alterar Foto</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setArquivoEditar(e.target.files[0])} />
                  </label>
              </div>

              <label>
                CNPJ:
                <input
                  type="text"
                  value={lojaSelecionada.cnpj}
                  onChange={(e) => setLojaSelecionada({ ...lojaSelecionada, cnpj: e.target.value })}
                />
              </label>

              <label>
                Endereço:
                <input
                  type="text"
                  value={lojaSelecionada.endereco}
                  onChange={(e) => setLojaSelecionada({ ...lojaSelecionada, endereco: e.target.value })}
                />
              </label>

              <label>
                Telefone:
                <input
                  type="text"
                  value={lojaSelecionada.telefone}
                  onChange={(e) => setLojaSelecionada({ ...lojaSelecionada, telefone: e.target.value })}
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={lojaSelecionada.email}
                  onChange={(e) => setLojaSelecionada({ ...lojaSelecionada, email: e.target.value })}
                />
              </label>

              <label>
                Status:
                <select
                  value={lojaSelecionada.ativo}
                  onChange={(e) => setLojaSelecionada({ ...lojaSelecionada, ativo: e.target.value })}
                >
                  <option value={1}>Ativa</option>
                  <option value={0}>Inativa</option>
                </select>
              </label>

              <div className="botoes-modal mt-4">
                <button type="button" className="btn-cancelar" onClick={fecharModalEditar}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}