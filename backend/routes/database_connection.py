import sqlite3
import os

# Define caminho do DB
database_url = r"C:\Users\Neil\OneDrive\Python\FIAP\Global Solutions\GS_Alerta_Tabajara\whatsapp_do_tio_beto\alertas_tabajara.db"

def conectar_db(silent=False):
    """
    Conecta ao banco de dados SQLite.
    
    Args:
        silent (bool): Se True, não mostra mensagens de debug
    
    Returns:
        tuple: (conexao, cursor) ou (None, None) se erro
    """
    conn = None
    cursor = None

    if not os.path.exists(database_url):
        raise ValueError("database_url não encontrada no caminho")
    else:
        try:
            conn = sqlite3.connect(database_url)
            cursor = conn.cursor()
            # Só mostra debug se silent=False
            if not silent:
                print("Conectado!")
        except Exception as e:
            print(f"Erro ao conectar: {e}")
    return conn, cursor 
    
def desconectar_db(conn, silent=False):
    """
    Desconecta do banco de dados.
    
    Args:
        conn: Conexão do banco
        silent (bool): Se True, não mostra mensagens de debug
    """
    if conn == None:
        if not silent:
            print("Sem conexão ativa")
    else:
        try:
            conn.close()
            # Só mostra debug se silent=False
            if not silent:
                print("Conexão finalizada com sucesso!")
        except Exception as e:
            print(f"Erro ao finalizar conexão: {e}")
    return quit

def testar_db():
    """
    Função de teste - sempre mostra debug porque é para desenvolvimento.
    """
    try:
        conn = sqlite3.connect(database_url)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM estados;")
        resultados = cursor.fetchall()
        print(f"Encontrados {len(resultados)} estados:")
        for estado in resultados:
            print(f"    • {estado[1]} ({estado[2]})")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao conectar: {e}")
    
    return True

if __name__ == "__main__":
    print("🔧 Testando conexão (modo debug):")
    testar_db()