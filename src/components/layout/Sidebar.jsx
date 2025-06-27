import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logo_icon from '@assets/fitlab-logo-icon.svg';

export default function Sidebar({ collapsed, onToggle, isMobile }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (screenSize === 'tablet' && collapsed) {
        const dropdownElements = document.querySelectorAll('.dropdown-wrapper');
        let clickedOutside = true;
        
        dropdownElements.forEach(element => {
          if (element.contains(event.target)) {
            clickedOutside = false;
          }
        });
        
        if (clickedOutside) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [screenSize, collapsed]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleMouseEnter = (item) => {
    if (screenSize === 'tablet' && collapsed) {
      setHoveredItem(item);
    }
  };

  const handleMouseLeave = () => {
    if (screenSize === 'tablet' && collapsed) {
      setHoveredItem(null);
    }
  };

  if (screenSize === 'mobile') {
    return (
      <>
        {/* Mobile Topbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mobile-topbar">
          <div className="container-fluid px-3">
            <div className="navbar-brand">
              <img src={logo_icon} alt="FitLab Logo" width={40} />
            </div>

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileNav"
              aria-controls="mobileNav"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mobileNav">
              <div className="navbar-nav w-100 mt-3">
                <NavLink to="/dashboard" className="nav-link mobile-nav-link">
                  <i className="bi bi-house me-2"></i>
                  Dashboard
                </NavLink>

                {/* Gestão de Pessoas */}
                <div className="nav-item dropdown">
                  <button
                    className="nav-link mobile-nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-people me-2"></i>
                    Pessoas
                  </button>
                  <ul className="dropdown-menu mobile-dropdown">
                    <li><NavLink to="/clientes" className="dropdown-item">Clientes</NavLink></li>
                    <li><NavLink to="/personal-trainers" className="dropdown-item">Personal Trainers</NavLink></li>
                    <li><NavLink to="/nutricionistas" className="dropdown-item">Nutricionistas</NavLink></li>
                  </ul>
                </div>

                {/* Processos Operacionais */}
                <div className="nav-item dropdown">
                  <button
                    className="nav-link mobile-nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-activity me-2"></i>
                    Operacional
                  </button>
                  <ul className="dropdown-menu mobile-dropdown">
                    <li><NavLink to="/check-ins" className="dropdown-item">Check-In</NavLink></li>
                    <li><NavLink to="/assinaturas" className="dropdown-item">Assinaturas</NavLink></li>
                  </ul>
                </div>

                {/* Produtos e Serviços */}
                <div className="nav-item dropdown">
                  <button
                    className="nav-link mobile-nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-basket me-2"></i>
                    Serviços
                  </button>
                  <ul className="dropdown-menu mobile-dropdown">
                    <li><NavLink to="/planos" className="dropdown-item">Planos</NavLink></li>
                    <li><NavLink to="/dietas" className="dropdown-item">Dietas</NavLink></li>
                    <li><NavLink to="/treinos" className="dropdown-item">Treinos</NavLink></li>
                    <li><NavLink to="/avaliacoes-fisicas" className="dropdown-item">Avaliação Física</NavLink></li>
                  </ul>
                </div>

                {/* Administração */}
                <div className="nav-item dropdown">
                  <button
                    className="nav-link mobile-nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Administração
                  </button>
                  <ul className="dropdown-menu mobile-dropdown">
                    <li><NavLink to="/administradores" className="dropdown-item">Administradores</NavLink></li>
                    <li><NavLink to="/configuracoes" className="dropdown-item">Configurações</NavLink></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <aside
        className={`sidebar-container p-3 ${screenSize === 'tablet' ? 'tablet-sidebar' : ''} ${collapsed ? 'collapsed' : ''}`}
      >
        <div className="sidebar-content rounded-3 px-1 py-4">
          {/* Logo */}
          <div className="sidebar-logo">
            <img src={logo_icon} alt="FitLab Logo" width={screenSize === 'tablet' && collapsed ? 35 : 75} />
          </div>

          {/* Toggle Button for Desktop only */}
          {screenSize === 'desktop' && (
            <button
              className="sidebar-toggle-btn"
              onClick={onToggle}
              aria-label="Toggle sidebar"
            >
              <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>
          )}

          {/* Navigation */}
          <nav className="sidebar-nav">
            {/* Dashboard */}
            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('dashboard')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/dashboard" className="nav-link">
                <i className="bi bi-house"></i>
                {(!collapsed || screenSize !== 'tablet') && <span>Dashboard</span>}
              </NavLink>
              {screenSize === 'tablet' && collapsed && hoveredItem === 'dashboard' && (
                <div className="tooltip-hover">Dashboard</div>
              )}
            </div>

            {/* Gestão de Pessoas */}
            <div
              className="nav-item-wrapper dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('pessoas')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`nav-link dropdown-btn ${activeDropdown === 'pessoas' ? 'active' : ''}`}
                onClick={() => toggleDropdown('pessoas')}
              >
                <i className="bi bi-people"></i>
                {(!collapsed || screenSize !== 'tablet') && (
                  <>
                    <span>Pessoas</span>
                  </>
                )}
              </button>

              {screenSize === 'tablet' && collapsed && hoveredItem === 'pessoas' && (
                <div className="tooltip-hover">Pessoas</div>
              )}

              {/* Dropdown normal para desktop ou dropend para tablet colapsado */}
              {activeDropdown === 'pessoas' && (
                <div className={`dropdown-content ${screenSize === 'tablet' && collapsed ? 'dropend-content' : ''}`}>
                  <NavLink to="/clientes" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Clientes
                  </NavLink>
                  <NavLink to="/personal-trainers" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Personal Trainers
                  </NavLink>
                  <NavLink to="/nutricionistas" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Nutricionistas
                  </NavLink>
                </div>
              )}
            </div>

            {/* Processos Operacionais */}
            <div
              className="nav-item-wrapper dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('operacional')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`nav-link dropdown-btn ${activeDropdown === 'operacional' ? 'active' : ''}`}
                onClick={() => toggleDropdown('operacional')}
              >
                <i className="bi bi-activity"></i>
                {(!collapsed || screenSize !== 'tablet') && (
                  <>
                    <span>Operacional</span>
                  </>
                )}
              </button>

              {screenSize === 'tablet' && collapsed && hoveredItem === 'operacional' && (
                <div className="tooltip-hover">Operacional</div>
              )}

              {activeDropdown === 'operacional' && (
                <div className={`dropdown-content ${screenSize === 'tablet' && collapsed ? 'dropend-content' : ''}`}>
                  <NavLink to="/check-ins" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Check-In
                  </NavLink>
                  <NavLink to="/assinaturas" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Assinaturas
                  </NavLink>
                </div>
              )}
            </div>

            {/* Produtos e Serviços */}
            <div
              className="nav-item-wrapper dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('servicos')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`nav-link dropdown-btn ${activeDropdown === 'servicos' ? 'active' : ''}`}
                onClick={() => toggleDropdown('servicos')}
              >
                <i className="bi bi-basket"></i>
                {(!collapsed || screenSize !== 'tablet') && (
                  <>
                    <span>Serviços</span>
                  </>
                )}
              </button>

              {screenSize === 'tablet' && collapsed && hoveredItem === 'servicos' && (
                <div className="tooltip-hover">Serviços</div>
              )}

              {activeDropdown === 'servicos' && (
                <div className={`dropdown-content ${screenSize === 'tablet' && collapsed ? 'dropend-content' : ''}`}>
                  <NavLink to="/planos" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Planos
                  </NavLink>
                  <NavLink to="/dietas" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Dietas
                  </NavLink>
                  <NavLink to="/treinos" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Treinos
                  </NavLink>
                  <NavLink to="/avaliacoes-fisicas" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Avaliação Física
                  </NavLink>
                </div>
              )}
            </div>

            {/* Administração */}
            <div
              className="nav-item-wrapper dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('admin')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`nav-link dropdown-btn ${activeDropdown === 'admin' ? 'active' : ''}`}
                onClick={() => toggleDropdown('admin')}
              >
                <i className="bi bi-shield-lock"></i>
                {(!collapsed || screenSize !== 'tablet') && (
                  <>
                    <span>Administração</span>
                  </>
                )}
              </button>

              {screenSize === 'tablet' && collapsed && hoveredItem === 'admin' && (
                <div className="tooltip-hover">Administração</div>
              )}

              {activeDropdown === 'admin' && (
                <div className={`dropdown-content ${screenSize === 'tablet' && collapsed ? 'dropend-content' : ''}`}>
                  <NavLink to="/administradores" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Administradores
                  </NavLink>
                  <NavLink to="/configuracoes" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    Configurações
                  </NavLink>
                </div>
              )}
            </div>

            <div className="mt-auto nav-item-wrapper dropdown-wrapper">
              <button
                className="nav-link border p-2 rounded-1 text-light bg-transparent d-flex align-items-center gap-2"
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                {(!collapsed || screenSize !== 'tablet') && (
                  <span className="sidebar-item-text">Sair</span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}