-- ---------------------------------------------------------------------------
-- Barbosa e Guimarães: disparo das matérias para a lista de divulgação
--
-- Rode DEPOIS de `schema.sql` e de `mensagens-e-mailing.sql`, uma única vez,
-- no SQL Editor do Supabase. Rodar de novo não estraga nada.
--
-- Um disparo é uma fotografia: no momento em que é criado, todo mundo que
-- está recebendo entra como destinatário pendente. Daí em diante o envio
-- caminha bloco a bloco, e cada endereço é marcado assim que sai. É o que
-- permite parar no meio, fechar o navegador e continuar depois sem mandar
-- e-mail repetido para ninguém.
-- ---------------------------------------------------------------------------

-- 1. O disparo -------------------------------------------------------------

create table if not exists public.disparos (
  id            uuid primary key default gen_random_uuid(),
  -- Artigo divulgado. Fica nulo se o artigo for excluído depois.
  artigo_id     uuid references public.artigos (id) on delete set null,
  assunto       text not null,
  -- Texto de abertura, acima do resumo do artigo.
  abertura      text not null default '',
  /* Cópia do artigo no momento do disparo: o e-mail que saiu não muda mais,
     mesmo que o artigo seja editado ou saia do ar depois. */
  artigo_titulo text not null,
  artigo_resumo text not null,
  artigo_url    text not null,
  artigo_capa   text not null default '',
  -- rascunho, enviando, concluido
  situacao      text not null default 'rascunho',
  criado_por    text not null default '',
  criado_em     timestamptz not null default now(),
  concluido_em  timestamptz
);

create index if not exists disparos_recentes_idx
  on public.disparos (criado_em desc);

-- 2. Quem recebe cada disparo ----------------------------------------------

create table if not exists public.disparos_destinos (
  id          uuid primary key default gen_random_uuid(),
  disparo_id  uuid not null references public.disparos (id) on delete cascade,
  mailing_id  uuid references public.mailing (id) on delete set null,
  email       text not null,
  nome        text not null default '',
  /* Token do contato, copiado para cá: o link de descadastro do e-mail que já
     saiu continua funcionando mesmo que a linha do mailing mude. */
  token       uuid not null,
  -- pendente, enviado, falhou
  situacao    text not null default 'pendente',
  erro        text not null default '',
  enviado_em  timestamptz,
  -- O mesmo endereço não entra duas vezes no mesmo disparo.
  unique (disparo_id, email)
);

create index if not exists disparos_destinos_pendentes_idx
  on public.disparos_destinos (disparo_id, situacao);

-- 3. Montar a lista de destinatários ----------------------------------------
--
-- Uma instrução só, no banco: puxar cinquenta mil linhas até o navegador para
-- devolvê-las em seguida seria absurdo. Roda com a permissão de quem chamou,
-- então continua valendo a regra de que só editor mexe nessas tabelas.

create or replace function public.preparar_disparo(p_disparo uuid)
returns integer
language plpgsql
as $$
declare
  quantos integer;
begin
  insert into public.disparos_destinos (disparo_id, mailing_id, email, nome, token)
  select p_disparo, m.id, m.email, m.nome, m.token
  from public.mailing m
  where m.ativo = true
  on conflict (disparo_id, email) do nothing;

  get diagnostics quantos = row_count;
  return quantos;
end;
$$;

-- 4. Sair da lista ----------------------------------------------------------
--
-- O link do rodapé do e-mail chega em quem não está logado, então esta função
-- roda como dona da tabela (security definer). Ela só enxerga quem tem o token
-- exato, que é sorteado por contato e não aparece em lugar nenhum público.
-- Ninguém consegue descadastrar terceiros, nem descobrir se um e-mail existe.

create or replace function public.descadastrar(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  encontrou boolean;
begin
  update public.mailing
  set ativo = false
  where token = p_token
  returning true into encontrou;

  return coalesce(encontrou, false);
end;
$$;

revoke all on function public.descadastrar(uuid) from public;
grant execute on function public.descadastrar(uuid) to anon, authenticated;

-- 5. Regras de acesso -------------------------------------------------------

alter table public.disparos enable row level security;
alter table public.disparos_destinos enable row level security;

drop policy if exists "editores leem disparos" on public.disparos;
create policy "editores leem disparos"
  on public.disparos for select
  to authenticated
  using (public.eh_editor());

drop policy if exists "editores criam disparos" on public.disparos;
create policy "editores criam disparos"
  on public.disparos for insert
  to authenticated
  with check (public.eh_editor());

drop policy if exists "editores editam disparos" on public.disparos;
create policy "editores editam disparos"
  on public.disparos for update
  to authenticated
  using (public.eh_editor())
  with check (public.eh_editor());

drop policy if exists "editores apagam disparos" on public.disparos;
create policy "editores apagam disparos"
  on public.disparos for delete
  to authenticated
  using (public.eh_editor());

drop policy if exists "editores leem destinos" on public.disparos_destinos;
create policy "editores leem destinos"
  on public.disparos_destinos for select
  to authenticated
  using (public.eh_editor());

drop policy if exists "editores criam destinos" on public.disparos_destinos;
create policy "editores criam destinos"
  on public.disparos_destinos for insert
  to authenticated
  with check (public.eh_editor());

drop policy if exists "editores editam destinos" on public.disparos_destinos;
create policy "editores editam destinos"
  on public.disparos_destinos for update
  to authenticated
  using (public.eh_editor())
  with check (public.eh_editor());

drop policy if exists "editores apagam destinos" on public.disparos_destinos;
create policy "editores apagam destinos"
  on public.disparos_destinos for delete
  to authenticated
  using (public.eh_editor());

-- 6. Resumo para a tela do painel -------------------------------------------
--
-- Contar destinatários por situação em SQL evita trazer a lista inteira para
-- o navegador só para somar. `security_invoker` mantém as regras de RLS de
-- quem consulta: sem isso a view rodaria com os poderes do dono da tabela.

create or replace view public.disparos_resumo
with (security_invoker = true) as
select
  d.*,
  count(dd.id)                                          as total,
  count(dd.id) filter (where dd.situacao = 'enviado')   as enviados,
  count(dd.id) filter (where dd.situacao = 'falhou')    as falhas,
  count(dd.id) filter (where dd.situacao = 'pendente')  as pendentes
from public.disparos d
left join public.disparos_destinos dd on dd.disparo_id = d.id
group by d.id;
