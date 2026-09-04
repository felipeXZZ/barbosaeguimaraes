/**
 * Dados institucionais do escritório.
 * Fonte única de verdade — nada de telefone ou endereço repetido em componente.
 */

export const ANO_FUNDACAO = 1979;

/** Calculado em tempo de renderização. Nunca hardcode o número de anos. */
export function anosDeAtuacao(): number {
  return new Date().getFullYear() - ANO_FUNDACAO;
}

export const site = {
  nome: "Barbosa e Guimarães Advogados Associados",
  nomeCurto: "Barbosa e Guimarães",
  razaoSocial: "Barbosa e Guimarães Advogados Associados",
  cnpj: "08.864.352/0001-0",
  fundacao: ANO_FUNDACAO,
  descricao:
    "Escritório de advocacia com sede no centro de São Paulo, atuando desde 1979 em dez áreas do direito, com atendimento em todo o território nacional.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.barbosaeguimaraes.adv.br",

  endereco: {
    logradouro: "Praça Dr. João Mendes, 42",
    bairro: "Sé",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01501-001",
    pais: "BR",
    /** Praça João Mendes, ao lado do Fórum João Mendes Júnior */
    geo: { lat: -23.5502, lng: -46.6363 },
    referencia: "Ao lado do Fórum João Mendes Júnior, no centro de São Paulo",
  },

  contato: {
    /** Formato E.164, sem sinais — usado em tel: e wa.me */
    telefoneE164: "+5511976373255",
    telefoneDigitos: "5511976373255",
    telefoneFormatado: "(11) 97637-3255",
    email: "contato@barbosaeguimaraes.adv.br",
  },

  horario: {
    texto: "Segunda a sexta, das 9h às 18h",
    /** Formato schema.org */
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    abre: "09:00",
    fecha: "18:00",
  },

  /** Inscrição da sociedade de advogados */
  oab: "OAB/SP",
  /** PENDENTE: informe o número de inscrição da sociedade na OAB/SP.
   *  Enquanto vazio, o rodapé exibe apenas a seccional, sem número inventado. */
  oabNumero: "",

  /** Crédito de rodapé. Vazio = nenhum crédito é exibido. */
  credito: {
    texto: "IADELY Produções",
    url: "",
  },
} as const;

export const enderecoLinhaUnica = `${site.endereco.logradouro} — ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}, ${site.endereco.cep}`;

export { MENSAGEM_PADRAO as MENSAGEM_WHATSAPP_PADRAO } from "@/content/mensagens-whatsapp";
