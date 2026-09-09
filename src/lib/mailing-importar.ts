/**
 * Leitura das listas que entram no painel. Roda nos dois lados: a tela mostra
 * a prévia enquanto a pessoa escolhe as colunas, e a Server Action refaz a
 * validação antes de gravar: nunca confiar no que o navegador mandou.
 *
 * São dois caminhos. O texto colado (`analisarLista`) resolve o caso simples,
 * de meia dúzia de contatos. A planilha (`adivinharMapeamento` +
 * `montarContatos`) resolve o caso de verdade, com nome, e-mail, endereço e
 * telefone em colunas separadas.
 */

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/;

/** Teto do texto colado na caixa, para não estourar a Server Action. */
export const LIMITE_IMPORTACAO = 5000;

/** Contatos por requisição na importação de planilha. */
export const TAMANHO_DO_BLOCO = 400;

export interface ContatoImportado {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  oab: string;
  subsecao: string;
  observacao: string;
}

export interface ResultadoLeitura {
  contatos: ContatoImportado[];
  /** Linhas em que não havia e-mail nenhum (cabeçalho da planilha, sobras). */
  ignoradas: string[];
  /** Repetições dentro do próprio arquivo, já descartadas. */
  repetidas: number;
  /** Verdadeiro quando a lista foi cortada em LIMITE_IMPORTACAO. */
  cortada: boolean;
}

function vazio(): ContatoImportado {
  return {
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    oab: "",
    subsecao: "",
    observacao: "",
  };
}

/* -------------------------------------------------------------------------
   Caminho 1: texto colado, uma linha por contato.
   ------------------------------------------------------------------------- */

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
    if (!achado || achado[0].length > 150) {
      if (ignoradas.length < 20) ignoradas.push(linha.slice(0, 80));
      continue;
    }

    const email = achado[0].toLowerCase();

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
      ...vazio(),
      nome: (campos[0] ?? "").slice(0, 120),
      email,
      observacao: campos.slice(1).join(" · ").slice(0, 200),
    });
  }

  return { contatos, ignoradas, repetidas, cortada };
}

/* -------------------------------------------------------------------------
   Caminho 2: planilha, com uma coluna para cada informação.
   ------------------------------------------------------------------------- */

/** Uma célula da planilha, como o leitor de xlsx devolve. */
export type Celula = string | number | boolean | Date | null;

export interface DefinicaoCampo {
  chave: keyof ContatoImportado;
  rotulo: string;
  /** Aceita várias colunas, juntadas na ordem em que aparecem no arquivo. */
  varias: boolean;
  /** Como as várias colunas são emendadas. */
  separador: string;
  limite: number;
  /** Nomes de coluna que apontam para este campo, já normalizados. */
  sinonimos: string[];
}

/* A ordem importa: quem vem antes tem preferência. "Nome Logradouro" precisa
   cair em endereço, e não em nome, só porque começa com "nome". */
export const CAMPOS: DefinicaoCampo[] = [
  {
    chave: "email",
    rotulo: "E-mail",
    varias: false,
    separador: " ",
    limite: 150,
    sinonimos: ["email", "e mail", "correio eletronico", "endereco eletronico"],
  },
  {
    chave: "cep",
    rotulo: "CEP",
    varias: false,
    separador: " ",
    limite: 20,
    sinonimos: ["cep", "codigo postal"],
  },
  {
    chave: "uf",
    rotulo: "UF",
    varias: false,
    separador: " ",
    limite: 4,
    sinonimos: ["uf", "estado", "sigla uf"],
  },
  {
    chave: "bairro",
    rotulo: "Bairro",
    varias: false,
    separador: " ",
    limite: 120,
    sinonimos: ["bairro", "distrito"],
  },
  {
    chave: "cidade",
    rotulo: "Cidade",
    varias: false,
    separador: " ",
    limite: 120,
    sinonimos: ["cidade", "municipio", "localidade"],
  },
  {
    chave: "subsecao",
    rotulo: "Subseção da OAB",
    varias: false,
    separador: " ",
    limite: 120,
    sinonimos: ["subsecao", "subseccao", "seccao", "secao", "comarca"],
  },
  {
    chave: "oab",
    rotulo: "Inscrição na OAB",
    varias: false,
    separador: " ",
    limite: 40,
    sinonimos: ["oab", "inscricao", "nr inscricao", "n inscricao", "registro"],
  },
  {
    chave: "endereco",
    rotulo: "Endereço",
    varias: true,
    separador: " ",
    limite: 240,
    sinonimos: [
      "endereco",
      "logradouro",
      "nome logradouro",
      "tipo logr",
      "cod tipo logr",
      "rua",
      "numero",
      "num endereco",
      "nr endereco",
      "complemento",
    ],
  },
  {
    chave: "telefone",
    rotulo: "Telefone",
    varias: true,
    separador: " ",
    limite: 120,
    sinonimos: [
      "telefone",
      "fone",
      "fones",
      "celular",
      "whatsapp",
      "ddd",
      "tel",
    ],
  },
  {
    chave: "nome",
    rotulo: "Nome",
    varias: false,
    separador: " ",
    limite: 120,
    sinonimos: [
      "nome",
      "advogado",
      "associado",
      "nome completo",
      "razao social",
      "contato",
    ],
  },
  {
    chave: "observacao",
    rotulo: "Observação",
    varias: true,
    separador: " · ",
    limite: 200,
    sinonimos: [],
  },
];

/* Colunas que nunca são escolhidas sozinhas: o site não precisa de CPF nem de
   documento para mandar artigo, e dado que não é usado é dado que não deveria
   estar guardado. Quem quiser pode escolher à mão na tela. */
const NUNCA_SOZINHAS = ["cpf", "cnpj", "rg", "documento", "senha", "nascimento"];

/** Minúsculas, sem acento e sem pontuação, para comparar nome de coluna. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Mapa campo do banco -> colunas da planilha, pelos índices das colunas. */
export type Mapeamento = Partial<Record<keyof ContatoImportado, number[]>>;

function textoDaCelula(celula: Celula): string {
  if (celula == null) return "";
  if (celula instanceof Date) return celula.toLocaleDateString("pt-BR");
  return String(celula).trim();
}

/**
 * Qual linha é o cabeçalho. Procura a primeira que tenha uma coluna chamada
 * e-mail; se não achar, entende que a planilha vem sem cabeçalho.
 */
export function acharCabecalho(linhas: Celula[][]): number {
  const teto = Math.min(linhas.length, 20);

  for (let i = 0; i < teto; i += 1) {
    const celulas = linhas[i].map((celula) => normalizar(textoDaCelula(celula)));
    /* Cabeçalho de verdade tem o nome da coluna, não o dado: uma linha com
       "jose@exemplo.com" dentro não é cabeçalho. */
    const temColunaEmail = celulas.some(
      (celula) => celula === "email" || celula === "e mail",
    );
    if (temColunaEmail) return i;
  }

  return -1;
}

/** Palpite de qual coluna alimenta cada campo, pelo nome do cabeçalho. */
export function adivinharMapeamento(cabecalho: string[]): Mapeamento {
  const titulos = cabecalho.map(normalizar);
  const mapa: Mapeamento = {};
  const usadas = new Set<number>();

  for (const campo of CAMPOS) {
    if (campo.sinonimos.length === 0) continue;

    for (let coluna = 0; coluna < titulos.length; coluna += 1) {
      if (usadas.has(coluna)) continue;

      const titulo = titulos[coluna];
      if (!titulo) continue;
      if (NUNCA_SOZINHAS.some((proibida) => titulo.includes(proibida))) continue;

      const combina = campo.sinonimos.some(
        (sinonimo) =>
          titulo === sinonimo ||
          titulo.startsWith(`${sinonimo} `) ||
          titulo.endsWith(` ${sinonimo}`) ||
          titulo.includes(` ${sinonimo} `) ||
          /* "NomeAdvogado" e "Nr_Inscricao" viram "nomeadvogado" e
             "nr inscricao": sem espaço para separar, vale o pedaço. */
          (sinonimo.length > 4 && titulo.includes(sinonimo)),
      );

      if (!combina) continue;

      const atual = mapa[campo.chave] ?? [];
      if (!campo.varias && atual.length > 0) continue;

      mapa[campo.chave] = [...atual, coluna];
      usadas.add(coluna);
    }
  }

  return mapa;
}

export interface OpcoesMontagem {
  linhas: Celula[][];
  mapeamento: Mapeamento;
  /** Primeira linha de dados; o cabeçalho fica de fora. */
  inicio: number;
}

/**
 * Monta os contatos a partir das linhas e do mapeamento escolhido. Linha sem
 * e-mail válido é descartada, e o e-mail repetido fica só na primeira vez.
 */
export function montarContatos({
  linhas,
  mapeamento,
  inicio,
}: OpcoesMontagem): ResultadoLeitura {
  const contatos: ContatoImportado[] = [];
  const ignoradas: string[] = [];
  const vistos = new Set<string>();
  let repetidas = 0;

  for (let i = inicio; i < linhas.length; i += 1) {
    const linha = linhas[i] ?? [];
    const preenchida = linha.some((celula) => textoDaCelula(celula));
    if (!preenchida) continue;

    const contato = vazio();

    for (const campo of CAMPOS) {
      const colunas = mapeamento[campo.chave] ?? [];
      if (colunas.length === 0) continue;

      const pedacos = colunas
        .map((coluna) => textoDaCelula(linha[coluna]))
        .filter(Boolean);

      contato[campo.chave] = pedacos
        .join(campo.separador)
        .slice(0, campo.limite);
    }

    const achado = contato.email.match(EMAIL);
    if (!achado || achado[0].length > 150) {
      if (ignoradas.length < 20) {
        ignoradas.push(
          linha
            .map(textoDaCelula)
            .filter(Boolean)
            .join("; ")
            .slice(0, 80) || `linha ${i + 1}`,
        );
      }
      continue;
    }

    contato.email = achado[0].toLowerCase();

    if (vistos.has(contato.email)) {
      repetidas += 1;
      continue;
    }
    vistos.add(contato.email);

    contatos.push(contato);
  }

  return { contatos, ignoradas, repetidas, cortada: false };
}
