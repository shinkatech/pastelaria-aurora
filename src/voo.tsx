import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CupSoda } from 'lucide-react'
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Pastel } from './components/Pastel'

type Voo = { id: number; x: number; y: number; tx: number; ty: number; tipo: 'pastel' | 'bebida' }

type Ctx = {
  /** faz um pastel (ou copo) voar do elemento clicado até a sacola */
  voar: (origem: Element, tipo: 'pastel' | 'bebida') => void
  /** a sacola registra aqui onde ela está */
  alvoRef: React.RefObject<HTMLElement | null>
  /** muda a cada pouso, para a sacola dar um pulinho */
  pousos: number
}

const VooCtx = createContext<Ctx | null>(null)

export function VooProvider({ children }: { children: ReactNode }) {
  const [voos, setVoos] = useState<Voo[]>([])
  const [pousos, setPousos] = useState(0)
  const alvoRef = useRef<HTMLElement | null>(null)
  const seq = useRef(0)
  const reduzir = useReducedMotion()

  const voar = useCallback(
    (origem: Element, tipo: 'pastel' | 'bebida') => {
      if (reduzir) {
        setPousos((p) => p + 1)
        return
      }
      const r = origem.getBoundingClientRect()
      const alvo = alvoRef.current?.getBoundingClientRect()
      const tx = alvo ? alvo.left + 28 : window.innerWidth / 2
      const ty = alvo ? alvo.top + alvo.height / 2 : window.innerHeight - 44
      setVoos((v) => [
        ...v,
        { id: ++seq.current, x: r.left + r.width / 2, y: r.top + r.height / 2, tx, ty, tipo },
      ])
    },
    [reduzir],
  )

  const pousou = (id: number) => {
    setVoos((v) => v.filter((x) => x.id !== id))
    setPousos((p) => p + 1)
  }

  return (
    <VooCtx.Provider value={{ voar, alvoRef, pousos }}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
        <AnimatePresence>
          {voos.map((v) => {
            const meioX = (v.x + v.tx) / 2
            const topo = Math.min(v.y, v.ty) - 140
            return (
              <motion.div
                key={v.id}
                className="absolute left-0 top-0 -ml-9 -mt-6"
                initial={{ x: v.x, y: v.y, scale: 0.6, rotate: 0, opacity: 1 }}
                animate={{
                  x: [v.x, meioX, v.tx],
                  y: [v.y, topo, v.ty],
                  scale: [0.6, 1.1, 0.35],
                  rotate: [0, -25, 15],
                }}
                transition={{ duration: 0.75, ease: [0.45, 0, 0.55, 1], times: [0, 0.45, 1] }}
                onAnimationComplete={() => pousou(v.id)}
              >
                {v.tipo === 'pastel' ? (
                  <Pastel className="w-[72px] drop-shadow-lg" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-full bg-dourado text-carvao shadow-lg">
                    <CupSoda className="size-6" />
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </VooCtx.Provider>
  )
}

export function useVoo() {
  const ctx = useContext(VooCtx)
  if (!ctx) throw new Error('useVoo fora do VooProvider')
  return ctx
}
