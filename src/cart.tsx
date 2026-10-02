import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { ADICIONAL_PRECO, ITENS_POR_ID, type Adicional, type Item } from './data/menu'

export type Linha = {
  chave: string
  itemId: string
  adicional: Adicional | null
  qtd: number
}

type Acao =
  | { tipo: 'add'; itemId: string; adicional: Adicional | null; qtd: number }
  | { tipo: 'qtd'; chave: string; delta: number }
  | { tipo: 'limpar' }

const CHAVE_STORAGE = 'pastel-da-aurora:carrinho'

function chaveDe(itemId: string, adicional: Adicional | null) {
  return `${itemId}|${adicional ?? ''}`
}

function reducer(estado: Linha[], acao: Acao): Linha[] {
  switch (acao.tipo) {
    case 'add': {
      const chave = chaveDe(acao.itemId, acao.adicional)
      const existe = estado.find((l) => l.chave === chave)
      if (existe) return estado.map((l) => (l.chave === chave ? { ...l, qtd: l.qtd + acao.qtd } : l))
      return [...estado, { chave, itemId: acao.itemId, adicional: acao.adicional, qtd: acao.qtd }]
    }
    case 'qtd':
      return estado
        .map((l) => (l.chave === acao.chave ? { ...l, qtd: l.qtd + acao.delta } : l))
        .filter((l) => l.qtd > 0)
    case 'limpar':
      return []
  }
}

function carregar(): Linha[] {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE)
    if (!bruto) return []
    const linhas = JSON.parse(bruto) as Linha[]
    return linhas.filter((l) => ITENS_POR_ID[l.itemId] && l.qtd > 0)
  } catch {
    return []
  }
}

export function precoLinha(l: Linha): number {
  const item = ITENS_POR_ID[l.itemId]
  return (item.preco + (l.adicional ? ADICIONAL_PRECO : 0)) * l.qtd
}

type Ctx = {
  linhas: Linha[]
  quantidade: number
  subtotal: number
  adicionar: (item: Item, adicional?: Adicional | null, qtd?: number) => void
  mudarQtd: (chave: string, delta: number) => void
  limpar: () => void
}

const CarrinhoCtx = createContext<Ctx | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [linhas, dispatch] = useReducer(reducer, undefined, carregar)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(linhas))
    } catch {
      /* sem storage: o carrinho só vive nesta aba */
    }
  }, [linhas])

  const valor = useMemo<Ctx>(
    () => ({
      linhas,
      quantidade: linhas.reduce((s, l) => s + l.qtd, 0),
      subtotal: linhas.reduce((s, l) => s + precoLinha(l), 0),
      adicionar: (item, adicional = null, qtd = 1) =>
        dispatch({ tipo: 'add', itemId: item.id, adicional, qtd }),
      mudarQtd: (chave, delta) => dispatch({ tipo: 'qtd', chave, delta }),
      limpar: () => dispatch({ tipo: 'limpar' }),
    }),
    [linhas],
  )

  return <CarrinhoCtx.Provider value={valor}>{children}</CarrinhoCtx.Provider>
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx)
  if (!ctx) throw new Error('useCarrinho fora do CarrinhoProvider')
  return ctx
}
