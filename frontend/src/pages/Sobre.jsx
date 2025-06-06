// src/pages/Sobre.jsx - NEIL GOODMAN VERSION
import React, { useState, useRef, useEffect } from 'react';
import './Sobre.css';

function Sobre() {
  // ===== ESTADOS DO CARROSSEL =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const carrosselRef = useRef(null);
  const totalSlides = 12; // Total de cards na timeline

  // ===== FUNÇÃO: NAVEGAÇÃO DO CARROSSEL =====
  const scrollCarrossel = (direction) => {
    const container = carrosselRef.current;
    if (!container) return;

    const cardWidth = 320; // Largura do card + gap
    let newSlide = currentSlide;

    if (direction === 'next' && currentSlide < totalSlides - 1) {
      newSlide = currentSlide + 1;
    } else if (direction === 'prev' && currentSlide > 0) {
      newSlide = currentSlide - 1;
    }

    // Scroll suave para a posição
    const scrollPosition = newSlide * cardWidth;
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    setCurrentSlide(newSlide);
  };

  // ===== EFFECT: SETUP INICIAL =====
  useEffect(() => {
    const container = carrosselRef.current;
    if (!container) return;

    // Listener para scroll manual
    const handleScroll = () => {
      const cardWidth = 320;
      const scrollLeft = container.scrollLeft;
      const newSlide = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newSlide);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="sobre page-enter">
      <div className="page-container">
        
        {/* === HEADER PESSOAL === */}
        <section className="profile-header">
          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-text">
                <h1>👨‍💻 Neil Goodman</h1>
                <h2>Estudante de Engenharia de Software | Futuro Engenheiro de Dados</h2>
                <p className="profile-description">
                  Desenvolvedor apaixonado por <strong>dados e automação</strong>, 
                  com experiência prática em Python, SQL e Power BI. 
                  Atualmente cursando Engenharia de Software na FIAP, 
                  <strong>buscando oportunidades de estágio em Engenharia de Dados</strong>.
                </p>
                
                <div className="profile-meta">
                  <span className="meta-item">🎓 <strong>RM:</strong> 559662</span>
                  <span className="meta-item">🏫 <strong>Turma:</strong> 1ESOR</span>
                  <span className="meta-item">📅 <strong>Período:</strong> Ago 2024 - Jul 2028</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <div className="contact-buttons">
                  <a 
                    href="https://www.linkedin.com/in/goodmanneil" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gsx-button gsx-button-primary contact-btn"
                  >
                    💼 LinkedIn
                  </a>
                  <a 
                    href="https://github.com/ngdmn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gsx-button gsx-button-secondary contact-btn"
                  >
                    🐙 GitHub
                  </a>
                </div>
                <div className="contact-info">
                  <span className="contact-detail">📧 neilgoodman@live.com</span>
                  <span className="contact-detail">📱 +55 41 99998-0300</span>
                  <span className="contact-detail">🌎 Curitiba, PR - Brasil</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === JORNADA TÉCNICA === */}
        <section className="jornada-section">
          <div className="gsx-card">
            <h2>🚀 Minha Jornada Técnica</h2>
            
            <div className="jornada-timeline">
              <div className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-icon">🏭</span>
                </div>
                <div className="timeline-content">
                  <h3>CNH Industrial (2019-2022)</h3>
                  <h4>HR Administrative Assistant</h4>
                  <p>
                    <strong>Início da jornada:</strong> Meu primeiro contato sério com automação! 
                    Construí dashboard Excel para análise de dados do restaurante corporativo, 
                    <strong>aumentando NPS em 15 pontos</strong>. Desenvolvi formulários Pipefy 
                    e workflows Power Automate que reduziram falhas de processo significativamente.
                  </p>
                  <div className="tech-used">
                    <span className="tech-tag">📊 Excel Avançado</span>
                    <span className="tech-tag">🔧 Power Automate</span>
                    <span className="tech-tag">📋 Pipefy</span>
                    <span className="tech-tag">📊 VBA Básico</span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-icon">🏢</span>
                </div>
                <div className="timeline-content">
                  <h3>Votorantim S.A. (2023-2024)</h3>
                  <h4>Junior Automation & Improvements Analyst</h4>
                  <p>
                    <strong>Momento decisivo:</strong> Descobri minha paixão por dados ao 
                    automatizar processos com Python e Power BI. Reduzi tempo de 
                    fechamento contábil de <strong>4h para 1.5h</strong> usando VBA 
                    e criei web scrapers que eliminaram tarefas manuais repetitivas.
                  </p>
                  <div className="tech-used">
                    <span className="tech-tag">🐍 Python</span>
                    <span className="tech-tag">📊 Power BI</span>
                    <span className="tech-tag">🔧 Power Automate</span>
                    <span className="tech-tag">📊 VBA Avançado</span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-icon">💼</span>
                </div>
                <div className="timeline-content">
                  <h3>Goodman Solution Experts (2025-Presente)</h3>
                  <h4>Independent Contractor</h4>
                  <p>
                    <strong>Empreendedorismo:</strong> Desenvolvo soluções personalizadas 
                    para clientes locais, incluindo sistema de gestão de eventos com 
                    Python e PostgreSQL, com dashboard de métricas e funcionalidades 
                    de consulta avançada.
                  </p>
                  <div className="tech-used">
                    <span className="tech-tag">🐍 Python</span>
                    <span className="tech-tag">🐘 PostgreSQL</span>
                    <span className="tech-tag">📊 Dashboards</span>
                    <span className="tech-tag">☁️ Cloud</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SOBRE O PROJETO === */}
        <section className="projeto-section">
          <div className="gsx-card">
            <h2>🎯 Sobre Este Projeto - GSX Alerta Tabajara</h2>
            
            <div className="projeto-grid">
              <div className="projeto-motivacao">
                <h3>💡 Por Que Este Tema?</h3>
                <p>
                  <strong>"Por que escolher um desastre, se posso trabalhar com vários?"</strong> 
                  Esta foi minha abordagem estratégica. Ao invés de focar em um único tipo de emergência, 
                  criei um sistema que monitora <strong>múltiplos riscos simultaneamente</strong>, 
                  permitindo demonstrar competências em análise de dados complexos, 
                  correlação temporal e algoritmos de decisão multicritério.
                </p>
                
                <div className="motivacao-pontos">
                  <div className="ponto-item">
                    <span className="ponto-icon">📊</span>
                    <span>Mais conteúdo de dados para processar</span>
                  </div>
                  <div className="ponto-item">
                    <span className="ponto-icon">🧠</span>
                    <span>Algoritmos mais complexos e interessantes</span>
                  </div>
                  <div className="ponto-item">
                    <span className="ponto-icon">⚡</span>
                    <span>Experiência próxima a sistemas reais</span>
                  </div>
                </div>
              </div>
              
              <div className="projeto-stats">
                <h3>📈 Projeto em Números</h3>
                <div className="stats-projeto">
                  <div className="stat-projeto">
                    <span className="stat-number">6</span>
                    <span className="stat-label">Estados Monitorados</span>
                  </div>
                  <div className="stat-projeto">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Tipos de Algoritmos</span>
                  </div>
                  <div className="stat-projeto">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Linhas de Código</span>
                  </div>
                  <div className="stat-projeto">
                    <span className="stat-number">47</span>
                    <span className="stat-label">Abrigos Simulados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === APRENDIZADOS === */}
        <section className="aprendizados-section">
          <div className="gsx-card">
            <h2>🧠 Principais Aprendizados</h2>
            
            <div className="aprendizados-grid">
              <div className="aprendizado-card backend">
                <div className="aprendizado-header">
                  <span className="aprendizado-icon">🐍</span>
                  <h3>Backend & Dados (Manual)</h3>
                </div>
                <p>
                  <strong>Desenvolvimento completo do zero:</strong> Criei todo o sistema 
                  de backend Python, incluindo algoritmos de cálculo de risco, geração 
                  de dados realistas com correlação temporal, e estrutura SQLite otimizada.
                </p>
                <div className="skills-learned">
                  <span className="skill-tag">Algoritmos de análise</span>
                  <span className="skill-tag">Correlação temporal</span>
                  <span className="skill-tag">Otimização SQL</span>
                  <span className="skill-tag">Arquitetura de dados</span>
                </div>
              </div>

              <div className="aprendizado-card frontend">
                <div className="aprendizado-header">
                  <span className="aprendizado-icon">⚛️</span>
                  <h3>React & Frontend</h3>
                </div>
                <p>
                  <strong>Evolução com orientação:</strong> Embora tenha seguido um 
                  passo a passo estruturado para o React, me desenvolvi significativamente 
                  em componentização, estado reativo, hooks e criação de interfaces 
                  funcionais e responsivas.
                </p>
                <div className="skills-learned">
                  <span className="skill-tag">Componentização</span>
                  <span className="skill-tag">Estado e hooks</span>
                  <span className="skill-tag">CSS avançado</span>
                  <span className="skill-tag">UX responsivo</span>
                </div>
              </div>

              <div className="aprendizado-card integracao">
                <div className="aprendizado-header">
                  <span className="aprendizado-icon">🔗</span>
                  <h3>Integração de Sistemas</h3>
                </div>
                <p>
                  <strong>Conexão completa:</strong> Aprendi a conectar backend Python 
                  com frontend React através de APIs JSON, implementando um pipeline 
                  completo de dados que simula sistemas profissionais de monitoramento.
                </p>
                <div className="skills-learned">
                  <span className="skill-tag">APIs REST</span>
                  <span className="skill-tag">Fluxo de dados</span>
                  <span className="skill-tag">JSON processing</span>
                  <span className="skill-tag">Sistema completo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === DESAFIOS === */}
        <section className="desafios-section">
          <div className="gsx-card">
            <h2>⚡ Desafios Enfrentados</h2>
            
            <div className="desafio-principal">
              <div className="desafio-content">
                <h3>🕒 Gestão de Tempo Solo</h3>
                <p>
                  <strong>Maior desafio:</strong> Trabalhar sozinho foi extremamente 
                  desafiador devido ao controle rigoroso do tempo. <strong>Várias vezes 
                  abri mão de seguir melhorando algumas ideias, apenas para conseguir 
                  finalizar no prazo</strong>.
                </p>
                
                <div className="desafio-detalhes">
                  <div className="desafio-item">
                    <h4>❌ Funcionalidades Sacrificadas</h4>
                    <ul>
                      <li>Machine Learning para predição de padrões</li>
                      <li>Mapas interativos com rotas reais</li>
                      <li>Integração com APIs externas de clima</li>
                      <li>Sistema de notificações push</li>
                    </ul>
                  </div>
                  
                  <div className="desafio-item">
                    <h4>✅ Estratégias de Priorização</h4>
                    <ul>
                      <li>Foco em MVP funcional primeiro</li>
                      <li>Documentação durante desenvolvimento</li>
                      <li>Testes incrementais constantes</li>
                      <li>Polimento visual apenas no final</li>
                    </ul>
                  </div>
                </div>

                <div className="licoes-aprendidas">
                  <h4>🎯 Lições para Próximos Projetos</h4>
                  <p>
                    Esta experiência me ensinou a importância do <strong>planejamento 
                    detalhado</strong> e da <strong>priorização radical</strong>. 
                    Em projetos futuros, vou implementar metodologias ágeis mais 
                    rigorosas e definir critérios claros de "pronto" para cada feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === PRÓXIMOS PASSOS === */}
        <section className="futuro-section">
          <div className="gsx-card">
            <h2>🚀 Próximos Passos Profissionais</h2>
            
            <div className="futuro-content">
              <div className="objetivo-principal">
                <h3>🎯 Objetivo Imediato: Engenheiro de Dados</h3>
                <p>
                  Estou me desenvolvendo ativamente para atuar na área de dados, 
                  <strong>buscando seguir carreira como Engenheiro de Dados</strong>. 
                  Minha experiência prática com Python, SQL e automação, combinada 
                  com os fundamentos teóricos da FIAP, me preparam para esta transição.
                </p>
              </div>
              
              <div className="roadmap-skills">
                <h3>📚 Roadmap de Aprendizado</h3>
                <div className="skills-roadmap">
                  <div className="skill-category atual">
                    <h4>🟢 Competências Atuais</h4>
                    <div className="skill-list">
                      <span className="skill-item">Python Intermediário</span>
                      <span className="skill-item">SQL (PostgreSQL)</span>
                      <span className="skill-item">Power BI</span>
                      <span className="skill-item">ETL Básico</span>
                      <span className="skill-item">Git/GitHub</span>
                    </div>
                  </div>
                  
                  <div className="skill-category desenvolvendo">
                    <h4>🟡 Em Desenvolvimento</h4>
                    <div className="skill-list">
                      <span className="skill-item">Apache Airflow</span>
                      <span className="skill-item">Docker & Kubernetes</span>
                      <span className="skill-item">Apache Spark</span>
                      <span className="skill-item">Cloud (AWS/Azure)</span>
                      <span className="skill-item">Data Warehousing</span>
                    </div>
                  </div>
                  
                  <div className="skill-category futuro">
                    <h4>🔵 Próximas Metas</h4>
                    <div className="skill-list">
                      <span className="skill-item">Real-time Processing</span>
                      <span className="skill-item">Machine Learning Ops</span>
                      <span className="skill-item">Data Architecture</span>
                      <span className="skill-item">Big Data Ecosystems</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="oportunidades">
                <h3>💼 Buscando Oportunidades</h3>
                <p>
                  <strong>Estou aberto a oportunidades de estágio</strong> em Engenharia 
                  de Dados onde possa aplicar minha experiência em automação e análise, 
                  enquanto desenvolvo competências em tecnologias modernas de Big Data 
                  e Cloud Computing.
                </p>
                
                <div className="call-to-action">
                  <p><strong>📩 Vamos conversar?</strong></p>
                  <div className="contact-final">
                    <a 
                      href="https://www.linkedin.com/in/goodmanneil" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gsx-button gsx-button-primary"
                    >
                      💼 Conectar no LinkedIn
                    </a>
                    <a 
                      href="mailto:neilgoodman@live.com?subject=Oportunidade%20de%20Estágio%20-%20Engenharia%20de%20Dados"
                      className="gsx-button gsx-button-secondary"
                    >
                      📧 Enviar Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === TECNOLOGIAS & COMPETÊNCIAS === */}
        <section className="competencias-section">
          <div className="gsx-card">
            <h2>🛠️ Stack Técnico Atual</h2>
            
            <div className="competencias-grid">
              <div className="competencia-categoria">
                <h3>💻 Linguagens</h3>
                <div className="skill-items">
                  <div className="skill-detail">
                    <span className="skill-name">🐍 Python</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">🗄️ SQL</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">⚛️ JavaScript/React</span>
                    <span className="skill-level">Básico-Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">📊 VBA</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                </div>
              </div>

              <div className="competencia-categoria">
                <h3>🔧 Ferramentas</h3>
                <div className="skill-items">
                  <div className="skill-detail">
                    <span className="skill-name">📊 Power BI</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">⚡ Power Automate</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">📦 Git/GitHub</span>
                    <span className="skill-level">Intermediário</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">🐘 PostgreSQL</span>
                    <span className="skill-level">Básico-Intermediário</span>
                  </div>
                </div>
              </div>

              <div className="competencia-categoria">
                <h3>🌐 Idiomas</h3>
                <div className="skill-items">
                  <div className="skill-detail">
                    <span className="skill-name">🇧🇷 Português</span>
                    <span className="skill-level">Nativo</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">🇺🇸 Inglês</span>
                    <span className="skill-level">Avançado</span>
                  </div>
                  <div className="skill-detail">
                    <span className="skill-name">🇫🇷 Francês</span>
                    <span className="skill-level">Básico</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === FOOTER PESSOAL === */}
        <section className="personal-footer">
          <div className="footer-message">
            <h3>🤝 Vamos Construir o Futuro Juntos</h3>
            <p>
              <strong>Acredito no poder dos dados para transformar negócios e salvar vidas.</strong> 
              Este projeto demonstra apenas o começo do que posso entregar quando tenho 
              as ferramentas certas e os desafios interessantes. 
              <strong>Estou pronto para o próximo nível!</strong>
            </p>
            
            <div className="footer-links">
              <a 
                href="https://www.linkedin.com/in/goodmanneil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                💼 LinkedIn
              </a>
              <a 
                href="https://github.com/ngdmn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                🐙 GitHub
              </a>
              <a 
                href="mailto:neilgoodman@live.com"
                className="footer-link"
              >
                📧 Email
              </a>
            </div>
            
            <div className="footer-signature">
              <p>
                <em>Neil Goodman - RM559662 - Engenharia de Software FIAP</em><br/>
                <small>Curitiba, PR - Brasil | 2025</small>
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Sobre;