import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';

export default function CriarPlanoModal({ show, onClose, onSaved, planoId }) {
  const [dados, setDados] = useState({ nome: '', frequencia: '', valor: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    if (planoId) {
      setLoading(true);
      api.get(`/planos/${planoId}`)
        .then(({ data }) => {
          setDados({
            nome: data.nome || '',
            frequencia: data.frequencia || '',
            valor: data.valor != null ? data.valor.toString() : ''
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
      setDados({ nome: '', frequencia: '', valor: '' });
    }
  }, [show, planoId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (!dados.nome.trim()) errs.nome = 'Nome do Plano deve ser preenchido!';
    else if (dados.nome.length < 2 || dados.nome.length > 50)
      errs.nome = 'Nome do Plano deve ter entre 2 e 50 caracteres!';

    if (!dados.frequencia.trim()) errs.frequencia = 'Frequência deve ser preenchida!';
    else if (dados.frequencia.length < 2 || dados.frequencia.length > 40)
      errs.frequencia = 'Frequência deve ter entre 2 e 40 caracteres!';

    if (!dados.valor) errs.valor = 'Valor deve ser preenchido!';
    else if (isNaN(Number(dados.valor)) || Number(dados.valor) < 0)
      errs.valor = 'Valor deve ser um número positivo!';

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
      const method = planoId ? 'put' : 'post';
      const url = planoId ? `/planos/${planoId}` : '/planos';
      const payload = {
        nome: dados.nome,
        frequencia: dados.frequencia,
        valor: Number(dados.valor)
      };

      await api[method](url, payload);
      toast.success(planoId ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
      let msg = 'Erro ao salvar plano';

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
        .modal-dialog { width: 100%; max-width: 90vw; margin: 1.5rem auto; }
        @media (min-width: 576px) { .modal-dialog { max-width: 400px; } }
        .modal-content { border-radius: 1rem; }
        .modal-body { max-height: 70vh; overflow-y: auto; }
        .custom-alert { background: transparent !important; color: var(--bs-danger) !important; margin-bottom: 1rem; }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">{planoId ? 'Editar Plano' : 'Criar Plano'}</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        className={`form-control${errors.nome ? ' is-invalid' : ''}`}
                        placeholder="Nome"
                        value={dados.nome}
                        onChange={handleChange}
                        disabled={loading}
                        autoFocus
                      />
                      <label htmlFor="nome" className="text-primary">Nome</label>
                      {errors.nome && <div className="invalid-feedback text-danger">{errors.nome}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        id="frequencia"
                        name="frequencia"
                        type="text"
                        className={`form-control${errors.frequencia ? ' is-invalid' : ''}`}
                        placeholder="Frequência"
                        value={dados.frequencia}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor="frequencia" className="text-primary">Frequência</label>
                      {errors.frequencia && <div className="invalid-feedback text-danger">{errors.frequencia}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        id="valor"
                        name="valor"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control${errors.valor ? ' is-invalid' : ''}`}
                        placeholder="Valor"
                        value={dados.valor}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor="valor" className="text-primary">Valor</label>
                      {errors.valor && <div className="invalid-feedback text-danger">{errors.valor}</div>}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar'}
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
