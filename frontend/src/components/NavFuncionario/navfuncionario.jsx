"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import "./navfuncionario.css";

export default function NavMatriz() {
  const [isOpen, setIsOpen] = useState(undefined);
  const router = useRouter(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isOpen === undefined) return null;

  const user = {
    nome: "Isabelli Monte",
    cargo: "Caixa da Molli",
  };

  const handleLogout = () => {
    router.push("/"); 
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="top-section">
        <img src="/IMG/navbar/LogoFuncionario.png" alt="Logo Molli" className="logo" />
      </div>

      <nav className="menu">
        <Link href="/funcionario/Atendente/estoque/" className="menu-item">
          <i className="bi-person-workspace"></i>
          {isOpen && <span>Atendente</span>}
        </Link>
        <Link href="/funcionario/repositor/estoque" className="menu-item">
          <i className="bi bi-box-seam"></i>
          {isOpen && <span>Estoque</span>}
        </Link>
        <Link href="/funcionario/caixa/pdv/teladevenda" className="menu-item">
          <i className="bi bi-shop"></i>
          {isOpen && <span>PDV</span>}
        </Link>
      </nav>

      <div className="bottom-section">
        <div className={`user-box ${isOpen ? "" : "collapsed"}`}>
            <div className="avatar">
            <i className="bi bi-person-circle"></i>
            </div>
            {isOpen && (
            <div className="user-info">
                <p className="user-name">{user.nome}</p>
                <p className="user-role">{user.cargo}</p>
            </div>
            )}
        </div>
        </div>
    </aside>
  );
}