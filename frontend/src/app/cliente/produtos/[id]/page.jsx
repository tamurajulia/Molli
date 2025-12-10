'use client';
import NavClient from '@/components/NavClient/navClient';
import Footer from '@/components/Footer/footer';
import Image from 'next/image';
import { use, useState, useEffect } from 'react';
import './detalhes.css';
import Loader from '@/app/loading';
import { ChevronLeft } from 'lucide-react';

export default function DetalhesProduto({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [produto, setProduto] = useState(null);

  const categorias = [
    { id: 1, nome: 'Acessório' },
    { id: 2, nome: 'Roupa' },
    { id: 3, nome: 'Cuidado' },
    { id: 4, nome: 'Conforto' },
  ];

  function decodificarCategoria(id_categoria) {
    const categoria = categorias.find((cat) => cat.id === id_categoria);
    return categoria ? categoria.nome : 'Categoria desconhecida';
  }

  useEffect(() => {
    async function fetchProduto() {
      try {
        const res = await fetch(`http://localhost:3001/produtos/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar produto');
        const data = await res.json();
        setProduto(data);
      } catch (err) {
        console.error(err);
        alert(err.message || 'Erro ao buscar produto');
      }
    }

    fetchProduto();
  }, [id]);

  if (!produto) return <Loader />;

  return (
    <>
      <NavClient />
      <main>
        <div className="detalhes-container">
          <div className="detalhes-card">
            <button
              onClick={() => window.location.replace('/cliente/produtos')}
              className="
                absolute top-4 left-4 md:top-6 md:left-6 
                flex items-center justify-center 
                w-10 h-10 md:w-12 md:h-12 
                text-[#8faaa3] bg-white/80 dark:bg-gray-800/70 
                rounded-full shadow hover:bg-white dark:hover:bg-gray-700 
                transition-all"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="imagem">
              <img
                src={`http://localhost:3001/uploads/produtos/${produto.imagem}`}
                alt={produto.nome}
                width={300}
                height={300}
                className="imagem-produto rounded-2xl"
              />
            </div>

            <div className="info">
              <h2 className="text-[#b58c82] text-3xl mb-7 md:mt-5">
                {produto.nome}
              </h2>
              <p>
                <span>Descrição:</span> {produto.descricao}
              </p>
              {produto.id_categoria && (
                <p>
                  <span>Categoria:</span>{' '}
                  {decodificarCategoria(produto.id_categoria)}
                </p>
              )}
              <p>
                <span>Na Molli desde:</span>{' '}
                {new Date(produto.criado).toLocaleDateString('pt-BR')}
              </p>
              <p>
                <span>Preço:</span>{' '}
                {Number(produto.preco_venda).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
