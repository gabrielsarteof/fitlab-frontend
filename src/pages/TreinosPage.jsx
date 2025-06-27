import React, { useEffect, useState, useRef } from 'react';
import api from '../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import CriarTreinoModal from '@components/modals/CriarTreinoModal';
import SearchInput from '../components/common/SearchInput';

// opções de objetivos para filtro
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

export default function TreinosPage() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState('cliente-asc');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // filtro de objetivo selecionado
  const [objetivoSelecionado, setObjetivoSelecionado] = useState('');
  const [showObjetivoDropdown, setShowObjetivoDropdown] = useState(false);
  const objetivoRef = useRef(null);

  const fetchTreinos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/treinos');
      setTreinos(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao buscar treinos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTreinos(); }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (objetivoRef.current && !objetivoRef.current.contains(e.target)) {
        setShowObjetivoDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Confirma exclusão deste treino?')) return;
    setLoading(true);
    try {
      await api.delete(`/treinos/${id}`);
      toast.success('Treino excluído com sucesso!');
      fetchTreinos();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao excluir treino';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // filtragem por busca e objetivo
  const filtrados = treinos.filter(t => {
    const buscaMatch =
      t.cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.personal?.nome.toLowerCase().includes(busca.toLowerCase());
    const objetivoMatch = objetivoSelecionado ? t.objetivo === objetivoSelecionado : true;
    return buscaMatch && objetivoMatch;
  });

  // ordenação por cliente ou vencimento
  const ordenados = [...filtrados].sort((a, b) => {
    if (sortKey === 'cliente-asc') return a.cliente.nome.localeCompare(b.cliente.nome);
    if (sortKey === 'cliente-desc') return b.cliente.nome.localeCompare(a.cliente.nome);
    if (sortKey === 'expires_at') return new Date(a.expires_at) - new Date(b.expires_at);
    return 0;
  });

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />

      {/* Cabeçalho */}
      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">Planos de Treino</h3>
          <small className="text-muted">{ordenados.length} resultados</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => { setEditId(null); setShowModal(true); }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Novo Treino
        </button>
      </div>

      {/* Busca, ordenação e filtro de objetivo */}
      <div className="d-flex flex-column flex-md-row align-items-center gap-2 mb-4">
        <SearchInput value={busca} onChange={setBusca} placeholder="Pesquisar cliente ou personal..." />

        <div className="dropdown ms-md-auto">
          <button className="btn btn-light btn-sm dropdown-toggle py-2 px-3" type="button" data-bs-toggle="dropdown">
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li>
              <button className="dropdown-item" onClick={() => setSortKey('cliente-asc')}>
                Cliente A-Z
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setSortKey('cliente-desc')}>
                Cliente Z-A
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setSortKey('expires_at')}>
                Vencimento
              </button>
            </li>
          </ul>
        </div>

        {/* filtro de objetivo */}
        <div className="position-relative" ref={objetivoRef}>
          <button
            className="btn btn-light btn-sm py-2 px-3"
            onClick={() => setShowObjetivoDropdown(v => !v)}
            style={{ minWidth: 150 }}
          >
            {objetivoSelecionado || 'Filtrar por objetivo'}
          </button>
          {showObjetivoDropdown && (
            <div className="dropdown-menu show mt-1 shadow" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {OBJETIVOS_TREINO.map(obj => (
                <button
                  key={obj}
                  className={`dropdown-item ${obj === objetivoSelecionado ? 'active' : ''}`}
                  onClick={() => { setObjetivoSelecionado(obj); setShowObjetivoDropdown(false); }}
                >
                  {obj}
                </button>
              ))}
              {objetivoSelecionado && <div className="dropdown-divider" />} 
              {objetivoSelecionado && (
                <button className="dropdown-item text-danger" onClick={() => setObjetivoSelecionado('')}>
                  Limpar filtro
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cabeçalho da lista em desktop */}
      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col-1">Id</div>
        <div className="col-3">Cliente</div>
        <div className="col-3">Personal</div>
        <div className="col-2">Objetivo</div>
        <div className="col-2">Vencimento</div>
        <div className="col-1">Ações</div>
      </div>

      {/* Lista de treinos */}
      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
          </div>
        ) : (
          ordenados.map(t => (
            <div key={t.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
              <div className="col-12 col-md-1 mb-1 mb-md-0">#{t.id}</div>
              <div className="col-12 col-md-3 fw-bold mb-1 mb-md-0 text-truncate">{t.cliente?.nome}</div>
              <div className="col-12 col-md-3 mb-1 mb-md-0 text-truncate">{t.personal?.nome}</div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">{t.objetivo}</div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">{t.expires_at ? new Date(t.expires_at).toLocaleDateString('pt-BR') : '-'}</div>
              <div className="col-12 col-md-1 d-flex justify-content-start gap-2">
                <button className="btn action-btn border-0 py-1 px-2" onClick={() => { setEditId(t.id); setShowModal(true); }}>
                  <i className="bi bi-pencil fs-6"></i>
                </button>
                <button className="btn bg-danger-subtle border-0 py-1 px-2" onClick={() => handleDelete(t.id)}>
                  <i className="bi bi-trash fs-6 text-danger"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de criar/editar treino */}
      <CriarTreinoModal show={showModal} treinoId={editId} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchTreinos(); }} />
    </div>
  );
}
