import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import StatCard from '../components/UI/StatCard'
import Button from '../components/UI/Button'
import { formatCurrency } from '../utils/format'

export default function Dashboard() {
  const { state } = useApp()
  const { customers, quotes, stats } = state

  const recentQuotes = quotes.slice(0, 5)
  const recentCustomers = customers.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex space-x-4">
          <Link to="/customers/new">
            <Button icon={Plus}>
              Novo Cliente
            </Button>
          </Link>
          <Link to="/quotes/new">
            <Button variant="outline" icon={Plus}>
              Novo Orçamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Clientes"
          value={stats.customers.total}
          change={{
            value: 12,
            type: 'increase',
            period: 'mês anterior'
          }}
          icon={Users}
          color="primary"
        />
        
        <StatCard
          title="Orçamentos Ativos"
          value={stats.quotes.pending}
          change={{
            value: 8,
            type: 'increase',
            period: 'semana anterior'
          }}
          icon={FileText}
          color="blue"
        />
        
        <StatCard
          title="Faturamento Mensal"
          value={formatCurrency(stats.revenue.month)}
          change={{
            value: 15,
            type: 'increase',
            period: 'mês anterior'
          }}
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.quotes.conversionRate}%`}
          change={{
            value: 3,
            type: 'increase',
            period: 'mês anterior'
          }}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Orçamentos Recentes
              </h2>
              <Link 
                to="/quotes" 
                className="text-sm text-brand-primary hover:text-brand-dark"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="space-y-0">
              {recentQuotes.map((quote) => (
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
                        {quote.customer?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(quote.totals.total)}
                      </p>
                      <div className="flex items-center mt-1">
                        {quote.status === 'pending' && (
                          <div className="flex items-center text-yellow-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="text-xs">Pendente</span>
                          </div>
                        )}
                        {quote.status === 'approved' && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            <span className="text-xs">Aprovado</span>
                          </div>
                        )}
                        {quote.status === 'expired' && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            <span className="text-xs">Expirado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Clientes Recentes
              </h2>
              <Link 
                to="/customers" 
                className="text-sm text-brand-primary hover:text-brand-dark"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="space-y-0">
              {recentCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                  className="block px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.contacts.phones[0]?.number}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${
                        customer.classification === 'vip' ? 'badge-primary' :
                        customer.classification === 'novo' ? 'badge-success' :
                        'badge bg-gray-100 text-gray-600'
                      }`}>
                        {customer.classification.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">
            Ações Rápidas
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/quotes/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-center"
            >
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Criar Novo Orçamento
              </p>
            </Link>
            
            <Link
              to="/customers/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-center"
            >
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Cadastrar Cliente
              </p>
            </Link>
            
            <Link
              to="/reports"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-center"
            >
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Ver Relatórios
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}