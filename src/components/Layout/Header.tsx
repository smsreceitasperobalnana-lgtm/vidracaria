import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 md:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4 md:ml-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes, orçamentos..."
                  className="pl-10 pr-4 py-2 w-64 lg:w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                (44) 98415-2049 - Diego | (44) 98456-4529 - Jonathan
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}