import {
  Building2,
  Copyright,
  Gavel,
  HardHat,
  Landmark,
  Leaf,
  Receipt,
  Scale,
  Trophy,
  Users,
} from "lucide-react";

import type { Area, AreaSlug } from "@/types/content";

/**
 * Conteúdo das dez áreas de atuação.
 * Copy revisada segundo o Provimento 205/2021 do CFOAB: informativa, moderada
 * e discreta. Sem promessa de resultado, superlativo, urgência ou preço.
 */
export const areas: Area[] = [
  {
    slug: "direito-bancario-e-financeiro",
    nome: "Direito Bancário e Financeiro",
    titulo: "Direito Bancário e Financeiro",
    resumoCurto:
      "Contratos financeiros, relação banco-cliente e conformidade regulatória.",
    metaDescricao:
      "Atuação em Direito Bancário e Financeiro no centro de São Paulo: contratos, revisão de cláusulas, relação banco-cliente e conformidade regulatória. Escritório atuante desde 1999.",
    descricao: [
      "O escritório acompanha pessoas físicas e empresas em questões do sistema financeiro. Analisamos contratos de crédito, financiamento, arrendamento mercantil e cédulas de crédito, verificamos encargos e cláusulas e orientamos sobre os caminhos administrativos e judiciais disponíveis em cada situação.",
      "Também atendemos instituições e empresas que precisam adequar operações às normas do Banco Central e do Conselho Monetário Nacional, com apoio na redação de instrumentos e no acompanhamento de litígios do setor.",
    ],
    subtemas: [
      "Revisão e discussão de contratos bancários e de financiamento",
      "Cédulas de crédito, arrendamento mercantil e alienação fiduciária",
      "Relação entre instituição financeira e cliente",
      "Conformidade com a regulação do sistema financeiro",
      "Negociação e renegociação de dívidas bancárias",
      "Contencioso judicial e arbitral do setor financeiro",
    ],
    quandoProcurar: [
      "Você identificou encargos ou cláusulas que não constavam do que foi contratado.",
      "Sua empresa vai firmar uma operação de crédito relevante e precisa de análise prévia.",
      "Houve inscrição indevida em cadastro de inadimplentes ou cobrança que você considera incorreta.",
      "Uma instituição precisa adequar produtos e contratos à regulação vigente.",
    ],
    icone: Landmark,
    imagem: "/images/areas/direito-bancario-e-financeiro.jpg",
    imagemAlt:
      "Contrato bancário sobre mesa de reunião do escritório Barbosa e Guimarães",
  },
  {
    slug: "direito-civel",
    nome: "Direito Cível",
    titulo: "Direito Cível",
    resumoCurto:
      "Direitos individuais e patrimoniais, contratos e responsabilidade civil.",
    metaDescricao:
      "Advocacia cível no centro de São Paulo: contratos, responsabilidade civil, direitos patrimoniais e disputas judiciais e extrajudiciais. Escritório atuante desde 1999.",
    descricao: [
      "O Direito Cível organiza boa parte das relações do dia a dia: o que você contrata, o que possui e o que pode exigir de outra pessoa ou empresa. O escritório atua na redação e na interpretação de contratos, na cobrança de obrigações não cumpridas e na reparação de danos.",
      "Buscamos primeiro a solução extrajudicial, por acordo ou notificação, quando ela atende ao interesse do cliente. Quando o processo é necessário, conduzimos a causa em todas as instâncias.",
    ],
    subtemas: [
      "Elaboração, revisão e interpretação de contratos",
      "Descumprimento de cláusulas e rescisão contratual",
      "Responsabilidade civil e reparação de danos",
      "Questões possessórias e de propriedade",
      "Cobrança e execução de títulos",
      "Acordos e negociações extrajudiciais",
    ],
    quandoProcurar: [
      "A outra parte deixou de cumprir o que foi combinado em contrato.",
      "Você sofreu um dano material ou moral e quer entender o cabimento da reparação.",
      "Há divergência sobre a interpretação de uma cláusula relevante.",
      "Você precisa formalizar um acordo com segurança jurídica.",
    ],
    icone: Scale,
    imagem: "/images/areas/direito-civel.jpg",
    imagemAlt: "Advogado analisando contrato no escritório Barbosa e Guimarães",
  },
  {
    slug: "direito-penal",
    nome: "Direito Penal",
    titulo: "Direito Penal",
    resumoCurto:
      "Defesa técnica, análise de provas e garantia dos direitos constitucionais.",
    metaDescricao:
      "Defesa criminal no centro de São Paulo, ao lado do Fórum João Mendes: análise de provas, defesa técnica em todas as fases e assistência à vítima. Área de atuação do sócio fundador.",
    descricao: [
      "O Direito Penal é a área de formação e atuação do sócio fundador do escritório. Trabalhamos na análise dos fatos e das provas, na elaboração da defesa técnica e na garantia dos direitos assegurados pela Constituição a quem responde a investigação ou processo criminal.",
      "A atuação começa na fase de inquérito, quando é possível esclarecer fatos antes do oferecimento da denúncia, e segue por todas as instâncias. Também prestamos assistência à vítima que deseja acompanhar o processo.",
    ],
    subtemas: [
      "Acompanhamento de inquérito policial e de investigações",
      "Defesa técnica em ações penais, em todas as instâncias",
      "Análise de provas e de nulidades processuais",
      "Pedidos de liberdade e medidas cautelares",
      "Assistência de acusação em favor da vítima",
      "Execução penal e incidentes",
    ],
    quandoProcurar: [
      "Você ou alguém próximo foi intimado a prestar depoimento ou é alvo de investigação.",
      "Houve prisão em flagrante ou decretação de prisão preventiva.",
      "Você recebeu citação em ação penal e precisa apresentar defesa no prazo.",
      "Você foi vítima de um crime e quer acompanhar o processo como assistente.",
    ],
    icone: Gavel,
    imagem: "/images/areas/direito-penal.jpg",
    imagemAlt:
      "Fachada do Fórum João Mendes Júnior, no centro de São Paulo, próximo ao escritório",
    destaque: true,
  },
  {
    slug: "direito-trabalhista",
    nome: "Direito Trabalhista",
    titulo: "Direito Trabalhista",
    resumoCurto:
      "Atuação para empregadores e empregados, da consultoria ao contencioso.",
    metaDescricao:
      "Advocacia trabalhista no centro de São Paulo: contratos de trabalho, políticas internas, acordos, negociações e contencioso, para empregadores e empregados.",
    descricao: [
      "O escritório atende os dois lados da relação de trabalho, em atendimentos distintos e sem conflito de interesses. Para empresas, estruturamos contratos, políticas internas e rotinas de admissão e desligamento, reduzindo o risco de passivo. Para trabalhadores, analisamos o contrato, as verbas devidas e as condições em que o trabalho foi prestado.",
      "Conduzimos negociações, mediações e audiências, e acompanhamos a causa na Justiça do Trabalho quando o acordo não é possível.",
    ],
    subtemas: [
      "Contratos de trabalho, admissão e desligamento",
      "Verbas rescisórias, horas extras e adicionais",
      "Políticas internas e conformidade trabalhista",
      "Acordos individuais e negociação coletiva",
      "Mediação e conciliação prévia",
      "Contencioso na Justiça do Trabalho",
    ],
    quandoProcurar: [
      "Você foi desligado e tem dúvida sobre as verbas pagas na rescisão.",
      "Sua empresa quer revisar contratos e rotinas para reduzir risco trabalhista.",
      "Há reclamação trabalhista em curso e é preciso preparar a defesa.",
      "Você precisa formalizar um acordo com validade jurídica.",
    ],
    icone: HardHat,
    imagem: "/images/areas/direito-trabalhista.jpg",
    imagemAlt:
      "Reunião de orientação trabalhista no escritório Barbosa e Guimarães",
  },
  {
    slug: "direito-empresarial",
    nome: "Direito Empresarial",
    titulo: "Direito Empresarial",
    resumoCurto:
      "Estruturação societária, contratos, governança e litígios comerciais.",
    metaDescricao:
      "Direito Empresarial no centro de São Paulo: constituição de sociedades, contratos, governança corporativa, fusões e aquisições e litígios comerciais.",
    descricao: [
      "Acompanhamos a empresa da constituição ao crescimento: escolha do tipo societário, contrato ou estatuto social, acordo de sócios e definição de responsabilidades. O objetivo é que a estrutura jurídica corresponda à forma como o negócio realmente funciona.",
      "Também atuamos em operações de reorganização, aquisição e alienação de participações, na proteção de marcas e ativos intangíveis e na solução de conflitos entre sócios ou com parceiros comerciais.",
    ],
    subtemas: [
      "Constituição e reorganização de sociedades",
      "Acordo de sócios e governança corporativa",
      "Contratos comerciais e de distribuição",
      "Propriedade intelectual e registro de marcas",
      "Fusões, aquisições e alienação de participações",
      "Litígios societários e comerciais",
    ],
    quandoProcurar: [
      "Você vai abrir uma empresa ou trazer um novo sócio para a sociedade.",
      "Existe conflito entre sócios sobre gestão, retirada ou divisão de resultados.",
      "A empresa vai negociar a compra ou a venda de participação societária.",
      "Um contrato comercial relevante precisa de análise antes da assinatura.",
    ],
    icone: Building2,
    imagem: "/images/areas/direito-empresarial.jpg",
    imagemAlt:
      "Assinatura de contrato societário no escritório Barbosa e Guimarães",
  },
  {
    slug: "direito-ambiental",
    nome: "Direito Ambiental",
    titulo: "Direito Ambiental",
    resumoCurto:
      "Licenciamento, conformidade ambiental e contencioso especializado.",
    metaDescricao:
      "Direito Ambiental no centro de São Paulo: licenciamento, adequação à legislação, autos de infração, termos de ajustamento de conduta e contencioso ambiental.",
    descricao: [
      "Orientamos empresas e empreendedores nos processos de licenciamento ambiental, no cumprimento das condicionantes e na adequação das atividades às normas federais, estaduais e municipais aplicáveis.",
      "Na esfera contenciosa, atuamos em autos de infração, processos administrativos, ações civis públicas e na negociação de termos de ajustamento de conduta, sempre a partir da análise técnica do caso concreto.",
    ],
    subtemas: [
      "Licenciamento ambiental e cumprimento de condicionantes",
      "Adequação à legislação ambiental aplicável",
      "Defesa em autos de infração e processos administrativos",
      "Termos de ajustamento de conduta",
      "Ações civis públicas e responsabilidade ambiental",
      "Consultoria em projetos e uso do solo",
    ],
    quandoProcurar: [
      "Seu empreendimento precisa obter ou renovar licença ambiental.",
      "Você recebeu auto de infração ou notificação de órgão ambiental.",
      "Há proposta de termo de ajustamento de conduta a ser negociada.",
      "Um projeto novo exige avaliação prévia de exigências ambientais.",
    ],
    icone: Leaf,
    imagem: "/images/areas/direito-ambiental.jpg",
    imagemAlt:
      "Área de vegetação preservada em empreendimento sujeito a licenciamento ambiental",
  },
  {
    slug: "direito-desportivo",
    nome: "Direito Desportivo",
    titulo: "Direito Desportivo",
    resumoCurto: "Contratos de atletas, direitos de imagem e justiça desportiva.",
    metaDescricao:
      "Direito Desportivo em São Paulo: contratos de atletas, transferências, patrocínio, direitos de imagem, doping e justiça desportiva.",
    descricao: [
      "Atendemos atletas, clubes, federações e patrocinadores nas relações próprias do esporte, que combinam regras estatais e regulamentos das entidades de administração do desporto.",
      "A atuação inclui a redação e a revisão de contratos, o acompanhamento de transferências e a defesa perante os tribunais de justiça desportiva, inclusive em procedimentos relativos a controle de dopagem.",
    ],
    subtemas: [
      "Contratos de trabalho e de imagem de atletas",
      "Transferências nacionais e internacionais",
      "Contratos de patrocínio e licenciamento",
      "Procedimentos de controle de dopagem",
      "Responsabilidade civil em eventos esportivos",
      "Defesa perante a justiça desportiva",
    ],
    quandoProcurar: [
      "Um atleta vai assinar contrato com clube ou patrocinador.",
      "Há procedimento em curso na justiça desportiva.",
      "Uma transferência precisa ser formalizada dentro dos regulamentos aplicáveis.",
      "Um evento esportivo exige análise de responsabilidade e seguros.",
    ],
    icone: Trophy,
    imagem: "/images/areas/direito-desportivo.jpg",
    imagemAlt: "Contrato de atleta profissional sendo analisado no escritório",
  },
  {
    slug: "direito-autoral",
    nome: "Direito Autoral",
    titulo: "Direito Autoral",
    resumoCurto:
      "Direitos de autor e conexos, uso de obras e direitos dos sucessores.",
    metaDescricao:
      "Direito Autoral em São Paulo: direitos patrimoniais e morais de autor, direitos conexos, licenciamento de obras, prazos prescricionais e direitos dos sucessores.",
    descricao: [
      "Orientamos autores, intérpretes, editoras, produtoras e sucessores sobre a titularidade das obras, o alcance dos direitos patrimoniais e morais e as formas de licenciamento e cessão.",
      "Atuamos também na apuração de uso não autorizado, no cálculo do período ainda exigível diante dos prazos prescricionais e na regularização de direitos transmitidos por herança.",
    ],
    subtemas: [
      "Titularidade de obras e direitos conexos",
      "Contratos de cessão e de licenciamento",
      "Uso não autorizado e medidas cabíveis",
      "Direitos patrimoniais e direitos morais do autor",
      "Prazos prescricionais aplicáveis",
      "Direitos dos sucessores do autor",
    ],
    quandoProcurar: [
      "Sua obra foi publicada ou reproduzida sem autorização.",
      "Você vai ceder ou licenciar direitos sobre uma criação.",
      "Há dúvida sobre a titularidade de obra feita em equipe ou sob encomenda.",
      "Você herdou direitos autorais e precisa regularizar a titularidade.",
    ],
    icone: Copyright,
    imagem: "/images/areas/direito-autoral.jpg",
    imagemAlt: "Registro de obra autoral e contrato de licenciamento sobre a mesa",
  },
  {
    slug: "direito-sindical",
    nome: "Direito Sindical",
    titulo: "Direito Sindical",
    resumoCurto:
      "Negociação coletiva, representação sindical e conflitos coletivos.",
    metaDescricao:
      "Direito Sindical em São Paulo: negociação coletiva, acordos e convenções, greves, demissões coletivas e representação de sindicatos e trabalhadores.",
    descricao: [
      "O escritório assessora entidades sindicais e trabalhadores na negociação coletiva, na redação de acordos e convenções e na condução das assembleias e procedimentos exigidos pela legislação.",
      "Atuamos ainda em conflitos coletivos, incluindo movimentos paredistas, dispensas em massa e situações de discriminação no ambiente de trabalho, perante a Justiça do Trabalho e o Ministério Público do Trabalho.",
    ],
    subtemas: [
      "Negociação coletiva e mediação de conflitos",
      "Acordos e convenções coletivas de trabalho",
      "Movimentos paredistas e dissídios coletivos",
      "Dispensas coletivas e seus requisitos",
      "Discriminação e assédio no ambiente de trabalho",
      "Representação de entidades sindicais",
    ],
    quandoProcurar: [
      "A categoria vai iniciar a campanha salarial e precisa de assessoria na negociação.",
      "Há anúncio de dispensa coletiva sem negociação prévia.",
      "O sindicato precisa revisar cláusulas de convenção antes do registro.",
      "Existe conflito sobre representatividade ou contribuição sindical.",
    ],
    icone: Users,
    imagem: "/images/areas/direito-sindical.jpg",
    imagemAlt: "Assembleia de trabalhadores durante negociação coletiva",
  },
  {
    slug: "direito-tributario",
    nome: "Direito Tributário",
    titulo: "Direito Tributário",
    resumoCurto: "Planejamento tributário, conformidade fiscal e contencioso.",
    metaDescricao:
      "Direito Tributário no centro de São Paulo: planejamento tributário, conformidade fiscal, defesa em autos de infração e contencioso administrativo e judicial.",
    descricao: [
      "Analisamos a carga tributária incidente sobre a atividade do cliente e as alternativas legítimas de organização do negócio, considerando regime de apuração, natureza das operações e obrigações acessórias.",
      "Na esfera contenciosa, atuamos na defesa em autos de infração, em processos administrativos fiscais e em ações judiciais que discutem a exigência de tributos, além de pedidos de restituição e compensação.",
    ],
    subtemas: [
      "Planejamento tributário e escolha de regime de apuração",
      "Conformidade fiscal e obrigações acessórias",
      "Defesa em autos de infração e processo administrativo fiscal",
      "Contencioso judicial tributário",
      "Restituição e compensação de tributos",
      "Parcelamentos e regularização fiscal",
    ],
    quandoProcurar: [
      "Sua empresa recebeu auto de infração ou notificação do fisco.",
      "Há dúvida sobre a incidência de um tributo em determinada operação.",
      "O regime de apuração atual pode não ser o mais adequado à atividade.",
      "Existem créditos tributários pagos a maior a serem recuperados.",
    ],
    icone: Receipt,
    imagem: "/images/areas/direito-tributario.jpg",
    imagemAlt: "Documentos fiscais analisados por advogado tributarista",
  },
];

export const totalAreas = areas.length;

export function buscarArea(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug);
}

export const slugsDasAreas: AreaSlug[] = areas.map((area) => area.slug);
