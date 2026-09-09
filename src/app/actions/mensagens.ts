"use server";

import { revalidatePath } from "next/cache";

import { supabaseServidor } from "@/lib/supabase/servidor";

export type ResultadoMensagem =
  | { status: "ok" }
  | { status: "erro"; mensagem: string };

const SEM_CONEXAO =
  "O painel não está conectado ao Supabase. Confira as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

/** Marca uma mensagem como lida ou volta para não lida. */
export async function marcarMensagemLida(
  id: string,
  lida: boolean,
): Promise<ResultadoMensagem> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase
    .from("mensagens")
    .update({ lida })
    .eq("id", id);

  if (error) {
    console.error("Falha ao marcar mensagem:", error.message);
    return {
      status: "erro",
      mensagem: "Não foi possível alterar a situação da mensagem.",
    };
  }

  revalidatePath("/admin/mensagens");
  return { status: "ok" };
}

/** Apaga a mensagem do banco. O e-mail já enviado continua na caixa. */
export async function excluirMensagem(
  id: string,
): Promise<ResultadoMensagem> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase.from("mensagens").delete().eq("id", id);

  if (error) {
    console.error("Falha ao excluir mensagem:", error.message);
    return { status: "erro", mensagem: "Não foi possível excluir a mensagem." };
  }

  revalidatePath("/admin/mensagens");
  return { status: "ok" };
}
