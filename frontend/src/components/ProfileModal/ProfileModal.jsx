'use client';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-left">
            <i
              className="bi bi-person-fill"
              style={{ color: '#82a198', fontSize: '1.5rem' }}
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
            <label>Telefone:</label>
            <input type="text" value={user.telefone} readOnly />
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
            <input
              type="text"
              value={Number(user.salario).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Cargo:</label>
            <input type="text" value={user.cargo} readOnly />
          </div>
        </div>

        <div className="form-group">
          <label>Molli vinculada:</label>
          <input
            type="text"
            value={
              user.id_funcao === 1 ? `${user.endereco} (Matriz)` : user.endereco
            }
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
