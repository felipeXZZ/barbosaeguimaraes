/**
 * Leitura da lista colada no painel. Roda nos dois lados: a tela mostra a
 * prévia enquanto a pessoa cola, e a Server Action refaz a mesma conta antes
 * de gravar: nunca confiar no que o navegador mandou.
 *
 * Aceita uma linha por contato, em qualquer um destes formatos:
 *
 *   Ana Souza; ana@exemplo.com; OAB/SP 123456
 *   Ana Souza, ana@exemplo.com
 *   Ana Souza <ana@exemplo.com>
 *   ana@exemplo.com
 *
 * Ou seja: cola direto de planilha (CSV ou colunas do Excel), do Word ou do
 * campo "Para" de um e-mail.
 */

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/;

/** Teto por importação, para não estourar o tempo da Server Action. */
export const LIMITE_IMPORTACAO = 5000;

export interface ContatoImportado {
  nome: string;
  email: string;
  observacao: string;
}

export interface ResultadoLeitura {
  contatos: ContatoImportado[];
  /** Linhas em que não havia e-mail nenhum (cabeçalho da planilha, sobras). */
  ignoradas: string[];
  /** Repetições dentro do próprio texto colado, já descartadas. */
  repetidas: number;
  /** Verdadeiro quando a lista foi cortada em LIMITE_IMPORTACAO. */
  cortada: boolean;
}

export function analisarLista(texto: string): ResultadoLeitura {
  const contatos: ContatoImportado[] = [];
  const ignoradas: string[] = [];
  const vistos = new Set<string>();
  let repetidas = 0;
  let cortada = false;

  for (const bruta of texto.split(/\r?\n/)) {
    const linha = bruta.trim();
    if (!linha) continue;

    if (contatos.length >= LIMITE_IMPORTACAO) {
      cortada = true;
      break;
    }

    const achado = linha.match(EMAIL);
    if (!achado) {
      if (ignoradas.length < 20) ignoradas.push(linha.slice(0, 80));
      continue;
    }

    const email = achado[0].toLowerCase();
    if (email.length > 150) {
      if (ignoradas.length < 20) ignoradas.push(linha.slice(0, 80));
      continue;
    }

    if (vistos.has(email)) {
      repetidas += 1;
      continue;
    }
    vistos.add(email);

    /* O que sobra da linha depois de tirar o e-mail: primeiro pedaço vira
       nome, o resto (OAB, cidade, escritório) vai para observação. */
    const campos = linha
      .replace(achado[0], " ")
      .split(/[;\t,|<>"]+/)
      .map((campo) => campo.trim())
      .filter(Boolean);

    contatos.push({
      nome: (campos[0] ?? "").slice(0, 120),
      email,
      observacao: campos.slice(1).join(" · ").slice(0, 200),
    });
  }

  return { contatos, ignoradas, repetidas, cortada };
}
