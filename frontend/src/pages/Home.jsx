import React from 'react';


// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  // ESTADOS: Gerenciamento de dados da página
  const [dadosEstados, setDadosEstados] = useState([]);
  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [alertasAtivos, setAlertasAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // EFFECT: Carrega todos os dados quando página abre
  useEffect(() => {
    console.log('🔄 useEffect executando...');
    carregarTodosDados();
  }, []);

  // FUNÇÃO: Carrega dados de múltiplas fontes
  const carregarTodosDados = async () => {
    try {
      setCarregando(true);
      setErro(null);

      // BUSCA PARALELA: Todos os JSONs ao mesmo tempo
      const [estadosRes, dashboardRes, alertasRes] = await Promise.all([
        fetch('/data/dados_estados.json'),
        fetch('/data/dashboard_data.json'),
        fetch('/data/alertas_ativos.json')
      ]);

      // PARSE: Converte responses para JSON
      const estados = await estadosRes.json();
      const dashboard = await dashboardRes.json();
      const alertas = await alertasRes.json();

      // ATUALIZAÇÕES: Atualiza todos os estados
      setDadosEstados(estados);
      setDadosDashboard(dashboard);
      setAlertasAtivos(alertas.alertas || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Falha ao carregar dados. Verifique a conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // FUNÇÃO: Obtém emoji baseado no nível de risco
  const obterEmojiRisco = (nivel) => {
    const emojis = {
      'VERDE': '🟢',
      'AMARELO': '🟡',
      'LARANJA': '🟠',
      'VERMELHO': '🔴'
    };
    return emojis[nivel] || '⚪';
  };

  // FUNÇÃO: Obtém emoji para tipo de emergência
  const obterEmojiEmergencia = (tipo) => {
    const emojis = {
      'incendio': '🔥',
      'enchente': '🌊',
      'tsunami': '🌊'
    };
    return emojis[tipo] || '⚠️';
  };

  // LOADING: Enquanto carrega dados
  if (carregando) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dados em tempo real...</div>
        </div>
      </div>
    );
  }

  // ERROR: Se deu erro ao carregar
  if (erro) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Erro no Sistema</h2>
          <p>{erro}</p>
          <button 
            className="gsx-button gsx-button-primary"
            onClick={carregarTodosDados}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home page-enter">
      <div className="page-container">
        
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Sistema de Alertas de Emergência</h1>
            <p>Monitoramento em tempo real dos estados costeiros brasileiros</p>
            
            {/* ESTATÍSTICAS RÁPIDAS */}
            {dadosDashboard && (
              <div className="stats-quick">
                <div className="stat-item">
                  <span className="stat-number">{dadosDashboard.resumo_geral.total_estados}</span>
                  <span className="stat-label">Estados Monitorados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{dadosDashboard.resumo_geral.estados_alerta}</span>
                  <span className="stat-label">Em Alerta</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{dadosDashboard.alertas_ativos}</span>
                  <span className="stat-label">Alertas Ativos</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ALERTAS CRÍTICOS */}
        {alertasAtivos.length > 0 && (
          <section className="alertas-criticos">
            <h2>🚨 Alertas Ativos</h2>
            <div className="alertas-grid">
              {alertasAtivos.map(alerta => (
                <div key={alerta.id} className={`alerta-card alert-${alerta.nivel.toLowerCase()}`}>
                  <div className="alerta-header">
                    <span className="alerta-icon">{alerta.icone}</span>
                    <span className="alerta-estado">{alerta.estado}</span>
                    <span className={`alerta-nivel nivel-${alerta.nivel.toLowerCase()}`}>
                      {alerta.nivel}
                    </span>
                  </div>
                  <h3>{alerta.titulo}</h3>
                  <p>{alerta.resumo}</p>
                  <div className="alerta-actions">
                    <button className="gsx-button gsx-button-primary">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MAPA DE ESTADOS */}
        <section className="estados-overview">
          <h2>Status por Estado</h2>
          <div className="estados-grid">
            {dadosEstados.map(estado => (
              <div 
                key={estado.sigla} 
                className={`estado-card risco-${estado.risco_geral.toLowerCase()}`}
              >
                <div className="estado-header">
                  <h3>{estado.sigla}</h3>
                  <span className="risco-emoji">
                    {obterEmojiRisco(estado.risco_geral)}
                  </span>
                </div>
                
                <div className="estado-status">
                  <div className="status-text">{estado.resumo_status}</div>
                  <div className={`nivel-badge nivel-${estado.risco_geral.toLowerCase()}`}>
                    {estado.risco_geral}
                  </div>
                </div>

                {/* TIPOS DE RISCO */}
                <div className="riscos-detalhes">
                  <div className="risco-item">
                    <span className="risco-icon">🔥</span>
                    <span className="risco-info">
                      <span className="risco-tipo">Incêndio</span>
                      <span className={`risco-nivel nivel-${estado.niveis.incendio.toLowerCase()}`}>
                        {estado.niveis.incendio}
                      </span>
                    </span>
                  </div>
                  
                  <div className="risco-item">
                    <span className="risco-icon">🌊</span>
                    <span className="risco-info">
                      <span className="risco-tipo">Enchente</span>
                      <span className={`risco-nivel nivel-${estado.niveis.enchente.toLowerCase()}`}>
                        {estado.niveis.enchente}
                      </span>
                    </span>
                  </div>
                  
                  <div className="risco-item">
                    <span className="risco-icon">🌊</span>
                    <span className="risco-info">
                      <span className="risco-tipo">Tsunami</span>
                      <span className={`risco-nivel nivel-${estado.niveis.tsunami.toLowerCase()}`}>
                        {estado.niveis.tsunami}
                      </span>
                    </span>
                  </div>
                </div>

                {/* EMERGÊNCIA DOMINANTE */}
                {estado.risco_dominante && (
                  <div className="emergencia-dominante">
                    <span className="emergencia-icon">
                      {obterEmojiEmergencia(estado.risco_dominante)}
                    </span>
                    <span className="emergencia-texto">
                      Principal: {estado.risco_dominante.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="estado-actions">
                  <button className="gsx-button gsx-button-secondary">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESUMO DASHBOARD */}
        {dadosDashboard && (
          <section className="dashboard-resumo">
            <h2>Resumo do Sistema</h2>
            <div className="resumo-grid">
              
              {/* DISTRIBUIÇÃO POR NÍVEL */}
              <div className="gsx-card">
                <h3>Distribuição por Nível</h3>
                <div className="distribuicao-niveis">
                  {Object.entries(dadosDashboard.distribuicao_niveis).map(([nivel, count]) => (
                    <div key={nivel} className="nivel-stat">
                      <span className="nivel-emoji">{obterEmojiRisco(nivel)}</span>
                      <span className="nivel-nome">{nivel}</span>
                      <span className="nivel-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPOS DE EMERGÊNCIA */}
              <div className="gsx-card">
                <h3>Tipos de Emergência</h3>
                <div className="tipos-emergencia">
                  {Object.entries(dadosDashboard.distribuicao_tipos).map(([tipo, count]) => (
                    <div key={tipo} className="tipo-stat">
                      <span className="tipo-emoji">{obterEmojiEmergencia(tipo)}</span>
                      <span className="tipo-nome">{tipo.toUpperCase()}</span>
                      <span className="tipo-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATUS SISTEMA */}
              <div className="gsx-card">
                <h3>Status do Sistema</h3>
                <div className="sistema-info">
                  <div className="sistema-status online">
                    <span className="status-dot"></span>
                    <span>{dadosDashboard.status_sistema}</span>
                  </div>
                  <div className="ultima-atualizacao">
                    <small>Última atualização: {dadosDashboard.timestamp}</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;