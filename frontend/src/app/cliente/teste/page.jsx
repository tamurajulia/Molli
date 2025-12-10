'use client';

import { useRef } from 'react';
import './res.css'

const DATA = [
  { id: 1, title: 'Design Moderno', color: 'bg-blue-500' },
  { id: 2, title: 'Alta Performance', color: 'bg-purple-500' },
  { id: 3, title: 'Responsivo', color: 'bg-emerald-500' },
  { id: 4, title: 'Acessibilidade', color: 'bg-amber-500' },
  { id: 5, title: 'SEO Friendly', color: 'bg-rose-500' },
  { id: 6, title: 'Escalável', color: 'bg-indigo-500' },
];

export default function Carousel() {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      // Ajuste o valor 300 para controlar a distância do scroll
      const scrollAmount = direction === 'left' ? -300 : 300;

      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nossos Serviços</h2>

      {/* Botão Esquerda (Anterior) */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all hidden md:block"
        aria-label="Anterior"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Container do Scroll */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {DATA.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-80 h-96 bg-white rounded-xl shadow-md border border-gray-100 snap-center overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagem/Topo do Card */}
            <div
              className={`h-48 w-full ${item.color} flex items-center justify-center`}
            >
              <span className="text-white text-4xl font-bold">{item.id}</span>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">
                Exemplo de descrição curta para o card feito com Tailwind e
                Next.js.
              </p>
              <button className="mt-4 w-full py-2 px-4 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition">
                Saiba mais
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Direita (Próximo) */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all hidden md:block"
        aria-label="Próximo"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}