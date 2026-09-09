"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { artigos as artigosIniciais } from "@/content/artigos";
import { esquemaArtigo, type ResultadoArtigo } from "@/lib/artigo-schema";
import { BUCKET_CAPAS } from "@/lib/supabase/config";
import { supabaseServidor } from "@/lib/supabase/servidor";

const SEM_CONEXAO =
  "O painel não está conectado ao Supabase. Confira as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.";

/** Atualiza no site tudo que exibe artigo, para a mudança aparecer na hora. */
function revalidarArtigos(slug?: string) {
  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/artigos/${slug}`);
}

/** Caminho dentro do bucket a partir da URL pública; null se for outra coisa. */
function caminhoNoBucket(url: string): string | null {
  const marcador = `/storage/v1/object/public/${BUCKET_CAPAS}/`;
  const posicao = url.indexOf(marcador);
  if (posicao === -1) return null;
  return decodeURIComponent(url.slice(posicao + marcador.length));
}

/** Cria ou atualiza um artigo. O `id` no payload decide qual dos dois. */
export async function salvarArtigo(dados: unknown): Promise<ResultadoArtigo> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "erro",
      mensagem: "Sua sessão expirou. Entre novamente para salvar.",
    };
  }

  const validacao = esquemaArtigo.safeParse(dados);

  if (!validacao.success) {
    const campos: Record<string, string> = {};
    for (const problema of validacao.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !campos[campo]) campos[campo] = problema.message;
    }
    return {
      status: "erro",
      mensagem: "Alguns campos precisam ser revisados.",
      campos,
    };
  }

  const artigo = validacao.data;

  const linha = {
    slug: artigo.slug,
    title: artigo.title,
    excerpt: artigo.excerpt,
    date: artigo.date,
    reading_time: artigo.readingTime,
    author: artigo.author,
    category: artigo.category,
    cover_image: artigo.coverImage,
    cover_image_alt: artigo.coverImageAlt,
    content: artigo.content,
    published: artigo.published,
  };

  /* O slug é único na tabela; sem esta checagem o banco devolveria um erro
     técnico em vez de uma frase que o escritório entende. */
  const { data: conflito } = await supabase
    .from("artigos")
    .select("id")
    .eq("slug", artigo.slug)
    .maybeSingle();

  if (conflito && conflito.id !== artigo.id) {
    return {
      status: "erro",
      mensagem: "Já existe um artigo com este endereço.",
      campos: { slug: "Já existe um artigo com este endereço." },
    };
  }

  if (artigo.id) {
    const { error } = await supabase
      .from("artigos")
      .update(linha)
      .eq("id", artigo.id);

    if (error) {
      console.error("Falha ao atualizar artigo:", error.message);
      return {
        status: "erro",
        mensagem: "Não foi possível salvar as alterações. Tente novamente.",
      };
    }

    revalidarArtigos(artigo.slug);
    return {
      status: "ok",
      id: artigo.id,
      mensagem: artigo.published
        ? "Artigo atualizado e publicado."
        : "Alterações salvas como rascunho.",
    };
  }

  const { data, error } = await supabase
    .from("artigos")
    .insert(linha)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Falha ao criar artigo:", error?.message);
    return {
      status: "erro",
      mensagem: "Não foi possível criar o artigo. Tente novamente.",
    };
  }

  revalidarArtigos(artigo.slug);
  return {
    status: "ok",
    id: data.id,
    mensagem: artigo.published
      ? "Artigo publicado."
      : "Rascunho criado. Publique quando estiver pronto.",
  };
}

/** Publica ou volta para rascunho sem abrir o editor. */
export async function alternarPublicacao(
  id: string,
  publicar: boolean,
): Promise<ResultadoArtigo> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { data, error } = await supabase
    .from("artigos")
    .update({ published: publicar })
    .eq("id", id)
    .select("slug")
    .single();

  if (error || !data) {
    console.error("Falha ao alternar publicação:", error?.message);
    return {
      status: "erro",
      mensagem: "Não foi possível alterar a situação do artigo.",
    };
  }

  revalidarArtigos(data.slug);
  return {
    status: "ok",
    id,
    mensagem: publicar
      ? "Artigo publicado no site."
      : "Artigo voltou para rascunho e saiu do site.",
  };
}

export async function excluirArtigo(id: string): Promise<ResultadoArtigo> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { data: artigo } = await supabase
    .from("artigos")
    .select("slug, cover_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("artigos").delete().eq("id", id);

  if (error) {
    console.error("Falha ao excluir artigo:", error.message);
    return { status: "erro", mensagem: "Não foi possível excluir o artigo." };
  }

  // Sem o artigo, a capa no storage vira lixo: some junto.
  const arquivo = caminhoNoBucket(artigo?.cover_image ?? "");
  if (arquivo) {
    await supabase.storage.from(BUCKET_CAPAS).remove([arquivo]);
  }

  revalidarArtigos(artigo?.slug);
  return { status: "ok", id, mensagem: "Artigo excluído." };
}

export type ResultadoUpload =
  | { status: "ok"; url: string }
  | { status: "erro"; mensagem: string };

/** Envia a foto de capa e devolve a URL pública dela. */
export async function enviarCapa(
  formData: FormData,
): Promise<ResultadoUpload> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { status: "erro", mensagem: "Escolha um arquivo de imagem." };
  }

  const tiposAceitos = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!tiposAceitos.includes(arquivo.type)) {
    return {
      status: "erro",
      mensagem: "Formato não aceito. Envie JPG, PNG, WebP ou AVIF.",
    };
  }

  const LIMITE = 8 * 1024 * 1024;
  if (arquivo.size > LIMITE) {
    return {
      status: "erro",
      mensagem: "A imagem tem mais de 8 MB. Reduza o arquivo e tente de novo.",
    };
  }

  const extensao = arquivo.type.split("/")[1].replace("jpeg", "jpg");
  const base = String(formData.get("slug") || "capa");
  const nome = `${base}-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET_CAPAS)
    .upload(nome, arquivo, { contentType: arquivo.type, upsert: false });

  if (error) {
    console.error("Falha ao enviar capa:", error.message);
    return {
      status: "erro",
      mensagem: "Não foi possível enviar a imagem. Tente novamente.",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_CAPAS).getPublicUrl(nome);

  return { status: "ok", url: publicUrl };
}

/**
 * Carga inicial: leva para o banco os artigos que hoje moram no repositório.
 * Só roda com a tabela vazia, então não há risco de duplicar nada.
 */
export async function importarArtigosIniciais(): Promise<ResultadoArtigo> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { count, error: erroContagem } = await supabase
    .from("artigos")
    .select("id", { count: "exact", head: true });

  if (erroContagem) {
    console.error("Falha ao contar artigos:", erroContagem.message);
    return { status: "erro", mensagem: "Não foi possível ler a tabela." };
  }

  if ((count ?? 0) > 0) {
    return {
      status: "erro",
      mensagem: "A importação só roda com a lista vazia.",
    };
  }

  const linhas = artigosIniciais.map((artigo) => ({
    slug: artigo.slug,
    title: artigo.title,
    excerpt: artigo.excerpt,
    date: artigo.date,
    reading_time: artigo.readingTime,
    author: artigo.author,
    category: artigo.category,
    cover_image: artigo.coverImage,
    cover_image_alt: artigo.coverImageAlt,
    content: artigo.content,
    published: true,
  }));

  const { error } = await supabase.from("artigos").insert(linhas);

  if (error) {
    console.error("Falha ao importar artigos:", error.message);
    return { status: "erro", mensagem: "Não foi possível importar." };
  }

  revalidarArtigos();
  return {
    status: "ok",
    id: "importacao",
    mensagem: `${linhas.length} artigos importados.`,
  };
}

/** Encerra a sessão do painel e volta para a tela de login. */
export async function sair(): Promise<void> {
  const supabase = await supabaseServidor();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
