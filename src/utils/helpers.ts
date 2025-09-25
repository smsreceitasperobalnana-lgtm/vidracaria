// Utilitários gerais do sistema
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `${year}${month}${random}`
}

export function calculateArea(height: number, width: number): number {
  // Converte mm para m² e adiciona folga de 5mm em cada lado
  const heightM = (height + 10) / 1000
  const widthM = (width + 10) / 1000
  return parseFloat((heightM * widthM).toFixed(4))
}

export function calculatePerimeter(height: number, width: number): number {
  // Converte mm para metros lineares
  const heightM = height / 1000
  const widthM = width / 1000
  return parseFloat((2 * (heightM + widthM)).toFixed(2))
}

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  
  // Validação básica de CPF
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  return true
}

export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return false
  
  return true
}

export function formatDocument(doc: string, type: 'cpf' | 'cnpj'): string {
  const cleaned = doc.replace(/\D/g, '')
  
  if (type === 'cpf' && cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  if (type === 'cnpj' && cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  
  return doc
}