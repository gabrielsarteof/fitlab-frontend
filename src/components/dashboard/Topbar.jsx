import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '@components/common/SearchInput'; // Componente de input de pesquisa

// Lista de páginas disponíveis no sistema
const PAGES = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Administradores', path: '/administradores' },
  { name: 'Clientes', path: '/clientes' },
  { name: 'Assinaturas', path: '/assinaturas' },
  { name: 'Dietas', path: '/dietas' },
  { name: 'Treinos', path: '/treinos' },
  { name: 'Avaliações Físicas', path: '/avaliacoes-fisicas' },
  { name: 'Planos', path: '/planos' },
  { name: 'Personal Trainers', path: '/personal-trainers' },
  { name: 'Nutricionistas', path: '/nutricionistas' },
  { name: 'Check-ins', path: '/check-ins' },
];

export default function Topbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Filtra páginas conforme o query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
    } else {
      const q = query.toLowerCase();
      setResults(
        PAGES.filter(p => p.name.toLowerCase().includes(q))
      );
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (path) => {
    setQuery('');
    setShow(false);
    navigate(path);
  };

  return (
    <header className="position-relative d-flex align-items-center py-3" style={{ height: '64px' }} ref={wrapperRef}>
      <SearchInput
        value={query}
        onChange={setQuery}
        items={PAGES.map(p => ({ id: p.path, label: p.name }))}
        onSelect={item => navigate(item.id)}
        placeholder="Pesquisar páginas..."
      />

      {show && results.length > 0 && (
        <ul className="list-group position-absolute bg-white shadow-sm rounded mt-1 w-100" style={{ top: '64px', zIndex: 1000 }}>
          {results.map(p => (
            <li
              key={p.path}
              className="list-group-item list-group-item-action"
              onMouseDown={() => handleSelect(p.path)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
