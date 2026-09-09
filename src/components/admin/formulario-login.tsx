"use client";

import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { supabaseNavegador } from "@/lib/supabase/navegador";

const CAMPO =
  "mt-2 block h-12 w-full rounded-[2px] border border-grafite-400 bg-white px-3 text-[0.9375rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/70 focus:border-bordo-700";

export function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");

    const supabase = supabaseNavegador();
    if (!supabase) {
      setErro(
        "O painel ainda não está conectado ao Supabase. Configure as variáveis de ambiente.",
      );
      return;
    }

    setEnviando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      setEnviando(false);
      /* A mensagem do Supabase vem em inglês e distingue "usuário não existe"
         de "senha errada", o que ajuda quem tenta adivinhar. Uma frase só. */
      setErro("E-mail ou senha incorretos.");
      return;
    }

    // O middleware só enxerga o cookie novo depois que o servidor é consultado.
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-[0.875rem] font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          className={CAMPO}
          placeholder="barbosaadvsite@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="senha" className="block text-[0.875rem] font-medium">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          className={CAMPO}
        />
      </div>

      {erro ? (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-[0.8125rem] text-erro"
        >
          <AlertCircle aria-hidden className="mt-px size-4 shrink-0" />
          {erro}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enviando}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-bordo-600 disabled:opacity-60"
      >
        {enviando ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
