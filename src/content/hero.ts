import type { SlideHero } from "@/types/content";

/**
 * Imagens que se alternam no topo da home. A ordem aqui é a ordem de exibição;
 * para acrescentar uma imagem basta somar um item e o carrossel se ajusta.
 */
export const slidesHero: SlideHero[] = [
  {
    src: "/images/hero/brasao.png",
    alt: "Brasão do escritório Barbosa e Guimarães Advogados Associados",
    ajuste: "contain",
  },
  {
    src: "/images/hero/hermes-tribuna.jpg",
    alt: "Raimundo Hermes Barbosa, sócio fundador do escritório, discursando em tribuna",
    ajuste: "cover",
  },
];
