// src/pages/Sobre.jsx
import React, { useRef, useState, useEffect } from 'react';
import './Sobre.css';

function Sobre() {
  // ===== ESTADO DO CARROSSEL =====
  const carrosselRef = useRef(null);
  const [cardAtual, setCardAtual] = useState(0);
  const [scrollInicio, setScrollInicio] = useState(true);
  const [scrollFinal, setScrollFinal] = useState(false);

  // ===== DADOS DA JORNADA =====
  const experiencias = [
    {
      ano: '2019',
      tipo: 'INÍCIO',
      titulo: 'Estágio RH - Pagamentos',
      empresa: 'CNH Industrial',
      descricao: 'Estudante de Ciências Contábeis aceito para estágio. Primeiro contato profundo com Excel para gestão de pagamentos do RH.',
      tecnologias: ['Excel'],
      resultado: null
    },
    {
      ano: '2019',
      tipo: 'EFETIVAÇÃO',
      titulo: 'Analista de Benefícios',
      empresa: 'CNH Industrial',
      descricao: 'Efetivado e migrado para área de benefícios. Acesso a planilhas extensas e grandes bases de dados pela primeira vez.',
      tecnologias: ['Excel Avançado', 'Bases de Dados'],
      resultado: null
    },
    {
      ano: '2020',
      tipo: 'EVOLUÇÃO',
      titulo: 'Descobrindo Automação',
      empresa: 'CNH Industrial',
      descricao: 'Primeiros passos com VBA e Power Automate. Início da compreensão de que processos manuais podem ser automatizados.',
      tecnologias: ['VBA', 'Power Automate'],
      resultado: null
    },
    {
      ano: '2021',
      tipo: 'INOVAÇÃO',
      titulo: 'Primeiro Sistema Próprio',
      empresa: 'CNH Industrial',
      descricao: 'Criação de formulário de avaliação com Pipefy para automatizar fluxo de reclamações de serviços (café, restaurante, táxi).',
      tecnologias: ['Pipefy', 'Power Automate', 'VBA'],
      resultado: 'Aumento na qualidade do serviço prestado'
    },
    {
      ano: '2021',
      tipo: 'DADOS',
      titulo: 'Primeiro Dashboard',
      empresa: 'CNH Industrial', 
      descricao: 'Desenvolvimento do primeiro dashboard em Excel para monitoramento de serviços.',
      tecnologias: ['Excel Dashboard', 'Análise de Dados'],
      resultado: 'Elevação do NPS do restaurante'
    },
    {
      ano: '2023',
      tipo: 'TRANSIÇÃO',
      titulo: 'Estagiário Contábil',
      empresa: 'Votorantim',
      descricao: 'Nova empresa, foco em grandes volumes de dados. Expansão do conhecimento em Excel, VBA e Power Automate.',
      tecnologias: ['Excel', 'VBA', 'Power Automate'],
      resultado: null
    },
    {
      ano: '2023',
      tipo: 'EFETIVAÇÃO',
      titulo: 'Especialista em Automações',
      empresa: 'Votorantim',
      descricao: 'Efetivado e focado em automações de processos contábeis. Maior impacto em redução de tempo operacional.',
      tecnologias: ['Power Automate', 'VBA'],
      resultado: 'Fechamento trimestral: 4h → 1h30 (redução de 62%)'
    },
    {
      ano: '2024',
      tipo: 'Migração',
      titulo: 'Núcleo de Automações',
      empresa: 'Votorantim',
      descricao: 'Migração para núcleo especializado em automação e melhoria de processos.',
      tecnologias: ['Power Automate', 'VBA', 'Power BI', 'Python'],
      resultado: null
    },
    {
      ano: '2024',
      tipo: 'EDUCAÇÃO',
      titulo: 'Graduação FIAP',
      empresa: 'FIAP',
      descricao: 'Início da graduação em Engenharia de Software, oficializando a transição de carreira para tecnologia.',
      tecnologias: ['Python', 'HTML/CSS', 'JavaScript', 'React'],
      resultado: 'Transição oficial para tech'
    },
    {
      ano: '2024',
      tipo: 'SAÍDA',
      titulo: 'Fim do Ciclo Corporativo',
      empresa: 'Votorantim',
      descricao: 'Cíclo na Votorantim chega ao fim.',
      tecnologias: [],
      resultado: 'Foco deixa de ser automações, abrindo um leque de possibilidades.'
    },
    {
      ano: '2025',
      tipo: 'EMPREENDEDORISMO',
      titulo: 'Goodman Solution Experts',
      empresa: 'Própria',
      descricao: 'Abertura de CNPJ para atuar como freelancer enquanto busca recolocação como estagiário de engenharia de dados.',
      tecnologias: ['Python', 'SQL', "React"],
      resultado: 'Atuação em projetos de automações, frontend e dados'
    },
    {
      ano: '2025',
      tipo: 'PROJETO',
      titulo: 'Sistema de Alertas GSX',
      empresa: 'FIAP - Global Solutions',
      descricao: 'Desenvolvimento de sistema completo integrando backend Python, banco SQLite e frontend React. Projeto que demonstra evolução técnica completa.',
      tecnologias: ['Python', 'SQLite', 'React', 'CSS3', 'JavaScript'],
      resultado: 'Não sei vocês, mas eu gostei!'
    }
  ];

  const totalCards = experiencias.length;

  // ===== FUNÇÕES DO CARROSSEL =====
  const verificarLimites = () => {
    if (!carrosselRef.current) return;
    
    const container = carrosselRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    setScrollInicio(scrollLeft <= 0);
    setScrollFinal(scrollLeft >= scrollWidth - clientWidth - 10);
  };

  const atualizarCardAtual = () => {
    if (!carrosselRef.current) return;
    
    const container = carrosselRef.current;
    const cardWidth = container.clientWidth * 0.8; // Largura de cada card
    const scrollLeft = container.scrollLeft;
    const novoCardAtual = Math.round(scrollLeft / cardWidth);
    
    setCardAtual(Math.min(novoCardAtual, totalCards - 1));
  };

  const scrollEsquerda = () => {
    if (!carrosselRef.current) return;
    const cardWidth = carrosselRef.current.clientWidth * 0.8;
    carrosselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  const scrollDireita = () => {
    if (!carrosselRef.current) return;
    const cardWidth = carrosselRef.current.clientWidth * 0.8;
    carrosselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
  };

  const irParaCard = (index) => {
    if (!carrosselRef.current) return;
    const cardWidth = carrosselRef.current.clientWidth * 0.8;
    carrosselRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  // ===== EFFECTS =====
  useEffect(() => {
    const container = carrosselRef.current;
    if (!container) return;

    const handleScroll = () => {
      verificarLimites();
      atualizarCardAtual();
    };

    container.addEventListener('scroll', handleScroll);
    verificarLimites(); // Verificação inicial

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

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

        {/* SEÇÃO 4: MINHA JORNADA PROFISSIONAL */}
        <section className="jornada-section">
          <div className="gsx-card">
            <h2>👨‍💻 Minha Jornada Profissional</h2>
            <p>Da contabilidade à engenharia de dados - uma transição orientada por dados</p>
            
            <div className="timeline-carrossel">
              <div className="carrossel-container" ref={carrosselRef}>
                <div className="carrossel-track">
                  {experiencias.map((experiencia, index) => (
                    <div key={index} className="experiencia-card">
                      <div className="experiencia-header">
                        <span className="experiencia-ano">{experiencia.ano}</span>
                        <span className="experiencia-tipo">{experiencia.tipo}</span>
                      </div>
                      <h3 className="experiencia-titulo">{experiencia.titulo}</h3>
                      <div className="experiencia-empresa">{experiencia.empresa}</div>
                      <p className="experiencia-descricao">{experiencia.descricao}</p>
                      <div className="experiencia-tecnologias">
                        {experiencia.tecnologias.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      {experiencia.resultado && (
                        <div className="experiencia-resultado">
                          <strong>💡 Resultado:</strong> {experiencia.resultado}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTROLES DO CARROSSEL */}
              <div className="carrossel-controles">
                <button 
                  className="carrossel-btn carrossel-btn-prev"
                  onClick={scrollEsquerda}
                  disabled={scrollInicio}
                  aria-label="Experiência anterior"
                >
                  ←
                </button>
                
                <div className="carrossel-indicadores">
                  {Array.from({ length: totalCards }).map((_, index) => (
                    <button
                      key={index}
                      className={`indicador ${cardAtual === index ? 'ativo' : ''}`}
                      onClick={() => irParaCard(index)}
                      aria-label={`Ir para experiência ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  className="carrossel-btn carrossel-btn-next"
                  onClick={scrollDireita}
                  disabled={scrollFinal}
                  aria-label="Próxima experiência"
                >
                  →
                </button>
              </div>

              {/* PROGRESSO VISUAL */}
              <div className="carrossel-progresso">
                <div 
                  className="progresso-fill"
                  style={{ width: `${(cardAtual + 1) / totalCards * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: PROCESSO DE DESENVOLVIMENTO */}
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

        {/* SEÇÃO 6: DADOS E LIMITAÇÕES */}
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
                    <strong>CEMADEN: </strong>Thresholds de enchente e precipitação
                  </div>
                  <div className="fonte-item"> 
                    <strong>INMET: </strong>Parâmetros meteorológicos
                  </div>
                  <div className="fonte-item">                    
                    <strong>Defesa Civil: </strong>Protocolos de emergência
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
                  <strong>Repositório:</strong> <a href="https://github.com/NGDMN/GS_Alerta_Tabajara" target="_blank" rel="noopener noreferrer">GitHub</a>
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