"use client";
import "./ProfileModalMatriz.css";
 
export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-left">
            <i
              className="bi bi-person-fill"
              style={{ color: "#82a198", fontSize: "1.5rem" }}
            ></i>
            <h2>Perfil</h2>
          </div>
          <button className="close-icon" onClick={onClose} aria-label="Fechar">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
 
        <div className="row">
          <div className="form-group">
            <label>Nome:</label>
            <input type="text" value={user.nome} readOnly />
          </div>
 
          <div className="form-group">
            <label>Senha:</label>
            <input type="password" value={user.senha} readOnly />
          </div>
        </div>
 
        <div className="row">
          <div className="form-group">
            <label>Email:</label>
            <input type="text" value={user.email} readOnly />
          </div>
 
          <div className="form-group">
            <label>CPF:</label>
            <input type="text" value={user.cpf} readOnly />
          </div>
        </div>
 
        <div className="row">
          <div className="form-group">
            <label>Salário:</label>
            <input type="text" value={user.salario} readOnly />
          </div>
 
          <div className="form-group">
            <label>Cargo:</label>
            <input type="text" value={user.cargo} readOnly />
          </div>
        </div>
 
      
      </div>
    </div>
  );
}