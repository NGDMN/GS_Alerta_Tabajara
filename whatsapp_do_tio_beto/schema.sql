-- SCHEMA UNIFICADO PARA O SISTEMA DE ALERTAS TABAJARA

--Tabela de Estados
CREATE TABLE IF NOT EXISTS Estados (
    id_estado SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(2) NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    população NUMERIC NOT NULL,
    fuso VARCHAR(6) NOT NULL,
    costa VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

--Tabela de Sensores
CREATE TABLE IF NOT EXISTS Sensores(
    id_sensores SERIAL PRIMARY KEY,
    id_estado
    latitude NUMERIC,
    longitude NUMERIC,
    hr_coleta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    temperatura NUMERIC,
    umidade NUMERIC,
    precipitação NUMERIC,
    velocidade_vento NUMERIC,
    direção_vento VARCHAR,
    nível_mar NUMERIC,
    altura_ondas NUMERIC,
    magnitude_sísmica NUMERIC,
    pressão_atm NUMERIC,
)

--Tabela de abrigos
CREATE TABLE IF NOT EXISTS Abrigos(
    id_abrigos SERIAL PRIMARY KEY,
    id_estado
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    capacidade NUMERIC NOT NULL,
    ocupação NUMERIC NOT NULL,
    contato VARCHAR(9) NOT NULL,
    acessibilidade VARCHAR(100) NOT NULL,
    recursos VARCHAR(2000),
)