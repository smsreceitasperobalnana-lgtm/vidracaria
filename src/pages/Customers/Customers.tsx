import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button'
import { formatDate } from '../../utils/format'

export default function Customers() {
  const { state } = useApp()
  const { customers } = state
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.document.includes(searchTerm)
    
    const matchesFilter = filterType === 'all' || 
                         customer.classification === filterType ||
                         customer.type === filterType

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie sua base de clientes
          </p>
        </div>
        <Link to="/customers/new">
          <Button icon={Plus}>
            Novo Cliente
          </Button>
        </Link>
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
                  placeholder="Buscar por nome ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input"
              >
                <option value="all">Todos</option>
                <option value="novo">Novos</option>
                <option value="regular">Regulares</option>
                <option value="vip">VIP</option>
                <option value="corporativo">Corporativos</option>
                <option value="fisica">Pessoa Física</option>
                <option value="juridica">Pessoa Jurídica</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {customer.type === 'fisica' ? 'CPF' : 'CNPJ'}: {customer.document}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    customer.classification === 'vip' ? 'badge-primary' :
                    customer.classification === 'novo' ? 'badge-success' :
                    customer.classification === 'corporativo' ? 'badge-warning' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.classification.toUpperCase()}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {customer.contacts.phones[0] && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {customer.contacts.phones[0].number}
                    {customer.contacts.phones[0].whatsapp && (
                      <span className="ml-2 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                        WhatsApp
                      </span>
                    )}
                  </div>
                )}
                
                {customer.contacts.emails[0] && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {customer.contacts.emails[0].email}
                  </div>
                )}
                
                {customer.addresses.residential && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {customer.addresses.residential.city}, {customer.addresses.residential.state}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {customer.history.projects.length} projeto(s)
                  </span>
                  <span className="text-gray-500">
                    Cliente desde {formatDate(customer.createdAt)}
                  </span>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <Link 
                    to={`/customers/${customer.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full text-xs">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link 
                    to={`/quotes/new?customer=${customer.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full text-xs">
                      Novo Orçamento
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 
              'Tente ajustar os filtros de busca.' :
              'Comece cadastrando seu primeiro cliente.'
            }
          </p>
          <Link to="/customers/new">
            <Button icon={Plus}>
              Cadastrar Cliente
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}