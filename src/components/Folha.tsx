import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  aberta: boolean
  onFechar: () => void
  titulo: string
  children: ReactNode
  /** área fixa no rodapé da folha (botão principal) */
  rodape?: ReactNode
  /** cabeçalho escuro opcional, acima do conteúdo */
  topo?: ReactNode
}

/** Painel que sobe de baixo (no celular) / modal centralizado (no computador). */
export function Folha({ aberta, onFechar, titulo, children, rodape, topo }: Props) {
  const painel = useRef<HTMLDivElement>(null)
  const drag = useDragControls()

  useEffect(() => {
    if (!aberta) return
    const anterior = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => painel.current?.focus())
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      anterior?.focus?.()
    }
  }, [aberta, onFechar])

  return (
    <AnimatePresence>
      {aberta && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-carvao/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFechar}
          />
          <motion.div
            ref={painel}
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            tabIndex={-1}
            className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-papel shadow-2xl outline-none sm:rounded-3xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            drag="y"
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onFechar()
            }}
          >
            {/* alça para arrastar */}
            <div
              onPointerDown={(e) => drag.start(e)}
              className="absolute inset-x-0 top-0 z-20 flex h-6 cursor-grab touch-none justify-center pt-2 sm:hidden"
            >
              <span className="h-1.5 w-12 rounded-full bg-papel/50 mix-blend-difference" />
            </div>
            <button
              onClick={onFechar}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-carvao/60 text-papel backdrop-blur transition hover:bg-carvao"
            >
              <X className="size-5" />
            </button>

            <div className="overflow-y-auto overscroll-contain">
              {topo}
              <div className="px-5 pb-4 pt-5">{children}</div>
            </div>
            {rodape && (
              <div className="border-t border-carvao/10 bg-papel px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                {rodape}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
