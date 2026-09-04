import { z } from "zod";

import { areas } from "@/content/areas";

const slugs = areas.map((area) => area.slug);

export const areasParaSelect = [
  ...areas.map((area) => ({ valor: area.slug, rotulo: area.nome })),
  { valor: "outra", rotulo: "Outro assunto" },
];

export const esquemaContato = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .min(1, "Informe um e-mail para retorno.")
    .email("E-mail inválido.")
    .max(150, "E-mail muito longo."),
  telefone: z
    .string()
    .trim()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone incompleto. Use o formato (11) 91234-5678.",
    ),
  area: z
    .string()
    .refine((valor) => valor === "outra" || slugs.includes(valor as never), {
      message: "Selecione a área de interesse.",
    }),
  mensagem: z
    .string()
    .trim()
    .min(20, "Descreva a situação com pelo menos 20 caracteres.")
    .max(3000, "Mensagem muito longa. Limite de 3000 caracteres."),
  consentimento: z.literal(true, {
    errorMap: () => ({
      message: "É necessário concordar com a política de privacidade.",
    }),
  }),
  /** Honeypot: invisível para pessoas, preenchido por robôs. */
  site: z.string().max(0).optional().or(z.literal("")),
});

export type DadosContato = z.infer<typeof esquemaContato>;

export type ResultadoEnvio =
  | { status: "ok" }
  | { status: "erro"; mensagem: string };
