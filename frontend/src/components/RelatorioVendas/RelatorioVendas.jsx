"use client";
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Relatorio.css";

export default function RelatorioVendas() {
  const [busca, setBusca] = useState("");

  const vendas = [
    { dia: "Segunda", diaria: 1200, semanal: 8400, mensal: 36000 },
    { dia: "Terça", diaria: 1500, semanal: 9900, mensal: 36000 },
    { dia: "Quarta", diaria: 900, semanal: 6300, mensal: 36000 },
  ];

  const produtosMaisVendidos = [
    { produto: "Camisa Polo", quantidade: 120, receita: 4500, estoque: 30, categoria: "Roupas" },
    { produto: "Tênis Esportivo", quantidade: 80, receita: 7200, estoque: 15, categoria: "Calçados" },
    { produto: "Mochila Escolar", quantidade: 50, receita: 2500, estoque: 20, categoria: "Acessórios" },
  ];

  const filiais = [
    { filial: "Loja Matriz", totalVendas: 25000, pedidos: 200, funcionarios: 10, status: "Normal" },
    { filial: "Loja 1", totalVendas: 18000, pedidos: 150, funcionarios: 8, status: "Abaixo da meta" },
    { filial: "Loja 2", totalVendas: 30000, pedidos: 220, funcionarios: 12, status: "Excelente" },
  ];

  const estoque = [
    { produto: "Camisa Polo", categoria: "Roupas", estoqueAtual: 30, estoqueMinimo: 20, status: "Ok" },
    { produto: "Tênis Esportivo", categoria: "Calçados", estoqueAtual: 15, estoqueMinimo: 25, status: "Precisa Repor" },
    { produto: "Mochila Escolar", categoria: "Acessórios", estoqueAtual: 0, estoqueMinimo: 10, status: "Esgotado" },
  ];

  return (
    <div className="container">

      <div className="cabecalho-relatorio">
        <div className="titulo">
          <i className="bi bi-file-earmark-bar-graph iconeTitulo"></i>
          <span className="titulo-preto">Relatório de Vendas</span>
        </div>

        <button className="btn-exportar">
          <i className="bi bi-download"></i>
          Baixar PDF
        </button>
      </div>

      {/* Seção de tabelas */}
      <div className="tabelaContainer">
        <h3 className="subtitulo">Vendas por Período</h3>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Diária</th>
                <th>Semanal</th>
                <th>Mensal</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v) => (
                <tr key={v.dia}>
                  <td data-label="Dia">{v.dia}</td>
                  <td data-label="Diária">R$ {v.diaria.toLocaleString("pt-BR")}</td>
                  <td data-label="Semanal">R$ {v.semanal.toLocaleString("pt-BR")}</td>
                  <td data-label="Mensal">R$ {v.mensal.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Produtos Mais Vendidos</h3>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade Vendida</th>
                <th>Receita Gerada</th>
                <th>Estoque Atual</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {produtosMaisVendidos.map((item) => (
                <tr key={item.produto}>
                  <td data-label="Produto">{item.produto}</td>
                  <td data-label="Quantidade">{item.quantidade}</td>
                  <td data-label="Receita">R$ {item.receita.toLocaleString("pt-BR")}</td>
                  <td data-label="Estoque">{item.estoque}</td>
                  <td data-label="Categoria">{item.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Filiais - Performance</h3>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Filial</th>
                <th>Total de Vendas</th>
                <th>Número de Pedidos</th>
                <th>Funcionários</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filiais.map((f) => (
                <tr key={f.filial}>
                  <td data-label="Filial">{f.filial}</td>
                  <td data-label="Total de Vendas">R$ {f.totalVendas.toLocaleString("pt-BR")}</td>
                  <td data-label="Pedidos">{f.pedidos}</td>
                  <td data-label="Funcionários">{f.funcionarios}</td>
                  <td data-label="Status" className={`status-${f.status}`}>
                    {f.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tabelaContainer">
        <h3 className="subtitulo">Estoque Atual</h3>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map((item) => (
                <tr key={item.produto}>
                  <td data-label="Produto">{item.produto}</td>
                  <td data-label="Categoria">{item.categoria}</td>
                  <td data-label="Estoque">{item.estoqueAtual}</td>
                  <td data-label="Mínimo">{item.estoqueMinimo}</td>
                  <td data-label="Status" className={`status-${item.status}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
