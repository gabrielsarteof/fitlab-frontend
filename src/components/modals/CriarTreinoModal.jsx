import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AutocompleteSelect from '@components/common/AutoCompleteSelect';

const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];
const OBJETIVOS_TREINO = [
  'Ganho de massa',
  'Emagrecimento',
  'Definição muscular',
  'Fortalecimento geral',
  'Resistência física',
  'Condicionamento cardiorrespiratório',
  'Reabilitação',
  'Flexibilidade',
  'Saúde geral',
  'Melhora de desempenho esportivo',
  'Prevenção de lesões'
];

export default function CriarTreinoModal({ show, onClose, onSaved, treinoId }) {
  const [dados, setDados] = useState({
    objetivo: '',
    nivel: '',
    expires_at: '',
    exercicios: '',
    cliente_id: '',
    personal_trainer_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [clientes, setClientes] = useState([]);
  const [personais, setPersonais] = useState([]);

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    setLoading(true);

    Promise.all([
      api.get('/clientes'),
      api.get('/personaltrainers'),
      treinoId ? api.get(`/treinos/${treinoId}`) : Promise.resolve({ data: null })
    ])
      .then(([clRes, ptRes, tRes]) => {
        setClientes(clRes.data);
        setPersonais(ptRes.data);
        if (tRes.data) {
          const t = tRes.data;
          setDados({
            objetivo: t.objetivo,
            nivel: t.nivel,
            expires_at: t.expires_at.split('T')[0],
            exercicios: t.exercicios,
            cliente_id: String(t.cliente_id),
            personal_trainer_id: String(t.personal_trainer_id)
          });
        } else {
          setDados({ objetivo: '', nivel: '', expires_at: '', exercicios: '', cliente_id: '', personal_trainer_id: '' });
        }
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
        setServerError(msg);
        toast.error(msg);
        onClose();
      })
      .finally(() => setLoading(false));
  }, [show, treinoId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (!dados.objetivo) errs.objetivo = 'Selecione o objetivo.';
    if (!dados.nivel) errs.nivel = 'Selecione um nível.';
    if (!dados.expires_at) {
      errs.expires_at = 'Data de expiração obrigatória.';
    } else {
      const today = new Date();
      const exp = new Date(dados.expires_at);
      today.setHours(23, 59, 59, 999);
      if (exp <= today) errs.expires_at = 'A data de expiração deve ser futura.';
    }
    if (!dados.exercicios.trim()) errs.exercicios = 'Preencha os exercícios.';
    if (!dados.cliente_id) errs.cliente_id = 'Selecione um cliente.';
    if (!dados.personal_trainer_id) errs.personal_trainer_id = 'Selecione um personal trainer.';
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
      const method = treinoId ? 'put' : 'post';
      const url = treinoId ? `/treinos/${treinoId}` : '/treinos';
      const payload = {
        ...dados,
        cliente_id: Number(dados.cliente_id),
        personal_trainer_id: Number(dados.personal_trainer_id)
      };

      await api[method](url, payload);
      toast.success(treinoId ? 'Treino atualizado com sucesso!' : 'Treino criado com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar treino:', err);
      let msg = 'Erro ao salvar treino';

      if (err.response) {
        const resp = err.response.data;
        if (resp && typeof resp === 'object') {
          msg = resp.message || resp.error || JSON.stringify(resp);
          if (resp.errors && typeof resp.errors === 'object') setErrors(resp.errors);
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

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

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
              <h4 className="modal-title fw-bold">{treinoId ? 'Editar Plano de Treino' : 'Criar Plano de Treino'}</h4>
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
                      name="objetivo"
                      className={`form-select text-primary${errors.objetivo ? ' is-invalid' : ''}`}
                      value={dados.objetivo}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Objetivo</option>
                      {OBJETIVOS_TREINO.map(obj => <option key={obj} value={obj}>{obj}</option>)}
                    </select>
                    {errors.objetivo && <div className="invalid-feedback text-danger">{errors.objetivo}</div>}
                  </div>

                  <div className="mb-3">
                    <select
                      name="nivel"
                      className={`form-select text-primary${errors.nivel ? ' is-invalid' : ''}`}
                      value={dados.nivel}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Nível</option>
                      {NIVEIS.map(nv => <option key={nv} value={nv}>{nv}</option>)}
                    </select>
                    {errors.nivel && <div className="invalid-feedback text-danger">{errors.nivel}</div>}
                  </div>

                  <div className="mb-3 form-floating">
                    <input
                      id="expires_at" name="expires_at" type="date"
                      className={`form-control${errors.expires_at ? ' is-invalid' : ''}`}
                      value={dados.expires_at}
                      onChange={handleChange}
                      min={getMinDate()}
                      disabled={loading}
                    />
                    <label htmlFor="expires_at" className="text-primary">Data de Expiração</label>
                    {errors.expires_at && <div className="invalid-feedback text-danger">{errors.expires_at}</div>}
                  </div>

                  <div className="mb-3">
                    <textarea
                      id="exercicios" name="exercicios"
                      className={`form-control${errors.exercicios ? ' is-invalid' : ''}`} rows={4}
                      value={dados.exercicios}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.exercicios && <div className="invalid-feedback text-danger">{errors.exercicios}</div>}
                  </div>

                  <AutocompleteSelect
                    value={dados.cliente_id}
                    options={clientes}
                    onChange={id => setDados(prev => ({ ...prev, cliente_id: id }))}
                    icon
                    error={errors.cliente_id}
                    placeholder="Cliente"
                    disabled={loading}
                  />

                  <AutocompleteSelect
                    value={dados.personal_trainer_id}
                    options={personais}
                    onChange={id => setDados(prev => ({ ...prev, personal_trainer_id: id }))}
                    icon
                    error={errors.personal_trainer_id}
                    placeholder="Personal Trainer"
                    disabled={loading}
                  />

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
