import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Customer, Quote, DashboardStats } from '../types'
import { generateMockData } from '../utils/mockData'

interface AppState {
  customers: Customer[]
  quotes: Quote[]
  stats: DashboardStats
  isLoading: boolean
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_QUOTE'; payload: Quote }
  | { type: 'UPDATE_QUOTE'; payload: Quote }
  | { type: 'DELETE_QUOTE'; payload: string }
  | { type: 'UPDATE_STATS'; payload: DashboardStats }

const initialState: AppState = {
  customers: [],
  quotes: [],
  stats: {
    customers: { total: 0, new: 0, vip: 0, inactive: 0 },
    quotes: { total: 0, pending: 0, approved: 0, conversionRate: 0 },
    revenue: { month: 0, year: 0, averageTicket: 0 },
    projects: { inProgress: 0, completed: 0, warranty: 0 }
  },
  isLoading: false
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] }
    
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      }
    
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload)
      }
    
    case 'ADD_QUOTE':
      return { ...state, quotes: [...state.quotes, action.payload] }
    
    case 'UPDATE_QUOTE':
      return {
        ...state,
        quotes: state.quotes.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      }
    
    case 'DELETE_QUOTE':
      return {
        ...state,
        quotes: state.quotes.filter(q => q.id !== action.payload)
      }
    
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload }
    
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  getCustomer: (id: string) => Customer | undefined
  getQuote: (id: string) => Quote | undefined
  getCustomerQuotes: (customerId: string) => Quote[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize with mock data
  React.useEffect(() => {
    const mockData = generateMockData()
    mockData.customers.forEach(customer => {
      dispatch({ type: 'ADD_CUSTOMER', payload: customer })
    })
    mockData.quotes.forEach(quote => {
      dispatch({ type: 'ADD_QUOTE', payload: quote })
    })
    dispatch({ type: 'UPDATE_STATS', payload: mockData.stats })
  }, [])

  const getCustomer = (id: string) => 
    state.customers.find(c => c.id === id)

  const getQuote = (id: string) => 
    state.quotes.find(q => q.id === id)

  const getCustomerQuotes = (customerId: string) =>
    state.quotes.filter(q => q.customerId === customerId)

  const contextValue: AppContextType = {
    state,
    dispatch,
    getCustomer,
    getQuote,
    getCustomerQuotes
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
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}