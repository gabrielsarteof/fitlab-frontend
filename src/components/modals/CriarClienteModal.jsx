import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';

export default function CriarClienteModal({ show, onClose, onSaved, clienteId }) {
  const [dados, setDados] = useState({ nome: '', email: '', telefone: '', data_nascimento: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Carrega dados para edição
  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');

    if (clienteId) {
      setLoading(true);
      api.get(`/clientes/${clienteId}`)
        .then(({ data }) => {
          setDados({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            data_nascimento: data.data_nascimento.split('T')[0]
          });
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Erro ao buscar cliente');
          onClose();
        })
        .finally(() => setLoading(false));
    } else {
      setDados({ nome: '', email: '', telefone: '', data_nascimento: '' });
    }
  }, [show, clienteId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!dados.nome.trim()) errs.nome = 'Nome do Cliente deve ser preenchido!';
    else if (dados.nome.length < 2 || dados.nome.length > 50)
      errs.nome = 'Nome do Cliente deve ter entre 2 e 50 caracteres!';

    if (!dados.email) errs.email = 'E-mail do Cliente deve ser preenchido!';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(dados.email))
      errs.email = 'E-mail do Cliente deve ser válido!';

    if (!dados.telefone) errs.telefone = 'Telefone do Cliente deve ser preenchido!';
    else if (dados.telefone.length < 10 || dados.telefone.length > 15)
      errs.telefone = 'Telefone do Cliente deve ter entre 10 e 15 caracteres!';

    if (!dados.data_nascimento) errs.data_nascimento = 'Data de Nascimento deve ser preenchida!';
    else {
      const birth = new Date(dados.data_nascimento);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 16);
      if (isNaN(birth.getTime()))
        errs.data_nascimento = 'Data de Nascimento deve ser uma data válida!';
      else if (birth > minAge)
        errs.data_nascimento = 'O cliente deve ter pelo menos 16 anos.';
    }
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
      if (clienteId) {
        // Atualiza cliente existente
        await api.put(`/clientes/${clienteId}`, dados);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Cria novo cliente
        await api.post('/clientes', dados);
        toast.success('Cliente criado com sucesso!');
      }
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      const data = err.response?.data || {};
      if (data.errors && typeof data.errors === 'object') {
        setErrors(data.errors);
      } else {
        const msg = data.message || data.err || data.error || 'Erro ao salvar cliente';
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <>
      <style>{`
        .modal-dialog { width: 100%; max-width: 90vw; margin: 1.5rem auto; }
        @media (min-width: 576px) { .modal-dialog { max-width: 450px; } }
        .modal-content { border-radius: 1rem; }
        .modal-body { max-height: 70vh; overflow-y: auto; }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">
                {clienteId ? 'Editar Cliente' : 'Criar Cliente'}
              </h4>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              {serverError && <div className="alert alert-danger mb-3">{serverError}</div>}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {['nome', 'email', 'telefone', 'data_nascimento'].map(field => (
                    <div className="mb-3" key={field}>
                      <div className="form-floating">
                        <input
                          id={field}
                          name={field}
                          type={field === 'email' ? 'email' : field === 'data_nascimento' ? 'date' : 'text'}
                          className={`form-control${errors[field] ? ' is-invalid' : ''}`}
                          placeholder={field}
                          value={dados[field]}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        <label htmlFor={field} className="text-primary">
                          {field
                            .split('_')
                            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </label>
                        {errors[field] && (
                          <div className="invalid-feedback text-danger">
                            {errors[field]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                      {clienteId ? 'Atualizar' : 'Salvar'}
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
