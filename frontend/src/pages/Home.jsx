// src/pages/Sobre.jsx
import React from 'react';
import './Sobre.css';

function Sobre() {
  return (
    <div className="sobre page-enter">
      <div className="page-container">
        
        {/* HEADER DA PÁGINA */}
        <section className="page-header">
          <h1>Sobre o Projeto</h1>
          <p>Sistema Integrado de Alertas de Emergência para Estados Costeiros Brasileiros</p>
        </section>

        {/* SEÇÃO 1: O PROJETO */}
        <section className="projeto-section">
          <div className="gsx-card">
            <h2>🎯 O Projeto</h2>
            <div className="content-grid">
              <div className="text-content">
                <h3>Problema Fictício Identificado</h3>
                <p>
                  Os estados costeiros brasileiros (RJ, SC, CE, PE, AL, BA) enfrentam múltiplos riscos climáticos: 
                  tsunamis, enchentes, incêndios e eventos meteorológicos extremos. A população frequentemente 
                  não recebe alertas em tempo real ou não sabe como reagir adequadamente.
                </p>
                
                <h3>Nossa Solução</h3>
                <p>
                  Sistema que simula o monitoramento de sensores IoT para detectar riscos e emitir alertas 
                  automáticos com instruções específicas da Defesa Civil. O diferencial é o 
                  <strong> pop-up de emergência automático</strong> que orienta o usuário diretamente 
                  para abrigos disponíveis.
                </p>
              </div>
              
              <div className="stats-box">
                <h3>Números do Projeto</h3>
                <div className="stat-item">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Estados Monitorados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Tipos de Emergência</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Monitoramento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: TECNOLOGIAS */}
        <section className="tecnologias-section">
          <div className="gsx-card">
            <h2>🛠️ Stack Tecnológica</h2>
            
            <div className="tech-grid">
              {/* FRONTEND */}
              <div className="tech-category">
                <h3>Frontend</h3>
                <div className="tech-list">
                  <div className="tech-item">
                    <span className="tech-icon">⚛️</span>
                    <div className="tech-info">
                      <strong>React 19</strong>
                      <p>Interface componentizada e estado reativo</p>
                    </div>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🎨</span>
                    <div className="tech-info">
                      <strong>CSS3 + Design próprio</strong>
                      <p>Identidade visual consistente e responsiva</p>
                    </div>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">📊</span>
                    <div className="tech-info">
                      <strong>Chart.js</strong>
                      <p>Visualização de dados meteorológicos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACKEND */}
              <div className="tech-category">
                <h3>Backend & Dados</h3>
                <div className="tech-list">
                  <div className="tech-item">
                    <span className="tech-icon">🐍</span>
                    <div className="tech-info">
                      <strong>Python 3</strong>
                      <p>Processamento de dados e cálculo de riscos</p>
                    </div>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🗄️</span>
                    <div className="tech-info">
                      <strong>SQLite</strong>
                      <p>Banco local para dados de sensores</p>
                    </div>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">📋</span>
                    <div className="tech-info">
                      <strong>JSON APIs</strong>
                      <p>Comunicação entre backend e frontend</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FERRAMENTAS */}
              <div className="tech-category">
                <h3>Ferramentas</h3>
                <div className="tech-list">
                  <div className="tech-item">
                    <span className="tech-icon">📦</span>
                    <div className="tech-info">
                      <strong>Git + GitHub</strong>
                      <p>Controle de versão e colaboração</p>
                    </div>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">⚡</span>
                    <div className="tech-info">
                      <strong>Node.js + npm</strong>
                      <p>Ambiente de desenvolvimento React</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: METODOLOGIA */}
        <section className="metodologia-section">
          <div className="gsx-card">
            <h2>🔬 Metodologia de Cálculo de Riscos</h2>
            
            <div className="metodologia-content">
              <div className="algoritmo-overview">
                <h3>Algoritmos de Análise</h3>
                <p>
                  Os riscos são calculados usando <strong>thresholds científicos</strong> baseados em 
                  dados reais de órgãos como CEMADEN, INMET e Defesa Civil.
                </p>
              </div>

              <div className="risk-types">
                <div className="risk-card">
                  <h4>🔥 Risco de Incêndio</h4>
                  <ul>
                    <li><strong>Temperatura:</strong> Crítica acima de 35°C</li>
                    <li><strong>Umidade:</strong> Perigosa abaixo de 30%</li>
                    <li><strong>Vento:</strong> Crítico acima de 20 m/s</li>
                    <li><strong>Precipitação:</strong> Seca prolongada (&lt; 2mm/7dias)</li>
                  </ul>
                </div>

                <div className="risk-card">
                  <h4>🌊 Risco de Enchente</h4>
                  <ul>
                    <li><strong>Chuva 1h:</strong> Intensa acima de 50mm</li>
                    <li><strong>Chuva 24h:</strong> Crítica acima de 100mm</li>
                    <li><strong>Chuva 72h:</strong> Solo saturado (&gt; 180mm)</li>
                    <li><strong>Nível do mar:</strong> Alto acima de 2.5m</li>
                  </ul>
                </div>

                <div className="risk-card">
                  <h4>🌊 Risco de Tsunami</h4>
                  <ul>
                    <li><strong>Magnitude:</strong> Mínima 6.0 (escala Richter)</li>
                    <li><strong>Magnitude crítica:</strong> Acima de 7.5</li>
                    <li><strong>Profundidade:</strong> Terremotos rasos (&lt; 70km)</li>
                    <li><strong>Localização:</strong> Próximo à costa (&lt; 1000km)</li>
                  </ul>
                </div>
              </div>

              <div className="scoring-system">
                <h3>Sistema de Pontuação</h3>
                <div className="score-explanation">
                  <div className="score-item">
                    <span className="score-range verde">0-24 pontos</span>
                    <span className="score-level">🟢 VERDE - Situação Normal</span>
                  </div>
                  <div className="score-item">
                    <span className="score-range amarelo">25-49 pontos</span>
                    <span className="score-level">🟡 AMARELO - Atenção</span>
                  </div>
                  <div className="score-item">
                    <span className="score-range laranja">50-74 pontos</span>
                    <span className="score-level">🟠 LARANJA - Alerta</span>
                  </div>
                  <div className="score-item">
                    <span className="score-range vermelho">75+ pontos</span>
                    <span className="score-level">🔴 VERMELHO - Emergência</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: DESENVOLVIMENTO */}
        <section className="desenvolvimento-section">
          <div className="gsx-card">
            <h2>⚙️ Processo de Desenvolvimento</h2>
            
            <div className="processo-timeline">
              <div className="timeline-item">
                <div className="timeline-marker">1</div>
                <div className="timeline-content">
                  <h3>Análise e Planejamento</h3>
                  <p>
                    Estudo dos principais riscos climáticos dos estados costeiros e 
                    definição dos requisitos funcionais do sistema.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">2</div>
                <div className="timeline-content">
                  <h3>Modelagem de Dados</h3>
                  <p>
                    Criação do banco SQLite com tabelas para estados, sensores e abrigos. 
                    Desenvolvimento dos algoritmos de geração de dados mockados.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">3</div>
                <div className="timeline-content">
                  <h3>Backend Python</h3>
                  <p>
                    Implementação dos calculadores de risco, sistema de alertas e 
                    exportação de dados para JSON consumível pelo frontend.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">4</div>
                <div className="timeline-content">
                  <h3>Interface React</h3>
                  <p>
                    Desenvolvimento do frontend com identidade visual própria, 
                    componentes reutilizáveis e sistema de pop-ups de emergência.
                  </p>
                </div>
              </div>
            </div>

            <div className="desafios-box">
              <h3>🎯 Principais Desafios Superados</h3>
              <div className="desafios-grid">
                <div className="desafio-item">
                  <h4>Correlação Temporal</h4>
                  <p>Gerar dados realistas que seguem padrões climáticos naturais (temperatura mais alta à tarde, etc.)</p>
                </div>
                <div className="desafio-item">
                  <h4>Sistema de Alertas</h4>
                  <p>Lógica complexa para determinar quando emitir alertas baseados em múltiplos fatores de risco</p>
                </div>
                <div className="desafio-item">
                  <h4>UX de Emergência</h4>
                  <p>Pop-up que não pode ser ignorado mas não frustra o usuário em situações normais</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: DADOS E LIMITAÇÕES */}
        <section className="limitacoes-section">
          <div className="gsx-card">
            <h2>📊 Dados e Considerações</h2>
            
            <div className="consideracoes-content">
              <div className="dados-info">
                <h3>🔍 Fonte dos Dados</h3>
                <p>
                  Este é um <strong>projeto acadêmico com dados simulados</strong>. Os algoritmos 
                  são baseados em thresholds reais de órgãos científicos, mas os valores dos 
                  sensores são gerados algoritmicamente para demonstração.
                </p>
                
                <div className="fontes-list">
                  <div className="fonte-item">
                    <a href="Link CEMADEN"><strong>CEMADEN: </strong>Thresholds de enchente e precipitação</a>
                  </div>
                  <div className="fonte-item"> 
                    <a href="Link INMET"><strong>INMET: </strong>Parâmetros meteorológicos</a>
                  </div>
                  <div className="fonte-item">                    
                    <a href="Link Defesa Civil"><strong>Defesa Civil: </strong>Protocolos de emergência</a>
                  </div>
                </div>
              </div>

              <div className="futuras-melhorias">
                <h3>🚀 Evoluções Futuras</h3>
                <ul>
                  <li>Integração com APIs reais de sensores IoT</li>
                  <li>Machine Learning para predição de padrões</li>
                  <li>Notificações push mobile</li>
                  <li>Integração com sistemas da Defesa Civil</li>
                  <li>Mapas interativos com rotas de evacuação</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER DA PÁGINA */}
        <section className="projeto-footer">
          <div className="gsx-card">
            <div className="footer-content">
              <h3>📝 Informações do Projeto</h3>
              <div className="projeto-meta">
                <div className="meta-item">
                  <strong>Instituição:</strong> FIAP
                </div>
                <div className="meta-item">
                  <strong>Projeto:</strong> Global Solutions 2
                </div>
                <div className="meta-item">
                  <strong>Turma:</strong> 1ESOR
                </div>
                <div className="meta-item">
                  <strong>Tipo:</strong> Protótipo Funcional (MVP)
                </div>
              </div>
              
              <div className="tecnologias-footer">
                <p>
                  <strong>Stack:</strong> React + Python + SQLite + CSS3 + Chart.js
                </p>
                <p>
                  <a href="https://github.com/NGDMN/GS_Alerta_Tabajara"><strong>Repositório Git + GitHub</strong></a>

                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Sobre;