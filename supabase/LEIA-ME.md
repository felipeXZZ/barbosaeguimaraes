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
| Estrutura do banco | [`schema.sql`](./schema.sql) |
| Leitura dos artigos | `src/lib/artigos.ts` |
| Ações do painel | `src/app/actions/artigos.ts` |
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
