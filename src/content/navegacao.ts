export interface ItemNavegacao {
  href: string;
  rotulo: string;
}

/** Navegação principal do header e do menu mobile. */
export const navegacaoPrincipal: ItemNavegacao[] = [
  { href: "/", rotulo: "Início" },
  { href: "/sobre", rotulo: "O escritório" },
  { href: "/areas-de-atuacao", rotulo: "Áreas de atuação" },
  { href: "/equipe", rotulo: "Equipe" },
  { href: "/artigos", rotulo: "Artigos" },
  { href: "/contato", rotulo: "Contato" },
];

/** Colunas do rodapé. */
export const navegacaoRodape: { titulo: string; itens: ItemNavegacao[] }[] = [
  {
    titulo: "Escritório",
    itens: [
      { href: "/sobre", rotulo: "Nossa história" },
      { href: "/equipe", rotulo: "Equipe" },
      { href: "/artigos", rotulo: "Artigos" },
      { href: "/contato", rotulo: "Contato" },
    ],
  },
];
