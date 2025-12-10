'use client';
import NavClient from '@/components/NavClient/navClient';
import Footer from '@/components/Footer/footer';
import './produtos.css';
import { useState, useEffect, useRef } from 'react';
import Loader from '@/app/loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoriaRow = ({ cat }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === 'left' ? -320 : 320;

      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="secao-produtos relative py-6" id={cat.titulo}>
      <div className="titulo-linha mb-6 px-4 md:px-0">
        <h2 className='!text-3xl border-l-5 pl-2 border-[#e8cfc5] !font-semibold'>{cat.titulo}</h2>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-gray-700 transition-all hidden md:block -ml-4"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-6 pb-4 px-4 md:px-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cat.produtos.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl shadow-md border border-gray-100 snap-center overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() =>
                window.location.replace(`/cliente/produtos/${p.id}`)
              }
            >
              <div className="produto-img-container relative h-64 w-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={`http://localhost:3001/uploads/produtos/${p.imagem}`}
                  alt={p.nome}
                  className="produto-img object-contain w-full h-full rounded-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-5 flex flex-col gap-2">
                <p
                  className="text-xl font-medium text-[#b58c82] line-clamp-1"
                  title={p.nome}
                >
                  {p.nome}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2 h-10">
                  {p.descricao}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-800 italic">
                    {Number(p.preco_venda).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                  <button className="text-sm bg-[#b58c82] text-white px-3 py-1.5 rounded-lg hover:bg-[#a07a70] transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-gray-700 transition-all hidden md:block -mr-4"
          aria-label="Próximo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default function Produtos() {
  const [categorias, setCategorias] = useState([]);

  async function pegarProdutos() {
    try {
      const res = await fetch('http://localhost:3001/produtos/cliente');
      if (!res.ok) alert('Erro ao buscar produtos');

      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err.message || 'Erro ao buscar produtos');
    }
  }

  useEffect(() => {
    pegarProdutos();
  }, []);

  return (
    <>
      <NavClient />
      <main className="min-h-screen bg-gray-50/30">
        <div className="produtos-container max-w-7xl mx-auto py-8">
          {categorias.length > 0 ? (
            categorias.map((cat, index) => (
              <CategoriaRow key={index} cat={cat} />
            ))
          ) : (
            <Loader />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
