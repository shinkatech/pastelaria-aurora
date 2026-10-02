import type { CSSProperties } from 'react'

const BOLHAS = [
  { left: '8%', size: 6, delay: 0, dur: 2.4 },
  { left: '17%', size: 4, delay: 1.1, dur: 2.0 },
  { left: '26%', size: 8, delay: 0.5, dur: 2.9 },
  { left: '37%', size: 5, delay: 1.7, dur: 2.2 },
  { left: '48%', size: 7, delay: 0.2, dur: 2.6 },
  { left: '57%', size: 4, delay: 1.3, dur: 1.9 },
  { left: '66%', size: 9, delay: 0.8, dur: 3.1 },
  { left: '76%', size: 5, delay: 0.1, dur: 2.3 },
  { left: '85%', size: 6, delay: 1.5, dur: 2.7 },
  { left: '93%', size: 4, delay: 0.6, dur: 2.1 },
]

/** Superfície de óleo quente com ondas e bolhas. Fica no rodapé do container pai. */
export function Oleo({ altura = 96, className = '' }: { altura?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ height: altura }}
    >
      {/* bolhas subindo */}
      {BOLHAS.map((b, i) => (
        <span
          key={i}
          className="bolha absolute rounded-full border border-dourado-claro/70 bg-dourado-claro/25"
          style={
            {
              left: b.left,
              bottom: altura - 34,
              width: b.size,
              height: b.size,
              '--delay': `${b.delay}s`,
              '--dur': `${b.dur}s`,
            } as CSSProperties
          }
        />
      ))}

      {/* duas camadas de onda */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: altura - 20 }}>
        <svg
          className="onda absolute bottom-0 left-0 h-full w-[200%]"
          style={{ '--dur': '9s' } as CSSProperties}
          viewBox="0 0 1600 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 22 Q100 6 200 22 T400 22 T600 22 T800 22 T1000 22 T1200 22 T1400 22 T1600 22 V100 H0 Z"
            fill="#8A520F"
            opacity="0.55"
          />
        </svg>
        <svg
          className="onda absolute bottom-0 left-0 h-[88%] w-[200%]"
          style={{ '--dur': '6s' } as CSSProperties}
          viewBox="0 0 1600 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="oleo-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#D58D18" />
              <stop offset="35%" stopColor="#7A4609" />
              <stop offset="100%" stopColor="#2B1804" />
            </linearGradient>
          </defs>
          <path
            d="M0 18 Q50 8 100 18 T200 18 T300 18 T400 18 T500 18 T600 18 T700 18 T800 18 T900 18 T1000 18 T1100 18 T1200 18 T1300 18 T1400 18 T1500 18 T1600 18 V100 H0 Z"
            fill="url(#oleo-grad)"
          />
        </svg>
      </div>
    </div>
  )
}

/** Fumacinhas saindo de cima do pastel. */
export function Vapor({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute flex gap-6 ${className}`}>
      {[0, 1.1, 0.5].map((delay, i) => (
        <span
          key={i}
          className="vapor block h-14 w-3 rounded-full bg-white/40 blur-[6px]"
          style={{ '--delay': `${delay}s`, '--dur': `${3 + i * 0.4}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
