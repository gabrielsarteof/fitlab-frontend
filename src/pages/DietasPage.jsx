import React, { useEffect, useState, useRef } from 'react';
import api from '../api'; // cliente HTTP centralizado
import { toast, Toaster } from 'react-hot-toast';
import CriarDietaModal from '@components/modals/CriarDietaModal';
import SearchInput from '../components/common/SearchInput';

const OBJETIVO_DIETA = [
    'Ganho de massa',
    'Emagrecimento',
    'Definição muscular',
    'Aumento de energia',
    'Saúde geral',
    'Reeducação alimentar',
    'Vegetariana',
    'Vegana',
];

export default function DietasPage() {
    const [dietas, setDietas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const [tipoSelecionado, setTipoSelecionado] = useState('');
    const [showTipoDropdown, setShowTipoDropdown] = useState(false);
    const tipoDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (tipoDropdownRef.current && !tipoDropdownRef.current.contains(event.target)) {
                setShowTipoDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchDietas = () => {
        setLoading(true);
        api.get('/dietas')
            .then(({ data }) => setDietas(data))
            .catch(err => toast.error(err.response?.data?.message || 'Erro ao buscar dietas'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDietas();
    }, []);

    const filtrados = dietas.filter(d => {
        const buscaMatch =
            d.descricao.toLowerCase().includes(busca.toLowerCase()) ||
            d.cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
            d.nutricionista?.nome.toLowerCase().includes(busca.toLowerCase());

        if (tipoSelecionado) {
            return d.descricao?.toLowerCase().includes(tipoSelecionado.toLowerCase());
        }
        return buscaMatch;
    });

    const ordenados = [...filtrados].sort((a, b) => {
        if (sortKey === 'descricao-asc') return a.descricao.localeCompare(b.descricao);
        if (sortKey === 'descricao-desc') return b.descricao.localeCompare(a.descricao);
        if (sortKey === 'expires_at') return new Date(a.expires_at) - new Date(b.expires_at);
        return 0;
    });

    const handleDelete = id => {
        if (!window.confirm('Confirma exclusão desta dieta?')) return;
        api.delete(`/dietas/${id}`)
            .then(() => {
                toast.success('Dieta excluída');
                fetchDietas();
            })
            .catch(err => toast.error(err.response?.data?.message || 'Erro ao excluir dieta'));
    };

    const filtros = [
        {
            nome: 'Todas as dietas',
            ativo: !tipoSelecionado,
            onClick: () => setTipoSelecionado(''),
        },
        {
            nome: 'Objetivo',
            ativo: !!tipoSelecionado,
            onClick: () => setShowTipoDropdown(v => !v),
            isDropdown: true,
        },
    ];

    return (
        <div className="bg-white py-4 px-3 px-md-4">
            <Toaster position="top-right" />

            <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div>
                    <h3 className="mb-1 fw-bold">Dietas</h3>
                    <small className="text-muted">{ordenados.length} resultados</small>
                </div>
                <button
                    className="btn btn-primary btn-sm d-flex align-items-center text-nowrap py-2 px-3"
                    onClick={() => { setEditId(null); setShowModal(true); }}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Nova Dieta
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
                        <li><button className="dropdown-item" onClick={() => setSortKey('descricao-asc')}>Descrição A-Z</button></li>
                        <li><button className="dropdown-item" onClick={() => setSortKey('descricao-desc')}>Descrição Z-A</button></li>
                        <li><button className="dropdown-item" onClick={() => setSortKey('expires_at')}>Vencimento</button></li>
                    </ul>
                </div>
            </div>

            <div className="d-flex align-items-center gap-4 mb-4" style={{ fontSize: 16, fontWeight: 500 }}>
                {filtros.map((filtro, idx) => (
                    <div key={filtro.nome} className="position-relative" ref={filtro.isDropdown ? tipoDropdownRef : null}>
                        <button
                            type="button"
                            className="bg-transparent border-0 p-0 m-0"
                            style={{
                                color: filtro.ativo ? '#111' : '#b8b8b8',
                                fontWeight: filtro.ativo ? 700 : 500,
                                opacity: filtro.ativo ? 1 : 0.7,
                                borderBottom: filtro.ativo ? '2px solid #3578e5' : '2px solid transparent',
                                outline: 'none',
                                cursor: filtro.isDropdown ? 'pointer' : filtro.ativo ? 'default' : 'pointer',
                                marginRight: idx !== filtros.length - 1 ? '24px' : 0,
                                background: 'none',
                            }}
                            onClick={filtro.onClick}
                            disabled={filtro.ativo && !filtro.isDropdown}
                        >
                            {filtro.nome}
                            {filtro.isDropdown && tipoSelecionado && (
                                <span className="ms-2 small text-primary" style={{ fontWeight: 400 }}>
                                    {tipoSelecionado}
                                    <i className="bi bi-x ms-1" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setTipoSelecionado(''); }}></i>
                                </span>
                            )}
                        </button>

                        {filtro.isDropdown && showTipoDropdown && (
                            <div
                                className="shadow rounded-3 bg-white mt-2 position-absolute"
                                style={{ minWidth: 180, zIndex: 10, left: 0, top: 30 }}
                            >
                                {OBJETIVO_DIETA.map(tipo => (
                                    <button
                                        key={tipo}
                                        className="dropdown-item py-2 px-3"
                                        style={{ fontWeight: tipoSelecionado === tipo ? 700 : 400, color: tipoSelecionado === tipo ? '#3578e5' : '#222' }}
                                        onClick={() => { setTipoSelecionado(tipo); setShowTipoDropdown(false); }}
                                    >
                                        {tipo}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="d-flex flex-column">
                <div className="d-none d-md-flex bg-light rounded-1 py-2 px-3 fw-bold">
                    <div className="col">ID</div>
                    <div className="col-3">Objetivo</div>
                    <div className="col">Criação</div>
                    <div className="col">Vencimento</div>
                    <div className="col">Cliente</div>
                    <div className="col">Nutricionista</div>
                    <div className="col-1">Ações</div>
                </div>

                <div className="mt-3 d-flex flex-column gap-3">
                    {loading && (
                        <div className="text-center py-5"><div className="spinner-border"></div></div>
                    )}
                    {!loading && ordenados.map(d => (
                        <div key={d.id} className="d-flex flex-column flex-md-row border border-light rounded-1 bg-white py-2 px-3">
                            <div className="col-12 col-md mb-1 mb-md-0">#{d.id}</div>
                            <div className="col-12 col-md-3 fw-bold mb-1 mb-md-0 text-truncate">{d.descricao}</div>
                            <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{new Date(d.created_at).toLocaleDateString()}</div>
                            <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{new Date(d.expires_at).toLocaleDateString()}</div>
                            <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{d.cliente?.nome}</div>
                            <div className="col-12 col-md mb-1 mb-md-0 text-truncate">{d.nutricionista?.nome}</div>
                            <div className="col-12 col-md-1 d-flex justify-content-start gap-2">
                                <button className="btn action-btn border-0 py-1 px-2" onClick={() => { setEditId(d.id); setShowModal(true); }}>
                                    <i className="bi bi-pencil fs-6"></i>
                                </button>
                                <button className="btn bg-danger-subtle border-0 py-1 px-2" onClick={() => handleDelete(d.id)}>
                                    <i className="bi bi-trash fs-6 text-danger"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CriarDietaModal
                show={showModal}
                dietaId={editId}
                onClose={() => setShowModal(false)}
                onSaved={() => { setShowModal(false); fetchDietas(); }}
            />
        </div>
    );
}
