import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cliente, Produto, Orcamento, Estatisticas } from '../types/simple'
import DB from '../database/sqlite'

interface AppState {
  clientes: Cliente[]
  produtos: Produto[]
  orcamentos: Orcamento[]
  estatisticas: Estatisticas
  loading: boolean
}

interface AppContextType {
  state: AppState
  // Clientes
  adicionarCliente: (cliente: Cliente) => void
  atualizarCliente: (id: number, cliente: Cliente) => void
  buscarCliente: (id: number) => Cliente | undefined
  // Produtos
  buscarProdutos: () => Produto[]
  buscarProdutosPorCategoria: (categoria: string) => Produto[]
  // Orçamentos
  adicionarOrcamento: (orcamento: Orcamento) => void
  buscarOrcamento: (id: number) => Orcamento | undefined
  buscarOrcamentosCliente: (clienteId: number) => Orcamento[]
  // Utilitários
  recarregarDados: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    clientes: [],
    produtos: [],
    orcamentos: [],
    estatisticas: {
      clientes: { total: 0, novos: 0, vip: 0, inativos: 0 },
      orcamentos: { total: 0, pendentes: 0, aprovados: 0, conversao: 0 },
      faturamento: { mes: 0, ano: 0, ticketMedio: 0 },
      projetos: { andamento: 0, concluidos: 0, garantia: 0 }
    },
    loading: true
  })

  const db = new DB()

  const carregarDados = () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const clientes = db.getClientes()
      const produtos = db.getProdutos()
      const orcamentos = db.getOrcamentos()
      const estatisticas = db.getEstatisticas()

      setState({
        clientes,
        produtos,
        orcamentos,
        estatisticas,
        loading: false
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const adicionarCliente = (cliente: Cliente) => {
    try {
      db.addCliente(cliente)
      carregarDados()
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
    }
  }

  const atualizarCliente = (id: number, cliente: Cliente) => {
    try {
      db.updateCliente(id, cliente)
      carregarDados()
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
    }
  }

  const buscarCliente = (id: number) => {
    return state.clientes.find(c => c.id === id)
  }

  const buscarProdutos = () => {
    return state.produtos
  }

  const buscarProdutosPorCategoria = (categoria: string) => {
    return state.produtos.filter(p => p.categoria === categoria)
  }

  const adicionarOrcamento = (orcamento: Orcamento) => {
    try {
      db.addOrcamento(orcamento)
      carregarDados()
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error)
    }
  }

  const buscarOrcamento = (id: number) => {
    return state.orcamentos.find(o => o.id === id)
  }

  const buscarOrcamentosCliente = (clienteId: number) => {
    return state.orcamentos.filter(o => o.cliente_id === clienteId)
  }

  const recarregarDados = () => {
    carregarDados()
  }

  const contextValue: AppContextType = {
    state,
    adicionarCliente,
    atualizarCliente,
    buscarCliente,
    buscarProdutos,
    buscarProdutosPorCategoria,
    adicionarOrcamento,
    buscarOrcamento,
    buscarOrcamentosCliente,
    recarregarDados
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}