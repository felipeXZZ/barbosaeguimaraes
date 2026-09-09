"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { site } from "@/content/site";
import { buscarDisparo } from "@/lib/disparos";
import {
  corpoHtml,
  corpoTexto,
  enderecoDescadastroUmClique,
  type MateriaDoDisparo,
} from "@/lib/email-disparo";
import {
  CAIXA_DO_ESCRITORIO,
  clienteResend,
  envioConfigurado,
  REMETENTE_PADRAO,
} from "@/lib/mail";
import { supabaseServidor } from "@/lib/supabase/servidor";

const SEM_CONEXAO =
  "O painel não está conectado ao Supabase. Confira as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

const SEM_TABELA =
  "As tabelas de disparo ainda não existem no banco. Rode o arquivo supabase/disparos.sql no SQL Editor do Supabase.";

const SEM_CHAVE =
  "O envio de e-mail não está configurado. Defina RESEND_API_KEY (e CONTATO_EMAIL_REMETENTE, no domínio verificado) no ambiente do site.";

/**
 * Endereços por requisição. O lote do Resend aceita cem; cinquenta deixa
 * folga no tempo da função e faz a barra de progresso andar mais vezes.
 */
const BLOCO = 50;

function tabelaAusente(codigo?: string, mensagem?: string): boolean {
  return (
    codigo === "42P01" ||
    codigo === "PGRST205" ||
    /Could not find the table|function .* does not exist/i.test(mensagem ?? "")
  );
}

export type ResultadoDisparo =
  | { status: "ok"; id: string; total: number; mensagem: string }
  | { status: "erro"; mensagem: string };

const esquemaDisparo = z.object({
  artigoId: z.string().uuid("Escolha a matéria que será divulgada."),
  assunto: z
    .string()
    .trim()
    .min(5, "O assunto precisa de pelo menos 5 caracteres.")
    .max(160, "Assunto muito longo."),
  abertura: z.string().trim().max(600, "Texto de abertura muito longo."),
});

/**
 * Cria o disparo e congela a lista de quem vai receber. Depois disso, incluir
 * gente nova no mailing não muda mais este envio: entra no próximo.
 */
export async function criarDisparo(dados: unknown): Promise<ResultadoDisparo> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const validacao = esquemaDisparo.safeParse(dados);
  if (!validacao.success) {
    return {
      status: "erro",
      mensagem: validacao.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { artigoId, assunto, abertura } = validacao.data;

  const { data: artigo, error: erroArtigo } = await supabase
    .from("artigos")
    .select("id, slug, title, excerpt, cover_image, published")
    .eq("id", artigoId)
    .maybeSingle();

  if (erroArtigo || !artigo) {
    return { status: "erro", mensagem: "Matéria não encontrada." };
  }

  if (!artigo.published) {
    return {
      status: "erro",
      mensagem:
        "Esta matéria é um rascunho. Publique antes de divulgar, senão o link do e-mail cai numa página que não existe.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: criado, error } = await supabase
    .from("disparos")
    .insert({
      artigo_id: artigo.id,
      assunto,
      abertura,
      artigo_titulo: artigo.title,
      artigo_resumo: artigo.excerpt,
      artigo_url: `${site.url}/artigos/${artigo.slug}`,
      artigo_capa: artigo.cover_image ?? "",
      criado_por: user?.email ?? "",
    })
    .select("id")
    .single();

  if (error || !criado) {
    console.error("Falha ao criar disparo:", error?.message);
    if (tabelaAusente(error?.code, error?.message)) {
      return { status: "erro", mensagem: SEM_TABELA };
    }
    return { status: "erro", mensagem: "Não foi possível criar o disparo." };
  }

  const { data: total, error: erroPreparo } = await supabase.rpc(
    "preparar_disparo",
    { p_disparo: criado.id },
  );

  if (erroPreparo) {
    console.error("Falha ao preparar disparo:", erroPreparo.message);
    await supabase.from("disparos").delete().eq("id", criado.id);
    if (tabelaAusente(erroPreparo.code, erroPreparo.message)) {
      return { status: "erro", mensagem: SEM_TABELA };
    }
    return {
      status: "erro",
      mensagem: "Não foi possível montar a lista de destinatários.",
    };
  }

  const quantos = Number(total ?? 0);

  if (quantos === 0) {
    await supabase.from("disparos").delete().eq("id", criado.id);
    return {
      status: "erro",
      mensagem:
        "Nenhum contato está recebendo os envios. Confira a lista de divulgação.",
    };
  }

  revalidatePath("/admin/disparos");
  return {
    status: "ok",
    id: criado.id,
    total: quantos,
    mensagem: `Disparo criado para ${quantos.toLocaleString("pt-BR")} contatos.`,
  };
}

export type ResultadoEnvioBloco =
  | {
      status: "ok";
      enviados: number;
      falhas: number;
      pendentes: number;
      concluido: boolean;
    }
  | { status: "erro"; mensagem: string; pendentes?: number };

interface LinhaDestino {
  id: string;
  email: string;
  nome: string;
  token: string;
}

/**
 * Envia o próximo bloco de endereços pendentes. A tela chama esta ação em
 * laço até não sobrar ninguém; cada endereço é marcado assim que sai, então
 * fechar o navegador no meio não faz ninguém receber duas vezes.
 */
export async function enviarProximoBloco(
  disparoId: string,
): Promise<ResultadoEnvioBloco> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  if (!envioConfigurado) return { status: "erro", mensagem: SEM_CHAVE };

  const disparo = await buscarDisparo(disparoId);
  if (!disparo) {
    return { status: "erro", mensagem: "Disparo não encontrado." };
  }

  const { data, error } = await supabase
    .from("disparos_destinos")
    .select("id, email, nome, token")
    .eq("disparo_id", disparoId)
    .eq("situacao", "pendente")
    .limit(BLOCO);

  if (error) {
    console.error("Falha ao buscar destinatários:", error.message);
    return { status: "erro", mensagem: "Não foi possível ler a fila de envio." };
  }

  const destinos = (data ?? []) as LinhaDestino[];

  if (destinos.length === 0) {
    await supabase
      .from("disparos")
      .update({ situacao: "concluido", concluido_em: new Date().toISOString() })
      .eq("id", disparoId);

    revalidatePath("/admin/disparos");
    return {
      status: "ok",
      enviados: 0,
      falhas: 0,
      pendentes: 0,
      concluido: true,
    };
  }

  if (disparo.situacao !== "enviando") {
    await supabase
      .from("disparos")
      .update({ situacao: "enviando" })
      .eq("id", disparoId);
  }

  const materia: MateriaDoDisparo = {
    assunto: disparo.assunto,
    abertura: disparo.abertura,
    titulo: disparo.artigoTitulo,
    resumo: disparo.artigoResumo,
    url: disparo.artigoUrl,
    capa: disparo.artigoCapa,
  };

  const resend = clienteResend();
  if (!resend) return { status: "erro", mensagem: SEM_CHAVE };

  const lote = destinos.map((destino) => ({
    from: REMETENTE_PADRAO,
    to: [destino.email],
    subject: disparo.assunto,
    html: corpoHtml(materia, destino.nome, destino.token),
    text: corpoTexto(materia, destino.nome, destino.token),
    /* Botão "cancelar inscrição" do próprio Gmail e do Outlook. Sem ele, quem
       quer sair da lista usa o botão de spam, que é o que derruba a
       reputação do domínio. */
    headers: {
      "List-Unsubscribe": `<${enderecoDescadastroUmClique(destino.token)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  }));

  const { error: erroEnvio } = await resend.batch.send(lote);

  if (erroEnvio) {
    console.error("Falha no lote de envio:", erroEnvio.message);
    /* Ninguém é marcado: o bloco continua pendente e pode ser retomado
       quando o motivo do erro passar (limite diário, por exemplo). */
    return {
      status: "erro",
      mensagem: `O provedor recusou este bloco: ${erroEnvio.message}`,
      pendentes: disparo.pendentes,
    };
  }

  const agora = new Date().toISOString();
  const { error: erroMarcar } = await supabase
    .from("disparos_destinos")
    .update({ situacao: "enviado", enviado_em: agora })
    .in(
      "id",
      destinos.map((destino) => destino.id),
    );

  if (erroMarcar) {
    /* Situação ruim de verdade: saiu e não foi marcado. Avisa em vez de
       seguir o laço, senão o bloco sairia de novo na próxima volta. */
    console.error("Falha ao marcar enviados:", erroMarcar.message);
    return {
      status: "erro",
      mensagem:
        "O bloco foi enviado, mas não deu para registrar. Pare aqui e confira a tela antes de continuar, para ninguém receber duas vezes.",
    };
  }

  const pendentes = Math.max(0, disparo.pendentes - destinos.length);

  revalidatePath("/admin/disparos");
  return {
    status: "ok",
    enviados: destinos.length,
    falhas: 0,
    pendentes,
    concluido: pendentes === 0,
  };
}

/** Manda uma amostra para a caixa do escritório, sem tocar na fila. */
export async function enviarTeste(
  disparoId: string,
  destino?: string,
): Promise<{ status: "ok"; mensagem: string } | { status: "erro"; mensagem: string }> {
  if (!envioConfigurado) return { status: "erro", mensagem: SEM_CHAVE };

  const disparo = await buscarDisparo(disparoId);
  if (!disparo) return { status: "erro", mensagem: "Disparo não encontrado." };

  const para = (destino ?? "").trim() || CAIXA_DO_ESCRITORIO;

  const resend = clienteResend();
  if (!resend) return { status: "erro", mensagem: SEM_CHAVE };

  /* Token de mentira: o link de descadastro do teste não pode tirar ninguém
     de verdade da lista. */
  const tokenDeTeste = "00000000-0000-0000-0000-000000000000";

  const materia: MateriaDoDisparo = {
    assunto: disparo.assunto,
    abertura: disparo.abertura,
    titulo: disparo.artigoTitulo,
    resumo: disparo.artigoResumo,
    url: disparo.artigoUrl,
    capa: disparo.artigoCapa,
  };

  const { error } = await resend.emails.send({
    from: REMETENTE_PADRAO,
    to: [para],
    subject: `[teste] ${disparo.assunto}`,
    html: corpoHtml(materia, "", tokenDeTeste),
    text: corpoTexto(materia, "", tokenDeTeste),
  });

  if (error) {
    return { status: "erro", mensagem: `Não foi possível enviar: ${error.message}` };
  }

  return { status: "ok", mensagem: `Teste enviado para ${para}.` };
}

/** Interrompe o envio. O que já saiu continua registrado. */
export async function pararDisparo(
  disparoId: string,
): Promise<{ status: "ok" } | { status: "erro"; mensagem: string }> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase
    .from("disparos")
    .update({ situacao: "rascunho" })
    .eq("id", disparoId);

  if (error) {
    return { status: "erro", mensagem: "Não foi possível parar o disparo." };
  }

  revalidatePath("/admin/disparos");
  return { status: "ok" };
}

/** Apaga o disparo e o registro de quem recebeu. */
export async function excluirDisparo(
  disparoId: string,
): Promise<{ status: "ok" } | { status: "erro"; mensagem: string }> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase.from("disparos").delete().eq("id", disparoId);

  if (error) {
    return { status: "erro", mensagem: "Não foi possível excluir o disparo." };
  }

  revalidatePath("/admin/disparos");
  return { status: "ok" };
}
