'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../Footer/footer';
import NavClient from '../NavClient/navClient';
import './403.css';
import { getCookie } from 'cookies-next';
import Loading from '@/app/loading';

export default function Forbidden({ allow, children }) {
  const router = useRouter();
  const [permitido, setPermitido] = useState(0);
  const [nome, setNome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPermitido(getCookie('id_funcao'));
    setNome(getCookie('nome'));

    setLoading(false);
  }, [allow]);

  const goProfile = () => {
    router.push('/');
  };

  if (loading) return <Loading />;

  if (permitido === undefined) return window.location.replace('/');

  if (allow != permitido) {
    return (
      <>
        <div className="forbidden-container">
          <main className="forbidden-content">
            <div className="illustration-403">
              <span className="num">4</span>
              <div className="door">
                <div className="door-arch"></div>
                <div className="door-tape tape1"></div>
                <div className="door-tape tape2"></div>
                <div className="door-tape tape3"></div>
                <div className="handle"></div>
              </div>
              <span className="num">3</span>
            </div>
            <p className="text">
              Desculpe {nome}, mas você não tem acesso a esta página ou recurso
              por algum motivo
            </p>
            <button onClick={goProfile}>Ir para o login Molli</button>
          </main>
        </div>
      </>
    );
  } else {
    return <>{children}</>;
  }
}
