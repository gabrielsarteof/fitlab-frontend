import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AutocompleteSelect from '@components/common/AutoCompleteSelect';

const API_BASE = '/estados';

export default function AtualizarEstadoModal({ show, onClose, onSaved, estadoId }) {
  const [dados, setDados] = useState({
    cliente_id: '',
    nutricionista_id: '',
    data: '',
    peso: '',
    altura: '',
    taxa_gordura: '',
    circunferencia_cintura: '',
    circunferencia_braco: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const [clientes, setClientes] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    setLoading(true);

    Promise.all([
      api.get('/clientes'),
      api.get('/nutricionistas'),
      estadoId ? api.get(`${API_BASE}/${estadoId}`) : Promise.resolve({ data: null })
    ])
      .then(([clRes, nutRes, estRes]) => {
        setClientes(clRes.data);
        setNutricionistas(nutRes.data);
        if (estRes.data) {
          const e = estRes.data;
          setDados({
            cliente_id: String(e.cliente_id),
            nutricionista_id: String(e.nutricionista_id),
            data: e.data?.split('T')[0] || '',
            peso: e.peso?.toString() || '',
            altura: e.altura?.toString() || '',
            taxa_gordura: e.taxa_gordura?.toString() || '',
            circunferencia_cintura: e.circunferencia_cintura?.toString() || '',
            circunferencia_braco: e.circunferencia_braco?.toString() || ''
          });
        } else {
          setDados({
            cliente_id: '',
            nutricionista_id: '',
            data: '',
            peso: '',
            altura: '',
            taxa_gordura: '',
            circunferencia_cintura: '',
            circunferencia_braco: ''
          });
        }
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
        setServerError(msg);
        toast.error(msg);
        onClose();
      })
      .finally(() => setLoading(false));
  }, [show, estadoId, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (!dados.cliente_id) errs.cliente_id = 'Selecione um cliente.';
    if (!dados.nutricionista_id) errs.nutricionista_id = 'Selecione um nutricionista.';
    if (!dados.data) errs.data = 'Data é obrigatória.';

    // Campos numéricos
    if (!dados.peso) errs.peso = 'Preencha o peso.';
    else if (isNaN(Number(dados.peso)) || Number(dados.peso) <= 0) errs.peso = 'Peso deve ser maior que zero.';

    if (!dados.altura) errs.altura = 'Preencha a altura.';
    else if (isNaN(Number(dados.altura)) || Number(dados.altura) <= 0) errs.altura = 'Altura deve ser maior que zero.';

    if (!dados.taxa_gordura) errs.taxa_gordura = 'Preencha a taxa de gordura.';
    else if (isNaN(Number(dados.taxa_gordura)) || Number(dados.taxa_gordura) < 0) errs.taxa_gordura = 'Taxa de gordura deve ser >= 0.';
    else if (Number(dados.taxa_gordura) > 100) errs.taxa_gordura = 'Taxa de gordura não pode exceder 100%.';

    if (!dados.circunferencia_cintura) errs.circunferencia_cintura = 'Preencha a cintura.';
    else if (isNaN(Number(dados.circunferencia_cintura)) || Number(dados.circunferencia_cintura) <= 0) errs.circunferencia_cintura = 'Cintura deve ser > 0.';

    if (!dados.circunferencia_braco) errs.circunferencia_braco = 'Preencha o braço.';
    else if (isNaN(Number(dados.circunferencia_braco)) || Number(dados.circunferencia_braco) <= 0) errs.circunferencia_braco = 'Braço deve ser > 0.';

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
      const method = estadoId ? 'put' : 'post';
      const url = estadoId ? `${API_BASE}/${estadoId}` : API_BASE;
      const payload = {
        cliente_id: Number(dados.cliente_id),
        nutricionista_id: Number(dados.nutricionista_id),
        data: dados.data,
        peso: Number(dados.peso),
        altura: Number(dados.altura),
        taxa_gordura: Number(dados.taxa_gordura),
        circunferencia_cintura: Number(dados.circunferencia_cintura),
        circunferencia_braco: Number(dados.circunferencia_braco)
      };

      await api[method](url, payload);
      toast.success(estadoId ? 'Estado atualizado com sucesso!' : 'Estado criado com sucesso!');
      onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar estado:', err);
      let msg = 'Erro ao salvar estado';
      if (err.response) {
        const resp = err.response.data;
        if (resp && typeof resp === 'object') {
          msg = resp.message || resp.error || JSON.stringify(resp);
          if (resp.errors && typeof resp.errors === 'object') setErrors(resp.errors);
        } else if (typeof resp === 'string') msg = resp;
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
              <h4 className="modal-title fw-bold">{estadoId ? 'Editar Estado' : 'Novo Estado'}</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status"/></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
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
                    value={dados.nutricionista_id}
                    options={nutricionistas}
                    onChange={id => setDados(prev => ({ ...prev, nutricionista_id: id }))}
                    icon
                    error={errors.nutricionista_id}
                    placeholder="Nutricionista"
                    disabled={loading}
                  />

                  <div className="mb-3 form-floating">
                    <input
                      id="data"
                      name="data"
                      type="date"
                      className={`form-control${errors.data ? ' is-invalid' : ''}`}
                      placeholder="Data"
                      value={dados.data}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="data" className="text-primary">Data</label>
                    {errors.data && <div className="invalid-feedback text-danger">{errors.data}</div>}
                  </div>

                  {/* Campos numéricos similares para peso, altura, etc. */}
                  {['peso','altura','taxa_gordura','circunferencia_cintura','circunferencia_braco'].map(field => (
                    <div className="mb-3 form-floating" key={field}>
                      <input
                        id={field}
                        name={field}
                        type="number"
                        min="0"
                        step={field==='taxa_gordura' ? '0.1' : '0.01'}
                        className={`form-control${errors[field] ? ' is-invalid' : ''}`}
                        placeholder={field}
                        value={dados[field]}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor={field} className="text-primary">
                        {field.replace(/_/g, ' ').replace(/(^| )[a-z]/g, l => l.toUpperCase())}
                      </label>
                      {errors[field] && <div className="invalid-feedback text-danger">{errors[field]}</div>}
                    </div>
                  ))}

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
