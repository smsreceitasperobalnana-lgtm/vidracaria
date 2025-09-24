export interface Customer {
  id: string
  type: 'fisica' | 'juridica' | 'revendedor' | 'construtora'
  name: string
  document: string
  rg_ie?: string
  birthDate?: Date
  classification: 'novo' | 'regular' | 'vip' | 'corporativo'
  contacts: {
    phones: Array<{
      type: 'residencial' | 'comercial' | 'celular'
      number: string
      whatsapp?: boolean
    }>
    emails: Array<{
      type: 'pessoal' | 'comercial' | 'financeiro'
      email: string
    }>
    socialMedia?: {
      instagram?: string
      facebook?: string
    }
    preferredChannel: 'telefone' | 'email' | 'whatsapp' | 'visita'
  }
  addresses: {
    residential?: Address
    commercial?: Address
    installation?: Address
  }
  history: {
    projects: Project[]
    preferences: CustomerPreferences
    interactions: CustomerInteraction[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  reference?: string
  accessNotes?: string
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  status: ProjectStatus
  totalValue: number
  date: Date
  description?: string
  photos?: string[]
  warranty?: {
    startDate: Date
    endDate: Date
    active: boolean
  }
}

export interface CustomerPreferences {
  glassTypes: string[]
  colors: string[]
  frameTypes: string[]
  priceRange?: {
    min: number
    max: number
  }
}

export interface CustomerInteraction {
  id: string
  date: Date
  type: 'call' | 'email' | 'whatsapp' | 'visit' | 'meeting'
  subject: string
  notes: string
  followUpDate?: Date
  userId?: string
}

export interface Quote {
  id: string
  number: string
  customerId: string
  customer?: Customer
  date: Date
  validUntil: Date
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'expired'
  salesperson: string
  project: QuoteProject
  items: QuoteItem[]
  totals: {
    materials: number
    labor: number
    losses: number
    overhead: number
    subtotal: number
    profit: number
    total: number
  }
  paymentTerms?: PaymentTerms
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface QuoteProject {
  name: string
  type: ProjectType
  location: {
    address?: Address
    reference?: string
    accessNotes?: string
  }
  specifications: {
    measurements: {
      height: number
      width: number
      depth?: number
      tolerances?: string
    }
    photos?: string[]
    notes?: string
  }
}

export interface QuoteItem {
  id: string
  category: 'glass' | 'frame' | 'hardware' | 'service'
  type: string
  specifications: Record<string, any>
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  description: string
}

export interface PaymentTerms {
  method: 'cash' | 'installments' | 'financing'
  installments?: number
  downPayment?: number
  description?: string
}

export type ProjectType = 
  | 'janela-correr' | 'janela-maximar' | 'janela-basculante' | 'janela-abrir'
  | 'porta-pivotante' | 'porta-correr' | 'porta-abrir'
  | 'box-frontal' | 'box-lateral' | 'box-nicho'
  | 'espelho-decorativo' | 'espelho-banheiro'
  | 'cobertura-telhado' | 'cobertura-sacada'
  | 'fachada-curtain' | 'fachada-estrutural'
  | 'outros'

export type ProjectStatus = 
  | 'pending' | 'approved' | 'in_production' | 'ready' 
  | 'installing' | 'completed' | 'warranty'

export interface GlassSpecification {
  type: 'temperado' | 'laminado' | 'comum' | 'aramado' | 'refletivo' | 'autolimpante' | 'duplo'
  thickness: 4 | 5 | 6 | 8 | 10 | 12 | 15 | 19
  color: 'incolor' | 'fume' | 'verde' | 'bronze' | 'azul' | 'serigrafado' | 'esmaltado' | 'fosco'
  finishing?: Array<'lapidacao' | 'furos' | 'recortes' | 'bisote' | 'jateamento'>
}

export interface FrameSpecification {
  system: 'correr' | 'maximar' | 'pivotante' | 'basculante' | 'abrir' | 'rebativel'
  profile: {
    line: string
    series: string
    dimensions: string
    weight: number
    resistance: string
  }
  color: 'branco' | 'preto' | 'anodizado' | 'madeirado'
  finishing: 'eletrostatico' | 'anodizacao'
  sealing: {
    type: 'epdm' | 'silicone'
    thermalIsolation: boolean
    acousticIsolation: boolean
  }
}

export interface HardwareSpecification {
  type: 'roldanas' | 'dobradicas' | 'bracos' | 'trincos' | 'fechaduras' | 'puxadores'
  brand: string
  model: string
  security?: boolean
  automation?: boolean
}

export interface DashboardStats {
  customers: {
    total: number
    new: number
    vip: number
    inactive: number
  }
  quotes: {
    total: number
    pending: number
    approved: number
    conversionRate: number
  }
  revenue: {
    month: number
    year: number
    averageTicket: number
  }
  projects: {
    inProgress: number
    completed: number
    warranty: number
  }
}