// src/pages/ClientesPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';                      // cliente Axios centralizado
import { toast, Toaster } from 'react-hot-toast';
import CriarClienteModal from '@components/modals/CriarClienteModal';
import SearchInput from '../components/common/SearchInput';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchClientes = () => {
    setLoading(true);
    api
      .get('/clientes')
      .then(({ data }) => setClientes(data))
      .catch(err =>
        toast.error(err.response?.data?.message || 'Erro ao buscar clientes')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = id => {
    if (!window.confirm('Confirma exclusão deste cliente?')) return;
    api
      .delete(`/clientes/${id}`)
      .then(() => {
        toast.success('Cliente excluído com sucesso!');
        fetchClientes();
      })
      .catch(err =>
        toast.error(err.response?.data?.message || 'Erro ao excluir cliente')
      );
  };

  // filtro de busca
  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLowerCase())
  );

  // ordenação
  const ordenados = [...filtrados].sort((a, b) => {
    if (sortKey === 'nome-asc') return a.nome.localeCompare(b.nome);
    if (sortKey === 'nome-desc') return b.nome.localeCompare(a.nome);
    if (sortKey === 'nascimento')
      return new Date(a.data_nascimento) - new Date(b.data_nascimento);
    return 0;
  });

  return (
    <div className="bg-white py-4 px-3 px-md-4">
      <Toaster position="top-right" />

      {/* Cabeçalho e botão de Novo */}
      <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          <h3 className="mb-1 fw-bold">Clientes</h3>
          <small className="text-muted">{ordenados.length} resultados</small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-1" />
          Novo Cliente
        </button>
      </div>

      {/* Filtros de busca e ordenação */}
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 mb-4">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Pesquisar cliente..."
        />
        <div className="dropdown ms-md-auto">
          <button
            className="btn btn-light btn-sm dropdown-toggle py-2 px-3"
            type="button"
            data-bs-toggle="dropdown"
          >
            Ordenar
          </button>
          <ul className="dropdown-menu dropdown-menu-end rounded-1 border-0 shadow">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortKey('nome-asc')}
              >
                Nome A-Z
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortKey('nome-desc')}
              >
                Nome Z-A
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortKey('nascimento')}
              >
                Data de Nascimento
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Cabeçalho da lista em desktop */}
      <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
        <div className="col-1">Id</div>
        <div className="col-3">Nome</div>
        <div className="col-3">Email</div>
        <div className="col-2">Telefone</div>
        <div className="col-2">Nascimento</div>
        <div className="col-1">Ações</div>
      </div>

      {/* Lista de clientes */}
      <div className="mt-3 d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
          </div>
        ) : (
          ordenados.map(c => (
            <div
              key={c.id}
              className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3"
            >
              <div className="col-12 col-md-1 mb-1 mb-md-0">#{c.id}</div>
              <div className="col-12 col-md-3 fw-bold mb-1 mb-md-0 text-truncate">
                {c.nome}
              </div>
              <div className="col-12 col-md-3 mb-1 mb-md-0 text-truncate">
                {c.email}
              </div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">
                {c.telefone}
              </div>
              <div className="col-12 col-md-2 mb-1 mb-md-0 text-truncate">
                {new Date(c.data_nascimento).toLocaleDateString()}
              </div>
              <div className="col-12 col-md-1 d-flex justify-content-start gap-2">
                <button
                  className="btn action-btn border-0 py-1 px-2"
                  onClick={() => {
                    setEditId(c.id);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil fs-6" />
                </button>
                <button
                  className="btn bg-danger-subtle border-0 py-1 px-2"
                  onClick={() => handleDelete(c.id)}
                >
                  <i className="bi bi-trash fs-6 text-danger" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de criar/editar cliente */}
      <CriarClienteModal
        show={showModal}
        clienteId={editId}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          setShowModal(false);
          fetchClientes();
        }}
      />
    </div>
  );
}
