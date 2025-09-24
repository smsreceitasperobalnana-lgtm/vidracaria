import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, X, Plus, Calculator, Trash2 } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button'
import { Quote, QuoteItem, Customer } from '../../types'
import { generateId, generateQuoteNumber } from '../../utils/helpers'
import { calculateGlassCost, calculateFrameCost, calculateHardwareCost } from '../../utils/calculator'

interface QuoteFormData {
  customerId: string
  projectName: string
  projectType: string
  location: {
    street?: string
    number?: string
    city?: string
    state?: string
    reference?: string
    accessNotes?: string
  }
  measurements: {
    height: number
    width: number
    depth?: number
    tolerances?: string
  }
  notes?: string
  validityDays: number
  salesperson: string
  paymentTerms: {
    method: 'cash' | 'installments' | 'financing'
    installments?: number
    downPayment?: number
    description?: string
  }
}

export default function QuoteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const preSelectedCustomer = searchParams.get('customer')
  
  const { state, dispatch, getQuote } = useApp()
  const { customers } = state
  const isEditing = !!id
  
  const existingQuote = isEditing ? getQuote(id!) : null
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<QuoteFormData>({
    defaultValues: existingQuote ? {
      customerId: existingQuote.customerId,
      projectName: existingQuote.project.name,
      projectType: existingQuote.project.type,
      location: existingQuote.project.location.address || {},
      measurements: existingQuote.project.specifications.measurements,
      notes: existingQuote.notes,
      validityDays: Math.ceil((new Date(existingQuote.validUntil).getTime() - new Date(existingQuote.date).getTime()) / (1000 * 60 * 60 * 24)),
      salesperson: existingQuote.salesperson,
      paymentTerms: existingQuote.paymentTerms || { method: 'cash' },
    } : {
      customerId: preSelectedCustomer || '',
      projectType: 'janela-correr',
      validityDays: 15,
      salesperson: 'Admin',
      paymentTerms: { method: 'cash' },
      measurements: { height: 0, width: 0 }
    }
  })

  const [items, setItems] = useState<QuoteItem[]>(
    existingQuote?.items || []
  )

  const selectedCustomerId = watch('customerId')
  const projectType = watch('projectType')
  const measurements = watch('measurements')

  const addGlassItem = () => {
    const area = (measurements.height / 1000) * (measurements.width / 1000) // Convert mm to m²
    const cost = calculateGlassCost({
      type: 'temperado',
      thickness: 6,
      color: 'incolor',
      area,
      finishing: []
    })

    const newItem: QuoteItem = {
      id: generateId(),
      category: 'glass',
      type: 'Vidro Temperado 6mm',
      specifications: {
        type: 'temperado',
        thickness: 6,
        color: 'incolor',
        height: measurements.height,
        width: measurements.width,
        area: area
      },
      quantity: 1,
      unit: 'm²',
      unitPrice: cost.pricePerM2,
      totalPrice: cost.totalPrice,
      description: `Vidro temperado 6mm incolor ${measurements.height}x${measurements.width}mm`
    }

    setItems([...items, newItem])
  }

  const addFrameItem = () => {
    const perimeter = 2 * ((measurements.height + measurements.width) / 1000) // Convert mm to m
    const cost = calculateFrameCost({
      system: 'correr',
      profile: {
        line: 'Linha 25',
        series: 'Standard',
        dimensions: '25x25mm',
        weight: 0.8,
        resistance: 'Média'
      },
      color: 'branco',
      finishing: 'eletrostatico',
      linearMeters: perimeter
    })

    const newItem: QuoteItem = {
      id: generateId(),
      category: 'frame',
      type: 'Esquadria de Correr',
      specifications: {
        system: 'correr',
        profile: 'Linha 25',
        color: 'branco',
        perimeter: perimeter
      },
      quantity: 1,
      unit: 'conjunto',
      unitPrice: cost.totalPrice,
      totalPrice: cost.totalPrice,
      description: `Esquadria de correr linha 25 branca - ${measurements.height}x${measurements.width}mm`
    }

    setItems([...items, newItem])
  }

  const addHardwareItem = () => {
    const cost = calculateHardwareCost({
      type: 'roldanas',
      brand: 'Nacional',
      model: 'Standard',
      quantity: 4,
      unitPrice: 15
    })

    const newItem: QuoteItem = {
      id: generateId(),
      category: 'hardware',
      type: 'Kit Ferragens',
      specifications: {
        type: 'conjunto_correr',
        items: ['roldanas', 'trincos', 'puxadores', 'borrachas']
      },
      quantity: 1,
      unit: 'kit',
      unitPrice: cost.totalPrice,
      totalPrice: cost.totalPrice,
      description: 'Kit completo de ferragens para janela de correr'
    }

    setItems([...items, newItem])
  }

  const addServiceItem = () => {
    const basePrice = 150
    const area = (measurements.height / 1000) * (measurements.width / 1000)
    const totalPrice = basePrice + (area * 50)

    const newItem: QuoteItem = {
      id: generateId(),
      category: 'service',
      type: 'Instalação',
      specifications: {
        type: 'installation',
        includes: ['medição', 'instalação', 'vedação', 'limpeza']
      },
      quantity: 1,
      unit: 'serviço',
      unitPrice: totalPrice,
      totalPrice: totalPrice,
      description: 'Serviço completo de instalação incluindo medição, instalação, vedação e limpeza'
    }

    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items]
    newItems[index].quantity = quantity
    newItems[index].totalPrice = newItems[index].unitPrice * quantity
    setItems(newItems)
  }

  const updateItemPrice = (index: number, price: number) => {
    const newItems = [...items]
    newItems[index].unitPrice = price
    newItems[index].totalPrice = price * newItems[index].quantity
    setItems(newItems)
  }

  // Calculate totals
  const materialsTotal = items
    .filter(item => ['glass', 'frame', 'hardware'].includes(item.category))
    .reduce((sum, item) => sum + item.totalPrice, 0)

  const laborTotal = items
    .filter(item => item.category === 'service')
    .reduce((sum, item) => sum + item.totalPrice, 0)

  const subtotal = materialsTotal + laborTotal
  const losses = subtotal * 0.05 // 5% losses
  const overhead = subtotal * 0.10 // 10% overhead
  const costTotal = subtotal + losses + overhead
  const profit = costTotal * 0.30 // 30% profit margin
  const total = costTotal + profit

  const onSubmit = (data: QuoteFormData) => {
    const customer = customers.find(c => c.id === data.customerId)
    if (!customer) {
      alert('Selecione um cliente válido')
      return
    }

    const quote: Quote = {
      id: isEditing ? id! : generateId(),
      number: existingQuote?.number || generateQuoteNumber(),
      customerId: data.customerId,
      customer,
      date: existingQuote?.date || new Date(),
      validUntil: new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000),
      status: existingQuote?.status || 'draft',
      salesperson: data.salesperson,
      project: {
        name: data.projectName,
        type: data.projectType as any,
        location: {
          address: data.location.street ? {
            street: data.location.street!,
            number: data.location.number!,
            neighborhood: '',
            city: data.location.city!,
            state: data.location.state!,
            zipCode: ''
          } : undefined,
          reference: data.location.reference,
          accessNotes: data.location.accessNotes,
        },
        specifications: {
          measurements: data.measurements,
          notes: data.notes
        }
      },
      items,
      totals: {
        materials: materialsTotal,
        labor: laborTotal,
        losses,
        overhead,
        subtotal: costTotal,
        profit,
        total
      },
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      createdAt: existingQuote?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (isEditing) {
      dispatch({ type: 'UPDATE_QUOTE', payload: quote })
    } else {
      dispatch({ type: 'ADD_QUOTE', payload: quote })
    }

    navigate('/quotes')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do orçamento' : 'Crie um novo orçamento detalhado'}
          </p>
        </div>
        <button
          onClick={() => navigate('/quotes')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Informações Básicas
            </h2>
          </div>
          <div className="card-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Cliente *</label>
                <select
                  {...register('customerId', { required: 'Cliente é obrigatório' })}
                  className="form-input"
                >
                  <option value="">Selecione um cliente...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Vendedor</label>
                <input
                  type="text"
                  {...register('salesperson')}
                  className="form-input"
                  placeholder="Nome do vendedor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Nome do Projeto *</label>
                <input
                  type="text"
                  {...register('projectName', { required: 'Nome do projeto é obrigatório' })}
                  className="form-input"
                  placeholder="Ex: Janela Sala Apartamento 101"
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Tipo do Projeto</label>
                <select
                  {...register('projectType')}
                  className="form-input"
                >
                  <option value="janela-correr">Janela de Correr</option>
                  <option value="janela-maximar">Janela Maxim-ar</option>
                  <option value="janela-basculante">Janela Basculante</option>
                  <option value="janela-abrir">Janela de Abrir</option>
                  <option value="porta-pivotante">Porta Pivotante</option>
                  <option value="porta-correr">Porta de Correr</option>
                  <option value="porta-abrir">Porta de Abrir</option>
                  <option value="box-frontal">Box Frontal</option>
                  <option value="box-lateral">Box Lateral</option>
                  <option value="box-nicho">Box Nicho</option>
                  <option value="espelho-decorativo">Espelho Decorativo</option>
                  <option value="espelho-banheiro">Espelho Banheiro</option>
                  <option value="cobertura-telhado">Cobertura Telhado</option>
                  <option value="cobertura-sacada">Cobertura Sacada</option>
                  <option value="fachada-curtain">Fachada Curtain Wall</option>
                  <option value="fachada-estrutural">Fachada Estrutural</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Validade do Orçamento</label>
              <select
                {...register('validityDays')}
                className="form-input"
              >
                <option value={15}>15 dias</option>
                <option value={30}>30 dias</option>
                <option value={45}>45 dias</option>
                <option value={60}>60 dias</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Specifications */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Especificações do Projeto
            </h2>
          </div>
          <div className="card-body space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Medidas do Vão</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Altura (mm) *</label>
                  <input
                    type="number"
                    {...register('measurements.height', { 
                      required: 'Altura é obrigatória',
                      min: { value: 1, message: 'Altura deve ser maior que 0' }
                    })}
                    className="form-input"
                    placeholder="1200"
                  />
                  {errors.measurements?.height && (
                    <p className="mt-1 text-sm text-red-600">{errors.measurements.height.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Largura (mm) *</label>
                  <input
                    type="number"
                    {...register('measurements.width', { 
                      required: 'Largura é obrigatória',
                      min: { value: 1, message: 'Largura deve ser maior que 0' }
                    })}
                    className="form-input"
                    placeholder="1500"
                  />
                  {errors.measurements?.width && (
                    <p className="mt-1 text-sm text-red-600">{errors.measurements.width.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Profundidade (mm)</label>
                  <input
                    type="number"
                    {...register('measurements.depth')}
                    className="form-input"
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">Tolerâncias e Observações</label>
                <input
                  type="text"
                  {...register('measurements.tolerances')}
                  className="form-input"
                  placeholder="±2mm, considerar esquadro..."
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Local de Instalação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Endereço</label>
                  <input
                    type="text"
                    {...register('location.street')}
                    className="form-input"
                    placeholder="Rua, número"
                  />
                </div>
                
                <div>
                  <label className="form-label">Cidade / Estado</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      {...register('location.city')}
                      className="form-input flex-1"
                      placeholder="Cidade"
                    />
                    <select
                      {...register('location.state')}
                      className="form-input w-24"
                    >
                      <option value="">UF</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="PR">PR</option>
                      <option value="SC">SC</option>
                      <option value="RS">RS</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="form-label">Ponto de Referência</label>
                  <input
                    type="text"
                    {...register('location.reference')}
                    className="form-input"
                    placeholder="Próximo ao shopping..."
                  />
                </div>
                
                <div>
                  <label className="form-label">Observações de Acesso</label>
                  <input
                    type="text"
                    {...register('location.accessNotes')}
                    className="form-input"
                    placeholder="Escada, elevador, estacionamento..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Itens do Orçamento
              </h2>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addGlassItem}
                  disabled={!measurements.height || !measurements.width}
                >
                  Vidro
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addFrameItem}
                  disabled={!measurements.height || !measurements.width}
                >
                  Esquadria
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addHardwareItem}
                >
                  Ferragens
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addServiceItem}
                >
                  Serviço
                </Button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Qtd
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Valor Unit.
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{item.type}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                            min="1"
                            step="0.01"
                          />
                          <div className="text-xs text-gray-500 mt-1">{item.unit}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                            className="w-24 px-2 py-1 text-center border border-gray-300 rounded"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">
                          R$ {item.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  Nenhum item adicionado ao orçamento
                </p>
                <p className="text-xs text-gray-400">
                  {!measurements.height || !measurements.width ? 
                    'Informe as medidas do projeto para adicionar itens automaticamente' :
                    'Use os botões acima para adicionar itens ao orçamento'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        {items.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Resumo Financeiro
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materiais:</span>
                    <span className="font-medium">R$ {materialsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mão de Obra:</span>
                    <span className="font-medium">R$ {laborTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perdas (5%):</span>
                    <span className="font-medium">R$ {losses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Despesas (10%):</span>
                    <span className="font-medium">R$ {overhead.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custo Total:</span>
                    <span className="font-medium">R$ {costTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margem (30%):</span>
                    <span className="font-medium">R$ {profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-brand-primary border-t pt-3">
                    <span>TOTAL GERAL:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Terms */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Condições de Pagamento
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label">Forma de Pagamento</label>
              <select
                {...register('paymentTerms.method')}
                className="form-input"
              >
                <option value="cash">À Vista</option>
                <option value="installments">Parcelado</option>
                <option value="financing">Financiamento</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Número de Parcelas</label>
                <input
                  type="number"
                  {...register('paymentTerms.installments')}
                  className="form-input"
                  placeholder="12"
                  min="1"
                />
              </div>

              <div>
                <label className="form-label">Entrada (%)</label>
                <input
                  type="number"
                  {...register('paymentTerms.downPayment')}
                  className="form-input"
                  placeholder="30"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Observações sobre Pagamento</label>
              <textarea
                {...register('paymentTerms.description')}
                className="form-input"
                rows={2}
                placeholder="Detalhes adicionais sobre condições de pagamento..."
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Observações Gerais
            </h2>
          </div>
          <div className="card-body">
            <textarea
              {...register('notes')}
              className="form-input"
              rows={4}
              placeholder="Observações técnicas, garantia, prazos, condições especiais..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/quotes')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            icon={Save}
            disabled={items.length === 0}
          >
            {isEditing ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
          </Button>
        </div>
      </form>
    </div>
  )
}