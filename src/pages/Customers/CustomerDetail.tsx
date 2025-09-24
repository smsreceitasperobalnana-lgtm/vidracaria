import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Building,
  FileText,
  Plus,
  MessageCircle,
  Instagram,
  Facebook
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button'
import { formatDate, formatCurrency } from '../../utils/format'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCustomer, getCustomerQuotes } = useApp()
  
  const customer = getCustomer(id!)
  const quotes = getCustomerQuotes(id!)

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Cliente não encontrado</h2>
        <p className="text-gray-600 mt-2">O cliente solicitado não foi encontrado.</p>
        <Link to="/customers" className="mt-4 inline-block">
          <Button>Voltar para Clientes</Button>
        </Link>
      </div>
    )
  }

  const totalProjects = customer.history.projects.length
  const totalValue = customer.history.projects.reduce((sum, project) => sum + project.totalValue, 0)
  const averageTicket = totalProjects > 0 ? totalValue / totalProjects : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`badge ${
                customer.classification === 'vip' ? 'badge-primary' :
                customer.classification === 'novo' ? 'badge-success' :
                customer.classification === 'corporativo' ? 'badge-warning' :
                'bg-gray-100 text-gray-600'
              }`}>
                {customer.classification.toUpperCase()}
              </span>
              <span className="text-gray-500 text-sm">
                {customer.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link to={`/quotes/new?customer=${customer.id}`}>
            <Button icon={Plus}>
              Novo Orçamento
            </Button>
          </Link>
          <Link to={`/customers/${customer.id}/edit`}>
            <Button variant="outline" icon={Edit}>
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
            <div className="text-sm text-gray-500">Projetos Realizados</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-gray-500">Total Faturado</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(averageTicket)}</div>
            <div className="text-sm text-gray-500">Ticket Médio</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Informações Básicas
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center space-x-3">
                {customer.type === 'fisica' ? (
                  <User className="w-5 h-5 text-gray-400" />
                ) : (
                  <Building className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-500">
                    {customer.type === 'fisica' ? 'CPF' : 'CNPJ'}
                  </p>
                  <p className="font-medium text-gray-900">{customer.document}</p>
                </div>
              </div>

              {customer.rg_ie && (
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {customer.type === 'fisica' ? 'RG' : 'Inscrição Estadual'}
                    </p>
                    <p className="font-medium text-gray-900">{customer.rg_ie}</p>
                  </div>
                </div>
              )}

              {customer.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(customer.birthDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cliente desde</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Contatos
              </h2>
            </div>
            <div className="card-body space-y-4">
              {customer.contacts.phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{phone.number}</p>
                      <p className="text-sm text-gray-500 capitalize">{phone.type}</p>
                    </div>
                  </div>
                  {phone.whatsapp && (
                    <a 
                      href={`https://wa.me/55${phone.number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  )}
                </div>
              ))}

              {customer.contacts.emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <a 
                      href={`mailto:${email.email}`}
                      className="font-medium text-gray-900 hover:text-brand-primary"
                    >
                      {email.email}
                    </a>
                    <p className="text-sm text-gray-500 capitalize">{email.type}</p>
                  </div>
                </div>
              ))}

              {customer.contacts.socialMedia && (
                <div className="space-y-2">
                  {customer.contacts.socialMedia.instagram && (
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-5 h-5 text-gray-400" />
                      <a 
                        href={`https://instagram.com/${customer.contacts.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-brand-primary"
                      >
                        {customer.contacts.socialMedia.instagram}
                      </a>
                    </div>
                  )}
                  
                  {customer.contacts.socialMedia.facebook && (
                    <div className="flex items-center space-x-3">
                      <Facebook className="w-5 h-5 text-gray-400" />
                      <a 
                        href={customer.contacts.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-brand-primary"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Canal preferido: <span className="font-medium text-gray-700 capitalize">{customer.contacts.preferredChannel}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Endereços
              </h2>
            </div>
            <div className="card-body space-y-6">
              {customer.addresses.residential && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {customer.type === 'fisica' ? 'Residencial' : 'Principal'}
                  </h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        {customer.addresses.residential.street}, {customer.addresses.residential.number}
                        {customer.addresses.residential.complement && `, ${customer.addresses.residential.complement}`}
                      </p>
                      <p className="text-gray-700">
                        {customer.addresses.residential.neighborhood} - {customer.addresses.residential.city}/{customer.addresses.residential.state}
                      </p>
                      <p className="text-gray-500 text-sm">
                        CEP: {customer.addresses.residential.zipCode}
                      </p>
                      {customer.addresses.residential.reference && (
                        <p className="text-gray-500 text-sm mt-1">
                          Referência: {customer.addresses.residential.reference}
                        </p>
                      )}
                      {customer.addresses.residential.accessNotes && (
                        <p className="text-gray-500 text-sm mt-1">
                          Acesso: {customer.addresses.residential.accessNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {customer.addresses.installation && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Instalação</h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        {customer.addresses.installation.street}, {customer.addresses.installation.number}
                        {customer.addresses.installation.complement && `, ${customer.addresses.installation.complement}`}
                      </p>
                      <p className="text-gray-700">
                        {customer.addresses.installation.neighborhood} - {customer.addresses.installation.city}/{customer.addresses.installation.state}
                      </p>
                      <p className="text-gray-500 text-sm">
                        CEP: {customer.addresses.installation.zipCode}
                      </p>
                      {customer.addresses.installation.reference && (
                        <p className="text-gray-500 text-sm mt-1">
                          Referência: {customer.addresses.installation.reference}
                        </p>
                      )}
                      {customer.addresses.installation.accessNotes && (
                        <p className="text-gray-500 text-sm mt-1">
                          Acesso: {customer.addresses.installation.accessNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects and Quotes */}
        <div className="space-y-6">
          {/* Recent Quotes */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Orçamentos ({quotes.length})
                </h2>
                <Link to={`/quotes/new?customer=${customer.id}`}>
                  <Button size="sm" icon={Plus}>
                    Novo Orçamento
                  </Button>
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              {quotes.length > 0 ? (
                <div className="space-y-0">
                  {quotes.slice(0, 5).map((quote) => (
                    <Link
                      key={quote.id}
                      to={`/quotes/${quote.id}`}
                      className="block px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {quote.project.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(quote.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(quote.totals.total)}
                          </p>
                          <span className={`badge text-xs ${
                            quote.status === 'approved' ? 'badge-success' :
                            quote.status === 'pending' ? 'badge-warning' :
                            quote.status === 'sent' ? 'badge-primary' :
                            'badge-danger'
                          }`}>
                            {quote.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {quotes.length > 5 && (
                    <div className="px-6 py-3 text-center border-t border-gray-100">
                      <Link 
                        to={`/quotes?customer=${customer.id}`}
                        className="text-sm text-brand-primary hover:text-brand-dark"
                      >
                        Ver todos os orçamentos ({quotes.length})
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Nenhum orçamento encontrado
                  </p>
                  <Link to={`/quotes/new?customer=${customer.id}`} className="mt-3 inline-block">
                    <Button size="sm" icon={Plus}>
                      Criar Primeiro Orçamento
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Project History */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Histórico de Projetos ({totalProjects})
              </h2>
            </div>
            <div className="card-body p-0">
              {customer.history.projects.length > 0 ? (
                <div className="space-y-0">
                  {customer.history.projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="px-6 py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {project.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(project.date)} - {project.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(project.totalValue)}
                          </p>
                          <span className={`badge text-xs ${
                            project.status === 'completed' ? 'badge-success' :
                            project.status === 'warranty' ? 'badge-primary' :
                            project.status === 'installing' ? 'badge-warning' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Nenhum projeto realizado ainda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}