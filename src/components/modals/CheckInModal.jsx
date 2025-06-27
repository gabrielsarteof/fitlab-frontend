import React, { useEffect, useState } from 'react';
import api from '../../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AutocompleteSelect from '@components/common/AutoCompleteSelect';

export default function CheckinModal({ show, onClose, onSaved }) {
  const [assinaturaId, setAssinaturaId] = useState('');
  const [assinaturas, setAssinaturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!show) return;
    setErrors({});
    setServerError('');
    setAssinaturaId('');
    setLoading(true);

    // Busca assinaturas e clientes em paralelo para montar labels
    Promise.all([api.get('/clientes'), api.get('/assinaturas/ativas')])
      .then(([cliRes, assRes]) => {
        const clientesData = cliRes.data;
        setClientes(clientesData);
        const assinaturasData = assRes.data;
        const opts = assinaturasData.map(a => {
          const cliente = clientesData.find(c => c.id === a.cliente_id) || {};
          const clienteNome = cliente.nome || 'Cliente desconhecido';
          const planoNome = a.plano?.nome || '';
          return {
            id: a.id,
            nome: planoNome
              ? `${clienteNome}`
              : clienteNome
          };
        });
        setAssinaturas(opts);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
        setServerError(msg);
        toast.error(msg);
        onClose();
      })
      .finally(() => setLoading(false));
  }, [show, onClose]);

  function validate() {
    const errs = {};
    if (!assinaturaId) errs.assinaturaId = 'Selecione uma assinatura.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const frontErrs = validate();
    if (Object.keys(frontErrs).length) {
      setErrors(frontErrs);
      return;
    }

    setLoading(true);
    try {
      await api.post('/checkins', { assinatura_id: Number(assinaturaId) });
      toast.success('Check-in realizado!');
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao fazer check-in:', err);
      const resp = err.response?.data;
      if (resp?.message?.toLowerCase().includes('assinatura_id')) {
        setErrors({ assinaturaId: resp.message });
        setServerError('');
      } else {
        const msg = resp?.message || err.message || 'Erro ao fazer check-in';
        setServerError(msg);
        toast.error(msg);
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
        .custom-alert { background: transparent !important; color: var(--bs-danger) !important; margin-bottom: 1rem; }
        .hover-bg-light:hover { background: #f6f6f6 !important; }
      `}</style>
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">Check-in de Cliente</h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              {serverError && <div className="custom-alert">{serverError}</div>}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <AutocompleteSelect
                    value={assinaturaId}
                    options={assinaturas}
                    onChange={id => { setAssinaturaId(id); setErrors(prev => ({ ...prev, assinaturaId: '' })); }}
                    error={errors.assinaturaId}
                    placeholder="Cliente"
                    disabled={loading}
                  />
                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading || !assinaturaId}>
                      Fazer Check-in
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
