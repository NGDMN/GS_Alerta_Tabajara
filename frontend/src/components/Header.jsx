// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  // CONCEITO CRÍTICO: useLocation nos diz qual página estamos
  const location = useLocation();
  
  // Função que determina se um link está ativo
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="gsx-container">
        <div className="header-content">
          
          {/* LOGO - Sempre usa identidade GSX */}
          <div className="logo">
            <Link to="/" className="logo-link">
              <h1>GSX <span className="highlight">Alerta Tabajara</span></h1>
              <span className="tagline">Sistema de Emergência</span>
            </Link>
          </div>
          
          {/* NAVEGAÇÃO - Links inteligentes que sabem se estão ativos */}
          <nav className="navigation">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
            
            <Link 
              to="/Monitoramento" 
              className={`nav-link ${isActiveLink('/Monitoramento') ? 'active' : ''}`}
            >
              📊 Previsões
            </Link>
            
            <Link 
              to="/Orientações" 
              className={`nav-link ${isActiveLink('/Orientacoes') ? 'active' : ''}`}
            >
              🏥 Abrigos
            </Link>
            
            <Link 
              to="/sobre" 
              className={`nav-link ${isActiveLink('/sobre') ? 'active' : ''}`}
            >
              ℹ️ Sobre
            </Link>
          </nav>
          
          {/* STATUS DO SISTEMA - Mostra se está operacional */}
          <div className="system-status">
            <div className="status-indicator online">
              <span className="status-dot"></span>
              <span className="status-text">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;