import React from 'react'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon: LucideIcon
  color?: 'primary' | 'green' | 'blue' | 'orange'
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = 'primary' 
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={clsx(
                  'text-xs font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs {change.period}</span>
              </div>
            )}
          </div>
          <div className={clsx(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}