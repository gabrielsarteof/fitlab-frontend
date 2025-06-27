import React, { useEffect, useState } from 'react';
import api from '../api'; // ajuste o caminho conforme sua estrutura
import { toast, Toaster } from 'react-hot-toast';
import AtualizarEstadoModal from '@components/modals/AtualizarEstadoModal';
import SearchInput from '../components/common/SearchInput';

export default function EstadosPage() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/estados');
      setEstados(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao buscar estados';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Confirma exclusão deste registro de estado?')) return;
    setLoading(true);
    try {
      await api.delete(`/estados/${id}`);
      toast.success('Estado excluído com sucesso!');
      fetchEstados();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao excluir estado';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Filtros, busca e ordenação
  const filtrados = estados.filter(e =>
    (e.cliente?.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (e.nutricionista?.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (e.data || '').toLowerCase().includes(busca.toLowerCase())
  );

  const ordenados = [...filtrados].sort((a, b) => {
    switch (sortKey) {
      case 'data-desc': return new Date(b.data) - new Date(a.data);
      case 'data-asc': return new Date(a.data) - new Date(b.data);
      case 'peso': return b.peso - a.peso;
      case 'altura': return b.altura - a.altura;
      default: return 0;
    }
  });

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />

      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">Estados</h3>
          <small className="text-muted">{ordenados.length} resultados</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => { setEditId(null); setShowModal(true); }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Novo Estado
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mb-4">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Filtrar cliente ou nutricionista..."
        />
        <div className="dropdown ms-md-auto">
          <button className="btn btn-light btn-sm dropdown-toggle py-2 px-3" type="button" data-bs-toggle="dropdown">
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li><button className="dropdown-item" onClick={() => setSortKey('data-desc')}>Mais recente</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('data-asc')}>Mais antigo</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('peso')}>Peso</button></li>
            <li><button className="dropdown-item" onClick={() => setSortKey('altura')}>Altura</button></li>
          </ul>
        </div>
      </div>

      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col">Id</div>
        <div className="col-2">Cliente</div>
        <div className="col-2">Nutricionista</div>
        <div className="col">Data</div>
        <div className="col">Peso</div>
        <div className="col">Altura</div>
        <div className="col">% Gordura</div>
        <div className="col">Cintura</div>
        <div className="col">Braço</div>
        <div className="col">Ações</div>
      </div>

      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border"></div></div>
        ) : (
          ordenados.map(e => (
            <div key={e.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
              <div className="col-12 col-md mb-1 mb-md-0">#{e.id}</div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">{e.cliente?.nome}</div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">{e.nutricionista?.nome}</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.data && new Date(e.data).toLocaleDateString()}</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.peso} kg</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.altura} m</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.taxa_gordura ? `${e.taxa_gordura} %` : '-'}</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.circunferencia_cintura ? `${e.circunferencia_cintura} cm` : '-'}</div>
              <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{e.circunferencia_braco ? `${e.circunferencia_braco} cm` : '-'}</div>
              <div className="col-12 col-md d-flex justify-content-start gap-2">
                <button className="btn action-btn border-0 py-1 px-2" onClick={() => { setEditId(e.id); setShowModal(true); }}>
                  <i className="bi bi-pencil fs-6"></i>
                </button>
                <button className="btn bg-danger-subtle border-0 py-1 px-2" onClick={() => handleDelete(e.id)}>
                  <i className="bi bi-trash fs-6 text-danger"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AtualizarEstadoModal
        show={showModal}
        estadoId={editId}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); fetchEstados(); }}
      />
    </div>
  );
}
