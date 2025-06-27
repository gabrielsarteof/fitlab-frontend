import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';

const especialidades = [
  'Nutrição Clínica',
  'Nutrição Esportiva',
  'Nutrição Funcional',
  'Nutrição Pediátrica',
  'Nutrição Oncológica',
  'Nutrição Geriátrica'
];

const crns = [
  'CRN-1','CRN-2','CRN-3','CRN-4','CRN-5',
  'CRN-6','CRN-7','CRN-8','CRN-9','CRN-10','CRN-11'
];

// Formata telefone para (NN) NNNNN-NNNN
function formatTelefone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 7);
  const part3 = digits.slice(7, 11);
  if (part3) return `(${part1}) ${part2}-${part3}`;
  if (part2) return `(${part1}) ${part2}`;
  if (part1) return `(${part1}`;
  return '';
}

export default function CriarNutricionistaModal({ show, onClose, onSaved, nutricionistaId }) {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    crn: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');

    if (nutricionistaId) {
      setLoading(true);
      api.get(`/nutricionistas/${nutricionistaId}`)
        .then(({ data }) => {
          setDados({
            nome: data.nome,
            email: data.email,
            telefone: formatTelefone(data.telefone || ''),
            especialidade: data.especialidade,
            crn: data.crn
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
      setDados({ nome: '', email: '', telefone: '', especialidade: '', crn: '' });
    }
  }, [show, nutricionistaId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    const val = name === 'telefone' ? formatTelefone(value) : value;
    setDados(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (!dados.nome.trim()) errs.nome = 'Nome deve ser preenchido.';
    if (!dados.email.trim()) errs.email = 'E-mail deve ser preenchido.';
    if (!dados.telefone) errs.telefone = 'Telefone deve ser preenchido.';
    else if (dados.telefone.replace(/\D/g, '').length !== 11)
      errs.telefone = 'Telefone deve ter DDD e 9 dígitos.';

    if (!dados.especialidade) errs.especialidade = 'Selecione uma especialidade.';
    if (!dados.crn) errs.crn = 'Selecione um CRN.';
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
      const method = nutricionistaId ? 'put' : 'post';
      const url = nutricionistaId ? `/nutricionistas/${nutricionistaId}` : '/nutricionistas';
      const payload = {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone.replace(/\D/g, ''),
        especialidade: dados.especialidade,
        crn: dados.crn
      };

      await api[method](url, payload);
      toast.success(nutricionistaId ? 'Nutricionista atualizado com sucesso!' : 'Nutricionista criado com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar nutricionista:', err);
      let msg = 'Erro ao salvar nutricionista';
      if (err.response) {
        const resp = err.response.data;
        if (resp && typeof resp === 'object') {
          msg = resp.message || resp.error || JSON.stringify(resp);
        } else if (typeof resp === 'string') {
          msg = resp;
        }
      } else {
        msg = err.message;
      }
      if (err.response?.data?.errors && typeof err.response.data.errors === 'object') {
        setErrors(err.response.data.errors);
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
        @media (min-width: 576px) { .modal-dialog { max-width: 450px; } }
        .modal-content { border-radius: 1rem; }
        .modal-body { max-height: 70vh; overflow-y: auto; }
        .custom-alert { background: transparent !important; color: var(--bs-danger) !important; margin-bottom: 1rem; }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">{nutricionistaId ? 'Editar Nutricionista' : 'Criar Nutricionista'}</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {['nome','email','telefone'].map(f => (
                    <div className="mb-3 form-floating" key={f}>
                      <input
                        id={f}
                        name={f}
                        type={f === 'email' ? 'email' : f === 'telefone' ? 'tel' : 'text'}
                        className={`form-control${errors[f] ? ' is-invalid' : ''}`}
                        placeholder={f}
                        value={dados[f]}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor={f} className="text-primary">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                      {errors[f] && <div className="invalid-feedback text-danger">{errors[f]}</div>}
                    </div>
                  ))}

                  <div className="mb-3">
                    <select
                      name="especialidade"
                      className={`form-select text-primary${errors.especialidade ? ' is-invalid' : ''}`}
                      value={dados.especialidade}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Especialidade</option>
                      {especialidades.map(espec => <option key={espec} value={espec}>{espec}</option>)}
                    </select>
                    {errors.especialidade && <div className="invalid-feedback text-danger">{errors.especialidade}</div>}
                  </div>

                  <div className="mb-3">
                    <select
                      name="crn"
                      className={`form-select text-primary${errors.crn ? ' is-invalid' : ''}`}
                      value={dados.crn}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">CRN</option>
                      {crns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.crn && <div className="invalid-feedback text-danger">{errors.crn}</div>}
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
