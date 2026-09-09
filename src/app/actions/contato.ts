"use server";

import { enviarEmailContato, envioConfigurado } from "@/lib/mail";
import { registrarMensagem } from "@/lib/mensagens";
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

  /* Grava antes de enviar. O e-mail é o aviso; o banco é o registro. Se o
     provedor de e-mail estiver fora do ar, o contato ainda aparece em
     /admin/mensagens em vez de se perder. */
  const gravado = await registrarMensagem(validacao.data);

  const indisponivel: ResultadoEnvio = {
    status: "erro",
    mensagem:
      "O envio por formulário está temporariamente indisponível. Fale com o escritório pelo WhatsApp ou pelo telefone.",
  };

  if (!envioConfigurado) {
    return gravado ? { status: "ok" } : indisponivel;
  }

  try {
    await enviarEmailContato(validacao.data);
    return { status: "ok" };
  } catch {
    if (gravado) return { status: "ok" };
    return {
      status: "erro",
      mensagem:
        "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes ou fale pelo WhatsApp.",
    };
  }
}
