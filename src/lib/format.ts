const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 20 → "R$ 20,00" (com espaço comum, sem o espaço inseparável do Intl) */
export function brl(valor: number): string {
  return fmt.format(valor).replace(/ /g, ' ')
}

/** 20 → "20,00" */
export function valor(valor: number): string {
  return valor.toFixed(2).replace('.', ',')
}
