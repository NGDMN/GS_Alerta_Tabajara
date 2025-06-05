from database_connection import conectar_db, desconectar_db
from datetime import datetime, timedelta
import math

# ===== THRESHOLDS REALISTAS BASEADOS EM DADOS CIENTÍFICOS =====

THRESHOLDS = {
    'incendio': {
        # Baseado no Índice de Perigo de Incêndio (FWI - Fire Weather Index)
        'temperatura_critica': 35.0,      # °C - Calor extremo
        'umidade_critica': 30.0,          # % - Ar muito seco
        'vento_critico': 20.0,            # m/s - Vento forte espalha fogo
        'precipitacao_baixa': 2.0,        # mm - Pouca chuva = vegetação seca
        'dias_sem_chuva': 7               # dias consecutivos
    },
    
    'enchente': {
        # Baseado em dados do CEMADEN e Defesa Civil
        'chuva_intensa_1h': 50.0,         # mm/h - Chuva muito forte
        'chuva_acumulada_24h': 100.0,     # mm/24h - Precipitação crítica
        'chuva_acumulada_72h': 180.0,     # mm/72h - Solo saturado
        'nivel_mar_alto': 2.5,            # m - Maré alta + ressaca
        'vento_tempestade': 15.0          # m/s - Ventos de tempestade
    },
    
    'tsunami': {
        # Baseado na Escala de Magnitude de Momento (Mw)
        'magnitude_sismica_minima': 6.0,   # Mw - Potencial para tsunami
        'magnitude_sismica_critica': 7.5,  # Mw - Tsunami destrutivo
        'profundidade_max': 70.0,         # km - Terremotos rasos são mais perigosos
        'distancia_costa': 1000.0         # km - Distância da costa
    },
    
    'tempestade': {
        # Baseado na Escala Beaufort e critérios meteorológicos
        'vento_forte': 10.0,              # m/s - Vento forte
        'vento_muito_forte': 17.0,        # m/s - Vento muito forte  
        'vento_tempestade': 25.0,         # m/s - Tempestade
        'pressao_baixa': 1005.0,          # hPa - Baixa pressão
        'chuva_intensa': 30.0             # mm/h - Chuva de tempestade
    },
    
    'onda_calor': {
        # Baseado em critérios do INMET
        'temperatura_alta': 32.0,         # °C - Calor intenso
        'temperatura_extrema': 37.0,      # °C - Calor extremo
        'dias_consecutivos': 3,           # dias - Persistência do calor
        'umidade_baixa': 20.0             # % - Ar muito seco
    }
}

# ===== NÍVEIS DE ALERTA =====
NIVEIS_ALERTA = {
    'VERDE': {'valor': 0, 'descricao': 'Situação Normal', 'cor': '#10B981'},
    'AMARELO': {'valor': 1, 'descricao': 'Atenção', 'cor': '#F59E0B'},
    'LARANJA': {'valor': 2, 'descricao': 'Alerta', 'cor': '#EF4444'},
    'VERMELHO': {'valor': 3, 'descricao': 'Emergência', 'cor': '#DC2626'}
}

def buscar_dados_recentes(estado_sigla, horas=24):
    """
    Busca dados de sensores das últimas X horas para um estado.
    
    Args:
        estado_sigla (str): Sigla do estado (ex: 'RJ')
        horas (int): Quantas horas atrás buscar
    
    Returns:
        list: Lista de tuplas com dados dos sensores
    """
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao or not cursor:
            return []
        
        tempo_limite = datetime.now() - timedelta(hours=horas)
        
        cursor.execute("""
            SELECT temperatura, umidade, velocidade_vento,
                   precipitacao, altura_ondas, magnitude_sismica,
                   timestamp_coleta, pressao_atmosferica, nivel_mar
            FROM sensores s
            JOIN estados e ON s.estado_id = e.id
            WHERE e.sigla = ? AND s.timestamp_coleta >= ?
            ORDER BY timestamp_coleta DESC
        """, (estado_sigla, tempo_limite))
        
        resultados = cursor.fetchall()
        desconectar_db(conexao, silent=True)
        
        return resultados
        
    except Exception as e:
        print(f"Erro ao buscar dados recentes: {e}")
        return []

def calcular_chuva_acumulada(dados_recentes, horas=24):
    """
    Calcula precipitação acumulada em um período específico.
    
    Args:
        dados_recentes (list): Dados dos sensores
        horas (int): Período em horas para acumular
    
    Returns:
        float: Precipitação total em mm
    """
    total_chuva = 0.0
    tempo_limite = datetime.now() - timedelta(hours=horas)
    
    for linha in dados_recentes:
        try:
            precipitacao = linha[3]  # Índice 3 = precipitacao
            timestamp_str = linha[6]  # Índice 6 = timestamp_coleta
            
            data_leitura = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            
            if data_leitura >= tempo_limite and precipitacao is not None:
                total_chuva += precipitacao
                
        except (ValueError, TypeError) as e:
            print(f"Erro ao processar linha: {e}")
            continue
    
    return round(total_chuva, 2)

def calcular_media_periodo(dados_recentes, campo_indice, horas=24):
    """
    Calcula média de um campo específico em um período.
    
    Args:
        dados_recentes (list): Dados dos sensores
        campo_indice (int): Índice do campo na tupla
        horas (int): Período em horas
    
    Returns:
        float: Média do campo no período
    """
    valores = []
    tempo_limite = datetime.now() - timedelta(hours=horas)
    
    for linha in dados_recentes:
        try:
            valor = linha[campo_indice]
            timestamp_str = linha[6]  # timestamp sempre no índice 6
            
            data_leitura = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            
            if data_leitura >= tempo_limite and valor is not None:
                valores.append(valor)
                
        except (ValueError, TypeError):
            continue
    
    return round(sum(valores) / len(valores), 2) if valores else 0.0

def detectar_onda_calor(dados_recentes):
    """
    Detecta padrões de onda de calor baseado na análise temporal.
    
    Returns:
        dict: Análise da onda de calor
    """
    if len(dados_recentes) < 3:
        return {'tipo': 'dados_insuficientes', 'dias_consecutivos': 0}
    
    # Extrair temperaturas dos últimos dias (1 leitura por dia)
    temperaturas_diarias = []
    dias_processados = set()
    
    for linha in dados_recentes:
        timestamp_str = linha[6]
        temp = linha[0]
        
        if temp is None:
            continue
            
        # Extrair apenas a data (sem hora)
        data = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S').date()
        
        # Evitar duplicatas do mesmo dia
        if data not in dias_processados:
            temperaturas_diarias.append((data, temp))
            dias_processados.add(data)
    
    # Ordenar por data (mais recente primeiro)
    temperaturas_diarias.sort(key=lambda x: x[0], reverse=True)
    
    if len(temperaturas_diarias) < 3:
        return {'tipo': 'dados_insuficientes', 'dias_consecutivos': 0}
    
    # Análise de padrão
    temps = [t[1] for t in temperaturas_diarias[:7]]  # Últimos 7 dias
    
    # Contar dias consecutivos acima de 30°C
    dias_consecutivos_calor = 0
    for temp in temps:
        if temp >= 30.0:
            dias_consecutivos_calor += 1
        else:
            break  # Para na primeira temperatura abaixo de 30°C
    
    # Detectar tendência
    if len(temps) >= 3:
        temp_hoje = temps[0]
        temp_ontem = temps[1] 
        temp_anteontem = temps[2]
        
    # Detectar tendência MELHORADA baseada na análise do usuário
    if len(temps) >= 3:
        temp_hoje = temps[0]
        temp_ontem = temps[1] 
        temp_anteontem = temps[2]
        
        # Critério: pelo menos 30°C para ser considerado "calor significativo"
        TEMP_CALOR_SIGNIFICATIVO = 30.0
        
        # Cenário A: Escalada rápida (pico súbito)
        if (temp_hoje >= 35 and 
            temp_ontem < 30 and 
            temp_anteontem < 30):
            tipo_onda = 'pico_subito_critico'
        
        # Cenário B: Aquecimento progressivo
        elif temp_hoje > temp_ontem > temp_anteontem and temp_hoje >= TEMP_CALOR_SIGNIFICATIVO:
            tipo_onda = 'aquecimento_progressivo'
        
        # Cenário C: Platô de calor alto (NOVA DETECÇÃO)
        elif (all(t >= TEMP_CALOR_SIGNIFICATIVO for t in temps[:3]) and
              max(temps[:3]) - min(temps[:3]) <= 2.0):  # Variação <= 2°C
            tipo_onda = 'plato_calor_intenso'
        
        # Onda estabelecida (múltiplos dias consecutivos)
        elif dias_consecutivos_calor >= 4:
            tipo_onda = 'onda_calor_estabelecida'
        
        # Calor persistente (3+ dias acima de 30°C)
        elif dias_consecutivos_calor >= 3:
            tipo_onda = 'calor_persistente'
        
        # Apenas calor esporádico
        elif temp_hoje >= TEMP_CALOR_SIGNIFICATIVO:
            tipo_onda = 'calor_esporadico'
        
        else:
            tipo_onda = 'temperaturas_normais'
    else:
        tipo_onda = 'dados_limitados'
    
    return {
        'tipo': tipo_onda,
        'dias_consecutivos': dias_consecutivos_calor,
        'temperaturas_recentes': temps[:5],  # Últimas 5 temperaturas
        'temperatura_maxima': max(temps) if temps else 0,
        'temperatura_media': round(sum(temps) / len(temps), 1) if temps else 0
    }
def calcular_risco_incendio(estado_sigla):
    """
    Calcula risco de incêndio baseado em:
    - Temperatura alta + Umidade baixa + Vento forte + Falta de chuva + Padrão temporal
    
    Returns:
        dict: {'nivel': str, 'score': float, 'fatores': list}
    """
    # Buscar dados das últimas 168h (7 dias) para análise robusta
    dados = buscar_dados_recentes(estado_sigla, 168)
    
    if not dados:
        return {'nivel': 'VERDE', 'score': 0.0, 'fatores': ['Sem dados disponíveis']}
    
    # Dados mais recentes (última leitura)
    ultimo_registro = dados[0]
    temp_atual = ultimo_registro[0] or 0      # temperatura (tratamento None)
    umidade_atual = ultimo_registro[1] or 0   # umidade  
    vento_atual = ultimo_registro[2] or 0     # velocidade_vento
    
    # Análise temporal avançada
    temp_media_24h = calcular_media_periodo(dados, 0, 24)  # temperatura
    chuva_7_dias = calcular_chuva_acumulada(dados, 168)    # 7 dias = 168h
    
    # NOVA: Análise de onda de calor
    onda_calor = detectar_onda_calor(dados)
    
    # Cálculo de score (0-100)
    score = 0
    fatores = []
    
    # Fator 1A: Temperatura atual (peso 20%) 
    if temp_atual >= THRESHOLDS['incendio']['temperatura_critica']:
        score += 20
        fatores.append(f"Temperatura crítica: {temp_atual}°C")
    elif temp_atual >= 30:
        score += 10
        fatores.append(f"Temperatura alta: {temp_atual}°C")
    
    # Fator 1B: Persistência do calor (peso 15%) - CORREÇÃO APLICADA
    if temp_media_24h >= 30.0:  # Calor persistente por 24h
        score += 15
        fatores.append(f"Calor persistente: média {temp_media_24h}°C/24h")
    elif temp_media_24h >= 27.0:  # Tendência de aquecimento
        score += 7
        fatores.append(f"Tendência de aquecimento: {temp_media_24h}°C/24h")
    
    # NOVO: Fator 1C: Padrão de onda de calor MELHORADO (peso 15%)
    if onda_calor['tipo'] == 'pico_subito_critico':
        score += 15
        fatores.append(f"⚠️ PICO SÚBITO CRÍTICO: {temp_atual}°C (era {onda_calor['temperaturas_recentes'][1]}°C ontem)")
    elif onda_calor['tipo'] == 'plato_calor_intenso':
        score += 12
        fatores.append(f"🔥 Platô de calor intenso: {onda_calor['dias_consecutivos']} dias estáveis em {temp_atual}°C")
    elif onda_calor['tipo'] == 'aquecimento_progressivo':
        score += 10
        fatores.append(f"📈 Aquecimento progressivo: {onda_calor['temperaturas_recentes'][2]}°→{onda_calor['temperaturas_recentes'][1]}°→{temp_atual}°C")
    elif onda_calor['tipo'] == 'onda_calor_estabelecida':
        score += 8
        fatores.append(f"🌡️ Onda estabelecida: {onda_calor['dias_consecutivos']} dias consecutivos")
    elif onda_calor['tipo'] == 'calor_persistente':
        score += 6
        fatores.append(f"♨️ Calor persistente: {onda_calor['dias_consecutivos']} dias acima de 30°C")
    
    # Fator 2: Umidade (peso 20%) - Peso reduzido para acomodar nova análise
    if umidade_atual <= THRESHOLDS['incendio']['umidade_critica']:
        score += 20
        fatores.append(f"Umidade crítica: {umidade_atual}%")
    elif umidade_atual <= 40:
        score += 10
        fatores.append(f"Umidade baixa: {umidade_atual}%")
    
    # Fator 3: Vento (peso 15%) - Peso reduzido
    if vento_atual >= THRESHOLDS['incendio']['vento_critico']:
        score += 15
        fatores.append(f"Vento forte: {vento_atual} m/s")
    elif vento_atual >= 12:
        score += 7
        fatores.append(f"Vento moderado: {vento_atual} m/s")
    
    # Fator 4: Precipitação (peso 20%) - Peso reduzido
    if chuva_7_dias <= THRESHOLDS['incendio']['precipitacao_baixa']:
        score += 20
        fatores.append(f"Seca prolongada: {chuva_7_dias}mm em 7 dias")
    elif chuva_7_dias <= 10:
        score += 10
        fatores.append(f"Pouca chuva: {chuva_7_dias}mm em 7 dias")
    
    # Determinar nível baseado no score
    if score >= 70:
        nivel = 'VERMELHO'
    elif score >= 50:
        nivel = 'LARANJA'
    elif score >= 25:
        nivel = 'AMARELO'
    else:
        nivel = 'VERDE'
    
    return {
        'nivel': nivel,
        'score': round(score, 1),
        'fatores': fatores if fatores else ['Condições normais'],
        'dados_analisados': {
            'temperatura_atual': temp_atual,
            'temperatura_media_24h': temp_media_24h,
            'umidade_atual': umidade_atual,
            'vento_atual': vento_atual,
            'chuva_7_dias': chuva_7_dias,
            'onda_calor': onda_calor
        }
    }

def calcular_risco_enchente(estado_sigla):
    """
    Calcula risco de enchente baseado em:
    - Precipitação intensa + Acúmulo de chuva + Nível do mar + Vento
    """
    dados = buscar_dados_recentes(estado_sigla, 72)  # 3 dias de dados
    
    if not dados:
        return {'nivel': 'VERDE', 'score': 0.0, 'fatores': ['Sem dados disponíveis']}
    
    # Análises temporais
    chuva_1h = dados[0][3] if dados[0][3] else 0    # Última precipitação
    chuva_24h = calcular_chuva_acumulada(dados, 24)
    chuva_72h = calcular_chuva_acumulada(dados, 72)
    nivel_mar = dados[0][8] if dados[0][8] else 0   # Último nível do mar
    vento_atual = dados[0][2] if dados[0][2] else 0
    
    score = 0
    fatores = []
    
    # Fator 1: Chuva na última hora (peso 25%)
    if chuva_1h >= THRESHOLDS['enchente']['chuva_intensa_1h']:
        score += 25
        fatores.append(f"Chuva intensa: {chuva_1h}mm/h")
    elif chuva_1h >= 25:
        score += 12
        fatores.append(f"Chuva forte: {chuva_1h}mm/h")
    
    # Fator 2: Chuva acumulada 24h (peso 30%)
    if chuva_24h >= THRESHOLDS['enchente']['chuva_acumulada_24h']:
        score += 30
        fatores.append(f"Acúmulo crítico 24h: {chuva_24h}mm")
    elif chuva_24h >= 50:
        score += 15
        fatores.append(f"Acúmulo alto 24h: {chuva_24h}mm")
    
    # Fator 3: Chuva acumulada 72h (peso 25%)
    if chuva_72h >= THRESHOLDS['enchente']['chuva_acumulada_72h']:
        score += 25
        fatores.append(f"Solo saturado: {chuva_72h}mm em 3 dias")
    elif chuva_72h >= 120:
        score += 12
        fatores.append(f"Solo úmido: {chuva_72h}mm em 3 dias")
    
    # Fator 4: Nível do mar (peso 10%)
    if nivel_mar >= THRESHOLDS['enchente']['nivel_mar_alto']:
        score += 10
        fatores.append(f"Nível do mar alto: {nivel_mar}m")
    
    # Fator 5: Vento de tempestade (peso 10%)
    if vento_atual >= THRESHOLDS['enchente']['vento_tempestade']:
        score += 10
        fatores.append(f"Vento de tempestade: {vento_atual} m/s")
    
    # Determinar nível
    if score >= 75:
        nivel = 'VERMELHO'
    elif score >= 50:
        nivel = 'LARANJA'
    elif score >= 25:
        nivel = 'AMARELO'
    else:
        nivel = 'VERDE'
    
    return {
        'nivel': nivel,
        'score': round(score, 1),
        'fatores': fatores if fatores else ['Condições normais'],
        'dados_analisados': {
            'chuva_1h': chuva_1h,
            'chuva_24h': chuva_24h,
            'chuva_72h': chuva_72h,
            'nivel_mar': nivel_mar,
            'vento': vento_atual
        }
    }

def calcular_risco_tsunami(estado_sigla):
    """
    Calcula risco de tsunami baseado em atividade sísmica.
    """
    dados = buscar_dados_recentes(estado_sigla, 24)
    
    if not dados:
        return {'nivel': 'VERDE', 'score': 0.0, 'fatores': ['Sem dados disponíveis']}
    
    # Buscar maior magnitude sísmica nas últimas 24h
    max_magnitude = 0
    for linha in dados:
        magnitude = linha[5] if linha[5] else 0  # magnitude_sismica
        if magnitude > max_magnitude:
            max_magnitude = magnitude
    
    score = 0
    fatores = []
    
    # Tsunami é evento raro mas catastrófico
    if max_magnitude >= THRESHOLDS['tsunami']['magnitude_sismica_critica']:
        score = 100
        fatores.append(f"Terremoto destrutivo: Magnitude {max_magnitude}")
    elif max_magnitude >= THRESHOLDS['tsunami']['magnitude_sismica_minima']:
        score = 60
        fatores.append(f"Atividade sísmica significativa: Magnitude {max_magnitude}")
    elif max_magnitude >= 4.0:
        score = 20
        fatores.append(f"Atividade sísmica detectada: Magnitude {max_magnitude}")
    
    # Determinar nível
    if score >= 80:
        nivel = 'VERMELHO'
    elif score >= 60:
        nivel = 'LARANJA'
    elif score >= 20:
        nivel = 'AMARELO'
    else:
        nivel = 'VERDE'
    
    return {
        'nivel': nivel,
        'score': round(score, 1),
        'fatores': fatores if fatores else ['Atividade sísmica normal'],
        'dados_analisados': {
            'magnitude_maxima': max_magnitude
        }
    }

def calcular_risco_geral(estado_sigla, verbose=False):
    """
    Calcula análise de risco completa para um estado.
    
    Args:
        estado_sigla (str): Sigla do estado
        verbose (bool): Se True, mostra detalhes da análise
    
    Returns:
        dict: Análise completa com todos os tipos de risco
    """
    if verbose:
        print(f"\n🔍 Analisando riscos para {estado_sigla}...")
    
    # Calcular cada tipo de risco
    risco_incendio = calcular_risco_incendio(estado_sigla)
    risco_enchente = calcular_risco_enchente(estado_sigla)
    risco_tsunami = calcular_risco_tsunami(estado_sigla)
    
    # NOVA FUNCIONALIDADE: Mostrar detalhes por tipo
    if verbose:
        print(f"   🔥 Incêndio: {risco_incendio['nivel']} (Score: {risco_incendio['score']})")
        if risco_incendio['fatores'] != ['Condições normais']:
            for fator in risco_incendio['fatores']:
                print(f"      • {fator}")
                
        print(f"   🌊 Enchente: {risco_enchente['nivel']} (Score: {risco_enchente['score']})")
        if risco_enchente['fatores'] != ['Condições normais']:
            for fator in risco_enchente['fatores']:
                print(f"      • {fator}")
                
        print(f"   🌊 Tsunami: {risco_tsunami['nivel']} (Score: {risco_tsunami['score']})")
        if risco_tsunami['fatores'] != ['Atividade sísmica normal']:
            for fator in risco_tsunami['fatores']:
                print(f"      • {fator}")
    
    # Determinar risco geral (maior nível entre todos)
    riscos = [risco_incendio['nivel'], risco_enchente['nivel'], risco_tsunami['nivel']]
    
    # Prioridade: VERMELHO > LARANJA > AMARELO > VERDE
    ordem_prioridade = ['VERMELHO', 'LARANJA', 'AMARELO', 'VERDE']
    
    risco_geral = 'VERDE'
    risco_dominante = None
    
    for nivel in ordem_prioridade:
        if nivel in riscos:
            risco_geral = nivel
            # Identificar qual tipo de risco está causando o alerta
            if risco_incendio['nivel'] == nivel:
                risco_dominante = 'incendio'
            elif risco_enchente['nivel'] == nivel:
                risco_dominante = 'enchente'  
            elif risco_tsunami['nivel'] == nivel:
                risco_dominante = 'tsunami'
            break
    
    return {
        'estado': estado_sigla,
        'risco_geral': risco_geral,
        'risco_dominante': risco_dominante,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'detalhes': {
            'incendio': risco_incendio,
            'enchente': risco_enchente,
            'tsunami': risco_tsunami
        }
    }

def analisar_todos_estados(detalhado=True):
    """
    Executa análise de risco para todos os estados costeiros.
    
    Args:
        detalhado (bool): Se True, mostra análise completa por estado
    
    Returns:
        dict: Análise completa de todos os estados
    """
    estados = ['RJ', 'SC', 'CE', 'PE', 'AL', 'BA']
    analise_completa = {}
    
    print("🌊 Iniciando análise de riscos - Estados Costeiros do Brasil")
    print("=" * 60)
    
    for estado in estados:
        analise_completa[estado] = calcular_risco_geral(estado, verbose=detalhado)
        
        # Feedback visual melhorado
        risco = analise_completa[estado]['risco_geral']
        risco_dominante = analise_completa[estado]['risco_dominante']
        
        cor_emoji = {
            'VERDE': '🟢',
            'AMARELO': '🟡', 
            'LARANJA': '🟠',
            'VERMELHO': '🔴'
        }
        
        tipo_emoji = {
            'incendio': '🔥',
            'enchente': '🌊', 
            'tsunami': '🌊',
            None: '✅'
        }
        
        if risco_dominante:
            print(f"{cor_emoji[risco]} {estado}: {risco} - Principal: {tipo_emoji[risco_dominante]} {risco_dominante.upper()}")
        else:
            print(f"{cor_emoji[risco]} {estado}: {risco}")
        
        # Separador visual entre estados (só no modo detalhado)
        if detalhado and estado != estados[-1]:
            print("-" * 40)
    
    print(f"\n📊 RESUMO GERAL:")
    print(f"{'='*30}")
    
    # Contagem por nível de risco
    contagem = {'VERDE': 0, 'AMARELO': 0, 'LARANJA': 0, 'VERMELHO': 0}
    for estado, dados in analise_completa.items():
        contagem[dados['risco_geral']] += 1
    
    for nivel, count in contagem.items():
        if count > 0:
            emoji = {'VERDE': '🟢', 'AMARELO': '🟡', 'LARANJA': '🟠', 'VERMELHO': '🔴'}
            print(f"{emoji[nivel]} {nivel}: {count} estado(s)")
    
    # Identificar tipos de emergência ativos
    tipos_ativos = set()
    for dados in analise_completa.values():
        if dados['risco_dominante']:
            tipos_ativos.add(dados['risco_dominante'])
    
    if tipos_ativos:
        print(f"\n⚠️ TIPOS DE EMERGÊNCIA DETECTADOS:")
        for tipo in tipos_ativos:
            estados_afetados = [estado for estado, dados in analise_completa.items() 
                              if dados['risco_dominante'] == tipo]
            print(f"   {tipo_emoji[tipo]} {tipo.upper()}: {', '.join(estados_afetados)}")
    
    print("\n✅ Análise concluída!")
    return analise_completa

# ===== FUNÇÃO DE TESTE =====
def testar_risk_calculator():
    """
    Teste completo do sistema de cálculo de riscos.
    """
    print("🧪 TESTANDO SISTEMA DE CÁLCULO DE RISCOS")
    print("=" * 50)
    
    # Teste 1: Risco específico para um estado
    print("\n1️⃣ Teste: Risco de Incêndio no RJ")
    risco_incendio_rj = calcular_risco_incendio('RJ')
    print(f"   Nível: {risco_incendio_rj['nivel']}")
    print(f"   Score: {risco_incendio_rj['score']}")
    print(f"   Fatores: {risco_incendio_rj['fatores']}")
    
    print("\n2️⃣ Teste: Risco de Enchente no RJ")
    risco_enchente_rj = calcular_risco_enchente('RJ')
    print(f"   Nível: {risco_enchente_rj['nivel']}")
    print(f"   Score: {risco_enchente_rj['score']}")
    
    print("\n3️⃣ Teste: Análise Geral do RJ")
    analise_rj = calcular_risco_geral('RJ', verbose=True)
    print(f"   Risco Geral: {analise_rj['risco_geral']}")
    if analise_rj['risco_dominante']:
        print(f"   Risco Dominante: {analise_rj['risco_dominante'].upper()}")
    
    print("\n4️⃣ Teste: Análise de Todos os Estados (Resumida)")
    analise_todos = analisar_todos_estados(detalhado=False)
    
    print("\n5️⃣ Teste: Análise Detalhada (Nova Funcionalidade)")
    print("Escolha: 's' para análise detalhada ou Enter para pular")
    escolha = input().strip().lower()
    
    if escolha in ['s', 'sim', 'y', 'yes']:
        print("\n" + "="*60)
        analise_detalhada = analisar_todos_estados(detalhado=True)
        return analise_detalhada
    
    return analise_todos

if __name__ == '__main__':
    testar_risk_calculator()