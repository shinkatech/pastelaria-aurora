import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import type { Categoria } from '../data/menu'
import { valor } from '../lib/format'
import { useCarrinho } from '../cart'
import { useVoo } from '../voo'
import { BarraTitulo } from './CategoriaSecao'

export function BebidasSecao({ categoria }: { categoria: Categoria }) {
  const { adicionar } = useCarrinho()
  const { voar } = useVoo()

  return (
    <section id={categoria.id} className="scroll-mt-20 px-4 pt-9">
      <BarraTitulo titulo={categoria.titulo} />
      <ul className="mt-2">
        {categoria.itens.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2 py-2">
            <span className="shrink-0 text-[16px] font-bold text-tinta">{item.nome}</span>
            <span aria-hidden className="pontilhado h-2 min-w-4 flex-1" />
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: (i % 6) * 0.04 }}
              className="min-w-[84px] shrink-0 rounded-md border-2 border-dourado px-2 py-0.5 text-center font-display text-[19px] font-extrabold tabular-nums leading-tight text-tinta"
            >
              <span className="mr-0.5 text-[14px]">R$</span>
              {valor(item.preco)}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                adicionar(item)
                voar(e.currentTarget, 'bebida')
              }}
              aria-label={`Adicionar ${item.nome} à sacola`}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-carvao text-dourado"
            >
              <Plus className="size-4" strokeWidth={3} />
            </motion.button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] text-tinta-suave">
        Para suco e refrigerante lata, diga o sabor na observação do pedido.
      </p>
    </section>
  )
}
