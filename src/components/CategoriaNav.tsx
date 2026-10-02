import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS } from '../data/menu'

/** Barra fixa com as categorias; acompanha a seção que está na tela. */
export function CategoriaNav() {
  const [ativa, setAtiva] = useState(CATEGORIAS[0].id)
  const trilho = useRef<HTMLDivElement>(null)
  const clicando = useRef(false)

  useEffect(() => {
    const secoes = CATEGORIAS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entradas) => {
        if (clicando.current) return
        const visivel = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visivel) setAtiva(visivel.target.id)
      },
      { rootMargin: '-120px 0px -60% 0px' },
    )
    secoes.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  // mantém o chip ativo visível no trilho horizontal
  useEffect(() => {
    // rola só o trilho (scrollIntoView também rolaria a página inteira)
    const t = trilho.current
    const chip = t?.querySelector<HTMLElement>(`[data-id="${ativa}"]`)
    if (t && chip) t.scrollTo({ left: chip.offsetLeft - (t.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
  }, [ativa])

  const ir = (id: string) => {
    setAtiva(id)
    clicando.current = true
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => (clicando.current = false), 800)
  }

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-0 z-40 border-b border-carvao/10 bg-papel/90 backdrop-blur-md"
    >
      <div ref={trilho} className="no-scrollbar relative mx-auto flex max-w-2xl gap-1.5 overflow-x-auto px-4 py-2.5">
        {CATEGORIAS.map((c) => {
          const on = c.id === ativa
          return (
            <button
              key={c.id}
              data-id={c.id}
              onClick={() => ir(c.id)}
              aria-current={on ? 'true' : undefined}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                on ? 'text-dourado' : 'text-tinta-suave hover:text-tinta'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="chip-ativo"
                  className="absolute inset-0 -z-0 rounded-full bg-carvao"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{c.curto}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
