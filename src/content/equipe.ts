import { Award, GraduationCap, Landmark, Scale, Users } from "lucide-react";

import type { MembroEquipe } from "@/types/content";

/**
 * Equipe do escritório. Apenas qualificação verdadeira e verificável:
 * títulos, cargos, filiações e tempo de atuação — permitido e recomendado
 * pelo Provimento 205/2021. Nenhuma menção a resultados ou casos.
 */
export const equipe: MembroEquipe[] = [
  {
    slug: "raimundo-hermes-barbosa",
    nome: "Raimundo Hermes Barbosa",
    cargo: "Sócio Fundador",
    credenciais: [
      "Advogado, jurisconsulto e especialista em Direito Penal",
      "Pós-graduado pela Pontifícia Universidade Católica",
      "Conselheiro Representante da OAB",
      "Sócio efetivo do Instituto dos Advogados Brasileiros (IAB)",
      "Presidente da Federação dos Advogados do Estado de São Paulo (FADESP)",
      "Conselheiro Federal da Ordem dos Advogados do Brasil",
    ],
    bio: [
      "Advogado, jurisconsulto e especialista em Direito Penal, pós-graduado pela Pontifícia Universidade Católica. Construiu a carreira atuando em diversos ramos do direito e participando do debate institucional da advocacia.",
      "Convidado pela Associação Comercial de São Paulo, exerceu três mandatos como Conselheiro Distrital. Na Ordem dos Advogados do Brasil, foi Conselheiro Representante na Fundação do Bem Estar do Menor, Secretário e Vice-Presidente da Caixa dos Advogados do Estado de São Paulo, membro das Comissões de Prerrogativas, de Estágio e Exame de Ordem e de Direitos Humanos, e Secretário Geral.",
      "Sócio efetivo do Instituto dos Advogados Brasileiros, participou da criação da Federação dos Advogados do Estado de São Paulo, onde exerce a presidência. Foi Presidente da Carteira de Previdência dos Advogados do Estado de São Paulo e Presidente da Comissão de Direito Bancário da OAB Federal, e foi eleito Conselheiro Federal da Ordem dos Advogados do Brasil.",
    ],
    resumo:
      "Advogado, jurisconsulto e especialista em Direito Penal. Construiu a carreira atuando em diversos ramos do direito e participando do debate institucional da advocacia.",
    destaques: [
      {
        icone: Award,
        rotulo: "Ordem dos Advogados do Brasil",
        detalhe: "Conselheiro Federal",
      },
      {
        icone: Users,
        rotulo: "FADESP",
        detalhe: "Presidente da Federação dos Advogados do Estado de São Paulo",
      },
      {
        icone: Landmark,
        rotulo: "Instituto dos Advogados Brasileiros",
        detalhe: "Sócio efetivo",
      },
      {
        icone: Scale,
        rotulo: "Comissão de Direito Bancário da OAB Federal",
        detalhe: "Presidente",
      },
      {
        icone: GraduationCap,
        rotulo: "Pontifícia Universidade Católica",
        detalhe: "Pós-graduação",
      },
    ],
    foto: "/images/equipe/raimundo-hermes-barbosa.jpg",
    fotoAlt:
      "Retrato de Raimundo Hermes Barbosa, sócio fundador do escritório Barbosa e Guimarães",
    destaque: true,
  },
  {
    slug: "debora-guimaraes",
    nome: "Débora Guimarães",
    cargo: "Advogada · Diretora Nacional de Negócios",
    credenciais: [
      "Advogada empresarial há mais de 27 anos",
      "Diretora Nacional de Negócios",
      "Diretora de Reestruturação de Negócios",
      "Head de Negócios",
      "Gestora de pessoas e processos",
    ],
    foto: "/images/equipe/debora-guimaraes.jpg",
    fotoAlt: "Retrato de Débora Guimarães, advogada e Diretora Nacional de Negócios",
  },
  {
    slug: "helio-mendes-da-silva",
    nome: "Helio Mendes da Silva",
    cargo: "Advogado · Trabalhista e Previdenciário",
    credenciais: [
      "Atuação trabalhista e previdenciária",
      "Advocacia consultiva",
      "Associado ao escritório desde 2013",
      "Ex-tesoureiro-adjunto da Federação Nacional dos Advogados, Estagiários e Bacharéis (FADESP)",
    ],
    foto: "/images/equipe/helio-mendes-da-silva.jpg",
    fotoAlt:
      "Retrato de Helio Mendes da Silva, advogado trabalhista e previdenciário",
  },
  {
    slug: "ariovaldo-vitzel-junior",
    nome: "Ariovaldo Vitzel Junior",
    cargo: "Advogado · Área Criminal",
    credenciais: [
      "Atuação na área criminal",
      "Membro da Comissão de Prerrogativas da 4ª Subseção",
    ],
    foto: "/images/equipe/ariovaldo-vitzel-junior.jpg",
    fotoAlt: "Retrato de Ariovaldo Vitzel Junior, advogado criminalista",
  },
  {
    slug: "thaylla-magalhaes",
    nome: "Thaylla Magalhães",
    cargo: "Advogada · Consultora Jurídica",
    credenciais: [
      "Especialista em Direito Bancário e Tributário",
      "Especialista em Direito Civil",
      "Consultoria jurídica",
    ],
    foto: "/images/equipe/thaylla-magalhaes.jpg",
    fotoAlt: "Retrato de Thaylla Magalhães, advogada e consultora jurídica",
  },
  {
    slug: "deny-williams-cury-haddad",
    nome: "Deny Williams Cury Haddad",
    cargo: "Advogado · Parecerista",
    credenciais: [
      "Parecerista e consultor",
      "Assessor jurídico há mais de 15 anos",
    ],
    foto: "/images/equipe/deny-williams-cury-haddad.jpg",
    fotoAlt: "Retrato de Deny Williams Cury Haddad, advogado parecerista",
  },
  {
    slug: "roque-cortes-pereira",
    nome: "Roque Cortes Pereira",
    cargo: "Diretor de Negócios",
    credenciais: [
      "Secretário Nacional de Comunicação Social",
      "Assessor político",
      "Professor",
      "Consultor há mais de 18 anos",
    ],
    foto: "/images/equipe/roque-cortes-pereira.jpg",
    fotoAlt: "Retrato de Roque Cortes Pereira, Diretor de Negócios",
  },
  {
    slug: "ingrid-adely",
    nome: "Ingrid Adély",
    cargo: "Jornalista · Assessoria de Imprensa",
    credenciais: [
      "Jornalista e produtora audiovisual",
      "Presidente da IAP",
      "Assessoria de imprensa",
    ],
    foto: "/images/equipe/ingrid-adely.jpg",
    fotoAlt: "Retrato de Ingrid Adély, jornalista e produtora audiovisual",
  },
  {
    slug: "walter-brito",
    nome: "Walter Brito",
    cargo: "Jornalista · Assessor de Imprensa",
    credenciais: [
      "Jornalista há 40 anos",
      "Editor-chefe em mais de seis veículos de imprensa",
      "Bacharel em Direito há mais de 10 anos",
      "Coordenador de campanhas eleitorais",
      "Professor de matemática",
    ],
    foto: "/images/equipe/walter-brito.jpg",
    fotoAlt: "Retrato de Walter Brito, jornalista e assessor de imprensa",
  },
];

export const socioFundador = equipe[0];

export function buscarMembro(slug: string): MembroEquipe | undefined {
  return equipe.find((membro) => membro.slug === slug);
}
