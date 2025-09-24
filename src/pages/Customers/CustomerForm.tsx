import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button'
import { Customer } from '../../types'
import { generateId } from '../../utils/helpers'

interface CustomerFormData {
  type: 'fisica' | 'juridica' | 'revendedor' | 'construtora'
  name: string
  document: string
  rg_ie?: string
  birthDate?: string
  classification: 'novo' | 'regular' | 'vip' | 'corporativo'
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
  residential?: {
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
  commercial?: {
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
  installation?: {
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
}

export default function CustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state, dispatch, getCustomer } = useApp()
  const isEditing = !!id
  
  const existingCustomer = isEditing ? getCustomer(id!) : null
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: existingCustomer ? {
      type: existingCustomer.type,
      name: existingCustomer.name,
      document: existingCustomer.document,
      rg_ie: existingCustomer.rg_ie,
      birthDate: existingCustomer.birthDate ? new Date(existingCustomer.birthDate).toISOString().split('T')[0] : '',
      classification: existingCustomer.classification,
      phones: existingCustomer.contacts.phones,
      emails: existingCustomer.contacts.emails,
      socialMedia: existingCustomer.contacts.socialMedia,
      preferredChannel: existingCustomer.contacts.preferredChannel,
      residential: existingCustomer.addresses.residential,
      commercial: existingCustomer.addresses.commercial,
      installation: existingCustomer.addresses.installation,
    } : {
      type: 'fisica',
      classification: 'novo',
      phones: [{ type: 'celular', number: '', whatsapp: false }],
      emails: [{ type: 'pessoal', email: '' }],
      preferredChannel: 'telefone',
    }
  })

  const [phones, setPhones] = useState(
    existingCustomer?.contacts.phones || [{ type: 'celular', number: '', whatsapp: false }]
  )
  const [emails, setEmails] = useState(
    existingCustomer?.contacts.emails || [{ type: 'pessoal', email: '' }]
  )

  const customerType = watch('type')

  const addPhone = () => {
    setPhones([...phones, { type: 'celular', number: '', whatsapp: false }])
  }

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index))
  }

  const addEmail = () => {
    setEmails([...emails, { type: 'pessoal', email: '' }])
  }

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const onSubmit = (data: CustomerFormData) => {
    const customer: Customer = {
      id: isEditing ? id! : generateId(),
      type: data.type,
      name: data.name,
      document: data.document,
      rg_ie: data.rg_ie,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      classification: data.classification,
      contacts: {
        phones,
        emails,
        socialMedia: data.socialMedia,
        preferredChannel: data.preferredChannel,
      },
      addresses: {
        residential: data.residential,
        commercial: data.commercial,
        installation: data.installation,
      },
      history: {
        projects: existingCustomer?.history.projects || [],
        preferences: existingCustomer?.history.preferences || {
          glassTypes: [],
          colors: [],
          frameTypes: []
        },
        interactions: existingCustomer?.history.interactions || [],
      },
      createdAt: existingCustomer?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (isEditing) {
      dispatch({ type: 'UPDATE_CUSTOMER', payload: customer })
    } else {
      dispatch({ type: 'ADD_CUSTOMER', payload: customer })
    }

    navigate('/customers')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do cliente' : 'Cadastre um novo cliente'}
          </p>
        </div>
        <button
          onClick={() => navigate('/customers')}
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
                <label className="form-label">Tipo de Cliente</label>
                <select
                  {...register('type', { required: 'Tipo é obrigatório' })}
                  className="form-input"
                >
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                  <option value="revendedor">Revendedor</option>
                  <option value="construtora">Construtora</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Classificação</label>
                <select
                  {...register('classification', { required: 'Classificação é obrigatória' })}
                  className="form-input"
                >
                  <option value="novo">Cliente Novo</option>
                  <option value="regular">Cliente Regular</option>
                  <option value="vip">Cliente VIP</option>
                  <option value="corporativo">Cliente Corporativo</option>
                </select>
                {errors.classification && (
                  <p className="mt-1 text-sm text-red-600">{errors.classification.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">
                {customerType === 'fisica' ? 'Nome Completo' : 'Razão Social'}
              </label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="form-input"
                placeholder={customerType === 'fisica' ? 'João Silva' : 'Empresa LTDA'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  {customerType === 'fisica' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  type="text"
                  {...register('document', { required: 'Documento é obrigatório' })}
                  className="form-input"
                  placeholder={customerType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
                {errors.document && (
                  <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  {customerType === 'fisica' ? 'RG' : 'Inscrição Estadual'}
                </label>
                <input
                  type="text"
                  {...register('rg_ie')}
                  className="form-input"
                />
              </div>
            </div>

            {customerType === 'fisica' && (
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  {...register('birthDate')}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Informações de Contato
            </h2>
          </div>
          <div className="card-body space-y-6">
            {/* Phones */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="form-label mb-0">Telefones</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addPhone}
                >
                  Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {phones.map((phone, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <select
                        value={phone.type}
                        onChange={(e) => {
                          const newPhones = [...phones]
                          newPhones[index].type = e.target.value as any
                          setPhones(newPhones)
                        }}
                        className="form-input"
                      >
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="celular">Celular</option>
                      </select>
                    </div>
                    <div className="flex-2">
                      <input
                        type="tel"
                        value={phone.number}
                        onChange={(e) => {
                          const newPhones = [...phones]
                          newPhones[index].number = e.target.value
                          setPhones(newPhones)
                        }}
                        className="form-input"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={phone.whatsapp || false}
                          onChange={(e) => {
                            const newPhones = [...phones]
                            newPhones[index].whatsapp = e.target.checked
                            setPhones(newPhones)
                          }}
                          className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">WhatsApp</span>
                      </label>
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emails */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="form-label mb-0">E-mails</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addEmail}
                >
                  Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <select
                        value={email.type}
                        onChange={(e) => {
                          const newEmails = [...emails]
                          newEmails[index].type = e.target.value as any
                          setEmails(newEmails)
                        }}
                        className="form-input"
                      >
                        <option value="pessoal">Pessoal</option>
                        <option value="comercial">Comercial</option>
                        <option value="financeiro">Financeiro</option>
                      </select>
                    </div>
                    <div className="flex-2">
                      <input
                        type="email"
                        value={email.email}
                        onChange={(e) => {
                          const newEmails = [...emails]
                          newEmails[index].email = e.target.value
                          setEmails(newEmails)
                        }}
                        className="form-input"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    {emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Instagram</label>
                <input
                  type="text"
                  {...register('socialMedia.instagram')}
                  className="form-input"
                  placeholder="@usuario"
                />
              </div>
              <div>
                <label className="form-label">Facebook</label>
                <input
                  type="text"
                  {...register('socialMedia.facebook')}
                  className="form-input"
                  placeholder="facebook.com/usuario"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Canal de Contato Preferido</label>
              <select
                {...register('preferredChannel')}
                className="form-input"
              >
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="visita">Visita</option>
              </select>
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
          <div className="card-body space-y-8">
            {/* Residential Address */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Endereço {customerType === 'fisica' ? 'Residencial' : 'Principal'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="form-label">Rua/Avenida</label>
                  <input
                    type="text"
                    {...register('residential.street')}
                    className="form-input"
                    placeholder="Rua das Flores"
                  />
                </div>
                <div>
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    {...register('residential.number')}
                    className="form-input"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    {...register('residential.complement')}
                    className="form-input"
                    placeholder="Apto 101"
                  />
                </div>
                <div>
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    {...register('residential.neighborhood')}
                    className="form-input"
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    {...register('residential.zipCode')}
                    className="form-input"
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    {...register('residential.city')}
                    className="form-input"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="form-label">Estado</label>
                  <select
                    {...register('residential.state')}
                    className="form-input"
                  >
                    <option value="">Selecione...</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
                <div>
                  <label className="form-label">Ponto de Referência</label>
                  <input
                    type="text"
                    {...register('residential.reference')}
                    className="form-input"
                    placeholder="Próximo ao shopping"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label">Observações de Acesso</label>
                <textarea
                  {...register('residential.accessNotes')}
                  className="form-input"
                  rows={2}
                  placeholder="Informações sobre acesso, estacionamento, etc."
                />
              </div>
            </div>

            {/* Installation Address */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Endereço de Instalação
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (se diferente do endereço principal)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="form-label">Rua/Avenida</label>
                  <input
                    type="text"
                    {...register('installation.street')}
                    className="form-input"
                    placeholder="Rua das Flores"
                  />
                </div>
                <div>
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    {...register('installation.number')}
                    className="form-input"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    {...register('installation.complement')}
                    className="form-input"
                    placeholder="Apto 101"
                  />
                </div>
                <div>
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    {...register('installation.neighborhood')}
                    className="form-input"
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    {...register('installation.zipCode')}
                    className="form-input"
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    {...register('installation.city')}
                    className="form-input"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="form-label">Estado</label>
                  <select
                    {...register('installation.state')}
                    className="form-input"
                  >
                    <option value="">Selecione...</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="RS">Rio Grande do Sul</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Ponto de Referência</label>
                  <input
                    type="text"
                    {...register('installation.reference')}
                    className="form-input"
                    placeholder="Próximo ao shopping"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label">Observações de Acesso</label>
                <textarea
                  {...register('installation.accessNotes')}
                  className="form-input"
                  rows={2}
                  placeholder="Informações sobre acesso, estacionamento, etc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/customers')}
          >
            Cancelar
          </Button>
          <Button type="submit" icon={Save}>
            {isEditing ? 'Atualizar Cliente' : 'Salvar Cliente'}
          </Button>
        </div>
      </form>
    </div>
  )
}