# Imagens do site

Coloque os arquivos com **exatamente** estes nomes. Enquanto um arquivo não
existir, o site exibe automaticamente um placeholder tratado no padrão visual
(fundo areia, filete dourado e o caminho esperado), nunca um retângulo vazio.

Formato recomendado: JPG ou WebP, qualidade 80, sem texto embutido na imagem.
As fotos são exibidas em cor original. Suba já tratadas, com luz e recorte
coerentes entre si.

## hero/
As fotos do topo da home se alternam sozinhas, uma a cada 7 segundos.
A lista fica em `src/content/hero.ts`, na ordem de exibição.

**O topo ignora item cujo arquivo ainda não existe.** Basta colocar o arquivo
com o nome abaixo que a foto entra no rodízio, sem mexer no código.

| Arquivo | Situação |
|---|---|
| `hermes-tribuna.jpg` | já no ar |
| `estudo-de-caso.jpg` | já no ar |
| `supremo-tribunal-federal.jpg` | já no ar |
| `escritorio-fachada.jpg` | **falta**: fachada ou recepção do escritório |
| `praca-joao-mendes.jpg` | **falta**: a praça e o Fórum, no centro |

Paisagem, mínimo 2000px de largura. Abaixo disso a foto aparece macia numa
tela grande, porque no topo ela ocupa o quadro inteiro. Evite foto com o
assunto principal bem no meio: ali fica o nome do escritório.

`brasao.png` e `brasao-escudo.png` são a marca, não fotografia: não entram
no rodízio.

## equipe/
Um retrato por profissional, enquadramento vertical, fundo neutro.
Proporção 3:4, mínimo 900x1200.

| Arquivo | Profissional |
|---|---|
| `raimundo-hermes-barbosa.jpg` | Raimundo Hermes Barbosa |
| `debora-guimaraes.jpg` | Débora Guimarães |
| `helio-mendes-da-silva.jpg` | Helio Mendes da Silva |
| `ariovaldo-vitzel-junior.jpg` | Ariovaldo Vitzel Junior |
| `thaylla-magalhaes.jpg` | Thaylla Magalhães |
| `deny-williams-cury-haddad.jpg` | Deny Williams Cury Haddad |
| `roque-cortes-pereira.jpg` | Roque Cortes Pereira |
| `ingrid-adely.jpg` | Ingrid Adély |
| `walter-brito.jpg` | Walter Brito |

## areas/
Uma imagem por área, paisagem, proporção 3:2, mínimo 1200x800.
Nomes iguais aos slugs:

`direito-bancario-e-financeiro.jpg`, `direito-civel.jpg`,
`direito-penal.jpg`, `direito-trabalhista.jpg`, `direito-empresarial.jpg`,
`direito-ambiental.jpg`, `direito-desportivo.jpg`, `direito-autoral.jpg`,
`direito-sindical.jpg`, `direito-tributario.jpg`

## artigos/
Capa de cada artigo, proporção 16:9, mínimo 1200x675, nome igual ao slug do post.

## og/
Imagem de compartilhamento social, 1200x630. Gerada por código no bloco 7;
só coloque arquivo aqui se quiser substituir a versão automática.
