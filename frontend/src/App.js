// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Previsoes from './pages/Monitoramento';
import Abrigos from './pages/Orientacoes';
import Sobre from './pages/Sobre';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* HEADER: Sempre presente em todas as páginas */}
        <Header />
        
        {/* MAIN: Container para o conteúdo das páginas */}
        <main className="main-content">
          <Routes>
            {/* ROTA HOME: Página inicial */}
            <Route path="/" element={<Home />} />
            
            {/* ROTA PREVISÕES: Gráficos e análises */}
            <Route path="/Monitoramento" element={<Previsoes />} />
            
            {/* ROTA ABRIGOS: Lista de abrigos por estado */}
            <Route path="/Orientacoes" element={<Abrigos />} />
            
            {/* ROTA SOBRE: Informações do projeto */}
            <Route path="/sobre" element={<Sobre />} />
            
            {/* ROTA 404: Para URLs que não existem */}
            <Route path="*" element={
              <div className="page-not-found">
                <div className="gsx-container">
                  <div className="error-content">
                    <h1>404 - Página não encontrada</h1>
                    <p>A página que você procura não existe.</p>
                    <a href="/" className="gsx-button gsx-button-primary">
                      Voltar ao Início
                    </a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        {/* FOOTER: Informações básicas */}
        <footer className="app-footer">
          <div className="gsx-container">
            <div className="footer-content">
              <p>&copy; 2025 GSX Alerta Tabajara - Sistema de Emergência Simulado</p>
              <p>Projeto Acadêmico FIAP Global Solutions</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;