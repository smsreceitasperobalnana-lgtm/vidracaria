import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  Calculator
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Orçamentos', href: '/quotes', icon: FileText },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Calculadora', href: '/calculator', icon: Calculator },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-6 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VL</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">Vidraçaria</h1>
              <p className="text-sm text-brand-primary font-medium">Liderança</p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-brand-primary' : 'text-gray-400'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}