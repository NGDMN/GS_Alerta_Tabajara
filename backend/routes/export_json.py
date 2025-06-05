import json
import os
from datetime import datetime
from alert_system import processar_alertas_ativos, obter_alertas_por_estado
from risk_calculator import analisar_todos_estados

# ===== CONFIGURAÇÕES =====

# Pasta onde serão salvos os JSONs (relativa ao script)
OUTPUT_DIR = "../../frontend/src/data"
BACKUP_DIR = "exports_backup"

# Arquivos de saída
ARQUIVOS_EXPORT = {
    'alertas': 'alertas_ativos.json',
    'estados': 'dados_estados.json', 
    'dashboard': 'dashboard_data.json',
    'config': 'system_config.json'
}

# ===== FUNÇÕES DE TRANSFORMAÇÃO =====

def transformar_dados_para_frontend(analise_completa):
    """
    Transforma dados do Python para formato otimizado para React.
    
    Args:
        analise_completa (dict): Dados da análise de risco
        
    Returns:
        dict: Dados formatados para frontend
    """
    estados_formatados = []
    
    for estado, dados in analise_completa.items():
        # Extrair scores por tipo de risco
        detalhes = dados['detalhes']
        
        estado_formatado = {
            'sigla': estado,
            'risco_geral': dados['risco_geral'],
            'risco_dominante': dados['risco_dominante'],
            'timestamp': dados['timestamp'],
            'scores': {
                'incendio': detalhes['incendio']['score'],
                'enchente': detalhes['enchente']['score'], 
                'tsunami': detalhes['tsunami']['score']
            },
            'niveis': {
                'incendio': detalhes['incendio']['nivel'],
                'enchente': detalhes['enchente']['nivel'],
                'tsunami': detalhes['tsunami']['nivel']
            },
            # Dados para mapa (cores, prioridade visual)
            'cor_mapa': definir_cor_mapa(dados['risco_geral']),
            'prioridade_visual': obter_prioridade_visual(dados['risco_geral']),
            # Resumo para cards
            'resumo_status': criar_resumo_status(dados)
        }
        
        estados_formatados.append(estado_formatado)
    
    return estados_formatados

def definir_cor_mapa(nivel_risco):
    """
    Define cor para visualização no mapa baseada no nível de risco.
    
    Args:
        nivel_risco (str): Nível do risco
        
    Returns:
        dict: Configuração de cor (hex, rgb, nome)
    """
    cores_risco = {
        'VERDE': {
            'hex': '#10B981',
            'rgb': 'rgb(16, 185, 129)',
            'nome': 'green',
            'intensidade': 0.7
        },
        'AMARELO': {
            'hex': '#F59E0B', 
            'rgb': 'rgb(245, 158, 11)',
            'nome': 'yellow',
            'intensidade': 0.8
        },
        'LARANJA': {
            'hex': '#EF4444',
            'rgb': 'rgb(239, 68, 68)', 
            'nome': 'orange',
            'intensidade': 0.9
        },
        'VERMELHO': {
            'hex': '#DC2626',
            'rgb': 'rgb(220, 38, 38)',
            'nome': 'red',
            'intensidade': 1.0
        }
    }
    
    return cores_risco.get(nivel_risco, cores_risco['VERDE'])

def obter_prioridade_visual(nivel_risco):
    """
    Define prioridade para ordenação visual (maior = mais urgente).
    """
    prioridades = {
        'VERDE': 1,
        'AMARELO': 2,
        'LARANJA': 3, 
        'VERMELHO': 4
    }
    
    return prioridades.get(nivel_risco, 1)

def criar_resumo_status(dados_estado):
    """
    Cria resumo legível para cards/tooltips.
    
    Args:
        dados_estado (dict): Dados do estado
        
    Returns:
        str: Resumo formatado
    """
    risco = dados_estado['risco_geral']
    dominante = dados_estado['risco_dominante']
    
    if risco == 'VERDE':
        return "Condições normais"
    elif risco == 'AMARELO':
        return f"Atenção para {dominante}"
    elif risco == 'LARANJA':
        return f"Alerta de {dominante}"
    else:  # VERMELHO
        return f"EMERGÊNCIA: {dominante}"

def transformar_alertas_para_frontend(resultado_alertas):
    """
    Transforma alertas para formato otimizado para React.
    
    Args:
        resultado_alertas (dict): Resultado do processamento de alertas
        
    Returns:
        dict: Alertas formatados para frontend
    """
    alertas_formatados = []
    
    for alerta in resultado_alertas['alertas_ativos']:
        alerta_formatado = {
            'id': alerta['id_alerta'],
            'estado': alerta['estado'],
            'tipo': alerta['tipo_principal'],
            'nivel': alerta['nivel'],
            'titulo': alerta['titulo'],
            'resumo': alerta['resumo'],
            'instrucoes': alerta['instrucoes'],
            'contato': alerta['contato_emergencia'],
            'timestamp': alerta['timestamp'],
            'prioridade': alerta['prioridade'],
            # Dados para UI
            'cor_alerta': definir_cor_mapa(alerta['nivel']),
            'icone': obter_icone_emergencia(alerta['tipo_principal']),
            'acao': alerta['acao_recomendada'],
            # Para pop-ups e notificações
            'deve_mostrar_popup': alerta['nivel'] in ['LARANJA', 'VERMELHO'],
            'urgencia': calcular_urgencia(alerta)
        }
        
        alertas_formatados.append(alerta_formatado)
    
    return {
        'alertas': alertas_formatados,
        'estatisticas': resultado_alertas['estatisticas'],
        'total_alertas': len(alertas_formatados),
        'alertas_criticos': len([a for a in alertas_formatados if a['nivel'] == 'VERMELHO']),
        'timestamp_ultima_atualizacao': resultado_alertas['timestamp_processamento']
    }

def obter_icone_emergencia(tipo_emergencia):
    """
    Define ícone para cada tipo de emergência.
    """
    icones = {
        'incendio': '🔥',
        'enchente': '🌊',
        'tsunami': '🌊',
        None: '⚠️'
    }
    
    return icones.get(tipo_emergencia, '⚠️')

def calcular_urgencia(alerta):
    """
    Calcula nível de urgência para ordenação de pop-ups.
    
    Returns:
        str: 'baixa', 'media', 'alta', 'critica'
    """
    if alerta['nivel'] == 'VERMELHO' and alerta['prioridade'] > 3:
        return 'critica'
    elif alerta['nivel'] == 'VERMELHO':
        return 'alta'
    elif alerta['nivel'] == 'LARANJA':
        return 'media'
    else:
        return 'baixa'

def criar_dados_dashboard():
    """
    Cria dados específicos para o dashboard principal.
    
    Returns:
        dict: Dados formatados para dashboard
    """
    # Obter dados frescos
    analise_completa = analisar_todos_estados(detalhado=False)
    resultado_alertas = processar_alertas_ativos(modo_silencioso=True)
    
    # Estatísticas gerais
    total_estados = len(analise_completa)
    estados_normais = sum(1 for dados in analise_completa.values() if dados['risco_geral'] == 'VERDE')
    estados_alerta = total_estados - estados_normais
    
    # Contagem por nível
    contagem_niveis = {'VERDE': 0, 'AMARELO': 0, 'LARANJA': 0, 'VERMELHO': 0}
    for dados in analise_completa.values():
        contagem_niveis[dados['risco_geral']] += 1
    
    # Contagem por tipo de emergência
    contagem_tipos = {'incendio': 0, 'enchente': 0, 'tsunami': 0}
    for dados in analise_completa.values():
        if dados['risco_dominante']:
            contagem_tipos[dados['risco_dominante']] += 1
    
    return {
        'resumo_geral': {
            'total_estados': total_estados,
            'estados_normais': estados_normais,
            'estados_alerta': estados_alerta,
            'taxa_alerta': round((estados_alerta / total_estados) * 100, 1)
        },
        'distribuicao_niveis': contagem_niveis,
        'distribuicao_tipos': contagem_tipos,
        'alertas_ativos': len(resultado_alertas['alertas_ativos']),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'status_sistema': 'OPERACIONAL'
    }

# ===== FUNÇÕES DE EXPORT =====

def garantir_diretorio(caminho):
    """
    Garante que o diretório existe, criando se necessário.
    """
    if not os.path.exists(caminho):
        os.makedirs(caminho)
        print(f"📁 Diretório criado: {caminho}")

def salvar_json(dados, arquivo, diretorio=OUTPUT_DIR):
    """
    Salva dados em arquivo JSON com tratamento de erro.
    
    Args:
        dados: Dados para serializar
        arquivo (str): Nome do arquivo
        diretorio (str): Diretório de destino
        
    Returns:
        bool: True se salvou com sucesso
    """
    try:
        garantir_diretorio(diretorio)
        caminho_completo = os.path.join(diretorio, arquivo)
        
        with open(caminho_completo, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Salvo: {arquivo}")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao salvar {arquivo}: {e}")
        return False

def exportar_todos_dados():
    """
    Função principal: exporta todos os dados para o frontend.
    
    Returns:
        dict: Relatório do export
    """
    print("📦 EXPORTANDO DADOS PARA FRONTEND")
    print("=" * 40)
    
    sucessos = 0
    falhas = 0
    
    try:
        # 1. Obter dados atualizados
        print("🔄 Coletando dados...")
        analise_completa = analisar_todos_estados(detalhado=False)
        resultado_alertas = processar_alertas_ativos(modo_silencioso=True)
        
        # 2. Transformar para frontend
        print("🔄 Transformando dados...")
        dados_estados = transformar_dados_para_frontend(analise_completa)
        dados_alertas = transformar_alertas_para_frontend(resultado_alertas)
        dados_dashboard = criar_dados_dashboard()
        
        # 3. Configuração do sistema
        config_sistema = {
            'versao': '1.0.0',
            'ultima_atualizacao': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'intervalo_atualizacao': 300,  # 5 minutos
            'estados_monitorados': ['RJ', 'SC', 'CE', 'PE', 'AL', 'BA'],
            'tipos_emergencia': ['incendio', 'enchente', 'tsunami']
        }
        
        # 4. Exportar cada arquivo
        exports = [
            (dados_estados, ARQUIVOS_EXPORT['estados']),
            (dados_alertas, ARQUIVOS_EXPORT['alertas']),
            (dados_dashboard, ARQUIVOS_EXPORT['dashboard']),
            (config_sistema, ARQUIVOS_EXPORT['config'])
        ]
        
        for dados, arquivo in exports:
            if salvar_json(dados, arquivo):
                sucessos += 1
            else:
                falhas += 1
        
        # 5. Backup (opcional)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = f"{BACKUP_DIR}/{timestamp}"
        
        for dados, arquivo in exports:
            salvar_json(dados, arquivo, backup_dir)
        
        print(f"\n📊 Export concluído:")
        print(f"   ✅ Sucessos: {sucessos}")
        print(f"   ❌ Falhas: {falhas}")
        
        return {
            'sucesso': falhas == 0,
            'arquivos_exportados': sucessos,
            'arquivos_falharam': falhas,
            'diretorio_output': OUTPUT_DIR,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
    except Exception as e:
        print(f"❌ Erro crítico no export: {e}")
        return {
            'sucesso': False,
            'erro': str(e),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

# ===== FUNÇÃO DE TESTE =====

def testar_export():
    """
    Testa o sistema de export sem salvar arquivos.
    """
    print("🧪 TESTANDO SISTEMA DE EXPORT")
    print("=" * 30)
    
    try:
        # Testar transformações
        analise_teste = analisar_todos_estados(detalhado=False)
        dados_estados = transformar_dados_para_frontend(analise_teste)
        
        print(f"✅ Estados transformados: {len(dados_estados)}")
        
        if dados_estados:
            exemplo = dados_estados[0]
            print(f"   Exemplo: {exemplo['sigla']} - {exemplo['risco_geral']}")
            print(f"   Cor mapa: {exemplo['cor_mapa']['hex']}")
        
        # Testar alertas
        alertas_teste = processar_alertas_ativos(modo_silencioso=True)
        dados_alertas = transformar_alertas_para_frontend(alertas_teste)
        
        print(f"✅ Alertas transformados: {dados_alertas['total_alertas']}")
        print(f"   Críticos: {dados_alertas['alertas_criticos']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        return False

if __name__ == '__main__':
    print("Escolha uma opção:")
    print("1. Testar transformações")
    print("2. Exportar dados completos")
    
    opcao = input("Digite 1 ou 2: ").strip()
    
    if opcao == "1":
        testar_export()
    elif opcao == "2":
        exportar_todos_dados()
    else:
        print("❌ Opção inválida")