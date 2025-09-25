// Calculadora de custos para vidraçaria

interface GlassCalculation {
  type: 'temperado' | 'laminado' | 'comum' | 'aramado'
  thickness: number
  color: 'incolor' | 'fume' | 'verde' | 'bronze'
  area: number
  finishing: string[]
}

interface FrameCalculation {
  system: 'correr' | 'maximar' | 'pivotante' | 'abrir'
  profile: {
    line: string
    series: string
    dimensions: string
    weight: number
    resistance: string
  }
  color: 'branco' | 'preto' | 'anodizado'
  linearMeters: number
}

interface HardwareCalculation {
  type: string
  brand: string
  model: string
  quantity: number
  unitPrice: number
}

// Tabela de preços base (R$ por m²)
const GLASS_PRICES = {
  temperado: {
    4: { incolor: 45, fume: 50, verde: 55, bronze: 55 },
    6: { incolor: 55, fume: 60, verde: 65, bronze: 65 },
    8: { incolor: 70, fume: 75, verde: 80, bronze: 80 },
    10: { incolor: 85, fume: 90, verde: 95, bronze: 95 },
    12: { incolor: 105, fume: 110, verde: 115, bronze: 115 }
  },
  laminado: {
    6: { incolor: 75, fume: 85, verde: 90, bronze: 90 },
    8: { incolor: 95, fume: 105, verde: 110, bronze: 110 },
    10: { incolor: 120, fume: 130, verde: 135, bronze: 135 }
  },
  comum: {
    4: { incolor: 25, fume: 30, verde: 35, bronze: 35 },
    6: { incolor: 35, fume: 40, verde: 45, bronze: 45 }
  }
}

// Tabela de preços de perfis (R$ por metro linear)
const FRAME_PRICES = {
  linha_25: { branco: 15, preto: 18, anodizado: 20 },
  linha_30: { branco: 18, preto: 22, anodizado: 25 },
  linha_40: { branco: 25, preto: 30, anodizado: 35 },
  linha_50: { branco: 35, preto: 42, anodizado: 48 }
}

export function calculateGlassCost(glass: GlassCalculation) {
  const basePrice = GLASS_PRICES[glass.type]?.[glass.thickness]?.[glass.color] || 50
  
  // Adicionar custos de beneficiamento
  let finishingCost = 0
  glass.finishing.forEach(finish => {
    switch (finish) {
      case 'lapidacao':
        finishingCost += glass.area * 8
        break
      case 'furos':
        finishingCost += 15 // por furo
        break
      case 'recortes':
        finishingCost += glass.area * 12
        break
      case 'bisote':
        finishingCost += glass.area * 25
        break
    }
  })
  
  const materialCost = glass.area * basePrice
  const totalCost = materialCost + finishingCost
  
  return {
    area: glass.area,
    pricePerM2: basePrice,
    materialCost,
    finishingCost,
    totalPrice: totalCost
  }
}

export function calculateFrameCost(frame: FrameCalculation) {
  const profileLine = frame.profile.line.toLowerCase().replace(' ', '_')
  const basePrice = FRAME_PRICES[profileLine]?.[frame.color] || 20
  
  // Adicionar material extra para travessas e reforços
  const extraMaterial = frame.linearMeters * 0.15 // 15% extra
  const totalLinearMeters = frame.linearMeters + extraMaterial
  
  const materialCost = totalLinearMeters * basePrice
  const laborCost = frame.linearMeters * 8 // R$ 8 por metro de mão de obra
  
  return {
    linearMeters: frame.linearMeters,
    extraMaterial,
    totalLinearMeters,
    pricePerMeter: basePrice,
    materialCost,
    laborCost,
    totalPrice: materialCost + laborCost
  }
}

export function calculateHardwareCost(hardware: HardwareCalculation) {
  const totalPrice = hardware.quantity * hardware.unitPrice
  
  return {
    quantity: hardware.quantity,
    unitPrice: hardware.unitPrice,
    totalPrice
  }
}

// Função principal para calcular orçamento completo
export function calculateQuoteTotal(items: any[]) {
  const materials = items
    .filter(item => ['glass', 'frame', 'hardware'].includes(item.category))
    .reduce((sum, item) => sum + item.totalPrice, 0)
  
  const labor = items
    .filter(item => item.category === 'service')
    .reduce((sum, item) => sum + item.totalPrice, 0)
  
  const subtotal = materials + labor
  const losses = subtotal * 0.05 // 5% perdas
  const overhead = subtotal * 0.10 // 10% despesas
  const costTotal = subtotal + losses + overhead
  const profit = costTotal * 0.30 // 30% margem
  const total = costTotal + profit
  
  return {
    materials,
    labor,
    subtotal,
    losses,
    overhead,
    costTotal,
    profit,
    total
  }
}

// Calculadora rápida para projetos comuns
export function quickCalculate(type: string, height: number, width: number) {
  const area = calculateArea(height, width)
  const perimeter = calculatePerimeter(height, width)
  
  let estimate = 0
  
  switch (type) {
    case 'janela-correr':
      estimate = (area * 65) + (perimeter * 18) + 120 // vidro + perfil + ferragem
      break
    case 'porta-pivotante':
      estimate = (area * 95) + (perimeter * 35) + 250 // vidro temperado + perfil reforçado + ferragem
      break
    case 'box-frontal':
      estimate = (area * 80) + (perimeter * 25) + 180 // vidro temperado + perfil + ferragem box
      break
    default:
      estimate = area * 100 // estimativa genérica
  }
  
  return {
    area,
    perimeter,
    estimatedPrice: estimate,
    pricePerM2: estimate / area
  }
}