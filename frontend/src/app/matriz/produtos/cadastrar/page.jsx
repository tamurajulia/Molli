'use client'
import React, { useState } from "react";
import "./cadastrar.css";
import { Search, ChevronLeft, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function CadastroProduto() {
  const router = useRouter();
  const [imagemPreview, setImagemPreview] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    codigo_barras: "",
    preco: "",
  });

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoImagem(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

const salvar = async (e) => {
  e.preventDefault();

  if (!arquivoImagem) {
    alert("A imagem do produto é obrigatória.");
    return;
  }

  try {
    const token = getCookie("token");
    const formData = new FormData();
    
    formData.append("nome", form.nome);
    formData.append("id_categoria", form.categoria);
    formData.append("codigo_barras", form.codigo_barras);
    formData.append("preco_venda", form.preco.replace(',', '.'));
    formData.append("imagem", arquivoImagem);  

    const res = await fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData,
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Produto cadastrado com sucesso!");
      router.push("/matriz/estoque");
    } else {
      alert("Erro: " + data.mensagem);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar produto");
  }
};



  return (
    <div className="cadastro-container">
      <div className="lado-esquerdo">
         <div className="w-full h-full flex items-center justify-center bg-[#e6efec] rounded-lg overflow-hidden relative min-h-[300px]">
            {imagemPreview ? (
                <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-400">
                    <ImageIcon size={64} className="mx-auto mb-2 opacity-50" />
                    <p>A imagem aparecerá aqui</p>
                </div>
            )}
         </div>
      </div>

      <div className="lado-direito">
        <div className="mb-4 cursor-pointer flex items-center text-gray-500 hover:text-[#566363] transition-colors" onClick={() => router.back()}>
            <ChevronLeft size={24} className="mr-1"/> <span className="font-semibold">Voltar</span>
        </div>

        <h2 className="titulo">
          <Search size={22} className="iconeTitulo" />
          <span className="titulo-preto">Cadastro de</span>
          <span className="titulo-verde"> Produto:</span>
        </h2>

        <hr className="linha" />

        <form className="formulario" onSubmit={salvar}>
          
          <div className="campo">
            <label>Imagem do Produto <span className="text-red-500">*</span></label>
            <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                <Upload size={20} className="text-[#566363]" />
                <span className="text-gray-500 text-sm font-medium">
                    {arquivoImagem ? arquivoImagem.name : "Clique para fazer upload da imagem"}
                </span>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImagemChange} 
                    className="hidden" 
                    required 
                />
            </label>
          </div>

          <div className="campo">
            <label>Nome do produto:</label>
            <input
              required
              type="text"
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              placeholder="INSIRA O NOME COMPLETO"
            />
          </div>

          <div className="linha-dupla">
            <div className="campo metade">
              <label>Categoria:</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={(e) => atualizar("categoria", e.target.value)}
                required
                className="p-2 bg-[#f7f9f8] border-none rounded outline-none w-full text-[#7a9690]"
              >
                <option value="">SELECIONE...</option>
                <option value="1">Acessório</option>
                <option value="2">Roupa</option>
                <option value="3">Cuidado</option>
                <option value="4">Conforto</option>
              </select>
            </div>
            <div className="campo metade">
              <label>Código de barras:</label>
              <input
                required
                type="text"
                value={form.codigo_barras}
                onChange={(e) => atualizar("codigo_barras", e.target.value)}
                placeholder="INSIRA O CÓDIGO"
              />
            </div>
          </div>

          <div className="campo">
            <label>Preço de Venda (R$):</label>
            <input
              required
              type="number"
              step="0.01"
              value={form.preco}
              onChange={(e) => atualizar("preco", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="rodape">
            <span className="logo">Molli</span>
            <button type="submit" className="botao">
              Criar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
