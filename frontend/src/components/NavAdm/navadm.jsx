'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './navadm.css';
import ProfileModal from '../ProfileModal/ProfileModal';
import { getCookie } from 'cookies-next';
import { logout } from '@/components/functions/logout';

export default function NavAdm() {
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [dadosFuncionario, setDadosFuncionario] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/IMG/navbar/LogoNav.png');

  const pathname = usePathname(); // <= PEGAR A ROTA ATUAL

  useEffect(() => {
    setHydrated(true);

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    const token = getCookie('token');
    if (!token) return;

    fetch('http://localhost:3001/funcionario/id', {
      headers: { Authorization: `${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setDadosFuncionario(data);
      })
      .catch(err => {
        setDadosFuncionario(err);
      });

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (hydrated) {
      setLogoSrc('/IMG/navbar/LogoNav.png');
    }
  }, [hydrated]);

  if (!hydrated) return null;

  // Função genérica para verificar se o link está ativo
  const isActive = (href) => pathname.startsWith(href);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="top-section">
          <img src={logoSrc} alt="Logo Admin" className="logo" />
        </div>

        <nav className="menu">
          <Link
            href="/admin/dashboard"
            className={`menu-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            <i className="bi bi-speedometer2"></i>
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/admin/financeiro"
            className={`menu-item ${isActive('/admin/financeiro') ? 'active' : ''}`}
          >
            <i className="bi bi-graph-up-arrow"></i>
            {isOpen && <span>Financeiro</span>}
          </Link>

          <Link
            href="/admin/funcionarios"
            className={`menu-item ${isActive('/admin/funcionarios') ? 'active' : ''}`}
          >
            <i className="bi bi-people-fill"></i>
            {isOpen && <span>Funcionários</span>}
          </Link>

          <Link
            href="/admin/estoque"
            className={`menu-item ${isActive('/admin/estoque') ? 'active' : ''}`}
          >
            <i className="bi bi-box-seam"></i>
            {isOpen && <span>Estoque</span>}
          </Link>

          <Link
            href="/admin/pedidos"
            className={`menu-item ${isActive('/admin/pedidos') ? 'active' : ''}`}
          >
            <i className="bi bi-receipt"></i>
            {isOpen && <span>Pedidos</span>}
          </Link>
        </nav>

        <div className="bottom-section">
          <div className={`user-box ${isOpen ? '' : 'collapsed'}`}>
            <div className="avatar" onClick={() => setIsProfileOpen(true)}>
              <i className="bi bi-person-circle"></i>
            </div>

            {isOpen && (
              <div className="user-info" onClick={() => setIsProfileOpen(true)}>
                <p className="user-name">{dadosFuncionario.nome}</p>
                <p className="user-role">{dadosFuncionario.cargo}</p>
              </div>
            )}

            {isOpen && (
              <i
                className="bi bi-box-arrow-right logout-icon"
                onClick={logout}
                title="Sair"
              ></i>
            )}
          </div>
        </div>
      </aside>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={dadosFuncionario}
      />
    </>
  );
}
