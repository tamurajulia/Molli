'use client';
import { useState, useEffect } from 'react';
import NavAdm from '@/components/NavAdm/navadm';
import Protecao from '@/components/403/page';
import './admin.css';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Protecao allow={2}>
      <div className="admin-container">
        <NavAdm isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main
          className={`admin-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}
        >
          {children}
        </main>
      </div>
    </Protecao>
  );
}
