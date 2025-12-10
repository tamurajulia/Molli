"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getCookie } from "cookies-next";
import "./charts.css";

export default function Charts({ chart }) {   // <-- CORREÇÃO AQUI
  const vendasDiaRef = useRef(null);
  const fluxoCaixaRef = useRef(null);
  const desempenhoFuncRef = useRef(null);
  const vendasCategoriaRef = useRef(null);

  const [pedidos, setPedidos] = useState([]);
  const [contas, setContas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // 1. Buscar Dados Reais
  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      try {
        const [resPedidos, resContas, resFunc] = await Promise.all([
          fetch("http://localhost:3001/financeiro/entradas", { headers: { Authorization: token } }),
          fetch("http://localhost:3001/contas", { headers: { Authorization: token } }),
          fetch("http://localhost:3001/funcionario", { headers: { Authorization: token } })
        ]);

        if (resPedidos.ok && resContas.ok) {
          setPedidos(await resPedidos.json());
          setContas(await resContas.json());
          if (resFunc.ok) setFuncionarios(await resFunc.json());
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    fetchData();
  }, []);

  // 2. Renderizar Gráficos
  useEffect(() => {
    // Evita rodar tudo se nenhum gráfico estiver sendo pedido  
    if (!chart) return;

    // Limpa gráficos antigos
    const refs = {
      vendasDia: vendasDiaRef,
      fluxoCaixa: fluxoCaixaRef,
      desempenhoFunc: desempenhoFuncRef,
      vendasCategoria: vendasCategoriaRef
    };

    const ref = refs[chart];
    if (!ref?.current) return;

    if (Chart.getChart(ref.current)) {
      Chart.getChart(ref.current).destroy();
    }

    // Apenas renderiza o gráfico selecionado
    switch (chart) {

      // ----------------------------------------------------------
      // GRÁFICO 1 — VENDAS POR DIA
      // ----------------------------------------------------------
      case "vendasDia": {
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
        const hoje = new Date();

        const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(hoje.getDate() - (6 - i));
          return d;
        });

        const dadosVendasDia = ultimos7Dias.map(dataRef => {
          const diaStr = dataRef.toISOString().split("T")[0];
          const total = pedidos
            .filter(p => p.data.startsWith(diaStr))
            .reduce((acc, curr) => acc + Number(curr.valor), 0);

          return {
            dia: diasSemana[dataRef.getDay()],
            total,
          };
        });

        new Chart(ref.current, {
          type: "line",
          data: {
            labels: dadosVendasDia.map(d => d.dia),
            datasets: [{
              label: "Vendas (R$)",
              data: dadosVendasDia.map(d => d.total),
              borderColor: "#8faaa3",
              backgroundColor: "rgba(143,170,163,0.3)",
              fill: true,
              tension: 0.3,
              pointRadius: 6,
              pointBackgroundColor: "#8faaa3",
            }],
          },
          options: {
            plugins: { legend: { labels: { color: "#566363", font: { family: "Montserrat" } } } },
            scales: {
              y: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
              x: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
            },
          },
        });
        break;
      }

      // ----------------------------------------------------------
      // GRÁFICO 2 — FLUXO DE CAIXA MENSAL
      // ----------------------------------------------------------
      case "fluxoCaixa": {
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
        const entradasMes = new Array(12).fill(0);
        const saidasMes = new Array(12).fill(0);

        pedidos.forEach(p => {
          const mes = new Date(p.data).getMonth();
          entradasMes[mes] += Number(p.valor);
        });

        contas.forEach(c => {
          const mes = new Date(c.vencimento).getMonth();
          saidasMes[mes] += Number(c.valor);
        });

        new Chart(ref.current, {
          type: "bar",
          data: {
            labels: meses,
            datasets: [
              { label: "Entradas (R$)", data: entradasMes, backgroundColor: "#8faaa3" },
              { label: "Saídas (R$)", data: saidasMes, backgroundColor: "#566363" },
            ],
          },
          options: {
            plugins: { legend: { labels: { color: "#566363", font: { family: "Montserrat" } } } },
            scales: {
              y: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
              x: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
            },
          },
        });
        break;
      }

      // ----------------------------------------------------------
      // GRÁFICO 3 — FUNCIONÁRIOS
      // ----------------------------------------------------------
      case "desempenhoFunc": {
        const vendasPorFunc = {};

        pedidos.forEach(p => {
          const nome = p.Registro || "Não Identificado";
          vendasPorFunc[nome] = (vendasPorFunc[nome] || 0) + Number(p.valor);
        });

        const top = Object.entries(vendasPorFunc)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 7);

        new Chart(ref.current, {
          type: "bar",
          data: {
            labels: top.map(([n]) => n),
            datasets: [{
              label: "Vendas (R$)",
              data: top.map(([,v]) => v),
              backgroundColor: "#8faaa3"
            }],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              y: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
              x: { ticks: { color: "#566363", font: { family: "Montserrat" } } },
            },
          },
        });
        break;
      }

      // ----------------------------------------------------------
      // GRÁFICO 4 — MÉTODOS DE PAGAMENTO
      // ----------------------------------------------------------
      case "vendasCategoria": {
        const metodos = {};
        pedidos.forEach(p => {
          metodos[p.formaPagamento] = (metodos[p.formaPagamento] || 0) + Number(p.valor);
        });

        new Chart(ref.current, {
          type: "doughnut",
          data: {
            labels: Object.keys(metodos),
            datasets: [{
              data: Object.values(metodos),
              backgroundColor: ["#8faaa3", "#566363", "#abded1", "#90bebb"],
            }],
          },
          options: {
            plugins: { legend: { labels: { color: "#566363", font: { family: "Montserrat" } } } },
          },
        });
        break;
      }
    }

  }, [chart, pedidos, contas, funcionarios]);

  return (
    <div className="w-full h-full">
      {chart === "vendasDia" && <canvas ref={vendasDiaRef} />}
      {chart === "fluxoCaixa" && <canvas ref={fluxoCaixaRef} />}
      {chart === "desempenhoFunc" && <canvas ref={desempenhoFuncRef} />}
      {chart === "vendasCategoria" && <canvas ref={vendasCategoriaRef} />}
    </div>
  );
}
