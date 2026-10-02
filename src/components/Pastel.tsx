import { useId } from 'react'

// Bolhinhas da massa frita — posições fixas para o desenho ficar sempre igual.
const BOLHAS: [number, number, number][] = [
  [38, 34, 5], [52, 52, 3.5], [70, 30, 4], [88, 46, 6], [104, 28, 3], [120, 56, 4.5],
  [138, 36, 5.5], [156, 50, 3.2], [164, 30, 2.6], [46, 76, 4.2], [64, 88, 3], [82, 72, 3.6],
  [100, 86, 5], [118, 78, 2.8], [134, 92, 4], [150, 76, 5], [166, 88, 3], [30, 58, 2.6],
  [76, 58, 2.2], [112, 42, 2.4], [144, 62, 2.2], [58, 64, 2], [94, 60, 2.6], [126, 66, 2],
]

type Props = {
  className?: string
  /** pastel mais claro (cru) → mais escuro (bem frito) */
  dourado?: 'claro' | 'normal'
  title?: string
}

/** Pastelão retangular com borda de garfo e bolhas — desenhado em SVG. */
export function Pastel({ className, dourado = 'normal', title }: Props) {
  const id = useId().replace(/:/g, '')
  const corpo = `corpo-${id}`
  const brilho = `brilho-${id}`
  const sombra = `sombra-${id}`

  const [c1, c2, c3] =
    dourado === 'claro' ? ['#FBE6A6', '#F4C866', '#E2A43C'] : ['#FAD98A', '#EDAE3A', '#C97A17']

  return (
    <svg
      viewBox="0 0 200 124"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <radialGradient id={corpo} cx="45%" cy="35%" r="75%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="55%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </radialGradient>
        <radialGradient id={brilho} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFF6D8" stopOpacity="0" />
        </radialGradient>
        <filter id={sombra} x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#3a1f00" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter={`url(#${sombra})`}>
        {/* borda ondulada (massa apertada) */}
        <rect x="6" y="8" width="188" height="106" rx="20" fill={c3} />
        <rect x="6" y="8" width="188" height="106" rx="20" fill="none" stroke={c3} strokeWidth="6"
          strokeDasharray="5 4" strokeLinecap="round" />
        {/* corpo estufado */}
        <rect x="16" y="17" width="168" height="88" rx="16" fill={`url(#${corpo})`} />
      </g>

      {/* marcas do garfo */}
      <rect x="10" y="12" width="180" height="98" rx="18" fill="none" stroke="#9C5A0C" strokeWidth="4"
        strokeDasharray="1.6 5" opacity="0.45" />

      {/* bolhas */}
      {BOLHAS.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y + r * 0.35} r={r} fill="#B8700F" opacity="0.28" />
          <circle cx={x} cy={y} r={r} fill="#FFE7A3" opacity="0.92" />
          <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill="#FFFBEA" />
        </g>
      ))}

      {/* brilho de óleo */}
      <ellipse cx="78" cy="40" rx="52" ry="16" fill={`url(#${brilho})`} />
    </svg>
  )
}
