import random
from datetime import datetime, timedelta
import math
from database_connection import conectar_db, desconectar_db
import time

# Dados climáticos por estação para cada estado (mantido igual)
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
    """Determina a estação climática atual baseada no mês."""
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
    return 'verao'

def calcular_temperatura_por_hora(temp_min, temp_max, hora):
    """
    NOVA FUNÇÃO: Calcula temperatura realista baseada no ciclo diário.
    
    Lógica:
    - Mínimo às 6h (nascer do sol)
    - Máximo às 14h (pico de calor)
    - Usa curva senoidal mais realista
    """
    # Normalizar hora para ciclo 0-24h
    hora_normalizada = hora % 24
    
    # Calcular posição no ciclo diário (6h = mínimo, 14h = máximo)
    # Deslocamos 6h para que o mínimo seja em x=0
    ciclo_radianos = ((hora_normalizada - 6) % 24) * 2 * math.pi / 24
    
    # Função senoidal ajustada:
    # - sin(-π/2) = -1 (mínimo às 6h)
    # - sin(π/6) ≈ 0.5 (meio termo às 10h) 
    # - sin(π/2) = 1 (máximo às 14h)
    fator_ciclo = math.sin(ciclo_radianos - math.pi/2)
    
    # Interpolar entre temperatura mínima e máxima
    temperatura_base = temp_min + (temp_max - temp_min) * (fator_ciclo + 1) / 2
    
    # Adicionar PEQUENA variação natural (max ±0.8°C)
    variacao_natural = random.uniform(-0.8, 0.8)
    
    return temperatura_base + variacao_natural

def buscar_dados_anteriores(estado_sigla):
    """Busca a última leitura de sensores para um estado específico."""
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao:
            return None
        
        cursor.execute("""
            SELECT temperatura, umidade, velocidade_vento, altura_ondas 
            FROM sensores s
            JOIN estados e ON s.estado_id = e.id
            WHERE e.sigla = ?
            ORDER BY timestamp_coleta DESC 
            LIMIT 1
        """, (estado_sigla,))
        
        resultado = cursor.fetchone()
        desconectar_db(conexao, silent=True)
        
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

def aplicar_correlacoes_climaticas_melhorada(dados_base, dados_anteriores, preservar_temp=True):
    """
    FUNÇÃO MELHORADA: Aplica correlações mas preserva temperatura se solicitado.
    """
    dados_finais = dados_base.copy()
    
    # Se não há dados anteriores, retorna os dados base
    if not dados_anteriores:
        return dados_finais
    
    # Correlação 1: Temperatura vs Umidade (mais suave)
    if not preservar_temp:  # Só altera temperatura se explicitamente permitido
        diferenca_temp = dados_base['temperatura'] - dados_anteriores['temperatura']
        
        if diferenca_temp > 3:  # Threshold mais alto
            ajuste_umidade = diferenca_temp * 1.5  # Fator menor
            dados_finais['umidade'] = max(30, dados_base['umidade'] - ajuste_umidade)
            
        elif diferenca_temp < -3:
            ajuste_umidade = abs(diferenca_temp) * 1.2
            dados_finais['umidade'] = min(95, dados_base['umidade'] + ajuste_umidade)
    
    # Correlação 2: Vento forte afeta ondas (mantida)
    diferenca_vento = dados_base['velocidade_vento'] - dados_anteriores['velocidade_vento']
    
    if dados_base['velocidade_vento'] > 8:
        fator_onda = 1 + (dados_base['velocidade_vento'] - 8) * 0.1
        dados_finais['altura_ondas'] = dados_base['altura_ondas'] * fator_onda
    
    return dados_finais

def gerar_dados_sensor_completo(estado_sigla, hora=12):
    """
    VERSÃO CORRIGIDA: Gera dados com correlação horária preservada.
    """
    if estado_sigla not in DADOS_ESTADOS:
        print(f"Estado {estado_sigla} não encontrado!")
        return None
    
    # Obter dados base da estação atual
    estacao = obter_estacao_atual()
    indice_estacao = {'verao': 0, 'outono': 1, 'inverno': 2, 'primavera': 3}
    indice = indice_estacao[estacao]
    
    clima_base = DADOS_ESTADOS[estado_sigla]
    
    # CORREÇÃO PRINCIPAL: Usar nova função de temperatura
    temp_min = clima_base['temp_min'][indice]
    temp_max = clima_base['temp_max'][indice]
    temperatura_final = calcular_temperatura_por_hora(temp_min, temp_max, hora)
    

    # Converter base para escala diária
    precipitacao_diaria_base = clima_base['precipitacao'][indice] / 30

    # Variação proporcional à escala diária (±2mm é razoável)
    precipitacao_final = precipitacao_diaria_base + random.uniform(-2, 2)

    
    # Gerar outros dados com variação natural
    dados_base = {
        'temperatura': round(temperatura_final, 2),
        'umidade': round(clima_base['umidade_normal'][indice] + random.uniform(-5, 5), 2),
        'velocidade_vento': round(clima_base['velocidade_vento'][indice] + random.uniform(-2, 2), 2),
        'altura_ondas': round(clima_base['altura_ondas'][indice] + random.uniform(-0.3, 0.3), 2),
        'precipitacao': round(max(0, precipitacao_final), 2),
        'nivel_mar': round(random.uniform(0, 0.5), 2),
        'magnitude_sismica': round(random.uniform(0, 2.5), 1),
        'pressao_atmosferica': round(random.uniform(1010, 1025), 1)
    }
    
    # Buscar dados anteriores e aplicar correlações (SEM alterar temperatura)
    dados_anteriores = buscar_dados_anteriores(estado_sigla)
    dados_correlacionados = aplicar_correlacoes_climaticas_melhorada(
        dados_base, dados_anteriores, preservar_temp=True
    )
    
    # Garantir valores dentro de limites realistas
    dados_correlacionados['umidade'] = max(20, min(100, dados_correlacionados['umidade']))
    dados_correlacionados['velocidade_vento'] = max(0, dados_correlacionados['velocidade_vento'])
    dados_correlacionados['altura_ondas'] = max(0.1, dados_correlacionados['altura_ondas'])
    
    return dados_correlacionados

def salvar_dados_no_banco(estado_sigla, dados_sensor):
    """Salva os dados do sensor no banco de dados."""
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao:
            return False
        
        cursor.execute("""
            INSERT INTO sensores (
                estado_id, latitude, longitude, temperatura, umidade, precipitacao, 
                velocidade_vento, nivel_mar, altura_ondas, 
                magnitude_sismica, pressao_atmosferica
            ) VALUES (
                (SELECT id FROM estados WHERE sigla = ?),
                (SELECT latitude FROM estados WHERE sigla = ?),
                (SELECT longitude FROM estados WHERE sigla = ?),
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            estado_sigla, estado_sigla, estado_sigla,
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
        desconectar_db(conexao, silent=True)
        return True
        
    except Exception as e:
        print(f"Erro ao salvar no banco: {e}")
        return False

def testar_correlacao_horaria():
    """
    NOVO TESTE: Verifica se a correlação horária está funcionando corretamente.
    """
    print("🧪 Testando correlação horária melhorada...")
    
    horarios_teste = [6, 10, 14, 18, 22]
    estado_teste = 'RJ'
    
    print(f"\n🗺️ Estado: {estado_teste}")
    print("⏰ Horário | 🌡️ Temperatura | 💧 Umidade | 💨 Vento")
    print("-" * 55)
    
    temperaturas = []
    for hora in horarios_teste:
        dados = gerar_dados_sensor_completo(estado_teste, hora)
        if dados:
            temperatura = dados['temperatura']
            temperaturas.append((hora, temperatura))
            print(f"   {hora:02d}:00h  |    {temperatura:5.1f}°C    | {dados['umidade']:5.1f}% | {dados['velocidade_vento']:4.1f}m/s")
    
    print(f"\n📊 Análise das temperaturas:")
    temp_06h = next(t[1] for t in temperaturas if t[0] == 6)
    temp_14h = next(t[1] for t in temperaturas if t[0] == 14)
    temp_22h = next(t[1] for t in temperaturas if t[0] == 22)
    
    print(f"🌅 6h:  {temp_06h:.1f}°C")
    print(f"🌞 14h: {temp_14h:.1f}°C (diferença: {temp_14h - temp_06h:+.1f}°C)")
    print(f"🌙 22h: {temp_22h:.1f}°C (diferença: {temp_22h - temp_14h:+.1f}°C)")
    
    if temp_14h > temp_06h:
        print("✅ Correlação horária funcionando! Tarde mais quente que manhã.")
    else:
        print("❌ Problema na correlação horária detectado!")
    
    if temp_22h < temp_14h:
        print("✅ Noite mais fria que tarde - padrão normal!")
    else:
        print("⚠️ Noite deveria ser mais fria que a tarde")


def popular_banco_7_dias():
    """
    Popula o banco com dados dos últimos 7 dias.
    7 dias × 6 estados × 6 horários = 252 registros
    """
    print("🗃️ Iniciando populamento do banco - Últimos 7 dias")
    print("=" * 50)
    
    # Configurações
    estados = ['RJ', 'SC', 'CE', 'PE', 'AL', 'BA']
    horarios = [2, 6, 10, 14, 18, 22]  # De 4 em 4 horas
    
    # Datas dos últimos 7 dias
    data_hoje = datetime.now()
    datas = []
    for i in range(7):
        data = data_hoje - timedelta(days=i)
        datas.append(data)
    
    contador_sucessos = 0
    contador_falhas = 0
    
    print(f"📅 Gerando dados de {datas[-1].strftime('%d/%m/%Y')} até {datas[0].strftime('%d/%m/%Y')}")
    print(f"🗺️ Estados: {', '.join(estados)}")
    print(f"⏰ Horários: {', '.join([f'{h:02d}:00' for h in horarios])}")
    print(f"📊 Total esperado: {len(datas)} dias × {len(estados)} estados × {len(horarios)} horários = {len(datas) * len(estados) * len(horarios)} registros")
    print()
    
    # Loop principal - pelos dias (do mais antigo para o mais recente)
    for i, data in enumerate(reversed(datas), 1):
        print(f"📅 Processando dia {i}/7: {data.strftime('%d/%m/%Y (%A)')}")
        
        # Loop pelos horários do dia
        for hora in horarios:
            print(f"  ⏰ Horário {hora:02d}:00h", end=" - ")
            
            # Loop pelos estados
            sucessos_horario = 0
            for estado in estados:
                # Gerar dados para este estado/horário
                dados = gerar_dados_sensor_completo(estado, hora)
                
                if dados:
                    # Simular timestamp específico para este dia/hora
                    timestamp_especifico = data.replace(hour=hora, minute=0, second=0, microsecond=0)
                    
                    # Salvar no banco (precisamos ajustar a função para aceitar timestamp customizado)
                    if salvar_dados_no_banco_com_timestamp(estado, dados, timestamp_especifico):
                        contador_sucessos += 1
                        sucessos_horario += 1
                    else:
                        contador_falhas += 1
                else:
                    contador_falhas += 1
            
            print(f"{sucessos_horario}/{len(estados)} estados salvos")
        
        print(f"  ✅ Dia {i} concluído")
        print()
    
    # Relatório final
    print("🎯 RELATÓRIO FINAL")
    print("=" * 30)
    print(f"✅ Sucessos: {contador_sucessos}")
    print(f"❌ Falhas: {contador_falhas}")
    print(f"📊 Taxa de sucesso: {(contador_sucessos/(contador_sucessos+contador_falhas)*100):.1f}%")
    
    if contador_sucessos > 0:
        print("\n🎉 Banco populado com sucesso!")
        print(f"💾 {contador_sucessos} registros inseridos no banco de dados")
    else:
        print("\n⚠️ Nenhum registro foi inserido. Verifique a conexão com o banco.")


def salvar_dados_no_banco_com_timestamp(estado_sigla, dados_sensor, timestamp_personalizado):
    """
    Versão da função de salvamento que aceita timestamp personalizado.
    """
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao:
            return False
        
        # Converter datetime para string no formato SQLite
        timestamp_str = timestamp_personalizado.strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.execute("""
            INSERT INTO sensores (
                estado_id, latitude, longitude, temperatura, umidade, precipitacao, 
                velocidade_vento, nivel_mar, altura_ondas, 
                magnitude_sismica, pressao_atmosferica, timestamp_coleta
            ) VALUES (
                (SELECT id FROM estados WHERE sigla = ?),
                (SELECT latitude FROM estados WHERE sigla = ?),
                (SELECT longitude FROM estados WHERE sigla = ?),
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            estado_sigla, estado_sigla, estado_sigla,
            dados_sensor['temperatura'],
            dados_sensor['umidade'], 
            dados_sensor['precipitacao'],
            dados_sensor['velocidade_vento'],
            dados_sensor['nivel_mar'],
            dados_sensor['altura_ondas'],
            dados_sensor['magnitude_sismica'],
            dados_sensor['pressao_atmosferica'],
            timestamp_str
        ))
        
        conexao.commit()
        desconectar_db(conexao, silent=True)
        return True
        
    except Exception as e:
        print(f"Erro ao salvar no banco: {e}")
        return False


def verificar_dados_banco():
    """
    Função para verificar quantos dados foram inseridos no banco.
    """
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao:
            return
        
        # Contar total de registros
        cursor.execute("SELECT COUNT(*) FROM sensores")
        total = cursor.fetchone()[0]
        
        # Contar por estado
        cursor.execute("""
            SELECT e.sigla, COUNT(s.id) 
            FROM estados e 
            LEFT JOIN sensores s ON e.id = s.estado_id 
            GROUP BY e.sigla 
            ORDER BY e.sigla
        """)
        por_estado = cursor.fetchall()
        
        # Período dos dados
        cursor.execute("""
            SELECT MIN(timestamp_coleta), MAX(timestamp_coleta) 
            FROM sensores
        """)
        periodo = cursor.fetchone()
        
        desconectar_db(conexao, silent=True)
        
        print("📊 RELATÓRIO DO BANCO DE DADOS")
        print("=" * 40)
        print(f"💾 Total de registros: {total}")
        
        if periodo[0] and periodo[1]:
            print(f"📅 Período: {periodo[0]} até {periodo[1]}")
        
        print("\n🗺️ Registros por estado:")
        for sigla, count in por_estado:
            print(f"  {sigla}: {count} registros")
        
        # Verificação esperada
        esperado = 7 * 6 * 6  # 7 dias, 6 estados, 6 horários
        print(f"\n🎯 Esperado: {esperado} registros")
        
        if total == esperado:
            print("✅ Banco populado corretamente!")
        elif total > 0:
            print(f"⚠️ Banco parcialmente populado ({(total/esperado)*100:.1f}%)")
        else:
            print("❌ Banco vazio")
            
    except Exception as e:
        print(f"Erro ao verificar banco: {e}")        

def limpar_tabela_sensores(tabela):
    try:
        conexao, cursor = conectar_db(silent=True)
        if not conexao:
            return False
        cursor.execute(f"DELETE FROM {tabela};")
        conexao.commit()
        desconectar_db(conexao, silent=True)
        return print(f"Tabela {tabela} limpa com sucesso!")
    except Exception as e:
        print(f"Falha ao conectar no DB: {e}")

# Execução principal
if __name__ == "__main__":
    print("🌦️ Sistema de Geração de Dados Climáticos - VERSÃO CORRIGIDA")
    print("=" * 60)
    
    estacao = obter_estacao_atual()
    print(f"🍂 Estação atual: {estacao.upper()}")
    
    print("\nEscolha uma opção:")
    print("1. Testar correlação horária")
    print("2. Testar geração de dados simples")
    print("3. Gerar dados únicos para teste")
    print("4. Gera dados para 7 dias e insere no DB")
    print("5. Limpar tabela sensores")

    opcao = input("\nDigite sua opção (1, 2, 3, 4 ou 5): ").strip()
    
    if opcao == "1":
        testar_correlacao_horaria()
    elif opcao == "2":
        # Teste simples mantido
        estados_teste = ['RJ', 'SC']
        horarios_teste = [6, 14, 22]
        
        for estado in estados_teste:
            print(f"\n🗺️ Estado: {estado}")
            for hora in horarios_teste:
                dados = gerar_dados_sensor_completo(estado, hora)
                if dados:
                    print(f"  {hora:02d}:00h - Temp: {dados['temperatura']:.1f}°C")
    elif opcao == "3":
        # Teste específico corrigido
        dados_rj_manha = gerar_dados_sensor_completo('RJ', 6)
        dados_rj_tarde = gerar_dados_sensor_completo('RJ', 14)
        
        print(f"\n🌅 RJ Manhã (6h): Temp: {dados_rj_manha['temperatura']:.1f}°C")
        print(f"🌞 RJ Tarde (14h): Temp: {dados_rj_tarde['temperatura']:.1f}°C")
        
        diferenca = dados_rj_tarde['temperatura'] - dados_rj_manha['temperatura']
        print(f"📊 Diferença: {diferenca:+.1f}°C")
        
        if diferenca > 0:
            print("✅ Correlação horária funcionando! Tarde mais quente que manhã.")
        else:
            print("❌ Problema na correlação horária detectado!")
    elif opcao == "4":
        popular_banco_7_dias()
        verificar_dados_banco()
    elif opcao == "5":
        print("\nEscolha uma opção:")
        print("1. Estados")
        print("2. Sensores")
        print("3. Abrigos")

        opcoes = input("\nDigite sua opção (1, 2, 3): ").strip()

        tabela = {
            '1': "estados",
            '2': "sensores",
            '3': "abrigos" 
            }
        
        limpar = limpar_tabela_sensores(tabela[opcoes])

    else:
        print("❌ Opção inválida!")