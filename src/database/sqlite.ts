import Database from 'better-sqlite3'

// Banco SQLite simples para desenvolvimento
let db: Database.Database | null = null

export function initDB() {
  if (db) return db
  
  try {
    db = new Database('vidracaria.db')
    
    // Configurar SQLite
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    
    createTables()
    insertInitialData()
    
    console.log('✅ Banco SQLite inicializado')
    return db
  } catch (error) {
    console.error('❌ Erro no banco:', error)
    throw error
  }
}

function createTables() {
  if (!db) return
  
  // Tabela Clientes (simples)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      documento TEXT,
      endereco TEXT,
      cidade TEXT DEFAULT 'Umuarama',
      estado TEXT DEFAULT 'PR',
      tipo TEXT DEFAULT 'fisica',
      classificacao TEXT DEFAULT 'novo',
      observacoes TEXT,
      ativo INTEGER DEFAULT 1,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabela Produtos (simples)
  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      unidade TEXT NOT NULL,
      preco_custo REAL DEFAULT 0,
      preco_venda REAL DEFAULT 0,
      margem REAL DEFAULT 30,
      ativo INTEGER DEFAULT 1,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabela Orçamentos (simples)
  db.exec(`
    CREATE TABLE IF NOT EXISTS orcamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE NOT NULL,
      cliente_id INTEGER NOT NULL,
      projeto TEXT NOT NULL,
      altura REAL,
      largura REAL,
      area REAL,
      valor_total REAL DEFAULT 0,
      status TEXT DEFAULT 'rascunho',
      vendedor TEXT DEFAULT 'Admin',
      validade INTEGER DEFAULT 15,
      data_orcamento DATE DEFAULT CURRENT_DATE,
      observacoes TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `)

  // Tabela Itens do Orçamento (simples)
  db.exec(`
    CREATE TABLE IF NOT EXISTS orcamento_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orcamento_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      quantidade REAL NOT NULL,
      preco_unitario REAL NOT NULL,
      preco_total REAL NOT NULL,
      FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id),
      FOREIGN KEY (produto_id) REFERENCES produtos (id)
    )
  `)
}

function insertInitialData() {
  if (!db) return
  
  // Inserir produtos básicos
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO produtos (nome, categoria, unidade, preco_custo, preco_venda, margem)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const produtos = [
    // Vidros
    ['Vidro Temperado 4mm Incolor', 'vidro', 'm²', 35.00, 50.00, 42.86],
    ['Vidro Temperado 6mm Incolor', 'vidro', 'm²', 45.00, 65.00, 44.44],
    ['Vidro Temperado 8mm Incolor', 'vidro', 'm²', 55.00, 80.00, 45.45],
    ['Vidro Temperado 10mm Incolor', 'vidro', 'm²', 65.00, 95.00, 46.15],
    ['Vidro Laminado 6mm Incolor', 'vidro', 'm²', 60.00, 85.00, 41.67],
    ['Vidro Comum 4mm Incolor', 'vidro', 'm²', 25.00, 35.00, 40.00],
    ['Vidro Temperado 6mm Fumê', 'vidro', 'm²', 50.00, 70.00, 40.00],
    
    // Esquadrias
    ['Perfil Linha 25 Branco', 'esquadria', 'ml', 12.00, 18.00, 50.00],
    ['Perfil Linha 25 Preto', 'esquadria', 'ml', 14.00, 20.00, 42.86],
    ['Perfil Linha 30 Branco', 'esquadria', 'ml', 15.00, 22.00, 46.67],
    ['Perfil Linha 40 Branco', 'esquadria', 'ml', 18.00, 26.00, 44.44],
    
    // Ferragens
    ['Kit Roldanas Janela', 'ferragem', 'kit', 25.00, 40.00, 60.00],
    ['Kit Ferragens Box', 'ferragem', 'kit', 80.00, 120.00, 50.00],
    ['Puxador Duplo Inox', 'ferragem', 'pç', 45.00, 70.00, 55.56],
    ['Dobradiça Pivotante', 'ferragem', 'pç', 35.00, 55.00, 57.14],
    ['Trinco Janela', 'ferragem', 'pç', 15.00, 25.00, 66.67],
    
    // Serviços
    ['Instalação Janela', 'servico', 'un', 80.00, 120.00, 50.00],
    ['Instalação Box', 'servico', 'un', 150.00, 220.00, 46.67],
    ['Instalação Porta', 'servico', 'un', 120.00, 180.00, 50.00],
    ['Medição Local', 'servico', 'un', 30.00, 50.00, 66.67]
  ]

  produtos.forEach(produto => {
    insertProduct.run(...produto)
  })

  // Inserir clientes de exemplo
  const insertClient = db.prepare(`
    INSERT OR IGNORE INTO clientes (nome, telefone, whatsapp, email, documento, endereco, classificacao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const clientes = [
    ['Maria Silva Santos', '(44) 99876-5432', '(44) 99876-5432', 'maria@email.com', '123.456.789-00', 'Rua das Flores, 123 - Centro', 'vip'],
    ['João Carlos Oliveira', '(44) 98765-4321', '(44) 98765-4321', 'joao@gmail.com', '987.654.321-00', 'Rua Paraná, 456 - Jardim América', 'regular'],
    ['Construtora Paraná LTDA', '(44) 3621-5555', '(44) 99123-4567', 'comercial@construtoraparana.com.br', '12.345.678/0001-90', 'Av. Brasil, 2500 - Zona Industrial', 'corporativo'],
    ['Ana Paula Ferreira', '(44) 99555-7777', '(44) 99555-7777', 'ana@hotmail.com', '456.789.123-00', 'Rua São Paulo, 789 - Vila Operária', 'novo']
  ]

  clientes.forEach(cliente => {
    insertClient.run(...cliente)
  })
}

// Funções simples para usar no sistema
export class DB {
  private db: Database.Database

  constructor() {
    this.db = initDB()!
  }

  // CLIENTES
  getClientes() {
    return this.db.prepare('SELECT * FROM clientes WHERE ativo = 1 ORDER BY nome').all()
  }

  getCliente(id: number) {
    return this.db.prepare('SELECT * FROM clientes WHERE id = ?').get(id)
  }

  addCliente(cliente: any) {
    const stmt = this.db.prepare(`
      INSERT INTO clientes (nome, telefone, whatsapp, email, documento, endereco, cidade, estado, tipo, classificacao, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      cliente.nome, cliente.telefone, cliente.whatsapp, cliente.email, 
      cliente.documento, cliente.endereco, cliente.cidade, cliente.estado,
      cliente.tipo, cliente.classificacao, cliente.observacoes
    )
  }

  updateCliente(id: number, cliente: any) {
    const stmt = this.db.prepare(`
      UPDATE clientes SET 
        nome = ?, telefone = ?, whatsapp = ?, email = ?, documento = ?,
        endereco = ?, cidade = ?, estado = ?, tipo = ?, classificacao = ?, observacoes = ?
      WHERE id = ?
    `)
    return stmt.run(
      cliente.nome, cliente.telefone, cliente.whatsapp, cliente.email,
      cliente.documento, cliente.endereco, cliente.cidade, cliente.estado,
      cliente.tipo, cliente.classificacao, cliente.observacoes, id
    )
  }

  // PRODUTOS
  getProdutos() {
    return this.db.prepare('SELECT * FROM produtos WHERE ativo = 1 ORDER BY categoria, nome').all()
  }

  getProdutosByCategoria(categoria: string) {
    return this.db.prepare('SELECT * FROM produtos WHERE categoria = ? AND ativo = 1').all(categoria)
  }

  // ORÇAMENTOS
  getOrcamentos() {
    return this.db.prepare(`
      SELECT o.*, c.nome as cliente_nome, c.telefone as cliente_telefone
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id
      ORDER BY o.data_orcamento DESC
    `).all()
  }

  getOrcamento(id: number) {
    const orcamento = this.db.prepare(`
      SELECT o.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id
      WHERE o.id = ?
    `).get(id)

    if (orcamento) {
      const itens = this.db.prepare(`
        SELECT oi.*, p.nome as produto_nome, p.categoria
        FROM orcamento_itens oi
        JOIN produtos p ON oi.produto_id = p.id
        WHERE oi.orcamento_id = ?
      `).all(id)
      
      return { ...orcamento, itens }
    }
    return null
  }

  addOrcamento(orcamento: any) {
    const stmt = this.db.prepare(`
      INSERT INTO orcamentos (numero, cliente_id, projeto, altura, largura, area, valor_total, status, vendedor, validade, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      orcamento.numero, orcamento.cliente_id, orcamento.projeto, orcamento.altura, orcamento.largura,
      orcamento.area, orcamento.valor_total, orcamento.status, orcamento.vendedor, orcamento.validade, orcamento.observacoes
    )
  }

  addOrcamentoItem(item: any) {
    const stmt = this.db.prepare(`
      INSERT INTO orcamento_itens (orcamento_id, produto_id, descricao, quantidade, preco_unitario, preco_total)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      item.orcamento_id, item.produto_id, item.descricao,
      item.quantidade, item.preco_unitario, item.preco_total
    )
  }

  // ESTATÍSTICAS
  getEstatisticas() {
    const totalClientes = this.db.prepare('SELECT COUNT(*) as count FROM clientes WHERE ativo = 1').get()
    const totalOrcamentos = this.db.prepare('SELECT COUNT(*) as count FROM orcamentos').get()
    const orcamentosPendentes = this.db.prepare("SELECT COUNT(*) as count FROM orcamentos WHERE status = 'rascunho'").get()
    const orcamentosAprovados = this.db.prepare("SELECT COUNT(*) as count FROM orcamentos WHERE status = 'aprovado'").get()
    const faturamentoMes = this.db.prepare(`
      SELECT COALESCE(SUM(valor_total), 0) as total 
      FROM orcamentos 
      WHERE status = 'aprovado' 
      AND date(data_orcamento) >= date('now', 'start of month')
    `).get()

    return {
      clientes: {
        total: totalClientes?.count || 0,
        novos: 0,
        vip: 0,
        inativos: 0
      },
      orcamentos: {
        total: totalOrcamentos?.count || 0,
        pendentes: orcamentosPendentes?.count || 0,
        aprovados: orcamentosAprovados?.count || 0,
        conversao: totalOrcamentos?.count > 0 ? Math.round((orcamentosAprovados?.count / totalOrcamentos?.count) * 100) : 0
      },
      faturamento: {
        mes: faturamentoMes?.total || 0,
        ano: 0,
        ticketMedio: 0
      },
      projetos: {
        andamento: 0,
        concluidos: orcamentosAprovados?.count || 0,
        garantia: 0
      }
    }
  }
}

export default DB