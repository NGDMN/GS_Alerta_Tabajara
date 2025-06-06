// src/pages/Monitoramento.jsx
import React, { useState, useEffect } from 'react';
import './Monitoramento.css';

function Monitoramento({ onSimularEmergencia }) {
  // ===== ESTADOS: Gerenciamento de dados da página =====
  const [dadosEstados, setDadosEstados] = useState([]);
  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [alertasAtivos, setAlertasAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // ===== EFFECT: Carrega dados quando página abre =====
  useEffect(() => {
    console.log('📊 Carregando dados do monitoramento...');
    carregarTodosDados();
  }, []);

  // ===== FUNÇÃO: Carrega dados de múltiplas fontes =====
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

      // VALIDAÇÃO: Verifica se requests foram bem-sucedidos
      if (!estadosRes.ok || !dashboardRes.ok || !alertasRes.ok) {
        throw new Error('Falha ao conectar com servidor de dados');
      }

      // PARSE: Converte responses para JSON
      const estados = await estadosRes.json();
      const dashboard = await dashboardRes.json();
      const alertas = await alertasRes.json();

      // ATUALIZAÇÕES: Atualiza todos os estados
      setDadosEstados(estados);
      setDadosDashboard(dashboard);
      setAlertasAtivos(alertas.alertas || []);
      
      console.log('✅ Dados carregados com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setErro('Sistema temporariamente indisponível. Tente novamente em alguns instantes.');
    } finally {
      setCarregando(false);
    }
  };

  // ===== FUNÇÃO: Simular emergência melhorada =====
  const simularEmergencia = async () => {
    console.log('🚨 Simulando emergência para demonstração...');
    
    try {
      // Criar dados de emergência realistas
      const emergenciaSimulada = {
        id: 'DEMO_' + Date.now(),
        estado: 'RJ',
        tipo_principal: 'incendio',
        nivel: 'VERMELHO',
        titulo: '🔥 EMERGÊNCIA DE INCÊNDIO',
        resumo: 'Condições críticas detectadas no Rio de Janeiro - Temperatura extrema + vento forte + baixa umidade',
        instrucoes: [
          'Mantenha-se longe de áreas com vegetação seca',
          'Feche janelas e evite atividades ao ar livre', 
          'Tenha um kit de emergência preparado',
          'Siga orientações da Defesa Civil'
        ],
        contato: '193 - Corpo de Bombeiros',
        timestamp: new Date().toISOString(),
        icone: '🔥'
      };
      
      // Atualizar estados locais para demonstração visual
      const estadosComEmergencia = dadosEstados.map(estado => {
        if (estado.sigla === 'RJ') {
          return {
            ...estado,
            risco_geral: 'VERMELHO',
            risco_dominante: 'incendio',
            resumo_status: 'EMERGÊNCIA: Incêndio crítico detectado',
            niveis: {
              ...estado.niveis,
              incendio: 'VERMELHO'
            }
          };
        }
        return estado;
      });
      
      setDadosEstados(estadosComEmergencia);
      setAlertasAtivos([emergenciaSimulada]);
      
      // CHAMAR FUNÇÃO DO APP.JS PARA MOSTRAR POPUP
      if (onSimularEmergencia) {
        console.log('📤 Enviando emergência para App.js:', emergenciaSimulada);
        onSimularEmergencia(emergenciaSimulada);
      } else {
        console.warn('⚠️ Função onSimularEmergencia não foi passada como prop!');
        alert('🚨 EMERGÊNCIA SIMULADA!\nAlerta de incêndio crítico no RJ ativado para demonstração.');
      }
      
    } catch (error) {
      console.error('❌ Erro na simulação:', error);
    }
  };

  // ===== FUNÇÃO: Obtém emoji baseado no nível de risco =====
  const obterEmojiRisco = (nivel) => {
    const emojis = {
      'VERDE': '🟢',
      'AMARELO': '🟡',
      'LARANJA': '🟠',
      'VERMELHO': '🔴'
    };
    return emojis[nivel] || '⚪';
  };

  // ===== FUNÇÃO: Obtém emoji para tipo de emergência =====
  const obterEmojiEmergencia = (tipo) => {
    const emojis = {
      'incendio': '🔥',
      'enchente': '🌊',
      'tsunami': '🌊'
    };
    return emojis[tipo] || '⚠️';
  };

  // ===== RENDER CONDICIONAL: LOADING =====
  if (carregando) {
    return (
      <div className="monitoramento page-enter">
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Carregando dados em tempo real...</div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER CONDICIONAL: ERROR =====
  if (erro) {
    return (
      <div className="monitoramento page-enter">
        <div className="page-container">
          <div className="error-container">
            <h2>⚠️ Sistema Temporariamente Indisponível</h2>
            <p>{erro}</p>
            <button 
              className="gsx-button gsx-button-primary"
              onClick={carregarTodosDados}
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="monitoramento page-enter">
      <div className="page-container">
        
        {/* HEADER DO DASHBOARD */}
        <section className="dashboard-header">
          <div className="header-content">
            <div className="header-info">
              <h1>Centro de Monitoramento</h1>
              <p>Monitoramento em tempo real dos estados costeiros brasileiros</p>
              {dadosDashboard && (
                <div className="status-resumo">
                  <span className="sistema-status">
                    🟢 Sistema Operacional
                  </span>
                  <span className="ultima-atualizacao">
                    Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
            
            {/* BOTÃO DE DEMONSTRAÇÃO */}
            <div className="demo-controls">
              <button 
                className="gsx-button gsx-button-primary demo-button"
                onClick={simularEmergencia}
                title="Simula emergência para demonstração do sistema"
              >
                🚨 Simular Emergência
              </button>
              <small className="demo-hint">
                Para demonstração do sistema de alertas
              </small>
            </div>
          </div>

          {/* ESTATÍSTICAS RÁPIDAS */}
          {dadosDashboard && (
            <div className="stats-dashboard">
              <div className="stat-card">
                <span className="stat-number">{dadosDashboard.resumo_geral.total_estados}</span>
                <span className="stat-label">Estados Monitorados</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{dadosDashboard.resumo_geral.estados_alerta}</span>
                <span className="stat-label">Estados em Alerta</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{dadosDashboard.alertas_ativos}</span>
                <span className="stat-label">Alertas Ativos</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{dadosDashboard.resumo_geral.taxa_alerta}%</span>
                <span className="stat-label">Taxa de Alerta</span>
              </div>
            </div>
          )}
        </section>

        {/* ALERTAS CRÍTICOS */}
        {alertasAtivos.length > 0 && (
          <section className="alertas-criticos">
            <h2>🚨 Alertas Ativos no Sistema</h2>
            <div className="alertas-grid">
              {alertasAtivos.map(alerta => (
                <div key={alerta.id} className={`alerta-card alert-${alerta.nivel.toLowerCase()}`}>
                  <div className="alerta-header">
                    <span className="alerta-icon">{alerta.icone}</span>
                    <div className="alerta-meta">
                      <span className="alerta-estado">{alerta.estado}</span>
                      <span className={`alerta-nivel nivel-${alerta.nivel.toLowerCase()}`}>
                        {alerta.nivel}
                      </span>
                    </div>
                  </div>
                  <h3>{alerta.titulo}</h3>
                  <p>{alerta.resumo}</p>
                  <div className="alerta-actions">
                    <button className="gsx-button gsx-button-primary">
                      Ver Detalhes
                    </button>
                    <button className="gsx-button gsx-button-secondary">
                      Orientações
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
                    Ver Histórico
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESUMO ANALÍTICO */}
        {dadosDashboard && (
          <section className="dashboard-analytics">
            <h2>Análise do Sistema</h2>
            <div className="analytics-grid">
              
              {/* DISTRIBUIÇÃO POR NÍVEL */}
              <div className="gsx-card analytics-card">
                <h3>📊 Distribuição por Nível de Risco</h3>
                <div className="distribuicao-chart">
                  {Object.entries(dadosDashboard.distribuicao_niveis).map(([nivel, count]) => (
                    <div key={nivel} className="nivel-bar">
                      <div className="nivel-info">
                        <span className="nivel-emoji">{obterEmojiRisco(nivel)}</span>
                        <span className="nivel-nome">{nivel}</span>
                        <span className="nivel-count">{count}</span>
                      </div>
                      <div className="nivel-progress">
                        <div 
                          className={`progress-fill nivel-${nivel.toLowerCase()}`}
                          style={{ width: `${(count / dadosDashboard.resumo_geral.total_estados) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPOS DE EMERGÊNCIA */}
              <div className="gsx-card analytics-card">
                <h3>🎯 Tipos de Emergência Ativas</h3>
                <div className="tipos-chart">
                  {Object.entries(dadosDashboard.distribuicao_tipos).map(([tipo, count]) => (
                    <div key={tipo} className="tipo-stat">
                      <div className="tipo-header">
                        <span className="tipo-emoji">{obterEmojiEmergencia(tipo)}</span>
                        <span className="tipo-nome">{tipo.toUpperCase()}</span>
                      </div>
                      <div className="tipo-count">{count} estado(s)</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATUS SISTEMA */}
              <div className="gsx-card analytics-card">
                <h3>⚙️ Status Operacional</h3>
                <div className="sistema-info">
                  <div className="sistema-status-detail">
                    <div className="status-indicator online">
                      <span className="status-dot"></span>
                      <span className="status-text">{dadosDashboard.status_sistema}</span>
                    </div>
                    <div className="status-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Última atualização:</span>
                        <span className="metric-value">{dadosDashboard.timestamp}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Próxima verificação:</span>
                        <span className="metric-value">Em 5 minutos</span>
                      </div>
                    </div>
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

export default Monitoramento;