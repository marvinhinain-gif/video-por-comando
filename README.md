# Quiz Biblioteca de Skills

Quiz-funil de vendas em uma página só (`index.html`, sem build). Mobile-first, pt-BR.
A 1ª pergunta pergunta o nicho e tudo depois muda por ele: dores, exemplos, vídeo da pausa, textos da captura e página de vendas.
O texto e a lógica seguem o `ROTEIRO.md`. As mídias ficam em `m/`.

Para publicar, suba a pasta inteira (`index.html` + `m/`) em qualquer hospedagem estática.

## O que trocar (topo do `<script>` em `index.html`)

| Constante | Para que serve |
|---|---|
| `CHECKOUT` | Link do checkout. Com `"#"` os botões de compra não levam a lugar nenhum. Com um link, abrem em nova aba e recebem as UTMs da URL (`utm_*`, `src`, `sck`, `fbclid`, `gclid`). |
| `LEAD_WEBHOOK` | URL que recebe o lead em `POST` JSON: `{nome, whatsapp, nicho, respostas, horasMes, gastoMes}`. Vazio (`""`) = não envia nada. Se falhar, o quiz segue normal. |
| `VSL` | Vídeo principal do resultado. Hoje: `m/vsl.mp4` com poster `m/vsl.webp`. Para usar vturb: `vturb:true`, `vturbId` e `vturbJs` do player. |
| `VSL_DELAY` | Segundos até aparecer tudo que fica abaixo do vídeo principal (hoje 30). |

## Editar textos por nicho

Tudo está no objeto `NICHES`, logo abaixo das constantes: rótulo, emoji, nome, nome curto, dores da P2 (com a frase de custo `c`), exemplos da P3 e P4, mídia da pausa, pedido de exemplo, opções da P6, skills do resultado e ordem do carrossel.
As mídias estão em `MEDIA` (`som:1` mostra o botão "Ouvir").
