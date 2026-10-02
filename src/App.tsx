import { MotionConfig } from 'motion/react'
import { Bike, MessageCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CarrinhoProvider } from './cart'
import { BebidasSecao } from './components/BebidasSecao'
import { CategoriaNav } from './components/CategoriaNav'
import { CategoriaSecao } from './components/CategoriaSecao'
import { Hero } from './components/Hero'
import { ItemFolha } from './components/ItemFolha'
import { Pastel } from './components/Pastel'
import { BarraSacola, FolhaSacola } from './components/Sacola'
import { CATEGORIAS, ENTREGAS, LOJA, type Item } from './data/menu'
import { valor } from './lib/format'
import { VooProvider } from './voo'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CarrinhoProvider>
        <VooProvider>
          <Cardapio />
        </VooProvider>
      </CarrinhoProvider>
    </MotionConfig>
  )
}

function Cardapio() {
  const [itemAberto, setItemAberto] = useState<Item | null>(null)
  const [sacolaAberta, setSacolaAberta] = useState(false)
  const fecharItem = useCallback(() => setItemAberto(null), [])
  const fecharSacola = useCallback(() => setSacolaAberta(false), [])

  const entregas = ENTREGAS.filter((e) => e.preco > 0)

  return (
    <>
      <Hero />

      {/* informações rápidas */}
      <div className="mx-auto grid max-w-2xl gap-2 px-4 pt-4 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-xl bg-papel-2 p-3">
          <Bike className="mt-0.5 size-5 shrink-0 text-casca" />
          <div className="min-w-0 flex-1 text-[13px] leading-snug text-tinta-suave">
            <p className="font-extrabold text-tinta">Entregas</p>
            {entregas.map((e) => (
              <p key={e.id} className="flex justify-between gap-2">
                <span>{e.local}</span>
                <span className="whitespace-nowrap font-semibold tabular-nums text-tinta">R$ {valor(e.preco)}</span>
              </p>
            ))}
          </div>
        </div>
        <a
          href={`https://wa.me/${LOJA.whatsapp}`}
          target="_blank"
          rel="noopener"
          className="flex items-start gap-2.5 rounded-xl bg-papel-2 p-3 transition hover:bg-[#efe2c2]"
        >
          <MessageCircle className="mt-0.5 size-5 shrink-0 text-casca" />
          <div className="text-[13px] leading-snug text-tinta-suave">
            <p className="font-extrabold text-tinta">Pedidos e Pix</p>
            <p className="tabular-nums">{LOJA.telefoneExibicao}</p>
          </div>
        </a>
      </div>

      <main id="cardapio" className="scroll-mt-4 pt-6">
        <CategoriaNav />
        <div className="mx-auto max-w-2xl pb-10">
          {CATEGORIAS.map((c) =>
            c.tipo === 'bebida' ? (
              <BebidasSecao key={c.id} categoria={c} />
            ) : (
              <CategoriaSecao key={c.id} categoria={c} onAbrir={setItemAberto} />
            ),
          )}
        </div>
      </main>

      <footer className="relative overflow-hidden bg-carvao px-4 pb-36 pt-12 text-center text-papel">
        <Pastel className="mx-auto w-24 -rotate-6" />
        <p className="mt-5 font-script text-[34px] leading-tight text-dourado">{LOJA.despedida}</p>
        <a
          href={`https://wa.me/${LOJA.whatsapp}`}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-block font-display text-2xl font-extrabold tracking-wide text-papel/90 underline-offset-4 hover:underline"
        >
          {LOJA.telefoneExibicao}
        </a>
      </footer>

      <BarraSacola onAbrir={() => setSacolaAberta(true)} />
      <ItemFolha item={itemAberto} onFechar={fecharItem} />
      <FolhaSacola aberta={sacolaAberta} onFechar={fecharSacola} />
    </>
  )
}
