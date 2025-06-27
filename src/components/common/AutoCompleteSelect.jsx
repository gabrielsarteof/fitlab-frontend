import React, { useEffect, useState } from 'react'

export default function AutocompleteSelect({
  value,
  options,
  onChange,
  icon = true,
  error,
  placeholder = '',
  disabled
}) {
  const [query, setQuery] = useState('')
  const [show, setShow] = useState(false)
  
  const filtered = options.filter(o =>
    o.nome.toLowerCase().includes(query.toLowerCase())
  )
  
  const selectedOption = options.find(o => o.id === value)
  const displayValue = selectedOption ? selectedOption.nome : query

  useEffect(() => { 
    if (!show) {
      // Se há um valor selecionado, mostra o nome, senão limpa
      if (selectedOption) {
        setQuery(selectedOption.nome)
      } else {
        setQuery('')
      }
    }
  }, [show, selectedOption])

  // Quando o valor muda externamente, atualiza a query
  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.nome)
    } else if (value === '' || value === null || value === undefined) {
      setQuery('')
    }
  }, [value, selectedOption])

  const handleInputChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // Se o usuário está digitando e não corresponde exatamente a um item selecionado,
    // limpa a seleção apenas se necessário
    if (selectedOption && newQuery !== selectedOption.nome) {
      onChange('')
    }
  }

  const handleOptionSelect = (optionId) => {
    const option = options.find(o => o.id === optionId)
    if (option) {
      setQuery(option.nome)
      onChange(optionId)
      setShow(false)
    }
  }

  return (
    <div className="mb-3 position-relative">
      <div className="input-icon-left position-relative">
        {icon && (
          <span className="input-icon">
            <i className="bi bi-search"></i>
          </span>
        )}
        <input
          type="text"
          className={`form-control${error ? ' is-invalid' : ''}`}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setShow(true)}
          onBlur={() => setTimeout(() => setShow(false), 150)}
          autoComplete="off"
          disabled={disabled}
          style={icon ? { paddingLeft: '2.2rem' } : undefined}
        />
      </div>
      {show && (
        <div className="position-absolute bg-white rounded-1 p-3 w-100 shadow z-10"
          style={{ maxHeight: 180, overflowY: 'auto', zIndex: 99 }}>
          {filtered.length === 0 && <div className="p-2 text-muted">Nenhum resultado</div>}
          {filtered.map(opt => (
            <div
              key={opt.id}
              className="p-2 hover-bg-light"
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              onMouseDown={() => handleOptionSelect(opt.id)}
            >
              <span className="fw-semibold">{opt.nome}</span>
            </div>
          ))}
        </div>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}

      {/* CSS inline para o ícone dentro do input */}
      <style>{`
        .input-icon-left .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #adb5bd;
          pointer-events: none;
          font-size: 1.15rem;
        }
        .input-icon-left input.form-control:focus {
          border-color: #5488d1 !important;
          box-shadow: 0 0 0 0.1rem rgba(84,136,209,.18) !important;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  )
}