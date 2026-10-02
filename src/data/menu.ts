// Cardápio transcrito do cardápio impresso do Pastel da Aurora.
// Para mudar preço ou sabor, edite só este arquivo.

export const LOJA = {
  nome: 'Pastel da Aurora',
  whatsapp: '5518981050318', // (18) 98105-0318 — também é a chave Pix
  telefoneExibicao: '(18) 98105-0318',
  despedida: 'Deus abençoe e volte sempre!',
}

export const ADICIONAL_PRECO = 3
export const ADICIONAIS = ['Catupiry', 'Cheddar'] as const
export type Adicional = (typeof ADICIONAIS)[number]

export type Entrega = { id: string; nome: string; local: string; preco: number; pedeEndereco: boolean }
export const ENTREGAS: Entrega[] = [
  { id: 'retirar', nome: 'Retirar no local', local: 'No balcão', preco: 0, pedeEndereco: false },
  { id: 'cidade', nome: 'Entrega na cidade', local: 'Na cidade', preco: 3, pedeEndereco: true },
  { id: 'morada', nome: 'Entrega no Morada do Sol', local: 'Morada do Sol', preco: 6, pedeEndereco: true },
]

export type Item = {
  id: string
  nome: string
  descricao?: string
  preco: number
  /** aceita acréscimo de catupiry ou cheddar */
  aceitaAdicional: boolean
  tipo: 'pastel' | 'bebida'
}

export type Categoria = {
  id: string
  titulo: string
  curto: string
  preco?: number
  destaque?: boolean
  tipo: 'pastel' | 'bebida'
  itens: Item[]
}

type Sabor = [nome: string, descricao?: string]

function pasteis(
  id: string,
  titulo: string,
  curto: string,
  preco: number,
  sabores: Sabor[],
  opts: { aceitaAdicional?: boolean; destaque?: boolean } = {},
): Categoria {
  const aceitaAdicional = opts.aceitaAdicional ?? true
  return {
    id,
    titulo,
    curto,
    preco,
    destaque: opts.destaque,
    tipo: 'pastel',
    itens: sabores.map(([nome, descricao], i) => ({
      id: `${id}-${i}`,
      nome,
      descricao,
      preco,
      aceitaAdicional,
      tipo: 'pastel',
    })),
  }
}

export const CATEGORIAS: Categoria[] = [
  pasteis(
    'tui',
    'Pastelão Tui',
    'Tui',
    21,
    [['Pastelão Tui', 'Peito de frango desfiado, mussarela, linguiça calabresa, bacon e catupiry.']],
    { destaque: true },
  ),
  pasteis('carne', 'Pastelão de Carne', 'Carne', 20, [
    ['Carne', 'Carne moída e azeitona.'],
    ['Carne Queijo', 'Carne moída, azeitona e mussarela.'],
    ['Carne Pizza', 'Carne moída, azeitona, presunto, mussarela, tomate e orégano.'],
    ['Carne Palmito', 'Carne moída, azeitona e palmito picado.'],
    ['Carne Calabresa', 'Carne moída, azeitona e linguiça calabresa.'],
    ['Carne Bacon', 'Carne moída, azeitona e bacon.'],
  ]),
  pasteis('frango', 'Pastelão de Frango', 'Frango', 20, [
    ['Frango', 'Peito de frango desfiado.'],
    ['Frango Queijo', 'Peito de frango desfiado e mussarela.'],
    ['Frango Palmito', 'Peito de frango desfiado e palmito picado.'],
    ['Frango Calabresa', 'Peito de frango desfiado e calabresa.'],
    ['Frango Bacon', 'Peito de frango desfiado e bacon.'],
  ]),
  pasteis('queijo', 'Pastelão de Queijo', 'Queijo', 20, [
    ['Queijo', 'Mussarela e orégano.'],
    ['Queijo Calabresa', 'Mussarela, orégano e calabresa.'],
    ['Queijo Bacon', 'Mussarela, orégano e bacon.'],
  ]),
  pasteis('pizza', 'Pastelão de Pizza', 'Pizza', 20, [
    ['Pizza', 'Presunto, mussarela, tomate, azeitona e orégano.'],
    ['Pizza Calabresa', 'Presunto, mussarela, tomate, azeitona, orégano e calabresa.'],
    ['Pizza Bacon', 'Presunto, mussarela, tomate, azeitona, orégano e bacon.'],
    ['Pizza Palmito', 'Presunto, mussarela, tomate, azeitona, orégano e palmito picado.'],
    ['Bauru', 'Presunto e mussarela.'],
  ]),
  pasteis('palmito', 'Pastelão de Palmito', 'Palmito', 20, [
    ['Palmito', 'Palmito picado.'],
    ['Palmito Calabresa', 'Palmito picado e calabresa.'],
    ['Palmito Queijo', 'Palmito picado e mussarela.'],
    ['Palmito Bacon', 'Palmito picado e bacon.'],
  ]),
  pasteis('vegetariano', 'Pastelão Vegetariano', 'Vegetariano', 20, [
    ['Vegetariano', 'Palmito, mussarela, azeitona, tomate e orégano.'],
  ]),
  pasteis('vento', 'Pastelão de Vento', 'Vento', 11, [['Vento', 'Só a massa, sequinha e crocante.']]),
  pasteis(
    'doce',
    'Pastelão Doce',
    'Doce',
    20,
    [['Brigadeiro'], ['Doce de Leite'], ['Romeu e Julieta', 'Goiabada com queijo.']],
    { aceitaAdicional: false },
  ),
  {
    id: 'bebidas',
    titulo: 'Bebidas',
    curto: 'Bebidas',
    tipo: 'bebida',
    itens: (
      [
        ['Coca-Cola 2L', 18],
        ['Coca-Cola 1L', 10],
        ['Coca-Cola 600ml', 8],
        ['Guaraná 1L', 10],
        ['Fanta 2L', 15],
        ['Guaraná 2L', 15],
        ['Sprite 2L', 15],
        ['Refrigerante lata', 6],
        ['Suco 1L', 10],
        ['Suco 450ml', 6],
        ['Água mineral', 4],
        ['Água mineral com gás', 5],
        ['Cerveja Skol lata', 6],
        ['Cerveja Brahma lata', 6],
      ] as [string, number][]
    ).map(([nome, preco], i) => ({
      id: `bebida-${i}`,
      nome,
      preco,
      aceitaAdicional: false,
      tipo: 'bebida' as const,
    })),
  },
]

export const ITENS_POR_ID: Record<string, Item> = Object.fromEntries(
  CATEGORIAS.flatMap((c) => c.itens).map((i) => [i.id, i]),
)

export const MENOR_PRECO = Math.min(
  ...CATEGORIAS.filter((c) => c.tipo === 'pastel').map((c) => c.preco ?? Infinity),
)
