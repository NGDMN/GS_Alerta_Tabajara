from risk_calculator import analisar_todos_estados, calcular_risco_geral
from datetime import datetime
import json

# ===== CONFIGURAÇÕES DE ALERTA =====

NIVEIS_ALERTA = {
    'VERDE': {'prioridade': 0, 'acao': 'monitorar'},
    'AMARELO': {'prioridade': 1, 'acao': 'atenção'},  
    'LARANJA': {'prioridade': 2, 'acao': 'preparar'},
    'VERMELHO': {'prioridade': 3, 'acao': 'agir_imediatamente'}
}

MENSAGENS_EMERGENCIA = {
    'incendio': {
        'titulo': '🔥 ALERTA DE INCÊNDIO',
        'instrucoes': [
            'Mantenha-se longe de áreas com vegetação seca',
            'Feche janelas e evite atividades ao ar livre',
            'Tenha um kit de emergência preparado',
            'Siga orientações da Defesa Civil'
        ],
        'contato_emergencia': '193 - Corpo de Bombeiros'
    },
    'enchente': {
        'titulo': '🌊 ALERTA DE ENCHENTE', 
        'instrucoes': [
            'Evite áreas alagáveis e margem de rios',
            'Não atravesse ruas alagadas',
            'Mantenha documentos em local seguro',
            'Desligue energia elétrica se necessário'
        ],
        'contato_emergencia': '199 - Defesa Civil'
    },
    'tsunami': {
        'titulo': '🌊 ALERTA DE TSUNAMI',
        'instrucoes': [
            'EVACUAÇÃO IMEDIATA para áreas altas',
            'Afaste-se da costa pelo menos 3km',
            'Não retorne até liberação oficial',
            'Procure abrigos de emergência'
        ],
        'contato_emergencia': '190 - Polícia Militar'
    }
}

# ===== FUNÇÕES PRINCIPAIS =====

def deve_emitir_alerta(analise_estado):
    """
    Determina se um estado necessita de alerta baseado na análise de risco.
    
    Args:
        analise_estado (dict): Dados da análise de risco do estado
        
    Returns:
        bool: True se deve emitir alerta
    """
    risco_geral = analise_estado['risco_geral']
    
    # Critérios para emissão de alerta
    if risco_geral in ['LARANJA', 'VERMELHO']:
        return True
        
    # Casos especiais: múltiplos riscos amarelos
    detalhes = analise_estado['detalhes']
    riscos_amarelos = sum(1 for tipo in detalhes.values() 
                         if tipo['nivel'] == 'AMARELO')
    
    if riscos_amarelos >= 2:  # 2+ riscos amarelos = alerta
        return True
        
    return False

def calcular_prioridade_alerta(analise_estado):
    """
    Calcula prioridade do alerta para ordenação.
    
    Args:
        analise_estado (dict): Dados da análise
        
    Returns:
        int: Prioridade (maior = mais urgente)
    """
    risco_geral = analise_estado['risco_geral']
    base_prioridade = NIVEIS_ALERTA[risco_geral]['prioridade']
    
    # Bônus por múltiplos riscos
    detalhes = analise_estado['detalhes']
    riscos_ativos = sum(1 for tipo in detalhes.values() 
                       if tipo['nivel'] != 'VERDE')
    
    # Bônus por score alto
    score_maximo = max(tipo['score'] for tipo in detalhes.values())
    bonus_score = score_maximo / 100  # 0 a 1
    
    return base_prioridade + (riscos_ativos * 0.1) + bonus_score

def criar_mensagem_alerta(analise_estado):
    """
    Cria mensagem de alerta formatada para o usuário.
    
    Args:
        analise_estado (dict): Dados da análise
        
    Returns:
        dict: Mensagem estruturada do alerta
    """
    estado = analise_estado['estado']
    risco_geral = analise_estado['risco_geral']
    risco_dominante = analise_estado['risco_dominante']
    detalhes = analise_estado['detalhes']
    
    # Obter template da mensagem
    if risco_dominante and risco_dominante in MENSAGENS_EMERGENCIA:
        template = MENSAGENS_EMERGENCIA[risco_dominante]
    else:
        # Mensagem genérica para múltiplos riscos
        template = {
            'titulo': f'⚠️ ALERTA METEOROLÓGICO',
            'instrucoes': [
                'Monitore condições climáticas',
                'Siga orientações oficiais',
                'Mantenha comunicação ativa'
            ],
            'contato_emergencia': '199 - Defesa Civil'
        }
    
    # Construir fatores de risco para contexto
    fatores_principais = []
    for tipo, dados in detalhes.items():
        if dados['nivel'] in ['LARANJA', 'VERMELHO']:
            fatores_principais.extend(dados['fatores'][:2])  # Primeiros 2 fatores
    
    return {
        'id_alerta': f"ALT_{estado}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        'estado': estado,
        'nivel': risco_geral,
        'tipo_principal': risco_dominante,
        'titulo': template['titulo'],
        'resumo': f"Situação {risco_geral.lower()} detectada em {estado}",
        'instrucoes': template['instrucoes'],
        'fatores_principais': fatores_principais[:3],  # Máximo 3 fatores
        'contato_emergencia': template['contato_emergencia'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'acao_recomendada': NIVEIS_ALERTA[risco_geral]['acao'],
        'score_principal': max(dados['score'] for dados in detalhes.values())
    }

def processar_alertas_ativos(modo_silencioso=False):
    """
    Função principal: analisa todos estados e gera alertas necessários.
    
    Args:
        modo_silencioso (bool): Se True, não mostra debug na tela
    
    Returns:
        dict: Resultado completo do processamento de alertas
    """
    if not modo_silencioso:
        print("🚨 Processando alertas de emergência...")
    
    # Obter análise completa de todos estados
    analise_completa = analisar_todos_estados(detalhado=False)
    
    # Processar cada estado
    alertas_ativos = []
    estados_monitoramento = []
    
    for estado, dados in analise_completa.items():
        if deve_emitir_alerta(dados):
            # Criar alerta estruturado
            alerta = criar_mensagem_alerta(dados)
            alerta['prioridade'] = calcular_prioridade_alerta(dados)
            alertas_ativos.append(alerta)
            
            if not modo_silencioso:
                print(f"🚨 {estado}: {dados['risco_dominante'].upper()}")
            
        else:
            # Estado em monitoramento normal
            estados_monitoramento.append({
                'estado': estado,
                'nivel': dados['risco_geral'],
                'timestamp': dados['timestamp']
            })
            
            if not modo_silencioso:
                print(f"✅ {estado}: Normal")
    
    # Ordenar alertas por prioridade (mais urgente primeiro)
    alertas_ativos.sort(key=lambda x: x['prioridade'], reverse=True)
    
    # Estatísticas do processamento
    total_estados = len(analise_completa)
    estados_alerta = len(alertas_ativos)
    estados_ok = total_estados - estados_alerta
    
    resultado = {
        'timestamp_processamento': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'alertas_ativos': alertas_ativos,
        'estados_monitoramento': estados_monitoramento,
        'estatisticas': {
            'total_estados': total_estados,
            'estados_em_alerta': estados_alerta,
            'estados_normais': estados_ok,
            'taxa_alerta': round((estados_alerta / total_estados) * 100, 1)
        },
        'status_sistema': 'OPERACIONAL'
    }
    
    if not modo_silencioso:
        print(f"\n📊 Resultado: {estados_alerta}/{total_estados} estados em alerta")
    
    return resultado

def obter_alertas_por_estado(estado_sigla):
    """
    Obtém alertas específicos para um estado.
    
    Args:
        estado_sigla (str): Sigla do estado (ex: 'RJ')
        
    Returns:
        dict: Alertas específicos do estado ou None
    """
    print(f"🔍 Verificando alertas para {estado_sigla}...")
    
    # Análise específica do estado
    analise_estado = calcular_risco_geral(estado_sigla, verbose=False)
    
    if deve_emitir_alerta(analise_estado):
        alerta = criar_mensagem_alerta(analise_estado)
        alerta['prioridade'] = calcular_prioridade_alerta(analise_estado)
        
        print(f"🚨 Alerta ativo para {estado_sigla}: {analise_estado['risco_geral']}")
        return alerta
    else:
        print(f"✅ {estado_sigla}: Sem alertas ativos")
        return None

def simular_emergencia(estado, tipo_emergencia):
    """
    Função para simular uma emergência específica (útil para testes).
    
    Args:
        estado (str): Estado para simular
        tipo_emergencia (str): Tipo ('incendio', 'enchente', 'tsunami')
        
    Returns:
        dict: Alerta simulado
    """
    dados_simulados = {
        'estado': estado,
        'risco_geral': 'VERMELHO',
        'risco_dominante': tipo_emergencia,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'detalhes': {
            tipo_emergencia: {
                'nivel': 'VERMELHO',
                'score': 95.0,
                'fatores': [f'Simulação de {tipo_emergencia} crítica']
            }
        }
    }
    
    return criar_mensagem_alerta(dados_simulados)

# ===== FUNÇÃO DE TESTE =====

def testar_alert_system():
    """
    Bateria de testes do sistema de alertas.
    """
    print("🧪 TESTANDO SISTEMA DE ALERTAS")
    print("=" * 40)
    
    print("\n1️⃣ Teste: Processamento Completo")
    resultado = processar_alertas_ativos()
    
    print(f"\n2️⃣ Teste: Alerta Específico (RJ)")
    alerta_rj = obter_alertas_por_estado('RJ')
    
    print(f"\n3️⃣ Teste: Simulação de Emergência")
    emergencia_simulada = simular_emergencia('SP', 'enchente')
    print("Emergência simulada criada:")
    print(f"   Título: {emergencia_simulada['titulo']}")
    print(f"   Nível: {emergencia_simulada['nivel']}")
    
    print(f"\n4️⃣ Análise dos Resultados")
    if resultado['alertas_ativos']:
        print("Estados com alertas ativos:")
        for alerta in resultado['alertas_ativos']:
            print(f"   🚨 {alerta['estado']}: {alerta['titulo']}")
    else:
        print("✅ Nenhum alerta ativo no momento")
    
    return resultado

if __name__ == '__main__':
    testar_alert_system()