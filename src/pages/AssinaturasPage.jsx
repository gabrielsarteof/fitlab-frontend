import React, { useEffect, useState } from 'react';
import api from '../api'; // ajuste conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import VisualizarAssinaturaModal from '@components/modals/VisualizarAssinaturaModal';
import AssinaturaModal from '@components/modals/AssinaturaModal';
import SearchInput from '../components/common/SearchInput';

const filtros = [
  { key: 'todas', nome: 'Todas' },
  { key: 'ativas', nome: 'Ativas' },
  { key: 'proximas', nome: 'Próximas a Vencer' },
  { key: 'vencidas', nome: 'Vencidas' }
];

export default function AssinaturasPage() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [viewing, setViewing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAssinaturas = async () => {
    setLoading(true);
    try {
      const [respAss, respCli, respPla] = await Promise.all([
        api.get('/assinaturas'),
        api.get('/clientes'),
        api.get('/planos')
      ]);
      setClientes(respCli.data);
      setPlanos(respPla.data);
      const merged = respAss.data.map(item => ({
        ...item,
        cliente: respCli.data.find(c => c.id === item.cliente_id),
        plano: respPla.data.find(p => p.id === item.plano_id)
      }));
      setAssinaturas(merged);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar dados';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssinaturas();
  }, []);

  // filtra pelo status retornado pelo backend (campo virtual)
  const statusFiltered = assinaturas.filter(a => {
    switch (filterStatus) {
      case 'ativas': return a.status === 'ativa';
      case 'proximas': return a.status === 'proxima';
      case 'vencidas': return a.status === 'vencida';
      default: return true;
    }
  });

  // filtra pelo termo de busca em cliente ou plano
  const buscados = statusFiltered.filter(a => {
    const termo = search.toLowerCase();
    const cli = a.cliente?.nome?.toLowerCase() || '';
    const pla = a.plano?.nome?.toLowerCase() || '';
    return cli.includes(termo) || pla.includes(termo);
  });

  // ordenação conforme chave selecionada
  const ordenados = [...buscados].sort((a, b) => {
    const nomeA = a.cliente?.nome || '';
    const nomeB = b.cliente?.nome || '';
    switch (sortKey) {
      case 'cliente-asc':
        return nomeA.localeCompare(nomeB);
      case 'cliente-desc':
        return nomeB.localeCompare(nomeA);
      // Criação: Recente primeiro
      case 'inicio-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      // Criação: Antigo primeiro
      case 'inicio-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      // Expiração: Recente primeiro
      case 'renovacao-desc':
        return new Date(b.expires_at) - new Date(a.expires_at);
      // Expiração: Antigo primeiro
      case 'renovacao-asc':
        return new Date(a.expires_at) - new Date(b.expires_at);
      default:
        return 0;
    }
  });

  // helper para classes de cor de status
  const statusClass = status => {
    if (status === 'ativa') return 'text-primary';
    if (status === 'vencida') return 'text-danger';
    if (status === 'proxima') return 'text-warning';
    return '';
  };

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />

      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">ASSINATURAS</h3>
          <small className="text-muted">{ordenados.length} registros</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-1" />Nova Assinatura
        </button>
      </div>

      <div className="d-flex align-items-center gap-4 mb-4" style={{ fontSize: 16, fontWeight: 500 }}>
        {filtros.map(f => (
          <button
            key={f.key}
            className="bg-transparent border-0 p-0"
            style={{
              color: filterStatus === f.key ? '#111' : '#b8b8b8',
              fontWeight: filterStatus === f.key ? 700 : 500,
              opacity: filterStatus === f.key ? 1 : 0.7,
              borderBottom: filterStatus === f.key ? '2px solid #3578e5' : '2px solid transparent',
              cursor: 'pointer'
            }}
            onClick={() => setFilterStatus(f.key)}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filtrar por cliente ou plano..."
        />
        <div className="dropdown ms-md-auto">
          <button className="btn btn-light btn-sm dropdown-toggle py-2 px-3" data-bs-toggle="dropdown">
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li><button className="dropdown-item" onClick={() => setSortKey('cliente-asc')}>Cliente A-Z</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('cliente-desc')}>Cliente Z-A</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('inicio-desc')}>Criação: Mais Recente</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('inicio-asc')}>Criação: Mais Antigo</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('renovacao-desc')}>Expiração: Mais Recente</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('renovacao-asc')}>Expiração: Mais Antigo</button></li>
          </ul>
        </div>
      </div>

      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col">ID</div>
        <div className="col-2">Cliente</div>
        <div className="col">Plano</div>
        <div className="col">Criação</div>
        <div className="col">Expira em</div>
        <div className="col">Status</div>
        <div className="col">Ações</div>
      </div>

      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" /></div>
        ) : (
          ordenados.map(a => (
            <div key={a.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
              <div className="col">#{a.id}</div>
              <div className="col-2 text-truncate">{a.cliente?.nome || '-'}</div>
              <div className="col text-truncate">{a.plano?.nome || '-'}</div>
              <div className="col text-truncate">{new Date(a.createdAt).toLocaleDateString()}</div>
              <div className="col text-truncate">{new Date(a.expires_at).toLocaleDateString()}</div>
              <div className={`col text-truncate ${statusClass(a.status)}`}>
                {a.status}
              </div>
              <div className="col d-flex justify-content-start gap-2">
                <button className="btn action-btn border-0 py-1 px-2" onClick={() => setViewing(a)}>
                  <i className="bi bi-eye fs-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {viewing && (
        <VisualizarAssinaturaModal
          assinatura={viewing}
          onClose={() => setViewing(null)}
        />
      )}
      <AssinaturaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); fetchAssinaturas(); }}
      />
    </div>
  );
}
