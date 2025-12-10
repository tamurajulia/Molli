"use client";

import React, { useEffect, useState } from "react";
import KpiCards from "@/components/Kpi/kpicards";
import Charts from "@/components/Grafico/charts";
import { getCookie } from "cookies-next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./dashboard.css";

export default function DashboardPageRedesign() {
  const [dados, setDados] = useState({
    faturamento: 0,
    total_vendas: 0,
    crescimento: 0,
    funcionarios_ativos: 0,
    meta_mensal: 0,
    lucro_liquido: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const token = getCookie("token");
      try {
        const response = await fetch("http://localhost:3001/dashboard/resumo", {
          headers: { Authorization: token },
        });

        if (response.ok) {
          const data = await response.json();
          setDados(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const kpis = [
    {
      label: "Faturamento Loja",
      value: Number(dados.faturamento).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      icon: "bi-cash-stack",
    },
    { label: "Total Vendas", value: dados.total_vendas, icon: "bi-cart3" },
    {
      label: "Crescimento Mês",
      value: `${dados.crescimento}%`,
      icon: "bi-arrow-up-right",
    },
    {
      label: "Funcionários Ativos",
      value: dados.funcionarios_ativos,
      icon: "bi-people",
    },
    {
      label: "Meta Mensal",
      value: Number(dados.meta_mensal).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      icon: "bi-bullseye",
    },
    {
      label: "Lucro Líquido",
      value: Number(dados.lucro_liquido).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      icon: "bi-wallet2",
    },
  ];

  const handleDownloadPDF = async () => {
    setPdfLoading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Título
      doc.setFontSize(22);
      doc.text("Dashboard da Filial", 40, 50);

      // Subtítulo
      doc.setFontSize(12);
      doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 40, 70);

      // Tabela
      autoTable(doc, {
        startY: 100,
        head: [["Indicador", "Valor"]],
        body: [
          [
            "Faturamento Loja",
            Number(dados.faturamento).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          ],
          ["Total Vendas", dados.total_vendas],
          ["Crescimento Mês", `${dados.crescimento}%`],
          ["Funcionários Ativos", dados.funcionarios_ativos],
          [
            "Meta Mensal",
            Number(dados.meta_mensal).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          ],
          [
            "Lucro Líquido",
            Number(dados.lucro_liquido).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          ],
        ],
        theme: "striped",
        styles: {
          fontSize: 12,
        },
        headStyles: {
          fillColor: [80, 90, 90],
          textColor: "#fff",
          fontStyle: "bold",
        },
      });

      doc.save("dashboard_filial.pdf");
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Erro ao gerar PDF. Tente novamente.");
    }

    setPdfLoading(false);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Faturamento",
      "Total Vendas",
      "Crescimento",
      "Funcionários Ativos",
      "Meta Mensal",
      "Lucro Líquido",
    ];

    const rows = [
      [
        dados.faturamento,
        dados.total_vendas,
        dados.crescimento,
        dados.funcionarios_ativos,
        dados.meta_mensal,
        dados.lucro_liquido,
      ],
    ];

    // Converte os dados para CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n"; // Adiciona os cabeçalhos
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"; // Adiciona as linhas
    });

    // Cria o link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_filial.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="dashboard-root min-h-screen p-6 bg-gradient-to-b from-[#f6fbf9] via-[#fefdfc] to-[#f7faf9] font-[Montserrat]">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-lg border border-gray-100">
              <i className="bi bi-bar-chart-fill text-2xl text-[#2f6a5f]"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#163f36]">
                Dashboard da Filial
              </h1>
              <p className="text-sm text-gray-500">
                Relatório gerencial — dados atualizados em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={loading || pdfLoading}
              className="inline-flex items-center gap-2 bg-[#2f6a5f] hover:bg-[#25594f] text-white font-medium py-2 px-4 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i
                className={`bi ${
                  pdfLoading ? "bi-hourglass-split" : "bi-download"
                }`}
              ></i>
              <span>{pdfLoading ? "Gerando PDF..." : "Exportar PDF"}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#2f6a5f] hover:bg-[#25594f] text-white font-medium py-2 px-4 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i
                className={`bi ${
                  loading ? "bi-hourglass-split" : "bi-download"
                }`}
              ></i>
              <span>Exportar CSV</span>
            </button>
          </div>
        </header>

        {/* Main Panel (inside PDF area) */}
        <main
          id="dashboard-pdf"
          className="bg-white rounded-2xl p-6 shadow-xl ring-1 ring-gray-50"
        >
          {/* Top row: KPIs + small widgets */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#163f36]">
                    Resumo da Filial
                  </h2>
                  <p className="text-sm text-gray-500">
                    Visão rápida das métricas mais importantes
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <div>
                      Período:{" "}
                      <strong>
                        {selectedDate
                          ? new Date(selectedDate).toLocaleDateString()
                          : "Últimos 30 dias"}
                      </strong>
                    </div>
                    <div className="text-xs text-gray-400">
                      Dados em tempo real
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <KpiCards kpis={kpis} />
              </div>
            </div>

            {/* Small highlights / progress */}
            <aside className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#f8faf8] to-white rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm text-gray-500">Meta vs Realizado</h3>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Meta Mensal</div>
                    <div className="text-lg font-semibold text-[#2f6a5f]">
                      {Number(dados.meta_mensal).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 text-right">
                      Realizado
                    </div>
                    <div className="text-lg font-semibold text-[#7ea79d]">
                      {Number(dados.faturamento).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        dados.meta_mensal
                          ? (dados.faturamento / dados.meta_mensal) * 100
                          : 0
                      )}%`,
                    }}
                    className="h-2 bg-[#7ea79d] transition-all"
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm text-gray-500">Lucro Médio</h3>
                <div className="mt-3">
                  <div className="text-lg font-semibold text-[#163f36]">
                    {Number(dados.lucro_liquido).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Lucro líquido acumulado
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* Controls: calendário funcional e filtros */}
          <section className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="text-sm px-3 py-2 rounded-md border bg-white">
                Período: Últimos 7 dias
              </button>
              <button className="text-sm px-3 py-2 rounded-md border bg-white">
                Últimos 30 dias
              </button>
            </div>
          </section>

          {/* Charts Grid */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transform hover:-translate-y-1 transition-all">
              <h4 className="text-sm font-semibold text-[#163f36] mb-4">
                Vendas da Semana
              </h4>
              <div className="h-64">
                <Charts chart="vendasDia" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transform hover:-translate-y-1 transition-all">
              <h4 className="text-sm font-semibold text-[#163f36] mb-4">
                Fluxo de Caixa
              </h4>
              <div className="h-64">
                <Charts chart="fluxoCaixa" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transform hover:-translate-y-1 transition-all">
              <h4 className="text-sm font-semibold text-[#163f36] mb-4">
                Desempenho dos Funcionários
              </h4>
              <div className="h-64">
                <Charts chart="desempenhoFunc" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transform hover:-translate-y-1 transition-all">
              <h4 className="text-sm font-semibold text-[#163f36] mb-4">
                Métodos de Pagamento
              </h4>
              <div className="h-64">
                <Charts chart="vendasCategoria" />
              </div>
            </div>
          </section>

          <footer className="mt-8 border-t border-gray-100 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Sistema Molli — Relatório Gerencial
            </div>
          </footer>
        </main>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-[rgba(255,255,255,0.6)] flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
              <div className="animate-spin">
                <i className="bi bi-arrow-repeat text-2xl text-gray-500"></i>
              </div>
              <div className="text-sm text-gray-600">
                Carregando dados do dashboard...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
