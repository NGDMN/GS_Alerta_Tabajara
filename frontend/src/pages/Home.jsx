// src/pages/Home.jsx - VERSÃO FINAL COM VÍDEO
import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  // ===== ESTADOS: Controle de interações =====
  const [videoTocando, setVideoTocando] = useState(false);
  const [estatisticasCarregadas, setEstatisticasCarregadas] = useState(false);

  // ===== EFFECT: Animação de entrada das estatísticas =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setEstatisticasCarregadas(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ===== FUNÇÃO: Simular reprodução de vídeo =====
  const handleVideoPlay = () => {
    if (!videoTocando) {
      setVideoTocando(true);
      // Simula vídeo de 3 minutos
      setTimeout(() => {
        alert('🎬 Vídeo "GSX Alerta Tabajara - Como Não Morrer em 2025" concluído!\n\n' +
              '⏱️ Duração: 3 minutos\n' +
              '🎯 Conteúdo: Apresentação institucional do sistema\n' +
              '📊 Demonstração das funcionalidades principais\n\n' +
              '🔄 Em breve, vídeo real será inserido aqui!');
        setVideoTocando(false);
      }, 3000); // 3 segundos simulando 3 minutos
    }
  };

  return (
    <div className="home page-enter">
      <div className="page-container">
        
        {/* === SEÇÃO HERO COM VÍDEO === */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>🚨 GSX Alerta Tabajara</h1>
              <h2>Sistema de Emergência Climatológica</h2>
              <p className="hero-description">
                Monitoramento em tempo real dos <strong>estados costeiros brasileiros </strong> 
                para detecção automática de emergências climáticas com alertas instantâneos 
                e orientações da Defesa Civil.
              </p>
              
              <div className="hero-features">
                <div className="feature-item">
                  <span className="feature-icon">🌊</span>
                  <span>Tsunamis & Enchentes</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔥</span>
                  <span>Incêndios Florestais</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Alertas Automáticos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏥</span>
                  <span>Rotas para Abrigos</span>
                </div>
              </div>
            </div>
            
            {/* === PLAYER DE VÍDEO === */}
            <div className="video-container">
              <div className={`video-player ${videoTocando ? 'playing' : ''}`}>
                {!videoTocando ? (
                  <div className="video-placeholder" onClick={handleVideoPlay}>
                    <div className="video-overlay">
                      <div className="play-button">
                        <span className="play-icon">▶️</span>
                      </div>
                      <div className="video-info">
                        <h3>🎬 Apresentação Institucional</h3>
                        <p>Como o Sistema GSX Tabajara Salva Vidas</p>
                        <small>⏱️ Duração: 3 minutos | 🎯 Demonstração completa</small>
                      </div>
                    </div>
                    <div className="video-thumbnail">
                      <div className="thumbnail-content">
                        <div className="thumbnail-header">
                          <span className="thumbnail-logo">📡 GSX</span>
                          <span className="thumbnail-title">ALERTA TABAJARA</span>
                        </div>
                        <div className="thumbnail-center">
                          <div className="simulated-map">
                            <div className="map-states">
                              <div className="state-dot red">RJ</div>
                              <div className="state-dot green">SC</div>
                              <div className="state-dot yellow">CE</div>
                              <div className="state-dot green">PE</div>
                              <div className="state-dot green">AL</div>
                              <div className="state-dot green">BA</div>
                            </div>
                          </div>
                        </div>
                        <div className="thumbnail-footer">
                          <span>Sistema de Emergência em Tempo Real</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="video-playing">
                    <div className="loading-video">
                      <div className="video-progress">
                        <div className="progress-bar"></div>
                      </div>
                      <div className="playing-content">
                        <h3>🎬 Reproduzindo...</h3>
                        <p>"Bem-vindos ao Sistema GSX Alerta Tabajara, onde a tecnologia de ponta encontra a criatividade brasileira para salvar vidas!"</p>
                        <div className="video-controls">
                          <span className="time-indicator">⏱️ 00:03 / 03:00</span>
                          <span className="quality-indicator">🎥 HD Quality</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="video-caption">
                <small>
                  💡 <strong>Dica:</strong> Este é um placeholder. O vídeo final será criado com IA 
                  no estilo "Tabajara" para apresentação do projeto.
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* === SEÇÃO PROBLEMA === */}
        <section className="problema-section">
          <div className="gsx-card">
            <div className="section-header">
              <h2>🌍 O Problema que Resolvemos</h2>
              <p>Por que os estados costeiros brasileiros precisam de um sistema como este?</p>
            </div>
            
            <div className="problema-content">
              <div className="problema-stats">
                <div className="problema-item urgente">
                  <div className="stat-number">75%</div>
                  <div className="stat-label">da população não sabe como reagir a emergências climáticas</div>
                </div>
                <div className="problema-item critico">
                  <div className="stat-number">6</div>
                  <div className="stat-label">estados costeiros expostos a múltiplos riscos simultâneos</div>
                </div>
                <div className="problema-item importante">
                  <div className="stat-number">15min</div>
                  <div className="stat-label">tempo médio para tsunami atingir costa após sismo</div>
                </div>
              </div>
              
              <div className="riscos-grid">
                <div className="risco-card">
                  <div className="risco-header">
                    <span className="risco-emoji">🌊</span>
                    <h3>Tsunamis & Enchentes</h3>
                  </div>
                  <p>Eventos que podem devastar regiões inteiras em minutos, exigindo evacuação imediata e rotas seguras.</p>
                </div>
                
                <div className="risco-card">
                  <div className="risco-header">
                    <span className="risco-emoji">🔥</span>
                    <h3>Incêndios Florestais</h3>
                  </div>
                  <p>Condições climáticas extremas que podem causar incêndios de grandes proporções, especialmente no verão.</p>
                </div>
                
                <div className="risco-card">
                  <div className="risco-header">
                    <span className="risco-emoji">⏰</span>
                    <h3>Falta de Tempo</h3>
                  </div>
                  <p>Em emergências, cada segundo conta. Sistemas manuais não conseguem processar e alertar com velocidade necessária.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SEÇÃO SOLUÇÃO === */}
        <section className="solucao-section">
          <div className="gsx-card">
            <div className="section-header">
              <h2>💡 Nossa Solução Tabajara</h2>
              <p>Sistema que funciona mesmo sendo "meio gambiarra" - mas salva vidas!</p>
            </div>
            
            <div className="solucao-features">
              <div className="feature-principal">
                <div className="feature-destaque">
                  <span className="destaque-icon">🚨</span>
                  <h3>Pop-up de Emergência Inteligente</h3>
                  <p>
                    <strong>O grande diferencial:</strong> Quando detectamos uma emergência crítica, 
                    um pop-up aparece automaticamente com instruções específicas da Defesa Civil 
                    e te redireciona diretamente para o abrigo mais próximo disponível.
                  </p>
                </div>
              </div>
              
              <div className="features-grid">
                <div className="feature-card">
                  <span className="feature-icon">📊</span>
                  <h4>Monitoramento 24/7</h4>
                  <p>Sensores simulados coletam dados em tempo real de temperatura, umidade, ventos e atividade sísmica.</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">🤖</span>
                  <h4>Algoritmos de Risco</h4>
                  <p>Cálculos baseados em thresholds científicos reais do CEMADEN, INMET e Defesa Civil.</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">🗺️</span>
                  <h4>Rotas de Evacuação</h4>
                  <p>Sistema identifica abrigos disponíveis por proximidade e capacidade, calculando rotas otimizadas.</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">📱</span>
                  <h4>Interface Intuitiva</h4>
                  <p>Design responsivo que funciona em qualquer dispositivo, com instruções claras para situações de pânico.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SEÇÃO ESTATÍSTICAS === */}
        <section className="estatisticas-section">
          <div className="stats-container">
            <h2>📈 Sistema em Números</h2>
            <div className={`stats-grid ${estatisticasCarregadas ? 'loaded' : ''}`}>
              <div className="stat-card">
                <div className="stat-icon">🗺️</div>
                <div className="stat-number">6</div>
                <div className="stat-label">Estados Monitorados</div>
                <div className="stat-detail">RJ, SC, CE, PE, AL, BA</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🚨</div>
                <div className="stat-number">3</div>
                <div className="stat-label">Tipos de Emergência</div>
                <div className="stat-detail">Tsunami, Enchente, Incêndio</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏠</div>
                <div className="stat-number">47</div>
                <div className="stat-label">Abrigos Cadastrados</div>
                <div className="stat-detail">Escolas, ginásios, centros</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-number">&lt;30s</div>
                <div className="stat-label">Tempo de Resposta</div>
                <div className="stat-detail">Detecção até alerta</div>
              </div>
            </div>
          </div>
        </section>

        {/* === SEÇÃO CTA === */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>🚀 Explore o Sistema Agora</h2>
              <p>Teste todas as funcionalidades do nosso protótipo funcional</p>
              
              <div className="cta-buttons">
                <a href="/monitoramento" className="gsx-button gsx-button-primary cta-primary">
                  📊 Ver Dashboard em Tempo Real
                </a>
                <a href="/orientacoes" className="gsx-button gsx-button-secondary cta-secondary">
                  🆘 Simular Emergência
                </a>
              </div>
              
              <div className="cta-features">
                <span className="cta-feature">✅ Simulação interativa</span>
                <span className="cta-feature">✅ Dados realistas</span>
                <span className="cta-feature">✅ Interface responsiva</span>
              </div>
            </div>
          </div>
        </section>

        {/* === SEÇÃO TECNOLOGIA === */}
        <section className="tech-overview">
          <div className="gsx-card">
            <div className="section-header">
              <h2>🛠️ Tecnologia Aplicada</h2>
              <p>Stack moderno para máxima confiabilidade e performance</p>
            </div>
            
            <div className="tech-stack">
              <div className="tech-category">
                <h3>Frontend</h3>
                <div className="tech-items">
                  <span className="tech-badge">⚛️ React 19</span>
                  <span className="tech-badge">🎨 CSS3</span>
                  <span className="tech-badge">📊 Chart.js</span>
                </div>
              </div>
              
              <div className="tech-category">
                <h3>Backend & Dados</h3>
                <div className="tech-items">
                  <span className="tech-badge">🐍 Python</span>
                  <span className="tech-badge">🗄️ SQLite</span>
                  <span className="tech-badge">📋 JSON APIs</span>
                </div>
              </div>
              
              <div className="tech-category">
                <h3>Ferramentas</h3>
                <div className="tech-items">
                  <span className="tech-badge">📦 Git + GitHub</span>
                  <span className="tech-badge">⚡ Node.js</span>
                  <span className="tech-badge">🔧 VS Code</span>
                </div>
              </div>
            </div>
            
            <div className="tech-highlight">
              <p>
                <strong>💡 Diferencial Técnico:</strong> Sistema desenvolvido inteiramente com 
                tecnologias do currículo FIAP, demonstrando aplicação prática dos conhecimentos 
                adquiridos em um contexto real de utilidade pública.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;