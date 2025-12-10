'use client';
import { useEffect, useState } from 'react';
import NavClient from '@/components/NavClient/navClient';
import Footer from '@/components/Footer/footer';
import Image from 'next/image';
import Link from 'next/link';
import './home.css';
import { setCookie } from 'cookies-next';
import { Phone, Building2, Store } from 'lucide-react';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [filiais, setFiliais] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const perguntas = [
    'Quais são os horários de funcionamento da loja?',
    'Posso trocar um produto presencialmente?',
    'Vocês oferecem atendimento personalizado para bebês?',
    'Vocês oferecem embalagens para presente?',
  ];

  const togglePergunta = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  async function pegarFiliais() {
    try {
      const token = setCookie('token');
      const response = await fetch('http://localhost:3001/filial', {
        headers: { Authorization: token },
      });

      if (!response.ok) {
        alert('Erro ao buscar filiais');
      }

      const data = await response.json();

      setFiliais(data);
      return data;
    } catch (error) {
      console.error('Erro ao pegar filiais:', error);
    }
  }

  useEffect(() => {
    pegarFiliais();
  }, []);

  return (
    <>
      <NavClient />
      <main>
        <div className="bannerFullWidth">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/IMG/mobile/MobileBanner.png"
            />
            <Image
              src="/IMG/home/bannerHome.png"
              alt="Banner Home"
              width={1920}
              height={600}
              className="bannerImage"
              priority
            />
          </picture>
        </div>

        <section className="molli-container">
          <div className="molli-top">
            <div className="molli-images">
              <Image
                src="/IMG/home/mae.png"
                alt="Bebê e mãe"
                width={180}
                height={240}
                className="molli-img"
              />
              <Image
                src="/IMG/home/bebe.png"
                alt="Mãe e bebê"
                width={180}
                height={240}
                className="molli-img"
              />
            </div>

            <div className="molli-text">
              <h1 className="molli-title">molli</h1>
              <h3 className="molli-subtitle">NOSSA LOJA</h3>
              <p className="molli-description">
                A Molli nasceu com o propósito de transformar o cuidado com o
                bebê em momentos cheios de carinho, praticidade e aconchego.{' '}
                <br />
                Somos uma marca especializada em produtos infantis e enxovais,
                que une qualidade, conforto e amor em cada detalhe.
              </p>
            </div>
          </div>

          <div className="bannerProdutos-container">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/IMG/mobile/mobille.png"
              />
              <Image
                src="/IMG/home/produtos1.png"
                alt="Banner Produtos"
                width={1920}
                height={600}
                className="bannerImage"
                priority
              />
            </picture>

            <div className="produtos-overlay">
              <h4 className="categoria-sub">CATEGORIA</h4>
              <h2 className="categoria-title">Conheça nossos produtos</h2>

              <div className="categoria-icons">
                <Link
                  href="/cliente/produtos#Acessório"
                  className="categoria-card"
                >
                  <Image
                    src="/IMG/icones/acessorios.png"
                    alt="Acessório"
                    width={70}
                    height={70}
                  />
                  <p>ACESSÓRIOS</p>
                </Link>

                <Link
                  href="/cliente/produtos#Roupa"
                  className="categoria-card"
                >
                  <Image
                    src="/IMG/icones/roupas.png"
                    alt="Roupas"
                    width={70}
                    height={70}
                  />
                  <p>ROUPAS</p>
                </Link>

                <Link
                  href="/cliente/produtos#Cuidado"
                  className="categoria-card"
                >
                  <Image
                    src="/IMG/icones/cuidado.png"
                    alt="Cuidados"
                    width={70}
                    height={70}
                  />
                  <p>CUIDADOS</p>
                </Link>

                <Link
                  href="/cliente/produtos#Conforto"
                  className="categoria-card"
                >
                  <Image
                    src="/IMG/icones/conforto.png"
                    alt="Conforto"
                    width={70}
                    height={70}
                  />
                  <p>CONFORTO</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mvv-section" id="mvv">
          <div className="mvv-container">
            <div className="mvv-text">
              <h2 className="mvv-title">missão</h2>
              <p className="mvv-texto">
                Proporcionar às famílias praticidade, conforto e carinho no
                cuidado com o bebê, oferecendo produtos de qualidade e
                experiências personalizadas que tornam cada fase da maternidade
                mais leve e especial.
              </p>

              <h2 className="mvv-title">visão</h2>
              <p className="mvv-texto">
                Ser reconhecida como a marca referência em assinaturas infantis
                e enxovais no Brasil, unindo tecnologia, afeto e inovação para
                transformar o modo como mães e pais cuidam de seus filhos.
              </p>

              <h2 className="mvv-title">valores</h2>
              <p className="mvv-texto">
                Amor, cuidado, qualidade, confiança, inovação, empatia e
                sustentabilidade.
              </p>
            </div>

            <div className="mvv-image">
              <Image
                src="/IMG/home/mvv.png"
                alt="Missão Visão Valores - fotos"
                width={420}
                height={380}
                className="mvv"
              />
            </div>
          </div>
        </section>

        <section className="lojas-section" id="filiais">
          <div className="container-lojas">
            <h2 className="lojas-title">
              <span className="lojas-bar"></span> NOSSAS LOJAS
            </h2>

            <div className="lojas-grid">
              {filiais
                .slice(
                  (paginaAtual - 1) * itensPorPagina,
                  paginaAtual * itensPorPagina
                )
                .map((filial) => (
                  <div className="loja-card" key={filial.id}>
                    <div className="loja-card--img">
                      {filial.foto_filial ? (
                        <img
                          src={`http://localhost:3001/${filial.foto_filial}`}
                          alt={`Loja ${filial.endereco}`}
                          width={300}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 text-gray-400">
                          <Store size={48} />
                          filial sem imagem
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="text-[#8faaa3] text-lg">
                        {filial.endereco}
                      </h3>
                      <p className="flex gap-1.5 items-center">
                        <Phone className="size-[18px] text-[#8faaa3]" />{' '}
                        {filial.telefone}
                      </p>
                      <p className="flex gap-1.5 items-center">
                        <Building2 className="size-[18px] text-[#8faaa3]" />
                        {filial.cnpj}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="carrossel-controles mt-6 flex justify-center gap-4">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="flex items-center gap-2">
                Página {paginaAtual} de{' '}
                {Math.ceil(filiais.length / itensPorPagina)}
              </span>
              <button
                onClick={() =>
                  setPaginaAtual((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filiais.length / itensPorPagina)
                    )
                  )
                }
                disabled={
                  paginaAtual === Math.ceil(filiais.length / itensPorPagina)
                }
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-inner">
            <div className="faq-left">
              <div className="faq-coelho-wrap">
                <Image
                  src="/IMG/home/coelhoo.png"
                  alt="Coelho"
                  width={420}
                  height={420}
                  priority
                />
              </div>
            </div>

            <div className="faq-right">
              <div className="faq-card">
                <div className="faq-card-header">
                  <h4 className="faq-sub">DÚVIDAS?</h4>
                  <h2 className="faq-title">perguntas frequentes</h2>
                </div>

                <div className="faq-list">
                  {perguntas.map((item, index) => (
                    <div
                      key={index}
                      className={`faq-item ${
                        activeIndex === index ? 'active' : ''
                      }`}
                      onClick={() => togglePergunta(index)}
                    >
                      <div className="faq-row">
                        <span className="faq-text">{item}</span>
                        <span
                          className={`faq-chev ${
                            activeIndex === index ? 'open' : ''
                          }`}
                        >
                          ▾
                        </span>
                      </div>

                      <div className="faq-answer">
                        <p>
                          Aqui vai a resposta da pergunta. Substitua por seu
                          texto real. Esse texto aparece quando o item está
                          aberto.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
