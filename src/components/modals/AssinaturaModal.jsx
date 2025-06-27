import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AutocompleteSelect from '@components/common/AutoCompleteSelect';

const METODOS_PAGAMENTO = [
  'Cartão de Crédito',
  'Boleto Bancário',
  'Pix',
  'Transferência Bancária',
  'Dinheiro',
];

export default function AssinaturaModal({ show, onClose, onSaved }) {
  const [clienteId, setClienteId] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [valor, setValor] = useState('');
  const [clientes, setClientes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    setClienteId('');
    setPlanoId('');
    setMetodoPagamento('');
    setValor('');
    setLoading(true);

    Promise.all([
      api.get('/clientes'),
      api.get('/planos')
    ])
      .then(([clRes, plRes]) => {
        setClientes(clRes.data);
        setPlanos(plRes.data);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
        setServerError(msg);
        toast.error(msg);
        onClose();
      })
      .finally(() => setLoading(false));
  }, [show, onClose]);

  // Atualiza o valor do plano automaticamente ao selecionar
  useEffect(() => {
    const plano = planos.find(p => p.id === Number(planoId));
    if (plano) {
      setValor(plano.valor != null ? plano.valor.toString() : '0');
    }
  }, [planoId, planos]);

  function validate() {
    const errs = {};
    if (!clienteId) errs.clienteId = 'Selecione um cliente.';
    if (!planoId) errs.planoId = 'Selecione um plano.';
    if (!metodoPagamento) errs.metodoPagamento = 'Informe o método de pagamento.';
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
      const payload = {
        cliente_id: Number(clienteId),
        plano_id: Number(planoId),
        metodo_pagamento: metodoPagamento,
        valor: parseFloat(valor)
      };

      await api.post('/assinaturas', payload);
      toast.success('Assinatura criada com sucesso!');
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao criar assinatura:', err);
      let msg = 'Erro ao criar assinatura.';
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
        @media (min-width: 576px) { .modal-dialog { max-width: 450px; } }
        .modal-content { border-radius: 1rem; }
        .modal-body { max-height: 70vh; overflow-y: auto; }
        .custom-alert { background: transparent !important; color: var(--bs-danger) !important; margin-bottom: 1rem; }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">Nova Assinatura</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <AutocompleteSelect
                    value={clienteId}
                    options={clientes}
                    onChange={id => { setClienteId(id); setErrors(prev => ({ ...prev, clienteId: '' })); }}
                    error={errors.clienteId}
                    placeholder="Cliente"
                    disabled={loading}
                  />

                  <AutocompleteSelect
                    value={planoId}
                    options={planos}
                    onChange={id => { setPlanoId(id); setErrors(prev => ({ ...prev, planoId: '' })); }}
                    error={errors.planoId}
                    placeholder="Plano"
                    disabled={loading}
                  />

                  <div className="mb-3">
                    <select
                      name="metodo_pagamento"
                      className={`form-select text-primary${errors.metodoPagamento ? ' is-invalid' : ''}`}
                      value={metodoPagamento}
                      onChange={e => { setMetodoPagamento(e.target.value); setErrors(prev => ({ ...prev, metodoPagamento: '' })); }}
                      disabled={loading}
                    >
                      <option value="">Método de Pagamento</option>
                      {METODOS_PAGAMENTO.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {errors.metodoPagamento && <div className="invalid-feedback text-danger">{errors.metodoPagamento}</div>}
                  </div>

                  <div className="mb-3 form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="valor"
                      placeholder="Valor"
                      value={valor}
                      readOnly
                      disabled
                    />
                    <label htmlFor="valor" className="text-primary">Valor do Plano (R$)</label>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                      Criar Assinatura
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
