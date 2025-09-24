import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText,
  Calendar,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button'
import { formatDate, formatCurrency } from '../../utils/format'

export default function Quotes() {
  const { state } = useApp()
  const { quotes, customers } = state
  const [searchParams] = useSearchParams()
  const customerFilter = searchParams.get('customer')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredQuotes = quotes.filter(quote => {
    const customer = customers.find(c => c.id === quote.customerId)
    const matchesSearch = quote.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.number.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    const matchesCustomer = !customerFilter || quote.customerId === customerFilter

    return matchesSearch && matchesStatus && matchesCustomer
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'sent':
        return <FileText className="w-4 h-4 text-blue-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Rascunho',
      sent: 'Enviado',
      pending: 'Pendente',
      approved: 'Aprovado',
      declined: 'Recusado',
      expired: 'Expirado'
    }
    return statusMap[status] || status
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'sent':
        return 'badge-primary'
      case 'declined':
      case 'expired':
        return 'badge-danger'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os orçamentos da empresa
          </p>
        </div>
        <Link to="/quotes/new">
          <Button icon={Plus}>
            Novo Orçamento
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900">
              {quotes.length}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {quotes.filter(q => q.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pendentes</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600">
              {quotes.filter(q => q.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-500">Aprovados</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-brand-primary">
              {quotes.length > 0 ? Math.round((quotes.filter(q => q.status === 'approved').length / quotes.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">Taxa de Conversão</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por projeto, cliente ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Todos os Status</option>
                <option value="draft">Rascunho</option>
                <option value="sent">Enviados</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="declined">Recusados</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="card">
        <div className="card-body p-0">
          {filteredQuotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orçamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data / Validade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => {
                    const customer = customers.find(c => c.id === quote.customerId)
                    const isExpired = new Date(quote.validUntil) < new Date()
                    
                    return (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                #{quote.number}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {quote.project.name}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {customer?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer?.contacts.phones[0]?.number}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {formatDate(quote.date)}
                              </div>
                              <div className={`text-xs ${
                                isExpired ? 'text-red-600' : 'text-gray-500'
                              }`}>
                                Válido até {formatDate(quote.validUntil)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(quote.totals.total)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Margem: {Math.round((quote.totals.profit / quote.totals.subtotal) * 100)}%
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(quote.status)}
                            <span className={`badge ${getStatusBadgeClass(quote.status)}`}>
                              {getStatusText(quote.status)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/quotes/${quote.id}`}>
                              <Button variant="outline" size="sm">
                                Ver
                              </Button>
                            </Link>
                            <Link to={`/quotes/${quote.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum orçamento encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 
                  'Tente ajustar os filtros de busca.' :
                  'Comece criando seu primeiro orçamento.'
                }
              </p>
              <Link to="/quotes/new">
                <Button icon={Plus}>
                  Criar Orçamento
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}