# 🚨 GSX Alerta Tabajara

Sistema Integrado de Alertas de Emergência para Estados Costeiros Brasileiros

## 📋 Sobre o Projeto

Sistema que simula monitoramento em tempo real de condições meteorológicas extremas nos estados costeiros do Brasil (RJ, SC, CE, PE, AL, BA). Detecta riscos de tsunamis, enchentes, incêndios e atividade sísmica através de algoritmos baseados em thresholds científicos reais.

### 🎯 Diferencial Principal
Pop-up automático de emergência com instruções da Defesa Civil que redireciona diretamente para abrigos disponíveis.

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** - Interface componentizada e estado reativo
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Design responsivo com identidade GSX
- **JavaScript ES6** - Interatividade e lógica do cliente

### Backend & Dados
- **Python 3** - Processamento de dados e cálculo de riscos
- **SQLite** - Banco local para dados de sensores
- **JSON APIs** - Comunicação entre backend e frontend

### Ferramentas
- **Git + GitHub** - Controle de versão
- **Node.js + npm** - Ambiente de desenvolvimento
- **Create React App** - Configuração base do React

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Python 3.x (para executar scripts do backend)

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/NGDMN/GS_Alerta_Tabajara.git
cd GS_Alerta_Tabajara
```

#### 2. Configure o Frontend
```bash
cd frontend
npm install
npm start
```

O sistema será executado em `http://localhost:3000`

#### 3. Backend (Opcional - Dados já estão gerados)
```bash
cd backend/routes
python data_generator.py
python export_json.py
```

### Scripts Disponíveis

No diretório `frontend/`:

- `npm start` - Executa o app em modo desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa testes
- `npm run eject` - Remove dependência do Create React App (⚠️ irreversível)

## 📁 Estrutura do Projeto

```
GS_Alerta_Tabajara/
├── frontend/                 # React App
│   ├── public/
│   │   └── data/             # JSONs gerados pelo backend
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   └── ...
│   └── package.json
├── backend/
│   └── routes/              # Scripts Python
├── whatsapp_do_tio_beto/    # Banco SQLite
└── README.md
```

## 🌊 Funcionalidades

### Core Features
- **Dashboard em Tempo Real** - Monitoramento de 6 estados costeiros
- **Sistema de Alertas** - Pop-ups automáticos para emergências críticas
- **Calculadora de Riscos** - Algoritmos baseados em dados científicos
- **Localização de Abrigos** - Sistema que indica abrigos mais próximos
- **Orientações de Emergência** - Instruções oficiais da Defesa Civil

### Tipos de Emergência Detectados
- 🔥 **Incêndios** - Temperatura + umidade + vento + precipitação
- 🌊 **Enchentes** - Acúmulo de chuva + nível do mar + tempestades
- 🌊 **Tsunamis** - Atividade sísmica + magnitude + proximidade da costa

## 🎮 Como Testar

### Simular Emergência
1. Acesse a página **Monitoramento**
2. Clique em **"🎲 Simular Emergência Aleatória"**
3. Pop-up de emergência será exibido automaticamente
4. Teste as orientações na página **Orientações**

### Navegação Completa
- **Home** - Visão geral do projeto e problema
- **Monitoramento** - Dashboard com dados em tempo real
- **Orientações** - Instruções de emergência por tipo
- **Sobre** - Jornada profissional e metodologia técnica

## 🔬 Metodologia Científica

### Thresholds Baseados em Dados Reais
- **CEMADEN** - Critérios de enchente e precipitação
- **INMET** - Parâmetros meteorológicos
- **Defesa Civil** - Protocolos de emergência

### Sistema de Pontuação
- **0-24 pontos**: 🟢 Verde (Normal)
- **25-49 pontos**: 🟡 Amarelo (Atenção)
- **50-74 pontos**: 🟠 Laranja (Alerta)
- **75+ pontos**: 🔴 Vermelho (Emergência)

## 🎨 Identidade Visual

### Paleta GSX
- **Deep Blue**: `#0A1628` - Navegação e textos principais
- **Electric Blue**: `#1E3A8A` - CTAs e destaques
- **Data Green**: `#10B981` - Sucesso e dados positivos
- **Innovation Purple**: `#6366F1` - Tecnologia e inovação

### Sistema de Alertas
- **Verde**: `#10B981` - Situação normal
- **Amarelo**: `#F59E0B` - Atenção necessária
- **Laranja**: `#EF4444` - Estado de alerta
- **Vermelho**: `#DC2626` - Emergência crítica

## ⚠️ Importante

**Este é um projeto acadêmico com dados simulados.** 

Em emergências reais, sempre siga orientações oficiais da Defesa Civil, Bombeiros e autoridades locais.

### Contatos de Emergência Reais
- 🚨 **Emergência Geral**: 190
- 🔥 **Bombeiros**: 193
- 🚑 **SAMU**: 192
- 🏛️ **Defesa Civil**: 199

## 👨‍💻 Desenvolvedor

**Neil Goodman**  
Estudante de Engenharia de Software - FIAP  
Especialista em Automação de Processos e Análise de Dados

- **LinkedIn**: [Neil Goodman](link-linkedin)
- **GitHub**: [@NGDMN](https://github.com/NGDMN)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Global Solutions 2025 da FIAP.

## 🏆 Projeto Acadêmico

- **Instituição**: FIAP
- **Curso**: Engenharia de Software  
- **Projeto**: Global Solutions 2025
- **Turma**: 1ESOR
- **Tipo**: Protótipo Funcional (MVP)

---

**Desenvolvido com 💙 e muito ☕ por Neil Goodman**