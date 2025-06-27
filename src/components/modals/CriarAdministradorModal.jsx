import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';

export default function CriarAdministradorModal({ show, onClose, onSaved, administradorId }) {
  const [dados, setDados] = useState({ nome: '', email: '', telefone: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');

    if (administradorId) {
      setLoading(true);
      api.get(`/administradores/${administradorId}`)
        .then(({ data }) => {
          setDados({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            senha: ''
          });
        })
        .catch(err => {
          const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
          setServerError(msg);
          toast.error(msg);
          onClose();
        })
        .finally(() => setLoading(false));
    } else {
      setDados({ nome: '', email: '', telefone: '', senha: '' });
    }
  }, [show, administradorId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (!dados.nome.trim()) errs.nome = 'Nome do Administrador deve ser preenchido!';
    if (!dados.email.trim()) errs.email = 'E-mail deve ser preenchido!';
    if (!dados.telefone.trim()) errs.telefone = 'Telefone deve ser preenchido!';
    if (!administradorId && !dados.senha.trim()) errs.senha = 'Senha deve ser preenchida!';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const frontErrs = validate();
    if (Object.keys(frontErrs).length) {
      setErrors(frontErrs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const method = administradorId ? 'put' : 'post';
      const url = administradorId ? `/administradores/${administradorId}` : '/administradores';
      const payload = { ...dados };

      // Ao editar, não envie senha vazia
      if (administradorId && !payload.senha) {
        delete payload.senha;
      }

      await api[method](url, payload);
      toast.success(administradorId ? 'Administrador atualizado com sucesso!' : 'Administrador criado com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar administrador:', err);
      let msg = 'Erro ao salvar administrador';
      if (err.response) {
        const resp = err.response.data;
        if (resp && typeof resp === 'object') {
          msg = resp.message || resp.error || JSON.stringify(resp);
          if (resp.errors && typeof resp.errors === 'object') {
            setErrors(resp.errors);
          }
        } else if (typeof resp === 'string') {
          msg = resp;
        }
      } else {
        msg = err.message;
      }
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;
  return (
    <>
      <style>{`
        .modal-dialog { width:100%; max-width:90vw; margin:1.5rem auto; }
        @media (min-width:576px){ .modal-dialog{ max-width:450px;} }
        .modal-content{ border-radius:1rem; }
        .modal-body{ max-height:70vh; overflow-y:auto; }
        .custom-alert{ background:transparent!important; color:var(--bs-danger)!important; margin-bottom:1rem; }
      `}</style>
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">
                {administradorId ? 'Editar Administrador' : 'Criar Administrador'}
              </h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status"/></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {['nome','email','telefone','senha'].map(field => (
                    <div className="mb-3 form-floating" key={field}>
                      <input
                        id={field}
                        name={field}
                        type={field==='senha'?'password': field==='email'?'email':'text'}
                        className={`form-control${errors[field]?' is-invalid':''}`}
                        placeholder={field}
                        value={dados[field]}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor={field} className="text-primary">
                        {field === 'senha'
                          ? `Senha${administradorId ? ' (deixe vazio para manter)' : ''}`
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {errors[field] && <div className="invalid-feedback text-danger">{errors[field]}</div>}
                    </div>
                  ))}
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                      Salvar
                    </button>
                    <button type="button" className="btn btn-outline-secondary flex-fill" onClick={onClose} disabled={loading}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
