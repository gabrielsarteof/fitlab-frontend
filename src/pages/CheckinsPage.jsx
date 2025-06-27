import React, { useEffect, useState } from 'react';
import api from '../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import CheckInModal from '@components/modals/CheckInModal';
import SearchInput from '../components/common/SearchInput';

const filtros = [
  { key: 'todas', nome: 'Todas' },
  { key: 'hoje', nome: 'Hoje' },
  { key: 'semana', nome: 'Últimos 7 dias' }
];

export default function CheckinsPage() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('data-desc');
  const [filterType, setFilterType] = useState('todas');
  const [showModal, setShowModal] = useState(false);

  const fetchCheckins = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/checkins');
      setCheckins(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar check-ins';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCheckins(); }, []);

  const hoje = new Date();
  const isHoje = ci => new Date(ci.entrada).toDateString() === hoje.toDateString();
  const isSemana = ci => {
    const diff = (hoje - new Date(ci.entrada)) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  // Filtro de período
  const filtered = checkins.filter(ci => {
    switch (filterType) {
      case 'hoje': return isHoje(ci);
      case 'semana': return isSemana(ci);
      default: return true;
    }
  });

  // Busca por nome do cliente
  const searched = filtered.filter(ci =>
    ci.assinatura?.cliente?.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Ordenação
  const ordered = [...searched].sort((a, b) => {
    switch (sortKey) {
      case 'cliente-asc': return a.assinatura.cliente.nome.localeCompare(b.assinatura.cliente.nome);
      case 'cliente-desc': return b.assinatura.cliente.nome.localeCompare(a.assinatura.cliente.nome);
      case 'data-asc': return new Date(a.entrada) - new Date(b.entrada);
      case 'data-desc': return new Date(b.entrada) - new Date(a.entrada);
      default: return 0;
    }
  });

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />

      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">CHECK-INS</h3>
          <small className="text-muted">{ordered.length} registros</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Novo Check-in
        </button>
      </div>

      <div className="d-flex align-items-center gap-4 mb-4" style={{ fontSize: 16, fontWeight: 500 }}>
        {filtros.map(f => (
          <button
            key={f.key}
            className="bg-transparent border-0 p-0"
            style={{
              color: filterType === f.key ? '#111' : '#b8b8b8',
              fontWeight: filterType === f.key ? 700 : 500,
              opacity: filterType === f.key ? 1 : 0.7,
              borderBottom: filterType === f.key ? '2px solid #3578e5' : '2px solid transparent',
              cursor: 'pointer'
            }}
            onClick={() => setFilterType(f.key)}
          >{f.nome}</button>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filtrar por cliente..."
          items={checkins.map(ci => ({ id: ci.id, label: ci.assinatura.cliente.nome }))}
          onSelect={item => setSearch(item.label)}
        />
        <div className="dropdown ms-md-auto">
          <button className="btn btn-light btn-sm dropdown-toggle py-2 px-3" data-bs-toggle="dropdown">
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li><button className="dropdown-item" onClick={() => setSortKey('cliente-asc')}>Cliente A-Z</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('cliente-desc')}>Cliente Z-A</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('data-asc')}>Mais Antigas</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('data-desc')}>Mais Recentes</button></li>
          </ul>
        </div>
      </div>

      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col-2">ID</div>
        <div className="col-4">Cliente</div>
        <div className="col-4">Entrada</div>
        <div className="col-2">Ações</div>
      </div>

      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
          </div>
        ) : (
          ordered.map(ci => (
            <div key={ci.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
              <div className="col-2">#{ci.id}</div>
              <div className="col-4 text-truncate">{ci.assinatura?.cliente?.nome || '-'}</div>
              <div className="col-4 text-truncate">{new Date(ci.entrada).toLocaleString()}</div>
              <div className="col-2 d-flex justify-content-start gap-2">
                <button className="btn action-btn border-0 py-1 px-2" onClick={() => {/* detalhes */}}>
                  <i className="bi bi-eye fs-6"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CheckInModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); fetchCheckins(); }}
      />
    </div>
  );
}
