import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { ADICIONAL_PRECO, type Categoria, type Item } from '../data/menu'
import { valor } from '../lib/format'
import { useCarrinho } from '../cart'
import { useVoo } from '../voo'
import { Pastel } from './Pastel'

type Props = { categoria: Categoria; onAbrir: (item: Item) => void }

/** Barra preta com título + etiqueta dourada de preço que desliza para fora. */
export function BarraTitulo({ titulo, preco }: { titulo: string; preco?: number }) {
  return (
    <div className="relative flex items-stretch">
      <h2 className={`relative z-10 flex flex-1 items-center bg-carvao py-3 pl-4 pr-3 font-display text-[26px] font-extrabold uppercase leading-none tracking-wide text-dourado ${preco === undefined ? 'rounded-md' : 'rounded-l-md'}`}
      >
        {titulo}
      </h2>
      {preco !== undefined && (
        <motion.div
          initial={{ x: -70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="flex items-center rounded-r-md bg-dourado px-3 font-display font-black leading-none text-carvao"
        >
          <span className="mr-1 text-base">R$</span>
          <span className="text-[28px] tabular-nums">{valor(preco)}</span>
        </motion.div>
      )}
    </div>
  )
}

function BotaoMais({ item, label }: { item: Item; label: string }) {
  const { adicionar } = useCarrinho()
  const { voar } = useVoo()
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation()
        adicionar(item)
        voar(e.currentTarget, item.tipo)
      }}
      aria-label={label}
      className="grid size-10 shrink-0 place-items-center rounded-full bg-carvao text-dourado shadow-sm transition hover:bg-carvao-2"
    >
      <Plus className="size-5" strokeWidth={3} />
    </motion.button>
  )
}

export function CategoriaSecao({ categoria, onAbrir }: Props) {
  if (categoria.destaque) return <Destaque categoria={categoria} onAbrir={onAbrir} />

  return (
    <section id={categoria.id} className="scroll-mt-20 px-4 pt-9">
      <BarraTitulo titulo={categoria.titulo} preco={categoria.preco} />
      <ul className="mt-1 divide-y divide-dashed divide-carvao/15">
        {categoria.itens.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3.5">
            <button
              onClick={() => onAbrir(item)}
              className="min-w-0 flex-1 rounded-md text-left"
              aria-label={`Ver ${item.nome}`}
            >
              <span className="block text-[17px] font-extrabold leading-tight text-tinta">{item.nome}</span>
              {item.descricao && (
                <span className="mt-0.5 block text-[14px] leading-snug text-tinta-suave">{item.descricao}</span>
              )}
            </button>
            <BotaoMais item={item} label={`Adicionar ${item.nome} à sacola`} />
          </li>
        ))}
      </ul>
      {categoria.itens[0]?.aceitaAdicional && categoria.id === 'carne' && (
        <p className="mt-1 rounded-md bg-papel-2 px-3 py-2 text-[13px] text-tinta-suave">
          Quer com catupiry ou cheddar? Toque no sabor e adicione por mais R$ {valor(ADICIONAL_PRECO)}.
        </p>
      )}
    </section>
  )
}

/** O Pastelão Tui ganha um cartão próprio. */
function Destaque({ categoria, onAbrir }: Props) {
  const item = categoria.itens[0]
  return (
    <section id={categoria.id} className="scroll-mt-20 px-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-carvao p-5 text-papel"
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 size-64 rounded-full bg-[radial-gradient(circle,rgba(232,169,14,.35),transparent_65%)]"
        />
        <span className="inline-block -rotate-2 rounded bg-tomate px-2 py-0.5 text-[13px] font-bold">
          O mais recheado da casa
        </span>
        <div className="mt-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[40px] font-black uppercase leading-[0.9] text-dourado">
              {categoria.titulo}
            </h2>
            <p className="mt-2 text-[15px] leading-snug text-papel/80">{item.descricao}</p>
          </div>
          <motion.div
            initial={{ x: 60, rotate: 20, opacity: 0 }}
            whileInView={{ x: 0, rotate: 8, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.2 }}
            className="w-28 shrink-0 pt-1"
          >
            <Pastel className="w-full" />
          </motion.div>
        </div>
        <div className="mt-4 font-display font-black leading-none text-papel">
          <span className="mr-1 text-lg text-dourado">R$</span>
          <span className="text-[44px] tabular-nums">{valor(item.preco)}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAbrir(item)}
            className="rounded-full border border-papel/25 px-4 py-3 text-sm font-bold text-papel transition hover:border-papel/60"
          >
            Personalizar
          </button>
          <AdicionarDestaque item={item} />
        </div>
      </motion.div>
    </section>
  )
}

function AdicionarDestaque({ item }: { item: Item }) {
  const { adicionar } = useCarrinho()
  const { voar } = useVoo()
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        adicionar(item)
        voar(e.currentTarget, 'pastel')
      }}
      className="flex items-center justify-center gap-1.5 rounded-full bg-dourado px-4 py-3 text-sm font-extrabold text-carvao"
    >
      <Plus className="size-4" strokeWidth={3} />
      Adicionar
    </motion.button>
  )
}
