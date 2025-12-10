'use client';
import './page.css';
import { useState, useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { FaUser } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin() {
    try {
      setErro('');
      const dataEnviar = {
        cpf: parseInt(cpf),
        senha,
      };
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        setCookie('token', data.token);
        setCookie('id_user', data.id_user);
        setCookie('id_funcao', data.id_funcao);
        setCookie('id_filial', data.id_filial);
        setCookie('nome', data.nome);

        if (data.id_funcao === 1) {
          return (window.location.href = '/matriz/financeiro');
        } else if (data.id_funcao === 2) {
          return (window.location.href = '/admin/dashboard');
        } else if (data.id_funcao === 3) {
          return (window.location.href = '/funcionario/repositor');
        } else {
          try {
            const res = await fetch(`http://localhost:3001/pdv`, {
              method: 'POST',
              headers: {
                Authorization: data.token,
              },
            });
            if (res.ok) {
              return (window.location.href = '/funcionario/caixa');
            } else {
              console.log('Erro PDV');
            }
          } catch (error) {
            console.error('Erro interno ao abrir pdv:', error);
          }
        }
      } else {
        setErro(data.mensagem);
        console.log('Erro no login:', response.statusText);
      }
    } catch (error) {
      console.error('Erro interno no login:', error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="IMG/login/imgLogin.png"
          alt="Loja infantil"
          className="background-image"
        />
      </div>
      <div className="login-right">
        <div className="login-box">
          <div className="logo">
            <span className="molli-text">
              <img
                src="IMG/login/logoLogin.png"
                alt="Logo Molli"
                className="background-image"
              />
            </span>
          </div>

          <label className="label">CPF:</label>
          <div className="input-group">
            <input
              type="number"
              placeholder="Insira seu cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value) && setErro('')}
            />
            <FaUser className="icon" />
          </div>

          <label className="label">Senha:</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Insira sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value) && setErro('')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
            {showPassword ? (
              <FaEye
                className="icon clickable"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEyeSlash
                className="icon clickable"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {erro && (
            <p className="error-message -mt-5 text-[14px] text-red-600">
              {erro}
            </p>
          )}
          <div className="link-container-center">
            <a href="/cliente/home" className="link-sem-acesso">
              Entrar sem acesso
            </a>
          </div>
          <button
            className="btn-entrar"
            onClick={() => {
              handleLogin();
            }}
          >
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
}
