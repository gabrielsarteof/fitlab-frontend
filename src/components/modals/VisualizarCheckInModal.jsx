import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function VisualizarCheckinModal({ checkin, onClose }) {
  if (!checkin) return null;

  return (
    <>
      <style>{`
        .modal-dialog { width: 100%; max-width: 90vw; margin: 1.5rem auto; }
        @media (min-width: 576px) { .modal-dialog { max-width: 450px; } }
        .modal-content { border-radius: 1rem; }
        .modal-body { max-height: 70vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--bs-primary) var(--bs-light); }
        .modal-body::-webkit-scrollbar { width: 10px; }
        .modal-body::-webkit-scrollbar-track { background: var(--bs-light); border-radius: 0 1rem 1rem 0; }
        .modal-body::-webkit-scrollbar-thumb { background-color: var(--bs-primary); border-radius: 0.5rem; border: 2px solid var(--bs-light); }
        .modal-body::-webkit-scrollbar-thumb:hover { background-color: var(--bs-primary-dark); }
      `}</style>

      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white shadow rounded-3 p-4 pb-5">
            <div className="modal-header border-0 p-4">
              <h4 className="modal-title fw-bold">Detalhes do Check-in #{checkin.id}</h4>
              <button type="button" className="btn-close text-reset" onClick={onClose} aria-label="Fechar" />
            </div>
            <div className="modal-body p-4">
              <dl className="row gx-2 gy-3 mb-0">
                <dt className="col-4 text-primary">Cliente</dt>
                <dd className="col-8">{checkin.assinatura?.cliente?.nome || '-'}</dd>

                <dt className="col-4 text-primary">Entrada</dt>
                <dd className="col-8">{new Date(checkin.entrada).toLocaleString()}</dd>

                <dt className="col-4 text-primary">Saída</dt>
                <dd className="col-8">{checkin.saida ? new Date(checkin.saida).toLocaleString() : '—'}</dd>

                <dt className="col-4 text-primary">Acesso Autorizado</dt>
                <dd className="col-8">{checkin.acesso_autorizado ? 'Sim' : 'Não'}</dd>

                {checkin.razao_bloqueio && (
                  <>
                    <dt className="col-4 text-primary">Razão Bloqueio</dt>
                    <dd className="col-8 text-danger">{checkin.razao_bloqueio}</dd>
                  </>
                )}
              </dl>
            </div>
            <div className="modal-footer border-0 p-4">
              <button type="button" className="btn btn-outline-secondary w-100" onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
