import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { valor as fmt } from '../lib/format'

type Props = {
  valor: number
  /** começa a contar a partir deste número no primeiro render */
  de?: number
  duracao?: number
  atraso?: number
  className?: string
}

/** Número em reais que "rola" até o valor novo. */
export function PrecoAnimado({ valor, de = valor, duracao = 0.6, atraso = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const atual = useRef(de)
  const reduzir = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduzir) {
      el.textContent = fmt(valor)
      atual.current = valor
      return
    }
    const ctrl = animate(atual.current, valor, {
      duration: duracao,
      delay: atraso,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        atual.current = v
        el.textContent = fmt(v)
      },
    })
    return () => ctrl.stop()
  }, [valor, duracao, atraso, reduzir])

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {fmt(de)}
    </span>
  )
}
