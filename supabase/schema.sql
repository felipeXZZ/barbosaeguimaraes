-- ---------------------------------------------------------------------------
-- Barbosa e Guimarães: estrutura dos artigos no Supabase
--
-- Rode este arquivo uma única vez, no SQL Editor do painel do Supabase
-- (Dashboard > SQL Editor > New query > colar > Run).
-- Rodar de novo não estraga nada: tudo aqui é idempotente.
-- ---------------------------------------------------------------------------

-- 1. Tabela dos artigos ------------------------------------------------------

create table if not exists public.artigos (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null,
  date            date not null,
  reading_time    integer not null default 5,
  author          text not null,
  category        text not null,
  cover_image     text not null default '',
  cover_image_alt text not null default '',
  content         text not null,
  -- Rascunho não aparece no site público; só na listagem do painel.
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Listagem do site é sempre "publicados, do mais recente para o mais antigo".
create index if not exists artigos_publicados_idx
  on public.artigos (published, date desc);

-- updated_at automático, para o painel mostrar a última alteração.
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists artigos_updated_at on public.artigos;
create trigger artigos_updated_at
  before update on public.artigos
  for each row execute function public.tocar_updated_at();

-- 2. Quem pode publicar ------------------------------------------------------
--
-- Ter conta no Supabase não basta para editar o site: é preciso estar nesta
-- lista. Assim, mesmo que o cadastro aberto seja ligado por engano no painel,
-- uma conta nova não consegue tocar em nenhum artigo.
--
-- Para autorizar alguém, veja o passo 6 no fim deste arquivo.

create table if not exists public.editores (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  criado_em  timestamptz not null default now()
);

alter table public.editores enable row level security;

-- Cada pessoa só enxerga a própria linha. Ninguém se adiciona sozinho:
-- não existe policy de insert, então só o SQL Editor (que roda como dono
-- da tabela e ignora RLS) consegue incluir editores.
drop policy if exists "editor ve a propria linha" on public.editores;
create policy "editor ve a propria linha"
  on public.editores for select
  to authenticated
  using (user_id = auth.uid());

/* security definer para que a checagem enxergue a tabela `editores` mesmo
   quando quem pergunta não tem permissão de lê-la inteira. */
create or replace function public.eh_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.editores where user_id = auth.uid()
  );
$$;

-- 3. Regras de acesso aos artigos (RLS) --------------------------------------
--
-- Visitante (chave pública, que vai no navegador): lê apenas o que está
-- publicado. Escrever, editar e apagar exige estar na lista de editores.

alter table public.artigos enable row level security;

drop policy if exists "artigos publicados sao publicos" on public.artigos;
create policy "artigos publicados sao publicos"
  on public.artigos for select
  to anon
  using (published = true);

/* Quem está logado mas não é editor continua enxergando só o que está
   publicado. Não tem como espiar rascunho criando uma conta qualquer. */
drop policy if exists "editores leem tudo" on public.artigos;
create policy "editores leem tudo"
  on public.artigos for select
  to authenticated
  using (published = true or public.eh_editor());

drop policy if exists "editores criam" on public.artigos;
create policy "editores criam"
  on public.artigos for insert
  to authenticated
  with check (public.eh_editor());

drop policy if exists "editores editam" on public.artigos;
create policy "editores editam"
  on public.artigos for update
  to authenticated
  using (public.eh_editor())
  with check (public.eh_editor());

drop policy if exists "editores apagam" on public.artigos;
create policy "editores apagam"
  on public.artigos for delete
  to authenticated
  using (public.eh_editor());

-- 4. Armazenamento das fotos de capa ----------------------------------------
--
-- Bucket público: a foto precisa abrir no navegador de qualquer visitante.
-- Enviar e apagar arquivo é só para editor.

insert into storage.buckets (id, name, public)
values ('artigos', 'artigos', true)
on conflict (id) do update set public = true;

drop policy if exists "capas sao publicas" on storage.objects;
create policy "capas sao publicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'artigos');

drop policy if exists "editores enviam capas" on storage.objects;
create policy "editores enviam capas"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'artigos' and public.eh_editor());

drop policy if exists "editores substituem capas" on storage.objects;
create policy "editores substituem capas"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'artigos' and public.eh_editor())
  with check (bucket_id = 'artigos' and public.eh_editor());

drop policy if exists "editores apagam capas" on storage.objects;
create policy "editores apagam capas"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'artigos' and public.eh_editor());

-- ---------------------------------------------------------------------------
-- 5. Crie a conta no painel
--
--    Authentication > Users > Add user > Create new user
--    - Email: o endereço da pessoa
--    - Password: defina uma
--    - marque "Auto Confirm User"
--
--    Não crie usuário por INSERT em auth.users: a senha precisa ser gerada
--    pelo próprio Supabase e há outras tabelas envolvidas. Uma linha inserida
--    à mão vira um usuário que não consegue entrar.
--
-- 6. Autorize essa conta a publicar
--
--    Volte aqui no SQL Editor, troque o e-mail e rode:
--
--      insert into public.editores (user_id, email)
--      select id, email from auth.users
--      where email = 'troque@pelo-email.com'
--      on conflict (user_id) do nothing;
--
--    Para remover o acesso de alguém, sem apagar a conta:
--
--      delete from public.editores e
--      using auth.users u
--      where e.user_id = u.id and u.email = 'troque@pelo-email.com';
--
--    Para conferir quem tem acesso hoje:
--
--      select u.email, e.criado_em
--      from public.editores e join auth.users u on u.id = e.user_id
--      order by e.criado_em;
-- ---------------------------------------------------------------------------
