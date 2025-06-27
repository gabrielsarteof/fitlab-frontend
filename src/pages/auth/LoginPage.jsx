// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await api.post('/login', { email, senha });
      const { token } = resp.data.data;              
      localStorage.setItem('token', token);          
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard', { replace: true });     
    } catch (err) {
      const msg =
        err.response?.data?.err ||
        err.response?.data?.message ||
        err.message;
      toast.error(`Falha no login: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      <div className="row g-0 w-100">
        {/* Lado do form */}
        <div className="col-12 col-lg-6 d-flex h-100">
          <div className="w-100 d-flex flex-column justify-content-center">
            <div className="w-50 d-flex flex-column bg-white justify-content-center mx-auto py-5">
              <img
                className="me-auto mb-2"
                src={`${import.meta.env.BASE_URL}fitlab-logo-primary.svg`}
                alt="Logo"
                height={25}
              />
              <h1 className="text-dark mb-3">
                Olá,<br />
                seja bem-vindo!
              </h1>
              <p className="mb-4">Entre com suas credenciais</p>

              <form className="w-100" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email" className="text-primary">
                    E-mail
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                  />
                  <label htmlFor="password" className="text-primary">
                    Senha
                  </label>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Link to="/forgot-password">Esqueci a senha</Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 mb-4"
                  disabled={loading}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lado da arte - oculto em tablets e dispositivos menores */}
        <div className="col-lg-6 d-none d-lg-flex h-100 overflow-auto">
          <div className="w-100 d-flex flex-column justify-content-center align-items-center bg-primary text-white h-100">
            <img
              className="h-75"
              src={`${import.meta.env.BASE_URL}fitlab-logo-alt-tertiary.svg`}
              alt="Logo"
            />
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
);
}