from database_connection import conectar_db, desconectar_db
from datetime import datetime, timedelta
import math

# ✅ Removi timezone.utc por simplicidade - SQLite usa horário local

THRESHOLDS = {
    'incendio': {
        'temperatura_critica': 35.0,
        'umidade_critica': 30.0,
        'vento_critico': 20.0,
        'precipitacao_baixa': 5.0
    },
    
    'enchente': {
        'chuva_intensa_hora': 50.0,
        'chuva_acumulada_2dias': 120.0,
        'nivel_mar_alto': 2.5
    },
    
    'tsunami': {
        'magnitude_sismica': 6.0,
        'profundidade_max': 70.0
    }
}

def buscar_dados_recentes(estado_sigla, horas=24):
    """
    ✅ Melhorias aplicadas:
    - Corrigidos erros de digitação
    - Simplificado timezone
    - Adicionado tratamento para cursor None
    """
    try:
        conexao, cursor = conectar_db()
        if not conexao or not cursor:  # ← Verificação dupla!
            return []
        
        # ✅ Removido timezone para simplicidade
        tempo_limite = datetime.now() - timedelta(hours=horas)
        
        cursor.execute("""
            SELECT temperatura, umidade, velocidade_vento,
                   precipitacao, altura_ondas, magnitude_sismica,
                   timestamp_coleta
            FROM sensores s
            JOIN estados e ON s.estado_id = e.id
            WHERE e.sigla = ? AND s.timestamp_coleta >= ?
            ORDER BY timestamp_coleta DESC
        """, (estado_sigla, tempo_limite))
        
        resultados = cursor.fetchall()  # ✅ Corrigido 'cursos' → 'cursor'
        desconectar_db(conexao)
        
        return resultados
        
    except Exception as e:
        print(f"Erro ao buscar dados recentes: {e}")
        return []  # ✅ Espaço adicionado

def calcular_chuva_acumulada(dados_recentes, dias=2):  # ✅ Dois pontos adicionados
    """
    ✅ Melhorias:
    - Sintaxe corrigida
    - Melhor tratamento de None
    - Conversão de timestamp simplificada
    """
    total_chuva = 0.0
    data_limite = datetime.now() - timedelta(days=dias)
    
    for linha in dados_recentes:  # ✅ Dois pontos adicionados
        try:
            precipitacao = linha[3]
            timestamp_str = linha[6]
            
            # ✅ Conversão corrigida - strptime é método de CLASSE
            data_leitura = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            
            # ✅ Verificação melhorada para None e 0
            if data_leitura >= data_limite and precipitacao is not None:
                total_chuva += precipitacao
                
        except (ValueError, TypeError) as e:
            # ✅ Tratamento de erro para timestamps inválidos
            print(f"Erro ao processar linha: {e}")
            continue
    
    return round(total_chuva, 2)

def testar_risk_calculator():
    """Teste rápido para ver se tudo funciona"""
    dados = buscar_dados_recentes('RJ', 48)  # 2 dias de dados
    print(f"Encontrados {len(dados)} registros para RJ")
    
    if dados:
        chuva = calcular_chuva_acumulada(dados, 2)
        print(f"Chuva acumulada: {chuva}mm")

if __name__ == '__main__':
    testar_risk_calculator()