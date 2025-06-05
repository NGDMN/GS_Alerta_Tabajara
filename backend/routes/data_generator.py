import random
from datetime import datetime, timedelta
import math
from database_connection import conectar_db, desconectar_db

# Dados climáticos por estação para cada estado
DADOS_ESTADOS = {
    'RJ': {
        'temp_min': [24, 21, 17, 21],       # verão, outono, inverno, primavera (°C)
        'temp_max': [31, 28, 25, 29],       # (°C)
        'umidade_normal': [78, 80, 75, 77], # (%)
        'velocidade_vento': [4, 4, 5, 4],   # (m/s)
        'altura_ondas': [1.6, 1.8, 2.0, 1.7], # (m)
        'precipitacao': [140, 130, 80, 100] # (mm/mês)
    },
    'SC': {
        'temp_min': [23, 20, 15, 19],
        'temp_max': [28, 25, 20, 24],
        'umidade_normal': [80, 82, 83, 81],
        'velocidade_vento': [5, 5, 6, 5],
        'altura_ondas': [1.7, 2.0, 2.3, 2.0],
        'precipitacao': [170, 160, 120, 150]
    },
    'CE': {
        'temp_min': [26, 25, 24, 25],
        'temp_max': [30, 29, 28, 30],
        'umidade_normal': [72, 80, 83, 75],
        'velocidade_vento': [5, 5, 6, 5],
        'altura_ondas': [1.5, 1.3, 1.1, 1.4],
        'precipitacao': [140, 200, 90, 40]
    },
    'PE': {
        'temp_min': [24.5, 24, 22.5, 23.5],
        'temp_max': [29.5, 28, 26.5, 28],
        'umidade_normal': [78, 82, 83, 79],
        'velocidade_vento': [5, 5, 6, 5],
        'altura_ondas': [1.4, 1.3, 1.2, 1.3],
        'precipitacao': [110, 190, 180, 80]
    },
    'AL': {
        'temp_min': [24.2, 23.8, 22.3, 23.0],
        'temp_max': [28.7, 27.5, 25.5, 27.5],
        'umidade_normal': [77, 81, 82, 78],
        'velocidade_vento': [5, 5, 6, 5],
        'altura_ondas': [1.3, 1.2, 1.1, 1.2],
        'precipitacao': [100, 180, 170, 90]
    },
    'BA': {
        'temp_min': [25.6, 25.0, 23.2, 24.5],
        'temp_max': [27.6, 26.5, 25.3, 26.5],
        'umidade_normal': [78, 80, 81, 79],
        'velocidade_vento': [5, 5, 6, 5],
        'altura_ondas': [1.4, 1.3, 1.2, 1.3],
        'precipitacao': [90, 160, 150, 80]
    }
}

def obter_estacao_atual():
    """
    Determina a estação climática atual baseada no mês.
    Returns: string com nome da estação
    """
    mes = datetime.now().month
    
    estacoes = {
        'verao': [12, 1, 2],
        'outono': [3, 4, 5],
        'inverno': [6, 7, 8],
        'primavera': [9, 10, 11]
    }
    
    for estacao, meses in estacoes.items():
        if mes in meses:
            return estacao
    
    return 'verao'  # fallback

def ajustar_temperatura_por_hora(temperatura_base, hora):
    """
    Ajusta temperatura conforme hora do dia usando curva matemática.
    
    Args:
        temperatura_base: temperatura base da estação
        hora: hora do dia (0-23)
    
    Returns:
        temperatura ajustada
    """
    # Pico de calor às 14h, mínimo às 6h
    radianos = (hora - 6) * math.pi / 12
    fator_horario = math.sin(radianos) * 3  # Varia entre -3 e +3
    
    return temperatura_base + fator_horario

def buscar_dados_anteriores(estado_sigla):
    """
    Busca a última leitura de sensores para um estado específico.
    
    Args:
        estado_sigla: sigla do estado (RJ, SC, etc.)
    
    Returns:
        dict com dados anteriores ou None se não encontrar
    """
    try:
        conexao, cursor = conectar_db()
        if not conexao:
            return None
        
        # Busca especificamente deste estado
        cursor.execute("""
            SELECT temperatura, umidade, velocidade_vento, altura_ondas 
            FROM sensores s
            JOIN estados e ON s.estado_id = e.id
            WHERE e.sigla = ?
            ORDER BY timestamp_coleta DESC 
            LIMIT 1
        """, (estado_sigla,))
        
        resultado = cursor.fetchone()
        desconectar_db(conexao)
        
        if resultado:
            return {
                'temperatura': resultado[0],
                'umidade': resultado[1],
                'velocidade_vento': resultado[2],
                'altura_ondas': resultado[3]
            }
        
        return None
        
    except Exception as e:
        print(f"Erro ao buscar dados anteriores: {e}")
        return None

def aplicar_correlacoes_climaticas(dados_base, dados_anteriores):
    """
    Aplica correlações realistas entre variáveis climáticas.
    
    Args:
        dados_base: dados gerados inicialmente
        dados_anteriores: última leitura do banco
    
    Returns:
        dados com correlações aplicadas
    """
    dados_finais = dados_base.copy()
    
    # Se não há dados anteriores, retorna os dados base
    if not dados_anteriores:
        return dados_finais
    
    # Correlação 1: Temperatura vs Umidade
    diferenca_temp = dados_base['temperatura'] - dados_anteriores['temperatura']
    
    if diferenca_temp > 2:  # Esquentou significativamente
        # Diminui umidade proporcionalmente
        ajuste_umidade = diferenca_temp * 2.5
        dados_finais['umidade'] = max(30, dados_base['umidade'] - ajuste_umidade)
        
    elif diferenca_temp < -2:  # Esfriou significativamente
        # Aumenta umidade proporcionalmente
        ajuste_umidade = abs(diferenca_temp) * 1.8
        dados_finais['umidade'] = min(95, dados_base['umidade'] + ajuste_umidade)
    
    # Correlação 2: Vento forte afeta temperatura
    diferenca_vento = dados_base['velocidade_vento'] - dados_anteriores['velocidade_vento']
    
    if diferenca_vento > 3:  # Vento aumentou muito
        # Vento forte geralmente traz mudança de temperatura
        if random.random() > 0.5:  # 50% chance de esfriar
            dados_finais['temperatura'] = dados_base['temperatura'] - random.uniform(1, 2.5)
    
    # Correlação 3: Vento forte = ondas maiores
    if dados_base['velocidade_vento'] > 8:  # Vento forte
        fator_onda = 1 + (dados_base['velocidade_vento'] - 8) * 0.1
        dados_finais['altura_ondas'] = dados_base['altura_ondas'] * fator_onda
    
    return dados_finais

def gerar_dados_sensor_completo(estado_sigla, hora=12):
    """
    Gera uma leitura completa de sensor com correlações realistas.
    
    Args:
        estado_sigla: sigla do estado
        hora: hora da leitura (0-23)
    
    Returns:
        dict com todos os dados do sensor
    """
    if estado_sigla not in DADOS_ESTADOS:
        print(f"Estado {estado_sigla} não encontrado!")
        return None
    
    # Obter dados base da estação atual
    estacao = obter_estacao_atual()
    indice_estacao = {'verao': 0, 'outono': 1, 'inverno': 2, 'primavera': 3}
    indice = indice_estacao[estacao]
    
    clima_base = DADOS_ESTADOS[estado_sigla]
    
    # Gerar valores base com variação natural
    temp_min = clima_base['temp_min'][indice]
    temp_max = clima_base['temp_max'][indice]
    
    # Temperatura base entre min e max da estação
    temp_base = random.uniform(temp_min, temp_max)
    
    # Aplicar variação por hora do dia
    temperatura_horaria = ajustar_temperatura_por_hora(temp_base, hora)
    
    # Adicionar pequena variação natural
    temperatura_final = temperatura_horaria + random.uniform(-1.5, 1.5)
    
    # Gerar outros dados com variação natural
    dados_base = {
        'temperatura': round(temperatura_final, 2),
        'umidade': round(clima_base['umidade_normal'][indice] + random.uniform(-5, 5), 2),
        'velocidade_vento': round(clima_base['velocidade_vento'][indice] + random.uniform(-2, 2), 2),
        'altura_ondas': round(clima_base['altura_ondas'][indice] + random.uniform(-0.3, 0.3), 2),
        'precipitacao': round(max(0, clima_base['precipitacao'][indice] + random.uniform(-20, 20)), 2),
        'nivel_mar': round(random.uniform(0, 0.5), 2),  # Variação do nível do mar
        'magnitude_sismica': round(random.uniform(0, 2.5), 1),  # Atividade sísmica baixa normal
        'pressao_atmosferica': round(random.uniform(1010, 1025), 1)  # Pressão atmosférica normal
    }
    
    # Buscar dados anteriores e aplicar correlações
    dados_anteriores = buscar_dados_anteriores(estado_sigla)
    dados_correlacionados = aplicar_correlacoes_climaticas(dados_base, dados_anteriores)
    
    # Garantir valores dentro de limites realistas
    dados_correlacionados['umidade'] = max(20, min(100, dados_correlacionados['umidade']))
    dados_correlacionados['velocidade_vento'] = max(0, dados_correlacionados['velocidade_vento'])
    dados_correlacionados['altura_ondas'] = max(0.1, dados_correlacionados['altura_ondas'])
    
    return dados_correlacionados

def salvar_dados_no_banco(estado_sigla, dados_sensor):
    """
    Salva os dados do sensor no banco de dados.
    
    Args:
        estado_sigla: sigla do estado
        dados_sensor: dict com dados do sensor
    
    Returns:
        bool: True se salvou com sucesso
    """
    try:
        conexao, cursor = conectar_db()
        if not conexao:
            return False
        
        # Inserir dados na tabela sensores
        cursor.execute("""
            INSERT INTO sensores (
                estado_id, temperatura, umidade, precipitacao, 
                velocidade_vento, nivel_mar, altura_ondas, 
                magnitude_sismica, pressao_atmosferica
            ) VALUES (
                (SELECT id FROM estados WHERE sigla = ?), 
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            estado_sigla,
            dados_sensor['temperatura'],
            dados_sensor['umidade'], 
            dados_sensor['precipitacao'],
            dados_sensor['velocidade_vento'],
            dados_sensor['nivel_mar'],
            dados_sensor['altura_ondas'],
            dados_sensor['magnitude_sismica'],
            dados_sensor['pressao_atmosferica']
        ))
        
        conexao.commit()
        desconectar_db(conexao)
        return True
        
    except Exception as e:
        print(f"Erro ao salvar no banco: {e}")
        return False

def gerar_historico_7_dias():
    """
    Gera dados históricos dos últimos 7 dias para todos os estados.
    
    Cria 6 leituras por dia (a cada 4 horas) para cada estado.
    Total: 7 dias × 6 leituras × 6 estados = 252 registros
    """
    estados = ['RJ', 'SC', 'CE', 'PE', 'AL', 'BA']
    horarios = [2, 6, 10, 14, 18, 22]  # A cada 4 horas
    
    print("🚀 Iniciando geração de dados históricos...")
    print(f"📊 Serão gerados dados para {len(estados)} estados")
    print(f"⏰ {len(horarios)} leituras por dia durante 7 dias")
    print(f"📈 Total estimado: {7 * len(horarios) * len(estados)} registros")
    
    contador_sucesso = 0
    contador_erro = 0
    
    # Loop pelos últimos 7 dias
    for dia in range(7):
        data_atual = datetime.now() - timedelta(days=dia)
        print(f"\n📅 Processando dia {data_atual.strftime('%d/%m/%Y')}")
        
        # Loop pelos horários do dia
        for hora in horarios:
            print(f"  ⏰ Gerando dados para {hora:02d}:00h")
            
            # Loop pelos estados
            for estado in estados:
                try:
                    # Gerar dados do sensor
                    dados = gerar_dados_sensor_completo(estado, hora)
                    
                    if dados:
                        # Salvar no banco
                        if salvar_dados_no_banco(estado, dados):
                            contador_sucesso += 1
                            print(f"    ✅ {estado}: {dados['temperatura']:.1f}°C, {dados['umidade']:.1f}%")
                        else:
                            contador_erro += 1
                            print(f"    ❌ {estado}: Erro ao salvar")
                    else:
                        contador_erro += 1
                        print(f"    ❌ {estado}: Erro ao gerar dados")
                        
                except Exception as e:
                    contador_erro += 1
                    print(f"    ❌ {estado}: Erro inesperado - {e}")
    
    print(f"\n🎉 Geração concluída!")
    print(f"✅ Sucessos: {contador_sucesso}")
    print(f"❌ Erros: {contador_erro}")
    print(f"📊 Taxa de sucesso: {(contador_sucesso/(contador_sucesso+contador_erro)*100):.1f}%")

def testar_geracao_dados():
    """
    Testa a geração de dados para diferentes horários.
    """
    print("🧪 Testando geração de dados...")
    
    estados_teste = ['RJ', 'SC']
    horarios_teste = [6, 14, 22]
    
    for estado in estados_teste:
        print(f"\n🗺️ Estado: {estado}")
        for hora in horarios_teste:
            dados = gerar_dados_sensor_completo(estado, hora)
            if dados:
                print(f"  {hora:02d}:00h - Temp: {dados['temperatura']:.1f}°C, "
                      f"Umidade: {dados['umidade']:.1f}%, "
                      f"Vento: {dados['velocidade_vento']:.1f}m/s")

# Execução principal
if __name__ == "__main__":
    print("🌦️ Sistema de Geração de Dados Climáticos")
    print("=" * 50)
    
    # Mostrar estação atual
    estacao = obter_estacao_atual()
    print(f"🍂 Estação atual: {estacao.upper()}")
    
    # Escolher o que fazer
    print("\nEscolha uma opção:")
    print("1. Testar geração de dados")
    print("2. Gerar histórico completo (7 dias)")
    print("3. Gerar dados únicos para teste")
    
    opcao = input("\nDigite sua opção (1, 2 ou 3): ").strip()
    
    if opcao == "1":
        testar_geracao_dados()
    elif opcao == "2":
        confirmacao = input("⚠️  Isso vai gerar 252 registros. Confirma? (s/n): ")
        if confirmacao.lower() == 's':
            gerar_historico_7_dias()
        else:
            print("❌ Operação cancelada.")
    elif opcao == "3":
        # Teste simples
        dados_rj_manha = gerar_dados_sensor_completo('RJ', 6)
        dados_rj_tarde = gerar_dados_sensor_completo('RJ', 14)
        
        print(f"\n🌅 RJ Manhã (6h): {dados_rj_manha}")
        print(f"🌞 RJ Tarde (14h): {dados_rj_tarde}")
        
        if dados_rj_tarde['temperatura'] > dados_rj_manha['temperatura']:
            print("✅ Tarde mais quente que manhã - correlação horária funcionando!")
        else:
            print("⚠️ Pode haver problema na correlação horária")
    else:
        print("❌ Opção inválida!")