import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * SearchInput genérico para filtros e sugestões com portal
 * Garante que o dropdown fique sempre acima de outros elementos usando React Portal
 *
 * Props:
 * - value: string
 * - onChange: (q: string) => void
 * - placeholder?: string
 * - items?: Array<{ id: string|number; label: string }>
 * - onSelect?: (item: { id: string|number; label: string }) => void
 */
export default function SearchInput({ value, onChange, placeholder = '', items = [], onSelect }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);

  // Filtra itens conforme valor
  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(value.toLowerCase())
  );

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mede posição do input quando abrir
  useLayoutEffect(() => {
    if (show && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [show]);

  const handleInput = e => {
    onChange(e.target.value);
    if (items.length) setShow(true);
  };
  const handleSelect = item => {
    onSelect?.(item);
    setShow(false);
  };

  // Dropdown via portal para document.body
  const dropdown = show && items.length > 0 && createPortal(
    <div
      className="position-absolute bg-white rounded-1 p-3 shadow"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: coords.width,
        maxHeight: 200,
        overflowY: 'auto',
        zIndex: 9999
      }}
    >
      {filtered.length === 0 ? (
        <div className="p-2 text-muted">Nenhum resultado</div>
      ) : (
        filtered.map(item => (
          <div
            key={item.id}
            className="p-2 hover-bg-light"
            style={{ cursor: 'pointer' }}
            onMouseDown={() => handleSelect(item)}
          >
            {item.label}
          </div>
        ))
      )}
    </div>,
    document.body
  );

  return (
    <>
      <div
        className="position-relative w-100"
        ref={wrapperRef}
        style={{ zIndex: 1 }}
      >
        <span
          className="position-absolute top-50 start-0 translate-middle-y text-muted"
          style={{ paddingLeft: '0.75rem', pointerEvents: 'none' }}
        >
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control w-100 border-0 shadow-none bg-light rounded-pill"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onFocus={() => items.length && setShow(true)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>
      {dropdown}
    </>
  );
}
