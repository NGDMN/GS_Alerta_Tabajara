// src/pages/Orientacoes.jsx
import React, { useState, useEffect } from 'react';
import './Orientacoes.css';

function Orientacoes() {
  // ===== ESTADOS: Controle da interface =====
  const [tipoSelecionado, setTipoSelecionado] = useState('incendio');
  const [estadoSelecionado, setEstadoSelecionado] = useState('RJ');
  const [abrigoMaisProximo, setAbrigoMaisProximo] = useState(null);
  const [simulandoRota, setSimulandoRota] = useState(false);

  // ===== DADOS: Instruções por tipo de emergência =====
  const instrucoesPorTipo = {
    incendio: {
      titulo: '🔥 Incêndio Florestal',
      cor: 'var(--alert-vermelho)',
      urgencia: 'CRÍTICA',
      tempoAcao: '2-5 minutos',
      instrucoes: [
        {
          fase: 'IMEDIATO',
          tempo: '0-2 min',
          acoes: [
            'Mantenha-se longe de áreas com vegetação seca',
            'Feche todas as janelas e portas da casa',
            'Desligue gás, energia e eletrônicos',
            'Molhe toalhas e cubra boca e nariz'
          ]
        },
        {
          fase: 'EVACUAÇÃO',
          tempo: '2-5 min',
          acoes: [
            'Pegue documentos, medicamentos e água',
            'Vista roupas de manga longa e calças',
            'Dirija-se para área aberta ou abrigo',
            'Siga rotas indicadas pela Defesa Civil'
          ]
        },
        {
          fase: 'SEGURANÇA',
          tempo: 'Após evacuação',
          acoes: [
            'Não retorne até liberação oficial',
            'Mantenha contato com autoridades',
            'Monitore boletins oficiais',
            'Procure abrigo se necessário'
          ]
        }
      ],
      contatos: [
        { nome: 'Bombeiros', numero: '193', tipo: 'emergencia' },
        { nome: 'Defesa Civil', numero: '199', tipo: 'coordenacao' },
        { nome: 'SAMU', numero: '192', tipo: 'medico' }
      ],
      prevencao: [
        'Mantenha limpeza em volta da casa (15m)',
        'Crie aceiros e mantenha mangueiras',
        'Tenha kit de emergência preparado',
        'Conheça rotas de evacuação'
      ]
    },
    enchente: {
      titulo: '🌊 Enchente e Alagamento',
      cor: 'var(--alert-laranja)',
      urgencia: 'ALTA',
      tempoAcao: '10-30 minutos',
      instrucoes: [
        {
          fase: 'PREPARAÇÃO',
          tempo: '0-10 min',
          acoes: [
            'Desligue energia elétrica geral',
            'Feche registro de gás',
            'Mova itens valiosos para andar superior',
            'Prepare kit de emergência'
          ]
        },
        {
          fase: 'EVACUAÇÃO',
          tempo: '10-30 min',
          acoes: [
            'Saia de casa se água subir muito',
            'NUNCA atravesse águas em movimento',
            'Evite contato com fios elétricos',
            'Dirija-se para terreno mais alto'
          ]
        },
        {
          fase: 'PÓS-EVENTO',
          tempo: 'Após baixar',
          acoes: [
            'Não entre em casa antes de vistoria',
            'Cuidado com animais peçonhentos',
            'Desinfete tudo que teve contato com água',
            'Documente perdas para seguro'
          ]
        }
      ],
      contatos: [
        { nome: 'Defesa Civil', numero: '199', tipo: 'emergencia' },
        { nome: 'Bombeiros', numero: '193', tipo: 'resgate' },
        { nome: 'Polícia Militar', numero: '190', tipo: 'seguranca' }
      ],
      prevencao: [
        'Não construa em áreas alagáveis',
        'Mantenha bueiros desobstruídos',
        'Tenha sempre documentos protegidos',
        'Conheça pontos mais altos da região'
      ]
    },
    tsunami: {
      titulo: '🌊 Tsunami',
      cor: 'var(--alert-vermelho)',
      urgencia: 'EXTREMA',
      tempoAcao: '5-20 minutos',
      instrucoes: [
        {
          fase: 'DETECÇÃO',
          tempo: '0-1 min',
          acoes: [
            'Sinta tremor de terra forte? TSUNAMI!',
            'Vê o mar recuando muito? EVACUAÇÃO JÁ!',
            'Ouviu sirene oficial? CORRA!',
            'Abandone TUDO e vá para área alta'
          ]
        },
        {
          fase: 'EVACUAÇÃO',
          tempo: '1-5 min',
          acoes: [
            'Dirija-se IMEDIATAMENTE para área alta',
            'Mínimo 30m de altura ou 3km da costa',
            'VÁ A PÉ se trânsito estiver travado',
            'Ajude idosos e crianças'
          ]
        },
        {
          fase: 'SEGURANÇA',
          tempo: 'Várias horas',
          acoes: [
            'Fique em área alta por NO MÍNIMO 8 horas',
            'Tsunami tem múltiplas ondas',
            'Só retorne com liberação OFICIAL',
            'Monitore rádio para orientações'
          ]
        }
      ],
      contatos: [
        { nome: 'Emergência', numero: '190', tipo: 'emergencia' },
        { nome: 'Defesa Civil', numero: '199', tipo: 'coordenacao' },
        { nome: 'Marinha', numero: '185', tipo: 'maritimo' }
      ],
      prevencao: [
        'Conheça sirenes de tsunami da região',
        'Saiba rotas de evacuação vertical',
        'Tenha sempre documentos importantes',
        'Pratique evacuação com a família'
      ]
    }
  };

  // ===== DADOS: Estados e abrigos simulados =====
  const estadosDisponiveis = [
    { sigla: 'RJ', nome: 'Rio de Janeiro', abrigos: 8 },
    { sigla: 'SC', nome: 'Santa Catarina', abrigos: 12 },
    { sigla: 'CE', nome: 'Ceará', abrigos: 6 },
    { sigla: 'PE', nome: 'Pernambuco', abrigos: 10 },
    { sigla: 'AL', nome: 'Alagoas', abrigos: 4 },
    { sigla: 'BA', nome: 'Bahia', abrigos: 15 }
  ];

  const abrigosSimulados = {
    'RJ': [
      { nome: 'Escola Municipal Santos Dumont', distancia: '1.2km', capacidade: 200, ocupacao: 45 },
      { nome: 'Ginásio Poliesportivo Central', distancia: '2.8km', capacidade: 500, ocupacao: 120 },
      { nome: 'Centro Comunitário Copacabana', distancia: '3.5km', capacidade: 150, ocupacao: 30 }
    ],
    'SC': [
      { nome: 'Centro de Convenções', distancia: '0.8km', capacidade: 300, ocupacao: 80 },
      { nome: 'Escola Técnica Federal', distancia: '1.5km', capacidade: 250, ocupacao: 60 }
    ],
    'CE': [
      { nome: 'Arena Multiuso', distancia: '2.1km', capacidade: 400, ocupacao: 90 },
      { nome: 'Escola Estadual Fortaleza', distancia: '3.2km', capacidade: 180, ocupacao: 40 }
    ]
    // Outros estados seguem padrão similar
  };

  // ===== EFFECT: Atualiza abrigo quando muda estado =====
  useEffect(() => {
    const abrigos = abrigosSimulados[estadoSelecionado] || [];
    if (abrigos.length > 0) {
      // Encontra abrigo mais próximo com capacidade
      const abrigoDisponivel = abrigos.find(abrigo => 
        (abrigo.ocupacao / abrigo.capacidade) < 0.8
      ) || abrigos[0];
      
      setAbrigoMaisProximo(abrigoDisponivel);
    }
  }, [estadoSelecionado]);

  // ===== FUNÇÃO: Simular ida para abrigo =====
  const irParaAbrigo = () => {
    setSimulandoRota(true);
    
    // Simula processo de navegação
    setTimeout(() => {
      alert(`🧭 ROTA CALCULADA!\n\n` +
            `📍 Destino: ${abrigoMaisProximo.nome}\n` +
            `📏 Distância: ${abrigoMaisProximo.distancia}\n` +
            `👥 Vagas disponíveis: ${abrigoMaisProximo.capacidade - abrigoMaisProximo.ocupacao}\n\n` +
            `🚗 Tempo estimado: ${Math.ceil(parseFloat(abrigoMaisProximo.distancia) * 3)} minutos\n\n` +
            `⚠️ Em emergência real, siga orientações da Defesa Civil!`);
      setSimulandoRota(false);
    }, 2000);
  };

  // ===== FUNÇÃO: Obter cor por tipo =====
  const obterCorTipo = (tipo) => {
    return instrucoesPorTipo[tipo]?.cor || 'var(--color-mid-gray)';
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="orientacoes page-enter">
      <div className="page-container">
        
        {/* HEADER DE EMERGÊNCIA */}
        <section className="emergency-header">
          <h1>🚨 Orientações de Emergência</h1>
          <p>Instruções oficiais da Defesa Civil para situações de risco</p>
          
          {/* SELETOR DE TIPO DE EMERGÊNCIA */}
          <div className="tipo-selector">
            {Object.keys(instrucoesPorTipo).map(tipo => (
              <button
                key={tipo}
                className={`tipo-button ${tipoSelecionado === tipo ? 'active' : ''}`}
                onClick={() => setTipoSelecionado(tipo)}
                style={{
                  '--tipo-cor': obterCorTipo(tipo)
                }}
              >
                {instrucoesPorTipo[tipo].titulo.split(' ')[0]} {/* Emoji */}
                <span>{instrucoesPorTipo[tipo].titulo.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </section>

        {/* INSTRUÇÕES DETALHADAS */}
        <section className="instrucoes-detalhadas">
          <div 
            className="instrucoes-card"
            style={{ '--instrucao-cor': obterCorTipo(tipoSelecionado) }}
          >
            
            {/* HEADER DA INSTRUÇÃO */}
            <div className="instrucao-header">
              <div className="titulo-emergencia">
                <h2>{instrucoesPorTipo[tipoSelecionado].titulo}</h2>
                <div className="urgencia-info">
                  <span className="urgencia-badge">
                    {instrucoesPorTipo[tipoSelecionado].urgencia}
                  </span>
                  <span className="tempo-acao">
                    ⏱️ Tempo para ação: {instrucoesPorTipo[tipoSelecionado].tempoAcao}
                  </span>
                </div>
              </div>
            </div>

            {/* FASES DE AÇÃO */}
            <div className="fases-acao">
              {instrucoesPorTipo[tipoSelecionado].instrucoes.map((fase, index) => (
                <div key={index} className="fase-card">
                  <div className="fase-header">
                    <span className="fase-numero">{index + 1}</span>
                    <div className="fase-info">
                      <h3>{fase.fase}</h3>
                      <span className="fase-tempo">{fase.tempo}</span>
                    </div>
                  </div>
                  
                  <div className="acoes-lista">
                    {fase.acoes.map((acao, acaoIndex) => (
                      <div key={acaoIndex} className="acao-item">
                        <span className="acao-bullet">•</span>
                        <span className="acao-texto">{acao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CONTATOS DE EMERGÊNCIA */}
            <div className="contatos-emergencia">
              <h3>📞 Contatos de Emergência</h3>
              <div className="contatos-grid">
                {instrucoesPorTipo[tipoSelecionado].contatos.map((contato, index) => (
                  <div key={index} className={`contato-card tipo-${contato.tipo}`}>
                    <span className="contato-nome">{contato.nome}</span>
                    <span className="contato-numero">{contato.numero}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SISTEMA DE ABRIGOS */}
        <section className="sistema-abrigos">
          <div className="gsx-card">
            <h2>🏠 Localizar Abrigo Mais Próximo</h2>
            <p>Sistema simulado para encontrar abrigos de emergência disponíveis</p>
            
            {/* SELETOR DE ESTADO */}
            <div className="estado-selector">
              <label htmlFor="estado-select">📍 Selecione seu estado:</label>
              <select 
                id="estado-select"
                value={estadoSelecionado}
                onChange={(e) => setEstadoSelecionado(e.target.value)}
                className="estado-select"
              >
                {estadosDisponiveis.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome} ({estado.abrigos} abrigos)
                  </option>
                ))}
              </select>
            </div>

            {/* ABRIGO RECOMENDADO */}
            {abrigoMaisProximo && (
              <div className="abrigo-recomendado">
                <h3>🎯 Abrigo Mais Próximo</h3>
                <div className="abrigo-info">
                  <div className="abrigo-detalhes">
                    <h4>{abrigoMaisProximo.nome}</h4>
                    <div className="abrigo-stats">
                      <span className="stat-item">
                        📏 <strong>{abrigoMaisProximo.distancia}</strong> de distância
                      </span>
                      <span className="stat-item">
                        👥 <strong>{abrigoMaisProximo.capacidade - abrigoMaisProximo.ocupacao}</strong> vagas disponíveis
                      </span>
                      <span className="stat-item">
                        📊 <strong>{Math.round((abrigoMaisProximo.ocupacao / abrigoMaisProximo.capacidade) * 100)}%</strong> ocupação
                      </span>
                    </div>
                  </div>
                  
                  <div className="abrigo-acao">
                    <button 
                      className="gsx-button ir-abrigo-button"
                      onClick={irParaAbrigo}
                      disabled={simulandoRota}
                    >
                      {simulandoRota ? (
                        <>🗺️ Calculando rota...</>
                      ) : (
                        <>🚗 IR PARA ABRIGO AGORA</>
                      )}
                    </button>
                    <small className="abrigo-hint">
                      Clique para simular navegação até o abrigo
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* MAPA VISUAL SIMPLES */}
        <section className="mapa-estados">
          <div className="gsx-card">
            <h2>🗺️ Estados Costeiros Monitorados</h2>
            <div className="estados-mapa">
              {estadosDisponiveis.map(estado => (
                <div 
                  key={estado.sigla}
                  className={`estado-mapa-item ${estadoSelecionado === estado.sigla ? 'selecionado' : ''}`}
                  onClick={() => setEstadoSelecionado(estado.sigla)}
                >
                  <span className="estado-sigla">{estado.sigla}</span>
                  <span className="estado-nome">{estado.nome}</span>
                  <span className="abrigos-count">{estado.abrigos} abrigos</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DICAS DE PREVENÇÃO */}
        <section className="prevencao-dicas">
          <div className="gsx-card">
            <h2>🛡️ Prevenção - {instrucoesPorTipo[tipoSelecionado].titulo}</h2>
            <div className="dicas-grid">
              {instrucoesPorTipo[tipoSelecionado].prevencao.map((dica, index) => (
                <div key={index} className="dica-item">
                  <span className="dica-numero">{index + 1}</span>
                  <span className="dica-texto">{dica}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER DE EMERGÊNCIA */}
        <section className="emergency-footer">
          <div className="footer-alert">
            <h3>⚠️ IMPORTANTE</h3>
            <p>
              <strong>Este é um sistema simulado para fins educacionais.</strong> 
              Em emergências reais, sempre siga orientações oficiais da Defesa Civil, 
              Bombeiros e autoridades locais.
            </p>
            <div className="emergency-numbers">
              <span>🚨 Emergência: <strong>190/193/192</strong></span>
              <span>🏛️ Defesa Civil: <strong>199</strong></span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Orientacoes;