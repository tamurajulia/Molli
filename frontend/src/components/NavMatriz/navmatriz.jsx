'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './navmatriz.css';
import ProfileModal from '../ProfileModal/ProfileModal';
import { getCookie } from 'cookies-next';
import { logout } from '@/components/functions/logout';
import { ScrollText } from 'lucide-react';

export default function NavMatriz() {
  const [isOpen, setIsOpen] = useState(undefined);
  const [dadosFuncionario, setDadosFuncionario] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/IMG/navbar/LogoMatriz.png');

  const pathname = usePathname(); // <= PEGANDO A ROTA ATUAL

  useEffect(() => {
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

  if (isOpen === undefined) return null;

  // FUNÇÃO PARA SABER SE O LINK ATUAL ESTÁ ATIVO
  const isActive = (href) => pathname.startsWith(href);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="top-section">
          <img src={logoSrc} alt="Logo Molli" className="logo" />
        </div>

        <nav className="menu">
          <Link
            href="/matriz/financeiro"
            className={`menu-item ${isActive('/matriz/financeiro') ? 'active' : ''}`}
          >
            <i className="bi bi-graph-up-arrow"></i>
            {isOpen && <span>Financeiro</span>}
          </Link>

          <Link
            href="/matriz/funcionarios"
            className={`menu-item ${isActive('/matriz/funcionarios') ? 'active' : ''}`}
          >
            <i className="bi bi-people-fill"></i>
            {isOpen && <span>Funcionários</span>}
          </Link>

          <Link
            href="/matriz/produtos"
            className={`menu-item ${isActive('/matriz/produtos') ? 'active' : ''}`}
          >
            <ScrollText />
            {isOpen && <span>Produtos</span>}
          </Link>

          <Link
            href="/matriz/estoque"
            className={`menu-item ${isActive('/matriz/estoque') ? 'active' : ''}`}
          >
            <i className="bi bi-box-seam"></i>
            {isOpen && <span>Estoque</span>}
          </Link>

          <Link
            href="/matriz/fornecedores"
            className={`menu-item ${isActive('/matriz/fornecedores') ? 'active' : ''}`}
          >
            <i className="bi bi-truck"></i>
            {isOpen && <span>Fornecedores</span>}
          </Link>

          <Link
            href="/matriz/filiais"
            className={`menu-item ${isActive('/matriz/filiais') ? 'active' : ''}`}
          >
            <i className="bi bi-geo-alt"></i>
            {isOpen && <span>Lojas</span>}
          </Link>

          <Link
            href="/matriz/pedidos"
            className={`menu-item ${isActive('/matriz/pedidos') ? 'active' : ''}`}
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
