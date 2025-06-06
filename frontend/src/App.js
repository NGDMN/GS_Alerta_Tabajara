// src/App.js - ARQUITETURA FINAL COMPLETA
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import PopupEmergencia from './components/PopupEmergencia';
import Home from './pages/Home';
import Monitoramento from './pages/Monitoramento';
import Orientacoes from './pages/Orientacoes';
import Sobre from './pages/Sobre';
import './App.css';

function App() {
  // ===== ESTADO GLOBAL =====
  const [dadosEstados, setDadosEstados] = useState([]);
  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [alertasAtivos, setAlertasAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  // ===== SISTEMA DE POPUP =====
  const [popupAtivo, setPopupAtivo] = useState(null);
  const [alertasJaVistos, setAlertasJaVistos] = useState(new Set());
  
  // ===== CACHE SYSTEM =====
  const [ultimoFetch, setUltimoFetch] = useState(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  // ===== PRIMEIRA CARGA =====
  useEffect(() => {
    carregarDadosIniciais();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencional: queremos executar apenas uma vez
  
  // ===== POLLING SYSTEM =====
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Verificando atualizações...');
      verificarAtualizacoes();
    }, CACHE_DURATION);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []); // Intencional: configurar polling apenas uma vez
  
  // ===== FUNÇÃO: CARREGAMENTO INICIAL =====
  const carregarDadosIniciais = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      console.log('📡 Carregando dados iniciais...');
      
      const [estadosRes, dashboardRes, alertasRes] = await Promise.all([
        fetch('/data/dados_estados.json'),
        fetch('/data/dashboard_data.json'),
        fetch('/data/alertas_ativos.json')
      ]);
      
      // Verificar se todas as respostas são válidas
      if (!estadosRes.ok || !dashboardRes.ok || !alertasRes.ok) {
        throw new Error('Falha ao carregar dados do servidor');
      }
      
      const estados = await estadosRes.json();
      const dashboard = await dashboardRes.json();
      const alertas = await alertasRes.json();
      
      setDadosEstados(estados);
      setDadosDashboard(dashboard);
      setAlertasAtivos(alertas.alertas || []);
      setUltimoFetch(Date.now());
      
      // Verificar se há alertas críticos
      processarAlertasCriticos(alertas.alertas || []);
      
      console.log('✅ Dados carregados com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setErro('Falha ao carregar dados. Verificando conexão...');
    } finally {
      setCarregando(false);
    }
  };
  
  // ===== FUNÇÃO: VERIFICAR ATUALIZAÇÕES =====
  const verificarAtualizacoes = async () => {
    try {
      // Verificar se cache ainda é válido
      const cacheValido = (Date.now() - ultimoFetch) < CACHE_DURATION;
      
      if (cacheValido) {
        console.log('📦 Usando dados do cache');
        return;
      }
      
      console.log('🔄 Cache expirado, buscando atualizações...');
      
      // Buscar apenas alertas (dados que mudam mais frequentemente)
      const alertasRes = await fetch('/data/alertas_ativos.json');
      
      if (!alertasRes.ok) {
        throw new Error('Falha ao verificar atualizações');
      }
      
      const alertas = await alertasRes.json();
      const novosAlertas = alertas.alertas || [];
      
      // Verificar se há alertas novos
      const alertasNovos = novosAlertas.filter(
        alerta => !alertasJaVistos.has(alerta.id)
      );
      
      if (alertasNovos.length > 0) {
        console.log('🚨 Novos alertas detectados:', alertasNovos.length);
        setAlertasAtivos(novosAlertas);
        processarAlertasCriticos(alertasNovos);
      }
      
      setUltimoFetch(Date.now());
      
    } catch (error) {
      console.error('⚠️ Erro ao verificar atualizações:', error);
      // Não quebra a aplicação, apenas log do erro
    }
  };
  
  // ===== FUNÇÃO: PROCESSAR ALERTAS CRÍTICOS =====
  const processarAlertasCriticos = (alertas) => {
    // Encontrar alertas VERMELHOS que ainda não foram vistos
    const alertasCriticos = alertas.filter(alerta => 
      alerta.nivel === 'VERMELHO' && !alertasJaVistos.has(alerta.id)
    );
    
    if (alertasCriticos.length > 0) {
      // Mostrar popup para o primeiro alerta crítico
      const alertaPrioritario = alertasCriticos[0];
      
      console.log('🚨 ALERTA CRÍTICO DETECTADO:', alertaPrioritario);
      
      setPopupAtivo(alertaPrioritario);
    }
  };
  
  // ===== FUNÇÃO: CONFIRMAR LEITURA DO POPUP =====
  const confirmarLeituraPopup = (alertaId) => {
    console.log('✅ Usuário confirmou leitura do alerta:', alertaId);
    
    // Marcar como visto
    setAlertasJaVistos(prev => new Set([...prev, alertaId]));
    
    // Fechar popup
    setPopupAtivo(null);
  };
  
  // ===== FUNÇÃO: NAVEGAR PARA ORIENTAÇÕES =====
  const navegarParaOrientacoes = (tipoAlerta, alertaId) => {
    console.log('🧭 Navegando para orientações:', tipoAlerta);
    
    // Marcar como visto
    confirmarLeituraPopup(alertaId);
    
    // Navegar programaticamente
    window.location.href = `/orientacoes?tipo=${tipoAlerta}&alerta=${alertaId}`;
  };
  
  // ===== FUNÇÃO: RETRY MANUAL =====
  const tentarNovamente = () => {
    console.log('🔄 Tentativa manual de recarregamento');
    carregarDadosIniciais();
  };
  
  // ===== RENDER CONDICIONAL: LOADING =====
  if (carregando) {
    return (
      <div className="App">
        <div className="loading-global">
          <div className="loading-spinner"></div>
          <h2>Carregando Sistema de Alertas...</h2>
          <p>Verificando condições meteorológicas</p>
        </div>
      </div>
    );
  }
  
  // ===== RENDER CONDICIONAL: ERRO =====
  if (erro) {
    return (
      <div className="App">
        <div className="error-global">
          <h2>⚠️ Sistema Temporariamente Indisponível</h2>
          <p>{erro}</p>
          <button 
            className="gsx-button gsx-button-primary"
            onClick={tentarNovamente}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  
  // ===== RENDER PRINCIPAL =====
  return (
    <Router>
      <div className="App">
        
        {/* POPUP GLOBAL DE EMERGÊNCIA */}
        {popupAtivo && (
          <PopupEmergencia 
            alerta={popupAtivo}
            onConfirmarLeitura={confirmarLeituraPopup}
            onNavegar={navegarParaOrientacoes}
          />
        )}
        
        {/* HEADER SEMPRE PRESENTE */}
        <Header 
          alertasAtivos={alertasAtivos}
          sistemOnline={!erro}
        />
        
        {/* MAIN CONTENT - ROTAS */}
        <main className="main-content">
          <Routes>
            
            {/* HOME: Apresentação do projeto */}
            <Route 
              path="/" 
              element={<Home />} 
            />
            
            {/* MONITORAMENTO: Dashboard com dados */}
            <Route 
              path="/monitoramento" 
              element={
                <Monitoramento 
                  dadosEstados={dadosEstados}
                  dadosDashboard={dadosDashboard}
                  alertasAtivos={alertasAtivos}
                />
              } 
            />
            
            {/* ORIENTAÇÕES: Carrossel + mapa */}
            <Route 
              path="/orientacoes" 
              element={
                <Orientacoes 
                  alertaAtivo={popupAtivo}
                  alertasAtivos={alertasAtivos}
                />
              } 
            />
            
            {/* SOBRE: Documentação do projeto */}
            <Route 
              path="/sobre" 
              element={<Sobre />} 
            />
            
            {/* 404: Página não encontrada */}
            <Route 
              path="*" 
              element={
                <div className="page-not-found">
                  <div className="gsx-container">
                    <h1>404 - Página não encontrada</h1>
                    <p>A página que você procura não existe no sistema.</p>
                    <a href="/" className="gsx-button gsx-button-primary">
                      🏠 Voltar ao Início
                    </a>
                  </div>
                </div>
              } 
            />
            
          </Routes>
        </main>
        
        {/* FOOTER */}
        <footer className="app-footer">
          <div className="gsx-container">
            <div className="footer-content">
              <p>&copy; 2025 GSX Alerta Tabajara - Sistema de Emergência Simulado</p>
              <p>
                Última atualização: {new Date(ultimoFetch).toLocaleString('pt-BR')}
                {alertasAtivos.length > 0 && (
                  <span className="footer-alertas">
                    • {alertasAtivos.length} alerta(s) ativo(s)
                  </span>
                )}
              </p>
            </div>
          </div>
        </footer>
        
      </div>
    </Router>
  );
}

export default App;