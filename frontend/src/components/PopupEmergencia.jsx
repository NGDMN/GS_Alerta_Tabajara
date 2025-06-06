// src/components/PopupEmergencia.jsx
import { useState, useEffect } from 'react';
import './PopupEmergencia.css';

function PopupEmergencia({ alerta, onConfirmarLeitura, onNavegar }) {
  const [leituraConfirmada, setLeituraConfirmada] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(30); // 30 segundos para ler
  
  // ===== TIMER DE LEITURA =====
  useEffect(() => {
    if (tempoRestante <= 0) return;
    
    const timer = setTimeout(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [tempoRestante]);
  
  // ===== PREVENÇÃO DE FECHAMENTO ACIDENTAL =====
  useEffect(() => {
    const prevenirEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        console.log('⚠️ ESC bloqueado - alerta crítico ativo');
      }
    };
    
    document.addEventListener('keydown', prevenirEscape);
    return () => document.removeEventListener('keydown', prevenirEscape);
  }, []);
  
  // ===== FUNÇÃO: CONFIRMAR QUE LEU =====
  const handleConfirmarLeitura = () => {
    if (tempoRestante > 0) {
      alert('⏰ Aguarde alguns segundos para garantir a leitura completa.');
      return;
    }
    
    setLeituraConfirmada(true);
  };
  
  // ===== FUNÇÃO: NAVEGAR PARA ORIENTAÇÕES =====
  const handleVerOrientacoes = () => {
    onNavegar(alerta.tipo_principal, alerta.id);
  };
  
  // ===== FUNÇÃO: APENAS FECHAR =====
  const handleFechar = () => {
    onConfirmarLeitura(alerta.id);
  };
  
  // ===== OBTER EMOJI POR TIPO =====
  const obterEmojiTipo = (tipo) => {
    const emojis = {
      'incendio': '🔥',
      'enchente': '🌊',
      'tsunami': '🌊',
      'tempestade': '⛈️',
      'calor': '🌡️'
    };
    return emojis[tipo] || '⚠️';
  };
  
  // ===== OBTER COR POR NÍVEL =====
  const obterCorNivel = (nivel) => {
    const coresCSS = {
      'VERMELHO': 'var(--alert-vermelho)',
      'LARANJA': 'var(--alert-laranja)',
      'AMARELO': 'var(--alert-amarelo)',
      'VERDE': 'var(--alert-verde)'
    };
    return coresCSS[nivel] || 'var(--color-mid-gray)';
  };
  
  return (
    <>
      {/* OVERLAY BLOQUEADOR */}
      <div className="popup-overlay" />
      
      {/* POPUP PRINCIPAL */}
      <div 
        className="popup-emergencia"
        style={{ '--cor-alerta': obterCorNivel(alerta.nivel) }}
      >
        
        {/* HEADER URGENTE */}
        <div className="popup-header">
          <div className="alert-icon">
            {obterEmojiTipo(alerta.tipo_principal)}
          </div>
          <div className="alert-info">
            <h1>{alerta.titulo}</h1>
            <div className="alert-meta">
              <span className="alert-estado">{alerta.estado}</span>
              <span className={`alert-nivel nivel-${alerta.nivel.toLowerCase()}`}>
                {alerta.nivel}
              </span>
            </div>
          </div>
          {tempoRestante > 0 && (
            <div className="timer-leitura">
              <div className="timer-circle">
                <span>{tempoRestante}</span>
              </div>
              <small>segundos</small>
            </div>
          )}
        </div>
        
        {/* CONTEÚDO PRINCIPAL */}
        <div className="popup-content">
          
          {/* RESUMO DO ALERTA */}
          <div className="alert-summary">
            <p className="alert-description">{alerta.resumo}</p>
          </div>
          
          {/* INSTRUÇÕES CRÍTICAS */}
          <div className="alert-instructions">
            <h3>🚨 Ações Imediatas:</h3>
            <ul>
              {alerta.instrucoes.map((instrucao, index) => (
                <li key={index}>{instrucao}</li>
              ))}
            </ul>
          </div>
          
          {/* INFORMAÇÕES DE EMERGÊNCIA */}
          <div className="emergency-contact">
            <div className="contact-item">
              <strong>📞 Emergência:</strong>
              <span>{alerta.contato}</span>
            </div>
            <div className="contact-item">
              <strong>⏰ Detectado em:</strong>
              <span>{new Date(alerta.timestamp).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
        
        {/* FOOTER COM AÇÕES */}
        <div className="popup-footer">
          
          {/* PRIMEIRA FASE: CONFIRMAR LEITURA */}
          {!leituraConfirmada ? (
            <>
              <div className="reading-confirmation">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    onChange={handleConfirmarLeitura}
                    disabled={tempoRestante > 0}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    Li e compreendi as instruções de emergência
                    {tempoRestante > 0 && (
                      <small> (aguarde {tempoRestante}s)</small>
                    )}
                  </span>
                </label>
              </div>
              
              {tempoRestante === 0 && (
                <div className="action-buttons phase-one">
                  <button 
                    className="btn-confirmar"
                    onClick={handleConfirmarLeitura}
                  >
                    ✅ Li e Compreendi
                  </button>
                </div>
              )}
            </>
          ) : (
            /* SEGUNDA FASE: AÇÕES DISPONÍVEIS */
            <div className="action-buttons phase-two">
              <button 
                className="btn-orientacoes"
                onClick={handleVerOrientacoes}
              >
                🧭 Ver Orientações Detalhadas
              </button>
              
              <button 
                className="btn-fechar"
                onClick={handleFechar}
              >
                ❌ Fechar Alerta
              </button>
            </div>
          )}
        </div>
        
        {/* BARRA DE URGÊNCIA ANIMADA */}
        <div className="urgency-bar">
          <div className="urgency-fill"></div>
        </div>
        
      </div>
    </>
  );
}

export default PopupEmergencia;