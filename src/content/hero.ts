import type { SlideHero } from "@/types/content";

/**
 * Fotografias que se alternam no fundo do topo da home, nesta ordem.
 *
 * Para acrescentar uma foto basta colocar o arquivo em /public/images/hero/ e
 * somar um item aqui. O topo ignora sozinho qualquer item cujo arquivo ainda
 * não exista, então dá para deixar a lista pronta antes das fotos chegarem:
 * a foto entra no rodízio no momento em que o arquivo é enviado.
 *
 * Peça 2000px de largura no mínimo. Abaixo disso a imagem aparece macia numa
 * tela grande, porque aqui ela ocupa o quadro inteiro.
 */
export const slidesHero: SlideHero[] = [
  {
    src: "/images/hero/hermes-tribuna.jpg",
    descricao:
      "Raimundo Hermes Barbosa, sócio fundador, discursando em tribuna",
    foco: "direita",
  },
  {
    src: "/images/hero/estudo-de-caso.jpg",
    descricao:
      "Advogados analisando um caso sobre a mesa, com códigos e a balança",
    foco: "centro",
  },
  /* Ainda não fornecidas. Ficam listadas de propósito: entram sozinhas no
     rodízio assim que os arquivos forem colocados na pasta. */
  {
    src: "/images/hero/escritorio-fachada.jpg",
    descricao: "Fachada ou recepção do escritório",
    foco: "centro",
  },
  {
    src: "/images/hero/praca-joao-mendes.jpg",
    descricao: "Praça João Mendes e o Fórum, no centro de São Paulo",
    foco: "centro",
  },
];
