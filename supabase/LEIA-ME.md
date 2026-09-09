# Painel de artigos: como colocar no ar

O escritório publica os artigos em **`/admin`**, dentro do próprio site. Os
textos ficam no Supabase (banco de dados) e as fotos de capa no Supabase
Storage. Nada disso exige mexer no código depois de configurado.

A configuração abaixo é feita **uma vez só**.

---

## 1. Criar o projeto no Supabase

1. Entre em <https://supabase.com> e crie uma conta (o plano gratuito atende
   com folga um site deste tamanho).
2. **New project**. Dê um nome (`barbosaeguimaraes`), escolha uma senha para o
   banco e a região **South America (São Paulo)**.
3. Espere o projeto terminar de subir, uns dois minutos.

## 2. Criar a tabela e o bucket das fotos

1. No menu lateral, **SQL Editor** → **New query**.
2. Abra o arquivo [`schema.sql`](./schema.sql) deste repositório, copie o
   conteúdo inteiro e cole no editor.
3. Clique em **Run**.

Isso cria a tabela `artigos`, as regras de acesso e o bucket `artigos` onde as
capas ficam guardadas. Rodar o arquivo de novo não estraga nada.

## 3. Pegar as duas chaves

No menu lateral: **Project Settings** → **API**. Anote:

- **Project URL**, algo como `https://xxxxxxxx.supabase.co`
- **a chave pública**. Nos projetos novos ela se chama **publishable key** e
  começa com `sb_publishable_...`; nos antigos se chama **anon public** e é um
  JWT começando com `eyJ...`. Serve qualquer uma das duas.

As duas são públicas por natureza: essa chave só consegue fazer o que as regras
criadas no passo 2 permitem, ou seja, **ler artigos publicados**. Criar, editar
e apagar exige login.

## 4. Configurar o site

**No seu computador**, crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

(Se o seu projeto for antigo e mostrar a *anon key*, use
`NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` no lugar da segunda linha.)

**Na Vercel**, em *Settings → Environment Variables*, adicione as mesmas duas
variáveis para os ambientes Production, Preview e Development, e faça um novo
deploy.

> Enquanto essas variáveis não existirem, o site continua funcionando e exibe
> os artigos que estão em `src/content/artigos.ts`. O painel avisa o que falta.

## 5. Criar o login do escritório

No Supabase: **Authentication** → **Users** → **Add user** → **Create new
user**.

- E-mail: o do escritório (ex.: `barbosaadvsite@gmail.com`)
- Senha: defina uma
- Marque **Auto Confirm User** (senão o Supabase manda e-mail de confirmação)

Não crie usuário por `INSERT` em `auth.users`: a senha precisa ser gerada
pelo próprio Supabase e há outras tabelas envolvidas. Uma linha inserida à mão
vira um usuário que não consegue entrar.

## 6. Autorizar essa conta a publicar

Ter conta no Supabase **não** dá acesso ao painel. É preciso estar na tabela
`public.editores`. No **SQL Editor**, troque o e-mail e rode:

```sql
insert into public.editores (user_id, email)
select id, email from auth.users
where email = 'troque@pelo-email.com'
on conflict (user_id) do nothing;
```

Quem entra sem estar nessa lista vê a mensagem "Conta sem permissão para
publicar" e não consegue ler rascunho nem alterar nada. A trava é do banco,
não da tela.

Para tirar o acesso de alguém sem apagar a conta:

```sql
delete from public.editores e using auth.users u
where e.user_id = u.id and u.email = 'troque@pelo-email.com';
```

Para ver quem tem acesso hoje:

```sql
select u.email, e.criado_em from public.editores e
join auth.users u on u.id = e.user_id order by e.criado_em;
```

### Feche também o cadastro aberto

Em **Authentication → Sign In / Providers → Email**, desmarque *Enable sign
ups*. A lista de editores já impede estranhos de publicar, mas sem essa trava
qualquer pessoa consegue criar conta no projeto à toa.

## 7. Trazer os artigos que já existem

Entre em `/admin`, faça login. Como a lista está vazia, aparece o botão
**"Importar os 5 artigos atuais do site"**. Clique nele uma vez.

Pronto: daí em diante os cinco artigos antigos são editáveis pelo painel como
qualquer outro. (Esse botão só funciona com a lista vazia, então não há como
duplicar por engano.)

## 8. Ligar as mensagens do formulário e a lista de divulgação

Mesma receita do passo 2, com outro arquivo: **SQL Editor** → **New query**,
cole o conteúdo de [`mensagens-e-mailing.sql`](./mensagens-e-mailing.sql) e
clique em **Run**. Rodar de novo não estraga nada.

Isso cria duas tabelas:

- **`mensagens`**: cada envio do formulário de contato passa a ficar
  registrado, além de continuar chegando por e-mail. O escritório lê em
  `/admin/mensagens`, marca como lida e apaga quando quiser. Se o provedor de
  e-mail falhar, o contato não se perde mais.
- **`mailing`**: os nomes e e-mails para quem o escritório divulga as
  matérias, em `/admin/mailing`.

Enquanto esse arquivo não for rodado, as duas telas do painel explicam o que
falta em vez de mostrarem lista vazia. O resto do site continua igual.

### A lista de divulgação, na prática

Em `/admin/mailing`:

- **Importar planilha**: escolha o `.xlsx` (ou arraste até a área pontilhada) e
  a tela mostra o que entendeu de cada coluna, para conferir antes de gravar.
  1. **Aba**: planilha com mais de uma aba deixa escolher qual entra. Uma por
     vez, então para trazer duas basta importar de novo depois.
  2. **Linha do cabeçalho**: achada sozinha, pela coluna chamada "Email". Dá
     para trocar, ou dizer que a planilha não tem cabeçalho.
  3. **O que é cada coluna**: nome, e-mail, telefone, endereço, bairro, cidade,
     UF, CEP, inscrição na OAB, subseção e observação. O palpite vem dos nomes
     das colunas e pode ser corrigido com um clique. Endereço, telefone e
     observação aceitam várias colunas (logradouro + número + complemento, DDD
     + telefone), juntadas na ordem do arquivo.
  4. **CPF fica de fora** de propósito: o site não precisa dele para mandar
     artigo, e dado que não é usado é dado que não deveria estar guardado.
  5. **Entrar desligado**: para listas de quem saiu, como uma aba de
     excluídos. O cadastro fica guardado, mas fora dos envios.

  A gravação vai em blocos, com barra de progresso, porque cinquenta mil linhas
  não cabem numa requisição só. Deixe a aba aberta até o fim; parar no meio não
  desfaz o que já entrou, e importar o mesmo arquivo de novo continua de onde
  parou, sem duplicar.

  CSV também serve, inclusive o salvo pelo Excel em português, com acento. O
  formato antigo `.xls` não serve: abra no Excel, **Salvar como**, **Pasta de
  Trabalho do Excel (.xlsx)**.
- **Colar uma lista curta**: para poucos contatos, um por linha. Vale
  `Ana Souza; ana@exemplo.com; OAB/SP 123456`, `Ana Souza, ana@exemplo.com`,
  `Ana Souza <ana@exemplo.com>` ou só `ana@exemplo.com`.
- **E-mail repetido não duplica**: o endereço é único na tabela, então importar
  a mesma planilha duas vezes só acrescenta o que ainda não estava lá.
- **Interruptor "Recebe"**: tira alguém dos envios sem apagar o cadastro.
  **Excluir** apaga de vez, que é o que se faz quando a pessoa pede para sair.
- **Baixar em CSV**: a lista inteira, para abrir no Excel ou levar para a
  ferramenta de envio.

> Nem a lista nem as mensagens podem ser lidas pela chave pública que vai no
> navegador: as regras de RLS só entregam essas tabelas a quem está na lista de
> editores. O disparo dos e-mails está no passo 9.

## 9. Ligar o disparo das matérias

Terceiro arquivo no SQL Editor: [`disparos.sql`](./disparos.sql). Ele cria a
tabela dos disparos, a fila de destinatários e a função de saída da lista.

Depois disso, falta o provedor de e-mail. No `.env.local` e na Vercel:

```
RESEND_API_KEY=re_...
CONTATO_EMAIL_REMETENTE=contato@barbosaadv.com.br
CONTATO_EMAIL_DESTINO=barbosaadvsite@gmail.com
```

O remetente precisa ser de **domínio verificado no Resend** (Domains > Add
domain, e depois os registros SPF e DKIM no DNS de `barbosaadv.com.br`).
Gmail não serve como remetente. Sem domínio verificado, envio em massa cai
direto na caixa de spam.

### Como disparar

Em `/admin/disparos`:

1. Escolha a matéria já publicada, confira o assunto e escreva, se quiser, uma
   linha de abertura.
2. **Preparar o disparo**. Isso ainda não envia nada: congela quem vai receber,
   ou seja, todo mundo que está marcado como "Recebe" na lista naquele momento.
   Quem for cadastrado depois entra no próximo disparo, não neste.
3. **Enviar teste para o escritório**, e abra o e-mail que chegou para conferir
   como ficou.
4. **Enviar para N contatos**. A barra mostra o progresso; o envio vai de
   cinquenta em cinquenta, com uma pausa entre os blocos para respeitar o
   limite do provedor.

Dá para **parar no meio** e retomar depois, inclusive de outro computador:
cada endereço é marcado no banco assim que sai, então ninguém recebe duas
vezes. Se o provedor recusar um bloco (limite diário estourado, por exemplo),
o envio para sozinho e a mensagem do provedor aparece na tela; os que faltam
continuam na fila.

### Saída da lista

Todo e-mail vai com link de saída no rodapé e com o cabeçalho
`List-Unsubscribe`, que é o que faz o Gmail e o Outlook mostrarem o próprio
botão de cancelar inscrição. Os dois caminhos desligam o contato na hora:

- o link do rodapé abre `/descadastro`, que pede confirmação (sem isso, o
  antivírus do servidor de e-mail, que abre os links sozinho para conferir,
  descadastraria a pessoa sem que ela pedisse);
- o botão do cliente de e-mail manda um POST para `/api/descadastro`, que
  desliga direto.

O contato desligado continua cadastrado, aparecendo como "Fora" na lista.

> **Antes do primeiro disparo grande.** Domínio que nunca enviou nada não
> manda dezenas de milhares de e-mails de uma vez sem ser bloqueado. Comece
> pelas centenas, olhe quantos voltam e vá subindo ao longo de semanas. Lista
> antiga tem muito endereço morto, e retorno demais derruba a reputação do
> domínio, o que atrapalha até o e-mail comum do escritório.

---

## Como o escritório usa, no dia a dia

1. Acessa `barbosaadv.com.br/admin` e entra com e-mail e senha.
2. **Novo artigo**.
3. Escreve o título; o endereço da página é preenchido sozinho.
4. Escolhe a categoria, a data e envia a foto de capa (horizontal, até 8 MB).
5. Preenche o resumo e o texto.
6. **Salvar como rascunho** quantas vezes quiser. O rascunho não aparece no
   site.
7. **Publicar no site** quando estiver pronto. O artigo entra na hora na
   listagem `/artigos`, na home e no sitemap.

### Como formatar o texto

O corpo do artigo aceita uma marcação simples, a mesma que os artigos atuais
já usam:

- linha em branco entre os parágrafos;
- `## Subtítulo` para os intertítulos;
- `- item` para listas.

O botão **"Ver como vai ficar"** mostra o resultado antes de publicar.

---

## Detalhes técnicos

| O quê | Onde |
| --- | --- |
| Estrutura do banco (artigos) | [`schema.sql`](./schema.sql) |
| Estrutura do banco (mensagens e mailing) | [`mensagens-e-mailing.sql`](./mensagens-e-mailing.sql) |
| Estrutura do banco (disparos) | [`disparos.sql`](./disparos.sql) |
| Leitura dos artigos | `src/lib/artigos.ts` |
| Mensagens recebidas | `src/lib/mensagens.ts` |
| Lista de divulgação | `src/lib/mailing.ts` + `src/lib/mailing-importar.ts` |
| Disparo das matérias | `src/lib/disparos.ts` + `src/lib/email-disparo.ts` |
| Saída da lista | `src/app/descadastro/` + `src/app/api/descadastro/` |
| Ações do painel | `src/app/actions/artigos.ts`, `mensagens.ts`, `mailing.ts`, `disparos.ts` |
| Telas do painel | `src/app/admin/` |
| Proteção das rotas | `src/middleware.ts` |
| Validação dos campos | `src/lib/artigo-schema.ts` |
| Quem pode publicar | tabela `public.editores` + função `eh_editor()` |

- **Rascunhos** nunca saem do painel: a regra de RLS só entrega ao visitante as
  linhas com `published = true`.
- **Publicar revalida** `/`, `/artigos`, `/artigos/<slug>` e o sitemap, então a
  mudança aparece imediatamente, sem novo deploy.
- **Excluir um artigo** apaga também a foto de capa dele no Storage.
- `/admin` está fora do `robots.txt` e marcado como `noindex`.
- Se o Supabase ficar fora do ar, o site cai de volta nos artigos de
  `src/content/artigos.ts` em vez de quebrar a página.
