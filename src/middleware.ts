import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/**
 * Guarda do painel. Faz duas coisas: renova o token da sessão (só o
 * middleware pode gravar cookie em toda requisição) e barra quem não está
 * autenticado antes mesmo da página carregar.
 *
 * Roda apenas em /admin. O site público não passa por aqui.
 */
export async function middleware(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const ehLogin = request.nextUrl.pathname === "/admin/login";

  /* Sem Supabase configurado o painel não tem como autenticar ninguém.
     Manda todo mundo para o login, que é onde está a explicação. */
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (ehLogin) return resposta;
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin/login";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar) {
        for (const { name, value } of cookiesParaGravar) {
          request.cookies.set(name, value);
        }
        resposta = NextResponse.next({ request });
        for (const { name, value, options } of cookiesParaGravar) {
          resposta.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !ehLogin) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin/login";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  if (user && ehLogin) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return resposta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
