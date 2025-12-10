"use client";

import { useMemo, useEffect, useState } from "react";
import "./kpicards.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard({ userName = "Usuário" }) {

  // ------------------ CALENDÁRIO DINÂMICO ------------------
  const [diasDoMes, setDiasDoMes] = useState([]);
  const [mesAtual, setMesAtual] = useState("");
  const [diaHoje, setDiaHoje] = useState(null);

  useEffect(() => {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.toLocaleString("pt-BR", { month: "long" });
    const ano = hoje.getFullYear();

    setDiaHoje(dia);
    setMesAtual(`${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`);

    const totalDias = new Date(ano, hoje.getMonth() + 1, 0).getDate();
    setDiasDoMes([...Array(totalDias)].map((_, i) => i + 1));
  }, []);

  // ------------------ KPI CARDS FILIAIS ------------------
  const kpis = [
    { label: "Filiais Ativas", value: 12, icon: "bi-building-fill" },
    { label: "Faturamento Geral", value: "R$ 4.500.000", icon: "bi-cash-stack" },
    { label: "Vendas no Mês", value: 32_450, icon: "bi-cart-check-fill" },
    { label: "Funcionários Totais", value: 280, icon: "bi-people-fill" },
    { label: "Meta do Mês", value: "R$ 5.000.000", icon: "bi-flag-fill" },
    { label: "Clientes Atendidos", value: 14_380, icon: "bi-people" },
  ];

  return (
    <div className="dashboardContainer">

      {/* --------- Boas-vindas --------- */}
      <div className="welcomeBox">
        <h2 className="welcomeTitle">
          Olá, <span>{userName}</span>
        </h2>
        <p className="welcomeSub">Painel geral das filiais</p>
      </div>

      {/* --------- KPI Cards --------- */}
      <div className="kpiGrid">
        {kpis.map(({ label, value, icon }) => (
          <div key={label} className="kpiCard">
            <div className="kpiHeader">
              <span className="kpiLabel">{label}</span>
              <i className={`bi ${icon} kpiIcon`}></i>
            </div>
            <span className="kpiValue">{value}</span>
          </div>
        ))}
      </div>

      {/* --------- Calendário --------- */}
      <div className="calendarWrapper">
        <div className="calendarCard">
          <h3 className="calendarTitle">Calendário</h3>

          <div className="calendarBox">
            <h4 className="calendarMonth">{mesAtual}</h4>

            <div className="calendarGrid">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <span key={d} className="calHead">
                  {d}
                </span>
              ))}

              {diasDoMes.map((dia) => (
                <div
                  key={dia}
                  className={`calDay ${dia === diaHoje ? "activeDay" : ""}`}
                >
                  {dia}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
