"use client";
import React, { useMemo, useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, FileText, HelpCircle, Landmark } from "lucide-react";
import { getCookie } from "cookies-next";

export default function DashboardFluxoCaixaMatriz() {
  const [selectedBranch, setSelectedBranch] = useState("Todas");
  const [period, setPeriod] = useState("mensal");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [realBranches, setRealBranches] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [resumo, setResumo] = useState({ total: 0, transacoes: 0 });

  const colors = ["bg-emerald-500", "bg-cyan-500", "bg-rose-500", "bg-indigo-500", "bg-amber-500"];

  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      try {
        const [resFiliais, resEntradas] = await Promise.all([
          fetch("http://localhost:3001/filial", { headers: { Authorization: token } }),
          fetch("http://localhost:3001/financeiro/entradas", { headers: { Authorization: token } })
        ]);

        if (resFiliais.ok && resEntradas.ok) {
          const filiaisData = await resFiliais.json();
          const entradasData = await resEntradas.json();

          const mappedBranches = filiaisData.map((f, index) => ({
            id: String(f.id), 
            label: f.id === 1 ? "Matriz" : f.endereco.split("-")[0].trim(),
            color: colors[index % colors.length]
          }));
          setRealBranches(mappedBranches);

          const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
          const hoje = new Date();
          const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(hoje.getDate() - (6 - i));
            return d;
          });

          const dadosGrafico = ultimos7Dias.map(dataRef => {
            const diaStr = dataRef.toISOString().split('T')[0];
            const diaSemana = diasSemana[dataRef.getDay()];
            
            const obj = { day: diaSemana, fullDate: diaStr };
            
            mappedBranches.forEach(branch => {
              const totalDia = entradasData
                .filter(e => {
                  const dataEntrada = e.data.split('T')[0]; 
                  return dataEntrada === diaStr && String(e.id_filial) === branch.id;
                })
                .reduce((acc, curr) => acc + Number(curr.valor), 0);
              
              obj[branch.id] = totalDia;
            });

            return obj;
          });

          setChartData(dadosGrafico);

          const totalGeral = entradasData.reduce((acc, curr) => acc + Number(curr.valor), 0);
          setResumo({
            total: totalGeral,
            transacoes: entradasData.length
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totals = useMemo(() => {
    if (!realBranches.length) return {};
    return realBranches.reduce((acc, b) => {
      const sum = chartData.reduce((s, row) => s + (row[b.id] || 0), 0);
      acc[b.id] = sum;
      return acc;
    }, {});
  }, [realBranches, chartData]);

  return (
    <div className="p-6 min-h-screentext-slate-800">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-white p-3 shadow-sm">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="titulo d-flex align-items-center gap-2 ">
              <span className="titulo-preto">Entradas de Todas as</span>
              <span className="titulo-preto1">Lojas:</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-md border px-3 py-2 bg-white shadow-sm"
          >
            <option value="Todas">Todas (Consolidado)</option>
            {realBranches.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-white px-3 py-2 shadow-sm flex items-center gap-2"
            title="Ajuda"
          >
            <HelpCircle size={16} />
            <span className="text-sm">Ajuda</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card title="Total Consolidado" value={loading ? "..." : `R$ ${formatNumber(resumo.total)}`} icon={<Landmark size={20} />} foot="Total Geral Acumulado" />
        <Card title="Transações" value={loading ? "..." : resumo.transacoes} icon={<ShoppingCart size={20} />} foot="Total de Vendas" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Gráfico de Vendas (Últimos 7 dias)</h3>
              <div className="text-sm text-slate-500">Período: {period}</div>
            </div>
            <div className="flex gap-6 items-start flex-col md:flex-row">
              <div className="flex-1">
                {chartData.length > 0 && (
                    <LineSpark data={chartData} branch={selectedBranch} branches={realBranches} />
                )}
              </div>
              <div className="w-full md:w-56">
                <h4 className="text-sm font-medium mb-2">Filiais</h4>
                <div className="space-y-3">
                  {realBranches.map((b) => (
                    <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${b.color}`} />
                        <div>
                          <div className="text-sm font-medium">{b.label}</div>
                          <div className="text-xs text-slate-500">7 Dias: R$ {formatNumber(totals[b.id])}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{b.id === selectedBranch ? "Ativa" : ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Comparativo por Filial (Barra)</h3>
            {chartData.length > 0 && (
                <BarGrouped data={chartData} branches={realBranches} />
            )}
          </div>

        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Calendário</h3>
              <div className="text-sm text-slate-500">Dezembro 2025</div>
            </div>
            <SmallCalendar />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Resumo por Filial</h3>
            <div className="space-y-3">
              {realBranches.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${b.color}`} />
                    <div>
                      <div className="text-sm">{b.label}</div>
                      <div className="text-xs text-slate-500">ID: {b.id}</div>
                    </div>
                  </div>
                  <div className="font-semibold">R$ {formatNumber(totals[b.id])}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <FileText size={18} />
              <h3 className="text-lg font-semibold">Como gerar relatórios</h3>
            </div>
            <ol className="list-decimal list-inside text-sm space-y-2 text-slate-600">
              <li>Escolha o período e a filial (ou consolidado).</li>
              <li>Selecione o formato (PDF / Excel / CSV).</li>
              <li>Clique em <strong>Exportar</strong> para baixar.</li>
            </ol>
            <div className="mt-6 text-right">
              <button className="px-4 py-2 rounded-md bg-slate-100" onClick={() => setShowModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value, icon, foot }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded p-2 bg-slate-50">{icon}</div>
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
      <div className="text-sm text-slate-400">{foot}</div>
    </div>
  );
}

function ExportControls() {
  return (
    <div className="flex gap-2">
      <button className="px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-sm">PDF</button>
      <button className="px-3 py-1 rounded bg-slate-50 text-slate-700 text-sm">CSV</button>
    </div>
  );
}

function formatNumber(n) {
  if (!n && n !== 0) return "0,00";
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LineSpark({ data, branch, branches }) {
  const width = 680;
  const height = 160;

  let series = [];
  if (branch === "Todas") {
      series = branches.map((b) => ({ id: b.id, values: data.map((d) => d[b.id] || 0) }));
  } else {
      series = [{ id: branch, values: data.map((d) => d[branch] || 0) }];
  }

  const allValues = series.flatMap(s => s.values);
  const maxY = allValues.length > 0 ? Math.max(...allValues) || 100 : 100;
  const stepX = width / (data.length - 1 || 1);

  const makePath = (values) => {
    return values.map((v, i) => {
      const x = i * stepX;
      const y = height - (v / maxY) * (height - 20); // padding
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  };

  const colorMap = branches.reduce((acc, b) => ({...acc, [b.id]: b.color.replace('bg-', '')}), {});
  
  const getHexColor = (tailwindClass) => {
      const map = { 
          "emerald-500": "#10b981", 
          "cyan-500": "#06b6d4", 
          "rose-500": "#f43f5e", 
          "indigo-500": "#6366f1",
          "amber-500": "#f59e0b"
      };
      const key = tailwindClass.replace("bg-", "");
      return map[key] || "#000";
  }

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0,1,2,3,4].map((i) => (
          <line key={i} x1={0} x2={width} y1={(height/4)*i} y2={(height/4)*i} stroke="#eef2f7" strokeWidth={1} />
        ))}

        {series.map((s) => {
            const colorClass = branches.find(b => b.id === s.id)?.color || "bg-gray-500";
            const strokeColor = getHexColor(colorClass);
            return (
                <g key={s.id}>
                    <path d={makePath(s.values)} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {s.values.map((v, i) => (
                    <circle key={i} cx={i*stepX} cy={height - (v/maxY)*(height - 20)} r={3.5} fill={strokeColor} />
                    ))}
                </g>
            )
        })}
      </svg>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
        {data.map((d) => <div key={d.day}>{d.day}</div>)}
      </div>
    </div>
  );
}

function BarGrouped({ data, branches }) {
  const width = 680;
  const height = 140;
  const days = data.map(d => d.day);

  const maxY = Math.max(...data.flatMap((row) => branches.map((b) => row[b.id] || 0))) || 100;
  const groupWidth = width / (data.length || 1);
  const barWidth = Math.max(6, (groupWidth - 8) / branches.length);

  const getHexColor = (tailwindClass) => {
      const map = { 
          "emerald-500": "#10b981", 
          "cyan-500": "#06b6d4", 
          "rose-500": "#f43f5e", 
          "indigo-500": "#6366f1",
          "amber-500": "#f59e0b"
      };
      const key = tailwindClass.replace("bg-", "");
      return map[key] || "#000";
  }

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0,1,2,3].map((i) => (
          <line key={i} x1={0} x2={width} y1={(height/4)*i} y2={(height/4)*i} stroke="#f1f5f9" strokeWidth={1} />
        ))}

        {data.map((row, dayIdx) => (
          <g key={row.day}>
            {branches.map((b, j) => {
              const value = row[b.id] || 0;
              const x = dayIdx * groupWidth + 4 + j * barWidth;
              const h = (value / maxY) * (height - 10);
              const y = height - h;
              return (
                <rect key={b.id} x={x} y={y} width={barWidth - 2} height={h} rx={3} fill={getHexColor(b.color)} />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
        {days.map((d) => <div key={d}>{d}</div>)}
      </div>
    </div>
  );
}

function SmallCalendar() {
  const hoje = new Date();  
  const diaAtual = hoje.getDate(); 
  const mesAtual = hoje.getMonth(); 
  const anoAtual = hoje.getFullYear(); 

  const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1);
  const diaDaSemanaDoPrimeiroDia = primeiroDiaDoMes.getDay(); 

  const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0);
  const totalDiasDoMes = ultimoDiaDoMes.getDate();

  const semanas = [];
  let semana = new Array(7).fill(null);

  for (let i = 0; i < diaDaSemanaDoPrimeiroDia; i++) {
    semana[i] = null; 
  }

  for (let i = 1; i <= totalDiasDoMes; i++) {
    semana[diaDaSemanaDoPrimeiroDia + i - 1] = i;
    if ((diaDaSemanaDoPrimeiroDia + i) % 7 === 0 || i === totalDiasDoMes) {
      semanas.push(semana);
      semana = new Array(7).fill(null); 
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500 mb-3">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sab</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {semanas.flat().map((d, i) => (
          <div
            key={i}
            className={`min-h-[36px] rounded-md flex items-center justify-center ${d === diaAtual ? 'bg-emerald-100 font-semibold' : 'bg-transparent'} text-sm`}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  );
}
