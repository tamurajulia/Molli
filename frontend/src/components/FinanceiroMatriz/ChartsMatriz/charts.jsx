"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getCookie } from "cookies-next";
import "./charts.css";

export default function Charts() {
  const vendasRef = useRef(null);
  const fluxoRef = useRef(null);
  const categoriaRef = useRef(null);
  const contasRef = useRef(null); 

  const [lojaSelecionada, setLojaSelecionada] = useState("Todas");
  
  const [pedidos, setPedidos] = useState([]);
  const [contas, setContas] = useState([]);
  const [filiais, setFiliais] = useState([]);

  useEffect(() => {
    async function fetchData() {
        const token = getCookie("token");
        try {
            const [resPedidos, resContas, resFiliais] = await Promise.all([
                fetch("http://localhost:3001/financeiro/entradas", { headers: { Authorization: token } }),
                fetch("http://localhost:3001/contas", { headers: { Authorization: token } }),
                fetch("http://localhost:3001/filial", { headers: { Authorization: token } })
            ]);

            if (resPedidos.ok && resContas.ok && resFiliais.ok) {
                setPedidos(await resPedidos.json());
                setContas(await resContas.json());
                setFiliais(await resFiliais.json());
            }
        } catch (error) {
            console.error("Erro ao carregar dados dos gráficos:", error);
        }
    }
    fetchData();
  }, []);

  useEffect(() => {
    Chart.getChart(vendasRef.current)?.destroy();
    Chart.getChart(fluxoRef.current)?.destroy();
    Chart.getChart(categoriaRef.current)?.destroy();
    Chart.getChart(contasRef.current)?.destroy();

    if (filiais.length === 0) return;

    const vendasPorFilial = filiais.map(f => {
        const total = pedidos
            .filter(p => p.id_filial === f.id)
            .reduce((acc, curr) => acc + Number(curr.valor), 0);
        return { nome: f.endereco.split("-")[0].trim(), total };
    });

    new Chart(vendasRef.current, {
      type: "bar",
      data: {
        labels: vendasPorFilial.map(v => v.nome),
        datasets: [{
            label: "Vendas (R$)",
            data: vendasPorFilial.map(v => v.total),
            backgroundColor: "#10b981",
            borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#e0f2f1" } },
          x: { grid: { display: false } },
        },
      },
    });

    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const entradasMes = new Array(12).fill(0);
    const saidasMes = new Array(12).fill(0);

    const pedidosFiltrados = lojaSelecionada === "Todas" 
        ? pedidos 
        : pedidos.filter(p => {
            const filial = filiais.find(f => f.endereco.includes(lojaSelecionada));
            return filial && p.id_filial === filial.id;
        });

    const contasFiltradas = lojaSelecionada === "Todas"
        ? contas
        : contas.filter(c => {
            const filial = filiais.find(f => f.endereco.includes(lojaSelecionada));
            return filial && c.id_filial === filial.id;
        });

    pedidosFiltrados.forEach(p => {
        const mes = new Date(p.data).getMonth();
        entradasMes[mes] += Number(p.valor);
    });

    contasFiltradas.forEach(c => {
        const mes = new Date(c.vencimento).getMonth();
        saidasMes[mes] += Number(c.valor);
    });

    new Chart(fluxoRef.current, {
      type: "line",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Entradas",
            data: entradasMes,
            borderColor: "#8faaa3",
            backgroundColor: "#06b6d4",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Saídas",
            data: saidasMes,
            borderColor: "#566363",
            backgroundColor: "#f43f5e",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#566363" } } },
        scales: { y: { beginAtZero: true } },
      },
    });

    const metodos = {};
    pedidosFiltrados.forEach(p => {
        metodos[p.formaPagamento] = (metodos[p.formaPagamento] || 0) + Number(p.valor);
    });

    new Chart(categoriaRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(metodos).length ? Object.keys(metodos) : ["Sem dados"],
        datasets: [{
            data: Object.keys(metodos).length ? Object.values(metodos) : [1],
            backgroundColor: ["#10b981", "#06b6d4", "#f43f5e", "#f59e0b"],
        }],
      },
      options: { plugins: { legend: { position: "right", labels: { color: "#566363" } } } },
    });

    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const hours = ["08h", "10h", "12h", "14h", "16h", "18h"];
    const heatPoints = [];

    pedidosFiltrados.slice(0, 100).forEach(p => {
        const d = new Date(p.data);
        let h = d.getHours();
        if (h % 2 !== 0) h -= 1; 
        if (h < 8) h = 8; if (h > 18) h = 18;
        
        const hourStr = h < 10 ? `0${h}h` : `${h}h`;
        heatPoints.push({ x: hourStr, y: days[d.getDay()], v: 1 });
    });

    const contasPendentes = contas
        .filter(c => c.status !== 'Pago')
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 7); 

    new Chart(contasRef.current, {
      type: "bar",
      data: {
        labels: contasPendentes.map(c => c.descricao),
        datasets: [{
            label: "Valor (R$)",
            data: contasPendentes.map(c => c.valor),
            backgroundColor: contasPendentes.map(c => c.status === 'Atrasado' ? '#ef4444' : '#f59e0b'), // Vermelho se atrasado, Amarelo se pendente
            borderRadius: 6,
        }],
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } },
      },
    });

  }, [pedidos, contas, filiais, lojaSelecionada]);

  return (
    <>
      <div className="chartsGrid">
        <div className="filtroLoja">
          <label>Filtrar por Loja:</label>
          <select value={lojaSelecionada} onChange={(e) => setLojaSelecionada(e.target.value)}>
            <option value="Todas">Todas</option>
            {filiais.map(f => (
                <option key={f.id} value={f.endereco.split("-")[0].trim()}>{f.endereco.split("-")[0].trim()}</option>
            ))}
          </select>
        </div>

        <div className="chartSection">
          <h2>Vendas por Filial</h2>
          <canvas ref={vendasRef} />
        </div>

        <div className="chartSection">
          <h2>Fluxo de Caixa (Mensal)</h2>
          <canvas ref={fluxoRef} />
        </div>

        <div className="chartSection">
          <h2>Vendas por Método Pgto</h2>
          <canvas ref={categoriaRef} />
        </div>

        <div className="chartSection" style={{ gridColumn: "1 / -1" }}>
          <h2>Principais Contas a Pagar (Pendentes/Atrasadas)</h2>
          <canvas ref={contasRef} />
        </div>

      </div>
    </>
  );
}