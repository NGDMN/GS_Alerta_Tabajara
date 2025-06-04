-- =====================================================
-- SCHEMA CORRIGIDO PARA O SISTEMA DE ALERTAS TABAJARA
-- Banco: SQLite  
-- Versão: 1.1 (Corrigida)
-- =====================================================

-- Tabela de Estados
CREATE TABLE IF NOT EXISTS estados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(2) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    populacao INTEGER NOT NULL,
    fuso_horario VARCHAR(10) NOT NULL,
    tipo_costa VARCHAR(20) NOT NULL,
    ondas_normal REAL DEFAULT 1.0,
    ventos_tipicos REAL DEFAULT 15.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Sensores
CREATE TABLE IF NOT EXISTS sensores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado_id INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    timestamp_coleta DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperatura REAL,
    umidade REAL,
    precipitacao REAL,
    velocidade_vento REAL,
    direcao_vento INTEGER,
    nivel_mar REAL,
    altura_ondas REAL,
    magnitude_sismica REAL,
    pressao_atmosferica REAL,
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

-- Tabela de Abrigos
CREATE TABLE IF NOT EXISTS abrigos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado_id INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    capacidade INTEGER NOT NULL,
    ocupacao INTEGER DEFAULT 0,
    contato VARCHAR(15),
    recursos TEXT,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_sensores_estado ON sensores(estado_id);
CREATE INDEX IF NOT EXISTS idx_sensores_timestamp ON sensores(timestamp_coleta);
CREATE INDEX IF NOT EXISTS idx_abrigos_estado ON abrigos(estado_id);

-- =====================================================
-- DADOS INICIAIS DOS ESTADOS
-- =====================================================

INSERT INTO estados (nome, sigla, latitude, longitude, populacao, fuso_horario, tipo_costa) VALUES
('Rio de Janeiro', 'RJ', -22.9068, -43.1729, 17264943, 'UTC-3', 'atlantica'),
('Santa Catarina', 'SC', -27.2423, -50.2189, 7164788, 'UTC-3', 'atlantica'), 
('Ceará', 'CE', -3.7327, -38.5267, 9187103, 'UTC-3', 'atlantica'),
('Pernambuco', 'PE', -8.0476, -34.8770, 9557071, 'UTC-3', 'atlantica'),
('Alagoas', 'AL', -9.6498, -35.7089, 3337357, 'UTC-3', 'atlantica'),
('Bahia', 'BA', -12.9714, -38.5014, 14873064, 'UTC-3', 'atlantica');