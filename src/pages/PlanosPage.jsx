import React, { useEffect, useState } from 'react';
import api from '../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import CriarPlanoModal from '@components/modals/CriarPlanoModal';

export default function PlanosPage() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchPlanos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/planos');
      setPlanos(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao buscar planos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão deste plano?')) return;
    setLoading(true);
    try {
      await api.delete(`/planos/${id}`);
      toast.success('Plano excluído com sucesso!');
      fetchPlanos();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao excluir plano';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = planos.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.frequencia?.toLowerCase().includes(busca.toLowerCase())
  );

  const ordenados = [...filtrados].sort((a, b) => {
    switch (sortKey) {
      case 'nome-asc': return a.nome.localeCompare(b.nome);
      case 'nome-desc': return b.nome.localeCompare(a.nome);
      case 'valor-asc': return a.valor - b.valor;
      case 'valor-desc': return b.valor - a.valor;
      default: return 0;
    }
  });

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />
      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">Planos</h3>
          <small className="text-muted">{ordenados.length} resultados</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => { setEditId(null); setShowModal(true); }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Novo Plano
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mb-4">
        <div className="dropdown ms-md-auto">
          <button className="btn btn-light btn-sm dropdown-toggle py-2 px-3" type="button" data-bs-toggle="dropdown">
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li><button className="dropdown-item" onClick={() => setSortKey('nome-asc')}>Nome A-Z</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('nome-desc')}>Nome Z-A</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('valor-asc')}>Valor (menor)</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('valor-desc')}>Valor (maior)</button></li>
          </ul>
        </div>
      </div>

      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col-1">Id</div>
        <div className="col-4">Nome</div>
        <div className="col-3">Frequência</div>
        <div className="col-2">Valor</div>
        <div className="col-2">Ações</div>
      </div>

      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border"/></div>
        ) : (
          ordenados.map(p => (
            <div key={p.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
              <div className="col-12 col-md-1 mb-1 mb-md-0">#{p.id}</div>
              <div className="col-12 col-md-4 fw-bold mb-1 mb-md-0 text-truncate">{p.nome}</div>
              <div className="col-12 col-md-3 mb-1 mb-md-0 text-truncate">{p.frequencia}</div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">{p.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="col-12 col-md-2 d-flex justify-content-start gap-2">
                <button className="btn action-btn border-0 py-1 px-2" onClick={() => { setEditId(p.id); setShowModal(true); }}>
                  <i className="bi bi-pencil fs-6"></i>
                </button>
                <button className="btn bg-danger-subtle border-0 py-1 px-2" onClick={() => handleDelete(p.id)}>
                  <i className="bi bi-trash fs-6 text-danger"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CriarPlanoModal
        show={showModal}
        planoId={editId}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); fetchPlanos(); }}
      />
    </div>
  );
}
