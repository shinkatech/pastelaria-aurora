import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { MENOR_PRECO } from '../data/menu'
import { Oleo, Vapor } from './Fritadeira'
import { Pastel } from './Pastel'
import { PrecoAnimado } from './PrecoAnimado'

const LETRAS = 'PASTEL'.split('')

const GOTAS = [
  { x: '22%', delay: 0 },
  { x: '41%', delay: 0.35 },
  { x: '63%', delay: 0.15 },
  { x: '80%', delay: 0.55 },
]

export function Hero() {
  return (
    <header className="relative isolate overflow-hidden bg-carvao text-papel">
      {/* brilho quente atrás do pastel */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-10 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,169,14,.32)_0%,rgba(232,169,14,0)_65%)]"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 text-center sm:pt-14">
        <h1 className="font-display leading-[0.8]">
          <span className="sr-only">Pastel da Aurora</span>
          <span aria-hidden className="flex justify-center text-[clamp(5rem,24vw,9.5rem)] font-black tracking-tight">
            {LETRAS.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: -80, opacity: 0, rotate: i % 2 ? 8 : -8 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 22, delay: 0.05 * i }}
                className="inline-block"
              >
                {l}
              </motion.span>
            ))}
          </span>
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            className="-mt-1 block text-[clamp(3rem,13vw,5.25rem)] font-extrabold text-dourado"
          >
            <span className="mr-2 text-[0.55em] text-papel">da</span>Aurora
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5 max-w-xs text-[15px] leading-snug text-papel/75"
        >
          Escolha seu pastelão, monte o pedido e envie direto no WhatsApp.
        </motion.p>
      </div>

      {/* palco: pastel saindo do óleo */}
      <div className="relative mt-4 h-[300px] sm:h-[340px]">
        <motion.div
          className="absolute inset-x-0 bottom-[54px] mx-auto w-[min(76vw,330px)] sm:w-[360px]"
          initial={{ y: 190, rotate: -10 }}
          animate={{ y: 0, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.55 }}
        >
          {/* boia de leve depois que sai */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
            className="relative"
          >
            <Vapor className="-top-14 left-1/2 -translate-x-1/2" />
            <Pastel className="w-full" title="Pastelão dourado saindo do óleo" />

            {/* gotas de óleo pingando */}
            {GOTAS.map((g, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute bottom-1 block h-3 w-2 rounded-b-full rounded-t-[40%] bg-dourado-claro/90"
                style={{ left: g.x }}
                initial={{ y: 0, opacity: 0, scaleY: 0.4 }}
                animate={{ y: [0, 4, 60], opacity: [0, 1, 0], scaleY: [0.4, 1, 1.3] }}
                transition={{
                  duration: 1.1,
                  times: [0, 0.25, 1],
                  ease: 'easeIn',
                  delay: 1.3 + g.delay,
                  repeat: Infinity,
                  repeatDelay: 2.4,
                }}
              />
            ))}

            {/* selo de preço */}
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 1.45 }}
              className="absolute -right-4 -top-9 sm:-right-10"
            >
              <motion.div
                animate={{ rotate: [0, -6, 0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2.4 }}
                className="grid size-[104px] place-items-center rounded-full bg-tomate text-papel shadow-[0_10px_30px_-8px_rgba(194,59,34,.8)] ring-4 ring-carvao"
              >
                <div className="leading-none">
                  <div className="text-[11px] font-semibold">a partir de</div>
                  <div className="mt-1 flex items-baseline justify-center">
                    <span className="mr-0.5 font-display text-[15px] font-extrabold">R$</span>
                    <PrecoAnimado
                    valor={MENOR_PRECO}
                    de={0}
                    atraso={1.6}
                    duracao={0.9}
                      className="font-display text-[30px] font-black"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <Oleo altura={110} />
      </div>

      {/* faixa de saída */}
      <div className="relative bg-[#2B1804] pb-6 pt-1">
        <motion.a
          href="#cardapio"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full bg-dourado px-6 py-3 font-bold text-carvao shadow-[0_8px_24px_-6px_rgba(232,169,14,.6)] transition active:scale-95"
        >
          Ver o cardápio
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <ChevronDown className="size-5" />
          </motion.span>
        </motion.a>
      </div>
    </header>
  )
}
