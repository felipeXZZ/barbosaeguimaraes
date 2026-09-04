"use server";

import { enviarEmailContato, envioConfigurado } from "@/lib/mail";
import { esquemaContato, type ResultadoEnvio } from "@/lib/schemas";

/**
 * Server Action do formulário de contato.
 * A validação do cliente é repetida aqui: nunca confiar no navegador.
 */
export async function enviarContato(dados: unknown): Promise<ResultadoEnvio> {
  const validacao = esquemaContato.safeParse(dados);

  if (!validacao.success) {
    return {
      status: "erro",
      mensagem:
        "Alguns campos precisam ser revisados. Confira os dados e tente novamente.",
    };
  }

  // Honeypot preenchido: responde como sucesso para não sinalizar ao robô.
  if (validacao.data.site) {
    return { status: "ok" };
  }

  if (!envioConfigurado) {
    return {
      status: "erro",
      mensagem:
        "O envio por formulário está temporariamente indisponível. Fale com o escritório pelo WhatsApp ou pelo telefone.",
    };
  }

  try {
    await enviarEmailContato(validacao.data);
    return { status: "ok" };
  } catch {
    return {
      status: "erro",
      mensagem:
        "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes ou fale pelo WhatsApp.",
    };
  }
}
