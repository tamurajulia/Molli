'use client';

import React, { useEffect, useState } from 'react';
import { Printer, Download } from 'lucide-react';
import { getCookie } from 'cookies-next';
import Loading from '@/app/loading';
import './fechamento.css';
import { logout } from '@/components/functions/logout';

export default function FechamentoCaixa() {
  const [dados, setDados] = useState(null);

  async function pegarDados() {
    const token = getCookie('token');

    try {
      const response = await fetch(`http://localhost:3001/pdv/fechamento`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDados(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    pegarDados();
  }, []);

  if (!dados) return <Loading />;

  async function fecharCaixa() {
    const token = getCookie('token');
    try {
      const response = await fetch('http://localhost:3001/pdv', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          total_vendas: dados.totalVendas,
          qtd_vendas: dados.qtdVendas,
          ticket_medio: dados.ticketMedio,
        }),
      });
      if (response.ok) {
        alert('Fechado com sucesso');
        logout();
      }
    } catch (error) {
      console.error('Erro ao fechar pdv' + error);
    }
  }

  const opcoes = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  return (
    <div className="fechamento-container">
      <div className="titulo flex">
        <button
          onClick={() => {
            window.location.replace('/funcionario/caixa');
          }}
        >
          <i className="bi bi-arrow-left w-full text-xl"></i>
        </button>
        <div className="flex justify-center">
          <img
            src="/IMG/icones/caixa.png"
            alt="Ícone caixa"
            className="icone-caixa"
          />
          <h1>
            Fechamento <span>do caixa</span>
          </h1>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="esquerda">
            Resumo do dia{' '}
            {dados.data
              ? new Date(dados.data).toLocaleDateString('pt-br', opcoes)
              : ''}
          </span>
        </div>

        <div className="card-body">
          <div className="linha">
            <div className="col">
              <p>Total de vendas</p>
              <h2>
                {dados.totalVendas?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h2>
            </div>
            <div className="col">
              <p>Qtd de vendas</p>
              <h2>{dados.qtdVendas}</h2>
            </div>
            <div className="col">
              <p>Tiket médio</p>
              <h2>
                {dados.ticketMedio?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="esquerda">Forma de pagamento</span>
        </div>

        <div className="card-body">
          <div className="linha cabecalho-forma">
            <div className="col">
              <p>Forma</p>
            </div>
            <div className="col">
              <p>Valor total</p>
            </div>
            <div className="col">
              <p>Qnt transação</p>
            </div>
          </div>

          <div className="linha">
            <div className="col">
              <p>Cartão de crédito</p>
            </div>
            <div className="col">
              <h2>
                {dados.credito?.totalVendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h2>
            </div>
            <div className="col">
              <h2>{dados.credito?.qtdVendas}</h2>
            </div>
          </div>

          <div className="linha">
            <div className="col">
              <p>Cartão de débito</p>
            </div>
            <div className="col">
              <h2>
                {dados.debito?.totalVendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h2>
            </div>
            <div className="col">
              <h2>{dados.debito?.qtdVendas}</h2>
            </div>
          </div>

          <div className="linha">
            <div className="col">
              <p>Pix</p>
            </div>
            <div className="col">
              <h2>
                {dados.pix?.totalVendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h2>
            </div>
            <div className="col">
              <h2>{dados.pix?.qtdVendas}</h2>
            </div>
          </div>

          <div className="linha total-geral">
            <div className="col">
              <p>
                <strong>Total geral</strong>
              </p>
            </div>
            <div className="col">
              <h2>
                <strong>
                  {dados.totalVendas?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </h2>
            </div>
            <div className="col">
              <h2>
                <strong>{dados.qtdVendas}</strong>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="botoes">

        <button
          className="btn-finalizar w-full"
          onClick={() => {
            fecharCaixa();
          }}
        >
          Finalizar caixa
        </button>
      </div>
    </div>
  );
}
