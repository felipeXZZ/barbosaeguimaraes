import { NextResponse, type NextRequest } from "next/server";

import { sairDaLista } from "@/app/actions/descadastro";
import { site } from "@/content/site";

/* Endereço do cabeçalho List-Unsubscribe. Nunca pode ser cacheado. */
export const dynamic = "force-dynamic";

/**
 * O botão "cancelar inscrição" do Gmail e do Outlook manda um POST para cá,
 * sem abrir o navegador. A resposta só precisa ser 200: quem lê é o programa
 * de e-mail, não uma pessoa.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const resultado = await sairDaLista(token);

  return NextResponse.json(
    { ok: resultado.status === "ok" },
    { status: resultado.status === "erro" ? 500 : 200 },
  );
}

/**
 * Se alguém abrir este endereço no navegador, manda para a página que
 * explica o que está acontecendo e pede confirmação.
 */
export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  return NextResponse.redirect(
    `${site.url}/descadastro${token ? `?t=${encodeURIComponent(token)}` : ""}`,
  );
}
