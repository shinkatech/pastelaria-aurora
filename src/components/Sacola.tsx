import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ENTREGAS, ITENS_POR_ID, LOJA } from '../data/menu'
import { brl, valor } from '../lib/format'
import { precoLinha, useCarrinho } from '../cart'
import { useVoo } from '../voo'
import { Folha } from './Folha'
import { PrecoAnimado } from './PrecoAnimado'

/** Barra flutuante no rodapé com total e botão para abrir a sacola. */
export function BarraSacola({ onAbrir }: { onAbrir: () => void }) {
  const { quantidade, subtotal } = useCarrinho()
  const { alvoRef, pousos } = useVoo()
  const pulo = useAnimationControls()

  useEffect(() => {
    if (pousos > 0) pulo.start({ scale: [1, 1.18, 0.94, 1], transition: { duration: 0.45 } })
  }, [pousos, pulo])

  return (
    <AnimatePresence>
      {quantidade > 0 && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <button
            onClick={onAbrir}
            className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl bg-carvao py-3 pl-3 pr-5 text-left text-papel shadow-[0_14px_40px_-10px_rgba(21,17,12,.75)]"
          >
            <motion.span
              ref={alvoRef as React.Ref<HTMLSpanElement>}
              animate={pulo}
              className="relative grid size-11 place-items-center rounded-xl bg-dourado text-carvao"
            >
              <ShoppingBag className="size-5" strokeWidth={2.5} />
              <motion.span
                key={quantidade}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-tomate px-1 text-[11px] font-extrabold text-papel ring-2 ring-carvao"
              >
                {quantidade}
              </motion.span>
            </motion.span>
            <span className="flex-1 font-bold">Ver sacola</span>
            <span className="font-display text-2xl font-black">
              <span className="mr-1 text-base text-dourado">R$</span>
              <PrecoAnimado valor={subtotal} de={0} duracao={0.5} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type Pagamento = 'Pix' | 'Dinheiro'

export function FolhaSacola({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const { linhas, subtotal, mudarQtd, limpar } = useCarrinho()
  const [entregaId, setEntregaId] = useState(ENTREGAS[1].id)
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [pagamento, setPagamento] = useState<Pagamento>('Pix')
  const [troco, setTroco] = useState('')
  const [obs, setObs] = useState('')
  const [tentou, setTentou] = useState(false)

  const entrega = ENTREGAS.find((e) => e.id === entregaId)!
  const total = subtotal + entrega.preco
  const faltaNome = !nome.trim()
  const faltaEndereco = entrega.pedeEndereco && !endereco.trim()
  const vazio = linhas.length === 0

  useEffect(() => {
    if (vazio && aberta) onFechar()
  }, [vazio, aberta, onFechar])

  const enviar = () => {
    setTentou(true)
    if (faltaNome || faltaEndereco || vazio) return
    const itens = linhas.map((l) => {
      const item = ITENS_POR_ID[l.itemId]
      const extra = l.adicional ? ` + ${l.adicional}` : ''
      return `• ${l.qtd}x ${item.nome}${extra} — ${brl(precoLinha(l))}`
    })
    const msg = [
      `*Pedido ${LOJA.nome}*`,
      '',
      ...itens,
      '',
      `Subtotal: ${brl(subtotal)}`,
      `${entrega.nome}: ${entrega.preco ? brl(entrega.preco) : 'grátis'}`,
      `*Total: ${brl(total)}*`,
      '',
      `Nome: ${nome.trim()}`,
      entrega.pedeEndereco ? `Endereço: ${endereco.trim()}` : null,
      `Pagamento: ${pagamento}${pagamento === 'Dinheiro' && troco.trim() ? ` (troco para R$ ${troco.trim()})` : ''}`,
      obs.trim() ? `Observação: ${obs.trim()}` : null,
    ]
      .filter((l) => l !== null)
      .join('\n')
    window.open(`https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  const campo =
    'mt-1 w-full rounded-xl border-2 border-carvao/15 bg-white px-3.5 py-3 text-[16px] text-tinta outline-none transition placeholder:text-tinta-suave/60 focus:border-dourado'
  const erro = 'border-tomate/70'

  return (
    <Folha
      aberta={aberta}
      onFechar={onFechar}
      titulo="Sua sacola"
      topo={
        <div className="bg-carvao px-5 pb-5 pt-7 text-papel">
          <h2 className="font-display text-[40px] font-black uppercase leading-none text-dourado">Sua sacola</h2>
          <p className="mt-1 text-sm text-papel/70">Confira, preencha seus dados e envie no WhatsApp.</p>
        </div>
      }
      rodape={
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-bold text-tinta-suave">Total</span>
            <span className="font-display text-[34px] font-black leading-none text-tinta">
              <span className="mr-1 text-lg">R$</span>
              <PrecoAnimado valor={total} duracao={0.4} />
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={enviar}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1FA855] py-4 text-[17px] font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(31,168,85,.9)]"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
            </svg>
            Enviar pedido no WhatsApp
          </motion.button>
          {tentou && (faltaNome || faltaEndereco) && (
            <p className="mt-2 text-center text-sm font-semibold text-tomate" role="alert">
              Preencha {faltaNome && faltaEndereco ? 'seu nome e o endereço' : faltaNome ? 'seu nome' : 'o endereço'} para
              enviar.
            </p>
          )}
        </>
      }
    >
      {/* itens */}
      <ul className="divide-y divide-dashed divide-carvao/15">
        <AnimatePresence initial={false}>
          {linhas.map((l) => {
            const item = ITENS_POR_ID[l.itemId]
            return (
              <motion.li
                key={l.chave}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, x: -40 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold leading-tight text-tinta">{item.nome}</p>
                    {l.adicional && <p className="text-sm text-tinta-suave">+ {l.adicional}</p>}
                    <p className="mt-0.5 font-display text-lg font-extrabold text-tinta">
                      R$ {valor(precoLinha(l))}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full bg-papel-2">
                    <button
                      onClick={() => mudarQtd(l.chave, -1)}
                      aria-label={l.qtd === 1 ? `Remover ${item.nome}` : `Diminuir ${item.nome}`}
                      className="grid size-9 place-items-center text-tinta"
                    >
                      {l.qtd === 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" strokeWidth={3} />}
                    </button>
                    <span className="w-5 text-center font-extrabold tabular-nums">{l.qtd}</span>
                    <button
                      onClick={() => mudarQtd(l.chave, 1)}
                      aria-label={`Aumentar ${item.nome}`}
                      className="grid size-9 place-items-center text-tinta"
                    >
                      <Plus className="size-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
      <button onClick={limpar} className="mt-1 text-sm font-semibold text-tinta-suave underline underline-offset-4">
        Esvaziar sacola
      </button>

      {/* entrega */}
      <fieldset className="mt-6">
        <legend className="text-[15px] font-extrabold text-tinta">Como você quer receber?</legend>
        <div className="mt-2 grid gap-2">
          {ENTREGAS.map((e) => {
            const on = e.id === entregaId
            return (
              <label
                key={e.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-3 transition-colors ${
                  on ? 'border-carvao bg-white' : 'border-carvao/15'
                }`}
              >
                <input
                  type="radio"
                  name="entrega"
                  checked={on}
                  onChange={() => setEntregaId(e.id)}
                  className="size-4 accent-carvao"
                />
                <span className="flex-1 font-bold text-tinta">{e.nome}</span>
                <span className="font-display text-lg font-extrabold text-tinta">
                  {e.preco ? `R$ ${valor(e.preco)}` : 'Grátis'}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* dados */}
      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-[15px] font-extrabold text-tinta">Seu nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            placeholder="Como devemos te chamar"
            className={`${campo} ${tentou && faltaNome ? erro : ''}`}
          />
        </label>
        <AnimatePresence initial={false}>
          {entrega.pedeEndereco && (
            <motion.label
              className="block overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <span className="text-[15px] font-extrabold text-tinta">Endereço de entrega</span>
              <textarea
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                autoComplete="street-address"
                rows={2}
                placeholder="Rua, número, bairro e ponto de referência"
                className={`${campo} resize-none ${tentou && faltaEndereco ? erro : ''}`}
              />
            </motion.label>
          )}
        </AnimatePresence>

        <fieldset>
          <legend className="text-[15px] font-extrabold text-tinta">Pagamento</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['Pix', 'Dinheiro'] as Pagamento[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPagamento(p)}
                aria-pressed={pagamento === p}
                className={`rounded-xl border-2 py-3 font-bold transition-colors ${
                  pagamento === p ? 'border-carvao bg-carvao text-dourado' : 'border-carvao/15 text-tinta'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {pagamento === 'Pix' && (
            <p className="mt-2 text-sm text-tinta-suave">
              Chave Pix: <strong className="text-tinta">{LOJA.telefoneExibicao}</strong>
            </p>
          )}
          {pagamento === 'Dinheiro' && (
            <label className="mt-3 block">
              <span className="text-sm font-bold text-tinta">Troco para quanto? (opcional)</span>
              <input
                value={troco}
                onChange={(e) => setTroco(e.target.value)}
                inputMode="decimal"
                placeholder="Ex.: 50,00"
                className={campo}
              />
            </label>
          )}
        </fieldset>

        <label className="block">
          <span className="text-[15px] font-extrabold text-tinta">Observação (opcional)</span>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={2}
            placeholder="Sabor do suco, sem azeitona, bem passado..."
            className={`${campo} resize-none`}
          />
        </label>
      </div>
    </Folha>
  )
}
