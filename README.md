# Cardápio digital — Pastel da Aurora

React + TypeScript + Tailwind CSS (v4) + Motion (animações).

## Rodar no computador

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

## Publicar

```bash
npm run build          # gera a pasta dist/ (suba em Vercel, Netlify, Hostinger...)
npm run build:single   # gera dist-single/index.html: um arquivo único com tudo dentro
```

## Onde mudar as coisas

| O que | Arquivo |
|---|---|
| Preços, sabores, bebidas, taxas de entrega, WhatsApp | `src/data/menu.ts` |
| Cores e fontes | `src/index.css` (bloco `@theme`) |
| Topo com o pastel saindo do óleo | `src/components/Hero.tsx` |
| Desenho do pastel | `src/components/Pastel.tsx` |
| Sacola e mensagem do WhatsApp | `src/components/Sacola.tsx` |

O pedido é enviado para o WhatsApp `(18) 98105-0318` já com itens, adicionais, taxa de entrega, total, nome, endereço e forma de pagamento.
