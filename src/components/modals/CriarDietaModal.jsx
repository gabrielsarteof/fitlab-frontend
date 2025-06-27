import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AutocompleteSelect from '@components/common/AutoCompleteSelect';

const OBJETIVO_DIETA = [
  'Ganho de massa',
  'Emagrecimento',
  'Definição muscular',
  'Aumento de energia',
  'Saúde geral',
  'Reeducação alimentar',
  'Vegetariana',
  'Vegana',
];

export default function CriarDietaModal({ show, onClose, onSaved, dietaId }) {
  const [dados, setDados] = useState({
    descricao: '',
    expires_at: '',
    instrucoes: '',
    cliente_id: '',
    nutricionista_id: ''
  });
  const [clientes, setClientes] = useState([]);
  const [nutris, setNutris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    setLoading(true);

    Promise.all([
      api.get('/clientes'),
      api.get('/nutricionistas'),
      dietaId ? api.get(`/dietas/${dietaId}`) : Promise.resolve({ data: null })
    ])
      .then(([clRes, nRes, dRes]) => {
        setClientes(clRes.data);
        setNutris(nRes.data);
        if (dRes.data) {
          const d = dRes.data;
          setDados({
            descricao: d.descricao,
            expires_at: d.expires_at.split('T')[0],
            instrucoes: d.instrucoes,
            cliente_id: String(d.cliente_id),
            nutricionista_id: String(d.nutricionista_id)
          });
        } else {
          setDados({ descricao: '', expires_at: '', instrucoes: '', cliente_id: '', nutricionista_id: '' });
        }
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
        setServerError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [show, dietaId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!dados.descricao.trim()) errs.descricao = 'Descrição é obrigatória.';
    if (!dados.expires_at) errs.expires_at = 'Data de expiração é obrigatória.';
    if (!dados.instrucoes.trim()) errs.instrucoes = 'Instruções não podem ser vazias.';
    if (!dados.cliente_id) errs.cliente_id = 'Selecione um cliente.';
    if (!dados.nutricionista_id) errs.nutricionista_id = 'Selecione um nutricionista.';
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
      const method = dietaId ? 'put' : 'post';
      const url = dietaId ? `/dietas/${dietaId}` : '/dietas';
      const payload = {
        ...dados,
        cliente_id: Number(dados.cliente_id),
        nutricionista_id: Number(dados.nutricionista_id)
      };

      await api[method](url, payload);
      toast.success(dietaId ? 'Dieta atualizada com sucesso!' : 'Dieta criada com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar dieta:', err);
      let msg = 'Erro ao salvar dieta';
      if (err.response) {
        const respData = err.response.data;
        if (respData && typeof respData === 'object') {
          msg = respData.message || respData.error || respData.err || JSON.stringify(respData);
        } else if (typeof respData === 'string') {
          msg = respData;
        }
      } else {
        msg = err.message;
      }

      // Se houver validações de campo
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
        .hover-bg-light:hover { background: #f6f6f6 !important; }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">{dietaId ? 'Editar Dieta' : 'Criar Dieta'}</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <select
                      id="descricao"
                      name="descricao"
                      className={`form-select text-primary${errors.descricao ? ' is-invalid' : ''}`}
                      value={dados.descricao}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Descrição</option>
                      {OBJETIVO_DIETA.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    {errors.descricao && <div className="invalid-feedback text-danger">{errors.descricao}</div>}
                  </div>

                  <div className="mb-3 form-floating">
                    <input
                      id="expires_at"
                      name="expires_at"
                      type="date"
                      className={`form-control${errors.expires_at ? ' is-invalid' : ''}`}
                      placeholder="Data de Expiração"
                      value={dados.expires_at}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="expires_at" className="text-primary">Data de Expiração</label>
                    {errors.expires_at && <div className="invalid-feedback text-danger">{errors.expires_at}</div>}
                  </div>

                  <div className="mb-3">
                    <textarea
                      id="instrucoes"
                      name="instrucoes"
                      className={`form-control${errors.instrucoes ? ' is-invalid' : ''}`}
                      placeholder="Instruções"
                      rows={4}
                      value={dados.instrucoes}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.instrucoes && <div className="invalid-feedback text-danger">{errors.instrucoes}</div>}
                  </div>

                  <AutocompleteSelect
                    value={dados.cliente_id}
                    options={clientes}
                    onChange={id => setDados(prev => ({ ...prev, cliente_id: id }))}
                    icon={true}
                    error={errors.cliente_id}
                    placeholder="Cliente"
                    disabled={loading}
                  />

                  <AutocompleteSelect
                    value={dados.nutricionista_id}
                    options={nutris}
                    onChange={id => setDados(prev => ({ ...prev, nutricionista_id: id }))}
                    icon={true}
                    error={errors.nutricionista_id}
                    placeholder="Nutricionista"
                    disabled={loading}
                  />

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>Salvar</button>
                    <button type="button" className="btn btn-outline-secondary flex-fill" onClick={onClose} disabled={loading}>Cancelar</button>
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
