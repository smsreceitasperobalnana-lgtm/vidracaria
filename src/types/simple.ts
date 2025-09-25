// Tipos simplificados para o sistema

export interface Cliente {
  id?: number
  nome: string
  telefone: string
  whatsapp?: string
  email?: string
  documento?: string
  endereco?: string
  cidade?: string
  estado?: string
  tipo?: 'fisica' | 'juridica'
  classificacao?: 'novo' | 'regular' | 'vip' | 'corporativo'
  observacoes?: string
  ativo?: boolean
  data_cadastro?: string
}

export interface Produto {
  id?: number
  nome: string
  categoria: 'vidro' | 'esquadria' | 'ferragem' | 'servico'
  unidade: string
  preco_custo: number
  preco_venda: number
  margem: number
  ativo?: boolean
  data_cadastro?: string
}

export interface Orcamento {
  id?: number
  numero: string
  cliente_id: number
  projeto: string
  altura?: number
  largura?: number
  area?: number
  valor_total: number
  status?: 'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'expirado'
  vendedor?: string
  validade?: number
  data_orcamento?: string
  observacoes?: string
  
  // Dados do cliente (join)
  cliente_nome?: string
  cliente_telefone?: string
  cliente_email?: string
  
  // Itens do orçamento
  itens?: OrcamentoItem[]
}

export interface OrcamentoItem {
  id?: number
  orcamento_id: number
  produto_id: number
  descricao: string
  quantidade: number
  preco_unitario: number
  preco_total: number
  
  // Dados do produto (join)
  produto_nome?: string
  categoria?: string
}

export interface Estatisticas {
  clientes: {
    total: number
    novos: number
    vip: number
    inativos: number
  }
  orcamentos: {
    total: number
    pendentes: number
    aprovados: number
    conversao: number
  }
  faturamento: {
    mes: number
    ano: number
    ticketMedio: number
  }
  projetos: {
    andamento: number
    concluidos: number
    garantia: number
  }
}