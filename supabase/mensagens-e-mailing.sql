-- ---------------------------------------------------------------------------
-- Barbosa e Guimarães: mensagens do formulário e lista de divulgação
--
-- Rode este arquivo DEPOIS do `schema.sql` (ele usa a função
-- `public.eh_editor()`, criada lá), uma única vez, no SQL Editor do painel do
-- Supabase (Dashboard > SQL Editor > New query > colar > Run).
-- Rodar de novo não estraga nada: tudo aqui é idempotente.
--
-- As duas tabelas guardam dado pessoal de gente de fora do escritório. Por
-- isso nenhuma das duas tem policy de leitura para `anon`: a chave pública
-- que vai no navegador não consegue listar nem um nome nem um e-mail.
-- ---------------------------------------------------------------------------

-- 1. Mensagens recebidas pelo formulário de contato -------------------------
--
-- Hoje a mensagem só vira e-mail. Se a caixa for esvaziada, o contato some.
-- Com esta tabela cada envio também fica registrado, e o painel mostra o
-- histórico em /admin/mensagens.

create table if not exists public.mensagens (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  email         text not null,
  telefone      text not null,
  area          text not null,
  mensagem      text not null,
  -- Marca que a caixa da política de privacidade foi aceita no envio.
  consentimento boolean not null default true,
  lida          boolean not null default false,
  criado_em     timestamptz not null default now()
);

create index if not exists mensagens_recentes_idx
  on public.mensagens (criado_em desc);

alter table public.mensagens enable row level security;

/* Gravar é liberado para visitante: o formulário é público e o envio sai
   pela chave anônima. Os limites de tamanho repetem os do formulário, para
   que ninguém use a chave para engordar a tabela com texto solto. */
drop policy if exists "site grava mensagem" on public.mensagens;
create policy "site grava mensagem"
  on public.mensagens for insert
  to anon, authenticated
  with check (
    char_length(nome) between 3 and 120
    and char_length(email) between 5 and 150
    and char_length(telefone) <= 40
    and char_length(area) <= 60
    and char_length(mensagem) between 20 and 3000
  );

-- Ler, marcar como lida e apagar: só editor.
drop policy if exists "editores leem mensagens" on public.mensagens;
create policy "editores leem mensagens"
  on public.mensagens for select
  to authenticated
  using (public.eh_editor());

drop policy if exists "editores atualizam mensagens" on public.mensagens;
create policy "editores atualizam mensagens"
  on public.mensagens for update
  to authenticated
  using (public.eh_editor())
  with check (public.eh_editor());

drop policy if exists "editores apagam mensagens" on public.mensagens;
create policy "editores apagam mensagens"
  on public.mensagens for delete
  to authenticated
  using (public.eh_editor());

-- 2. Lista de divulgação (mailing) ------------------------------------------
--
-- Nomes e e-mails para quem o escritório divulga as matérias. O e-mail é
-- único e fica sempre em minúsculas, então importar a mesma planilha duas
-- vezes não duplica ninguém.

create table if not exists public.mailing (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null default '',
  email         text not null unique,
  -- Campos livres: OAB, cidade, escritório, o que a planilha trouxer.
  observacao    text not null default '',
  -- De onde veio o contato. Útil para conferir a origem depois.
  origem        text not null default '',
  -- Desligado (false) continua na lista, mas fica fora dos envios.
  ativo         boolean not null default true,
  /* Identificador do link de descadastro. Fica pronto desde já para que o
     "sair da lista" não exija mexer na tabela quando o envio for ligado. */
  token         uuid not null default gen_random_uuid(),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint mailing_email_minusculo check (email = lower(email)),
  constraint mailing_email_com_arroba check (position('@' in email) > 1)
);

create index if not exists mailing_ativos_idx on public.mailing (ativo, nome);

create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists mailing_atualizado_em on public.mailing;
create trigger mailing_atualizado_em
  before update on public.mailing
  for each row execute function public.tocar_atualizado_em();

alter table public.mailing enable row level security;

/* Nada de `anon` aqui: uma lista de e-mails legível pela chave pública
   viraria presente para quem quisesse raspar o site. */
drop policy if exists "editores leem mailing" on public.mailing;
create policy "editores leem mailing"
  on public.mailing for select
  to authenticated
  using (public.eh_editor());

drop policy if exists "editores incluem no mailing" on public.mailing;
create policy "editores incluem no mailing"
  on public.mailing for insert
  to authenticated
  with check (public.eh_editor());

drop policy if exists "editores editam o mailing" on public.mailing;
create policy "editores editam o mailing"
  on public.mailing for update
  to authenticated
  using (public.eh_editor())
  with check (public.eh_editor());

drop policy if exists "editores apagam do mailing" on public.mailing;
create policy "editores apagam do mailing"
  on public.mailing for delete
  to authenticated
  using (public.eh_editor());
