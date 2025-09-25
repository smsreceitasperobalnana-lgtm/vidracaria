// Utilitários de formatação simples

export const formatCurrency = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00'
  }
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const formatDate = (date: Date | string): string => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return dateObj.toLocaleDateString('pt-BR')
}

export const formatPhone = (phone: string): string => {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

export const formatCPF = (cpf: string): string => {
  if (!cpf) return ''
  
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}

export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return ''
  
  const cleaned = cnpj.replace(/\D/g, '')
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  
  return cnpj
}

// Calcular área automaticamente
export const calcularArea = (altura: number, largura: number): number => {
  if (!altura || !largura) return 0
  
  // Converter mm para m² e adicionar folga de 5mm
  const alturaM = (altura + 10) / 1000
  const larguraM = (largura + 10) / 1000
  
  return parseFloat((alturaM * larguraM).toFixed(4))
}

// Calcular perímetro para esquadrias
export const calcularPerimetro = (altura: number, largura: number): number => {
  if (!altura || !largura) return 0
  
  // Converter mm para metros lineares
  const alturaM = altura / 1000
  const larguraM = largura / 1000
  
  return parseFloat((2 * (alturaM + larguraM)).toFixed(2))
}

// Gerar número de orçamento
export const gerarNumeroOrcamento = (): string => {
  const ano = new Date().getFullYear()
  const mes = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `${ano}${mes}${random}`
}