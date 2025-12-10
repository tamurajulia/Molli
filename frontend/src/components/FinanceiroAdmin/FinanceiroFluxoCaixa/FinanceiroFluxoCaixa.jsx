"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, FileText, HelpCircle } from "lucide-react";
import { getCookie } from "cookies-next";
import "./FluxoCaixaLoja.css"; 

const FinanceiroFluxoCaixa = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vendasSemana, setVendasSemana] = useState([]);
  const [kpis, setKpis] = useState({ hoje: 0, semana: 0, mes: 0 });

  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      try {
        // CORRIGIDO: Chamando a nova rota de contagem de vendas da filial
                  const res = await fetch("http://localhost:3001/vendas-filial/quantidades", { 
            headers: { Authorization: token },
          });
          
          if (res.ok) {
            const data = await res.json();
            // Recebe as quantidades prontas do backend!
            setKpis({ 
                hoje: data.qtd_hoje, 
                semana: data.qtd_semana, 
                mes: data.qtd_mes 
            });
            // Usa a lista que veio junto para montar o gráfico
            processarDadosGrafico(data.pedidos_lista);
          }
      } catch (error) { console.error(error); }
    }
    fetchData();
  }, []);

  const processarDadosGrafico = (pedidos) => {
    const hoje = new Date();
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    // 1. Gera datas dos últimos 7 dias
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - (6 - i)); 
        return d;
    });

    // 2. Calcula Quantidade de Vendas por Dia (Gráfico)
    const dadosGrafico = ultimos7Dias.map(date => {
        const dia = date.getDate();
        const mes = date.getMonth();
        const ano = date.getFullYear();

        // CONTAGEM: Filtra pedidos por dia e pega o tamanho da lista
        const qtdDia = pedidos.filter(p => {
            const pDate = new Date(p.criado);
            return pDate.getDate() === dia && 
                   pDate.getMonth() === mes && 
                   pDate.getFullYear() === ano;
        }).length;
        
        return { 
            name: diasSemana[date.getDay()], 
            vendas: qtdDia 
        };
    });
    setVendasSemana(dadosGrafico);
  };

  // --- CONFIGURAÇÃO VISUAL DO GRÁFICO ---
  const dataGrafico = vendasSemana.length > 0 ? vendasSemana : [
    { name: "Seg", vendas: 0 }, { name: "Ter", vendas: 0 }, { name: "Qua", vendas: 0 },
    { name: "Qui", vendas: 0 }, { name: "Sex", vendas: 0 }, { name: "Sáb", vendas: 0 }, { name: "Dom", vendas: 0 }
  ];

  const maxY = Math.max(...dataGrafico.map((d) => d.vendas)) || 5; 
  const height = 150;
  const width = 400;
  const stepX = width / (dataGrafico.length - 1);

  const points = dataGrafico
    .map((d, i) => {
      const x = i * stepX;
      const y = height - (d.vendas / maxY) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const formatInt = (val) => Number(val).toString();

  const cards = [
    { titulo: "Hoje", valor: formatInt(kpis.hoje), total: "Vendas realizadas" },
    { titulo: "Semanal", valor: formatInt(kpis.semana), total: "Últimos 7 dias" },
    { titulo: "Mês", valor: formatInt(kpis.mes), total: "Acumulado Mês" },
  ];

  return (
    <div className="container">
      <h2 className="titulo d-flex align-items-center gap-2 mb-4">
        <TrendingUp className="iconeTitulo" size={22} />
        <span className="titulo-preto">Fluxo de</span>
        <span className="titulo-verde"> Caixa da Loja</span>
      </h2>

      {/* CARDS */}
      <div className="cardsContainer">
        {cards.map((item, index) => (
          <div key={index} className="cardFluxo">
            <div className="ladoVerde">
              <ShoppingCart size={26} />
              <span className="tituloCard">{item.titulo}</span>
            </div>
            <div className="ladoBranco">
              <span className="textoPequenoCinza">Quantidade</span>
              <span className="valor">{item.valor}</span>
              <span className="textoMiniCinza">{item.total}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="graficoContainer">
        <div className="graficoHeader">Gráfico de Vendas (Qtd. Diária)</div>
        <div className="graficoCorpo">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none" 
            className="graficoSVG"
            style={{ width: '100%', height: '100%' }}
          >
            {[...Array(5)].map((_, i) => (
              <line key={i} x1="0" x2={width} y1={(height / 4) * i} y2={(height / 4) * i} stroke="#e0e0e0" strokeWidth="1" />
            ))}
            
            <polyline
              fill="none"
              stroke="#6c9087"
              strokeWidth="3"
              points={points}
            />

            {dataGrafico.map((d, i) => {
              const x = i * stepX;
              const y = height - (d.vendas / maxY) * height;
              return <circle key={i} cx={x} cy={y} r="4" fill="#6c9087" />;
            })}
          </svg>
          
          <div className="eixoX">
            {dataGrafico.map((d, i) => (
              <span key={i}>{d.name}</span>
            ))}
          </div>
        </div>
        <div className="graficoRodape">Total na Semana: {formatInt(kpis.semana)} vendas</div>
      </div>

      {/* CARD DE RELATÓRIO */}
      <div className="card-relatorio">
        <div className="cabecalho-relatorio">
          <div className="titulo-relatorio">
            <FileText size={22} />
            <h2 className="">Emissão de relatórios</h2>
          </div>
          <HelpCircle
            size={20}
            className="icone-ajuda"
            onClick={() => setMostrarModal(true)}
          />
        </div>

        <div className="inputs-relatorio">
          <p className="text-sm text-gray-500 mb-2">Utilize o botão de exportação global no canto da tela.</p>
        </div>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FileText size={22} className="iconeModal" />
              <h3>Como gerar um relatório</h3>
            </div>
            <p className="textoModal">
              Para gerar um relatório, utilize o botão flutuante no canto inferior direito da tela.
            </p>
            <button className="btnFiltrar" onClick={() => setMostrarModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceiroFluxoCaixa;