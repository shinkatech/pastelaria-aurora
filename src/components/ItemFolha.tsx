import { motion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ADICIONAIS, ADICIONAL_PRECO, CATEGORIAS, type Adicional, type Item } from '../data/menu'
import { valor } from '../lib/format'
import { useCarrinho } from '../cart'
import { useVoo } from '../voo'
import { Folha } from './Folha'
import { Oleo, Vapor } from './Fritadeira'
import { Pastel } from './Pastel'
import { PrecoAnimado } from './PrecoAnimado'

type Props = { item: Item | null; onFechar: () => void }

export function ItemFolha({ item: atual, onFechar }: Props) {
  // guarda o último sabor para o conteúdo não sumir durante a animação de saída
  const ultimo = useRef<Item | null>(atual)
  if (atual) ultimo.current = atual
  const item = atual ?? ultimo.current
  const [adicional, setAdicional] = useState<Adicional | null>(null)
  const [qtd, setQtd] = useState(1)
  const { adicionar } = useCarrinho()
  const { voar } = useVoo()
  const botao = useRef<HTMLButtonElement>(null)

  // sempre começa limpo ao abrir outro sabor
  useEffect(() => {
    setAdicional(null)
    setQtd(1)
  }, [item?.id])

  const categoria = item ? CATEGORIAS.find((c) => c.itens.some((i) => i.id === item.id)) : null
  const unitario = item ? item.preco + (adicional ? ADICIONAL_PRECO : 0) : 0
  const total = unitario * qtd

  const confirmar = () => {
    if (!item) return
    adicionar(item, adicional, qtd)
    if (botao.current) voar(botao.current, item.tipo)
    onFechar()
  }

  return (
    <Folha
      aberta={!!atual}
      onFechar={onFechar}
      titulo={item?.nome ?? ''}
      topo={
        item && (
          <div key={item.id} className="relative h-[230px] overflow-hidden bg-carvao">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,169,14,.3),transparent_65%)]"
            />
            {/* o pastel sai do óleo toda vez que a folha abre */}
            <motion.div
              className="absolute inset-x-0 bottom-[46px] mx-auto w-[210px]"
              initial={{ y: 170, rotate: 8 }}
              animate={{ y: 0, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 110, damping: 12, delay: 0.15 }}
            >
              <Vapor className="-top-12 left-1/2 -translate-x-1/2" />
              <Pastel className="w-full" />
            </motion.div>
            <Oleo altura={78} />

            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.55 }}
              className="absolute left-4 top-5 rounded-lg bg-dourado px-3 py-1.5 font-display font-black leading-none text-carvao shadow-lg"
            >
              <span className="mr-1 text-base">R$</span>
              <PrecoAnimado valor={item.preco} de={0} atraso={0.6} className="text-[30px]" />
            </motion.div>
          </div>
        )
      }
      rodape={
        item && (
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border-2 border-carvao/15">
              <button
                onClick={() => setQtd((q) => Math.max(1, q - 1))}
                disabled={qtd === 1}
                aria-label="Diminuir quantidade"
                className="grid size-11 place-items-center rounded-full text-tinta disabled:opacity-30"
              >
                <Minus className="size-4" strokeWidth={3} />
              </button>
              <motion.span
                key={qtd}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-6 text-center text-lg font-extrabold tabular-nums"
                aria-live="polite"
              >
                {qtd}
              </motion.span>
              <button
                onClick={() => setQtd((q) => q + 1)}
                aria-label="Aumentar quantidade"
                className="grid size-11 place-items-center rounded-full text-tinta"
              >
                <Plus className="size-4" strokeWidth={3} />
              </button>
            </div>
            <motion.button
              ref={botao}
              whileTap={{ scale: 0.96 }}
              onClick={confirmar}
              className="flex flex-1 items-center justify-between rounded-full bg-carvao py-3.5 pl-5 pr-5 font-extrabold text-dourado"
            >
              <span>Adicionar</span>
              <span className="font-display text-xl font-black">
                R$ <PrecoAnimado valor={total} duracao={0.35} />
              </span>
            </motion.button>
          </div>
        )
      }
    >
      {item && (
        <>
          <p className="text-sm font-semibold text-tinta-suave">{categoria?.titulo}</p>
          <h3 className="mt-0.5 font-display text-[38px] font-black uppercase leading-[0.95] text-tinta">
            {item.nome}
          </h3>
          {item.descricao && <p className="mt-2 text-[15px] leading-snug text-tinta-suave">{item.descricao}</p>}

          {item.aceitaAdicional && (
            <fieldset className="mt-5">
              <legend className="text-[15px] font-extrabold text-tinta">
                Acréscimo{' '}
                <span className="font-medium text-tinta-suave">(opcional, + R$ {valor(ADICIONAL_PRECO)})</span>
              </legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[null, ...ADICIONAIS].map((op) => {
                  const on = adicional === op
                  return (
                    <button
                      key={op ?? 'nenhum'}
                      onClick={() => setAdicional(op)}
                      aria-pressed={on}
                      className={`relative rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-colors ${
                        on ? 'border-carvao text-papel' : 'border-carvao/15 text-tinta hover:border-carvao/40'
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="adicional-on"
                          className="absolute inset-0 rounded-[10px] bg-carvao"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative">{op ?? 'Sem'}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}
        </>
      )}
    </Folha>
  )
}
