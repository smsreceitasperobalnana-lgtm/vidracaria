-- Schema do banco de dados SQLite para Vidraçaria
-- Criado em: 2024

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT CHECK(tipo IN ('pessoa_fisica', 'pessoa_juridica', 'revendedor', 'construtora')) DEFAULT 'pessoa_fisica',
    documento TEXT UNIQUE NOT NULL, -- CPF ou CNPJ
    rg_ie TEXT,
    data_nascimento DATE,
    classificacao TEXT CHECK(classificacao IN ('novo', 'regular', 'vip', 'corporativo')) DEFAULT 'novo',
    telefone TEXT,
    whatsapp BOOLEAN DEFAULT 0,
    email TEXT,
    endereco_rua TEXT,
    endereco_numero TEXT,
    endereco_bairro TEXT,
    endereco_cidade TEXT DEFAULT 'Umuarama',
    endereco_estado TEXT DEFAULT 'PR',
    endereco_cep TEXT,
    endereco_referencia TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos/Materiais
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT CHECK(categoria IN ('vidro', 'esquadria', 'ferragem', 'servico')) NOT NULL,
    tipo TEXT NOT NULL, -- temperado, laminado, comum, etc
    espessura INTEGER, -- em mm
    cor TEXT,
    unidade TEXT NOT NULL, -- m2, ml, peca, servico
    preco_custo DECIMAL(10,2) DEFAULT 0,
    preco_venda DECIMAL(10,2) DEFAULT 0,
    margem_lucro DECIMAL(5,2) DEFAULT 30.00,
    ativo BOOLEAN DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL,
    projeto_nome TEXT NOT NULL,
    projeto_tipo TEXT NOT NULL,
    altura INTEGER, -- em mm
    largura INTEGER, -- em mm
    profundidade INTEGER, -- em mm
    local_instalacao TEXT,
    observacoes TEXT,
    status TEXT CHECK(status IN ('rascunho', 'enviado', 'aprovado', 'recusado', 'expirado')) DEFAULT 'rascunho',
    vendedor TEXT DEFAULT 'Admin',
    valor_materiais DECIMAL(10,2) DEFAULT 0,
    valor_mao_obra DECIMAL(10,2) DEFAULT 0,
    valor_perdas DECIMAL(10,2) DEFAULT 0,
    valor_despesas DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) DEFAULT 0,
    margem_lucro DECIMAL(5,2) DEFAULT 30.00,
    forma_pagamento TEXT DEFAULT 'a_vista',
    parcelas INTEGER DEFAULT 1,
    entrada_percentual DECIMAL(5,2) DEFAULT 0,
    validade_dias INTEGER DEFAULT 15,
    data_orcamento DATE DEFAULT CURRENT_DATE,
    data_validade DATE,
    data_aprovacao DATETIME,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

-- Tabela de Itens do Orçamento
CREATE TABLE IF NOT EXISTS orcamento_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orcamento_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos (id)
);

-- Tabela de Histórico de Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    orcamento_id INTEGER,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    status TEXT CHECK(status IN ('pendente', 'aprovado', 'producao', 'pronto', 'instalando', 'concluido', 'garantia')) DEFAULT 'pendente',
    valor_total DECIMAL(10,2) NOT NULL,
    data_inicio DATE,
    data_conclusao DATE,
    garantia_meses INTEGER DEFAULT 12,
    observacoes TEXT,
    fotos TEXT, -- JSON com URLs das fotos
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id)
);

-- Tabela de Interações com Clientes
CREATE TABLE IF NOT EXISTS interacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('telefone', 'whatsapp', 'email', 'visita', 'reuniao')) NOT NULL,
    assunto TEXT NOT NULL,
    descricao TEXT,
    data_contato DATETIME DEFAULT CURRENT_TIMESTAMP,
    proximo_contato DATE,
    usuario TEXT DEFAULT 'Admin',
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

-- Inserir produtos básicos
INSERT OR IGNORE INTO produtos (nome, categoria, tipo, espessura, cor, unidade, preco_custo, preco_venda) VALUES
-- Vidros
('Vidro Temperado 4mm Incolor', 'vidro', 'temperado', 4, 'incolor', 'm2', 35.00, 50.00),
('Vidro Temperado 6mm Incolor', 'vidro', 'temperado', 6, 'incolor', 'm2', 45.00, 65.00),
('Vidro Temperado 8mm Incolor', 'vidro', 'temperado', 8, 'incolor', 'm2', 55.00, 80.00),
('Vidro Temperado 10mm Incolor', 'vidro', 'temperado', 10, 'incolor', 'm2', 65.00, 95.00),
('Vidro Laminado 6mm Incolor', 'vidro', 'laminado', 6, 'incolor', 'm2', 60.00, 85.00),
('Vidro Laminado 8mm Incolor', 'vidro', 'laminado', 8, 'incolor', 'm2', 75.00, 105.00),
('Vidro Comum 4mm Incolor', 'vidro', 'comum', 4, 'incolor', 'm2', 25.00, 35.00),
('Vidro Temperado 6mm Fumê', 'vidro', 'temperado', 6, 'fume', 'm2', 50.00, 70.00),
('Vidro Temperado 8mm Fumê', 'vidro', 'temperado', 8, 'fume', 'm2', 60.00, 85.00),

-- Esquadrias
('Perfil Linha 25 Branco', 'esquadria', 'linha_25', NULL, 'branco', 'ml', 12.00, 18.00),
('Perfil Linha 25 Preto', 'esquadria', 'linha_25', NULL, 'preto', 'ml', 14.00, 20.00),
('Perfil Linha 30 Branco', 'esquadria', 'linha_30', NULL, 'branco', 'ml', 15.00, 22.00),
('Perfil Linha 40 Branco', 'esquadria', 'linha_40', NULL, 'branco', 'ml', 18.00, 26.00),

-- Ferragens
('Kit Roldanas Janela Correr', 'ferragem', 'roldanas', NULL, NULL, 'kit', 25.00, 40.00),
('Kit Ferragens Box Banheiro', 'ferragem', 'kit_box', NULL, NULL, 'kit', 80.00, 120.00),
('Puxador Duplo Porta Vidro', 'ferragem', 'puxador', NULL, 'inox', 'peca', 45.00, 70.00),
('Dobradiça Pivotante', 'ferragem', 'dobradica', NULL, 'inox', 'peca', 35.00, 55.00),
('Trinco Janela', 'ferragem', 'trinco', NULL, 'branco', 'peca', 15.00, 25.00),

-- Serviços
('Instalação Janela Simples', 'servico', 'instalacao', NULL, NULL, 'servico', 80.00, 120.00),
('Instalação Box Banheiro', 'servico', 'instalacao', NULL, NULL, 'servico', 150.00, 220.00),
('Instalação Porta Vidro', 'servico', 'instalacao', NULL, NULL, 'servico', 120.00, 180.00),
('Medição no Local', 'servico', 'medicao', NULL, NULL, 'servico', 30.00, 50.00);

-- Inserir clientes de exemplo
INSERT OR IGNORE INTO clientes (nome, tipo, documento, telefone, whatsapp, email, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, classificacao) VALUES
('Maria Silva Santos', 'pessoa_fisica', '123.456.789-00', '(44) 99876-5432', 1, 'maria.santos@email.com', 'Rua das Flores', '123', 'Centro', 'Umuarama', 'PR', '87501-000', 'vip'),
('João Carlos Oliveira', 'pessoa_fisica', '987.654.321-00', '(44) 98765-4321', 1, 'joao.oliveira@gmail.com', 'Rua Paraná', '456', 'Jardim América', 'Umuarama', 'PR', '87503-000', 'regular'),
('Construtora Paraná LTDA', 'pessoa_juridica', '12.345.678/0001-90', '(44) 3621-5555', 0, 'comercial@construtoraparana.com.br', 'Avenida Brasil', '2500', 'Zona Industrial', 'Umuarama', 'PR', '87502-000', 'corporativo'),
('Ana Paula Ferreira', 'pessoa_fisica', '456.789.123-00', '(44) 99555-7777', 1, 'ana.ferreira@hotmail.com', 'Rua São Paulo', '789', 'Vila Operária', 'Umuarama', 'PR', '87504-000', 'novo');