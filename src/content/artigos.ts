import type { Artigo } from "@/types/content";

/**
 * Artigos migrados do site anterior.
 *
 * ATENÇÃO: do site antigo foram preservados os títulos e as datas de
 * publicação. Os textos abaixo foram redigidos para esta versão do site,
 * em linguagem informativa e compatível com o Provimento 205/2021, e
 * PRECISAM DE REVISÃO E APROVAÇÃO DO ESCRITÓRIO antes da publicação.
 *
 * O campo `content` usa Markdown simples (## título, parágrafos e listas),
 * o que permite migrar para MDX sem alterar o tipo.
 */
export const artigos: Artigo[] = [
  {
    slug: "os-advogados-e-o-imposto-de-renda",
    title: "Os advogados e o IR",
    excerpt:
      "Como os honorários advocatícios são tributados, o que muda entre autônomo e sociedade e quais cuidados a declaração anual exige.",
    date: "2023-07-12",
    readingTime: 5,
    author: "Barbosa e Guimarães Advogados Associados",
    category: "Tributário",
    coverImage: "/images/artigos/os-advogados-e-o-imposto-de-renda.jpg",
    coverImageAlt:
      "Documentos de declaração de imposto de renda sobre mesa de trabalho",
    content: `A tributação da renda do advogado costuma gerar dúvidas porque a profissão admite formas distintas de exercício, e cada uma delas tem regras próprias de apuração. Entender essa diferença é o primeiro passo para organizar a vida fiscal.

## Autônomo e sociedade: apurações diferentes

O advogado que atua como pessoa física recebe honorários sujeitos à tabela progressiva do imposto de renda. Quando o pagamento vem de outra pessoa física, cabe o recolhimento mensal obrigatório por meio do carnê-leão; quando vem de pessoa jurídica, há retenção na fonte.

Já a sociedade de advogados apura o imposto conforme o regime adotado. A escolha entre os regimes disponíveis depende do faturamento, da folha de pagamento e da estrutura de despesas, e merece análise caso a caso, sempre antes do início do ano-calendário.

## Despesas dedutíveis exigem prova

O profissional autônomo pode deduzir despesas necessárias à percepção da receita e à manutenção da fonte produtora, desde que escrituradas em livro-caixa e comprovadas por documentação idônea. Entram nessa categoria, entre outras:

- aluguel e condomínio do escritório;
- remuneração de empregados e respectivos encargos;
- contribuições a entidades de classe, incluindo a anuidade da OAB;
- despesas de custeio indispensáveis à atividade.

Despesas pessoais não se comunicam com a atividade profissional, ainda que pagas com recursos dela.

## Honorários recebidos acumuladamente

Valores recebidos de uma só vez, mas referentes a períodos anteriores, seguem regra específica de tributação, que considera a quantidade de meses a que se refere o pagamento. O tratamento correto evita recolhimento a maior.

## Antes da declaração anual

A declaração deve refletir o que já foi apurado ao longo do ano. Divergências entre os informes de rendimento, o livro-caixa e os valores declarados são a principal causa de retenção em malha fiscal. Reunir a documentação ao longo do exercício, e não em abril, reduz esse risco.

Este texto tem finalidade informativa e não substitui a análise de um caso concreto.`,
  },
  {
    slug: "dicas-para-entrevista-na-area-juridica",
    title: "Dicas para entrevista na área jurídica",
    excerpt:
      "O que costuma ser avaliado em uma entrevista para escritório de advocacia e como se preparar para ela de forma consistente.",
    date: "2023-07-12",
    readingTime: 4,
    author: "Barbosa e Guimarães Advogados Associados",
    category: "Carreira",
    coverImage: "/images/artigos/dicas-para-entrevista-na-area-juridica.jpg",
    coverImageAlt:
      "Entrevista profissional em sala de reunião de escritório de advocacia",
    content: `A entrevista em um escritório de advocacia avalia menos o que o candidato memorizou e mais como ele raciocina, se comunica e lida com o que não sabe. Alguns cuidados simples aumentam bastante o aproveitamento da conversa.

## Conheça a atuação do escritório

Antes da entrevista, identifique as áreas em que o escritório atua e o perfil das causas que conduz. Uma resposta que conecta a sua trajetória ao trabalho concreto do escritório é sempre mais forte do que uma declaração genérica de interesse.

## Prepare-se para falar do que você fez

Peças que você redigiu, audiências que acompanhou, pesquisas que conduziu: escolha dois ou três exemplos e saiba explicá-los com clareza, incluindo a dificuldade encontrada e a solução adotada. Evite detalhes que exponham informações sigilosas de clientes anteriores.

## Não invente o que não sabe

É comum que se pergunte sobre um tema fora da sua especialidade. Dizer que não domina o assunto e descrever como faria a pesquisa demonstra honestidade intelectual e método — dois atributos centrais na advocacia. Respostas improvisadas produzem o efeito contrário.

## Cuide da comunicação escrita

Muitos processos seletivos incluem uma prova prática. Clareza, ordem e correção gramatical pesam mais do que erudição. Texto longo não é sinônimo de texto bem fundamentado.

## Leve as suas perguntas

Perguntar sobre rotina de trabalho, formato de supervisão e oportunidades de aprendizado demonstra interesse real. A entrevista é também o momento de avaliar se o ambiente corresponde ao que você procura.`,
  },
  {
    slug: "decisoes-do-supremo-tribunal-federal-e-a-advocacia",
    title: "Decisões do Supremo Tribunal Federal em prejuízo da advocacia",
    excerpt:
      "Reflexão sobre julgamentos que afetam prerrogativas profissionais e por que a defesa dessas prerrogativas interessa a toda a sociedade.",
    date: "2023-07-12",
    readingTime: 5,
    author: "Barbosa e Guimarães Advogados Associados",
    category: "Advocacia",
    coverImage:
      "/images/artigos/decisoes-do-supremo-tribunal-federal-e-a-advocacia.jpg",
    coverImageAlt: "Fachada de tribunal superior brasileiro",
    content: `Decisões dos tribunais superiores sobre o exercício da advocacia costumam ser lidas como assunto corporativo. Não são. Prerrogativa profissional não é privilégio do advogado: é condição para que o cidadão tenha defesa efetiva.

## O que está em jogo

Quando se restringe o acesso do advogado aos autos, a comunicação reservada com o cliente ou a inviolabilidade do escritório e dos arquivos profissionais, quem perde a proteção é a pessoa defendida. O sigilo pertence ao cliente; o advogado apenas o guarda.

## Prerrogativa e ampla defesa

A Constituição declara o advogado indispensável à administração da justiça. Esse enunciado só produz efeito prático se as condições materiais do trabalho forem preservadas: prazo para conhecer a acusação, acesso integral às provas já documentadas e liberdade para sustentar a tese sem receio de retaliação.

## O papel das entidades de classe

Cabe às entidades da advocacia acompanhar esses julgamentos, apresentar-se como amicus curiae quando cabível e levar aos tribunais os efeitos concretos que determinadas interpretações produzem no cotidiano forense. O debate técnico, feito nos autos, é o caminho legítimo.

## Uma pauta permanente

A defesa das prerrogativas não se resolve em uma decisão isolada. Ela depende de acompanhamento contínuo da jurisprudência e de atuação institucional constante, tema que o escritório acompanha desde a sua fundação.

Este texto expressa reflexão institucional sobre matéria de interesse público e não se refere a nenhum caso concreto.`,
  },
  {
    slug: "poderes",
    title: "Poderes",
    excerpt:
      "A separação entre Legislativo, Executivo e Judiciário e o significado prático da harmonia entre eles para a segurança jurídica.",
    date: "2023-07-10",
    readingTime: 4,
    author: "Barbosa e Guimarães Advogados Associados",
    category: "Direito Constitucional",
    coverImage: "/images/artigos/poderes.jpg",
    coverImageAlt:
      "Detalhe arquitetônico de edifício público brasileiro em preto e branco",
    content: `A Constituição estabelece que são Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário. A fórmula é conhecida, mas o seu alcance prático merece atenção.

## Independência não é isolamento

Independência significa que nenhum dos Poderes se subordina aos demais no exercício de suas funções típicas. Não significa que cada um atue sem controle. O sistema constitucional prevê mecanismos recíprocos de contenção, do veto presidencial ao controle de constitucionalidade.

## Harmonia é método de trabalho

A harmonia a que a Constituição se refere não é ausência de divergência, mas o compromisso de resolver a divergência pelos canais institucionais previstos. O conflito entre órgãos é normal em democracias; anômala é a tentativa de resolvê-lo fora das regras.

## O efeito sobre quem contrata e litiga

Para empresas e cidadãos, a estabilidade dessa arquitetura tem efeito direto: define a previsibilidade das normas, o tempo dos processos e a confiança em contratos de longo prazo. Segurança jurídica é, antes de tudo, a expectativa razoável de que a regra aplicada hoje continuará valendo amanhã.

## O lugar da advocacia

Ao atuar em cada processo, a advocacia participa do funcionamento desse arranjo. É pela via do contraditório que teses são testadas e que decisões ganham fundamentação. Esse trabalho, feito caso a caso, sustenta o sistema no plano concreto.`,
  },
  {
    slug: "o-desprestigio-da-advocacia-e-dos-advogados",
    title: "O desprestígio da advocacia e dos advogados",
    excerpt:
      "Sobre a percepção pública da profissão, as causas dessa erosão e o que a própria advocacia pode fazer a respeito.",
    date: "2023-07-10",
    readingTime: 5,
    author: "Barbosa e Guimarães Advogados Associados",
    category: "Advocacia",
    coverImage: "/images/artigos/o-desprestigio-da-advocacia-e-dos-advogados.jpg",
    coverImageAlt: "Livros e autos processuais em estante de escritório",
    content: `Há um incômodo recorrente entre advogados: o sentimento de que a profissão perdeu prestígio. O diagnóstico merece exame sereno, porque parte das causas é externa e parte é interna.

## Causas externas

O aumento expressivo do número de bacharéis, a massificação do contencioso e a percepção de lentidão do Judiciário afetam a imagem de toda a cadeia. Some-se a isso a confusão frequente, no debate público, entre defender um acusado e concordar com o que lhe é imputado.

## Causas internas

Também pesam práticas que a própria advocacia precisa enfrentar: promessas de resultado, mercantilização do serviço, captação irregular de clientela e uso da profissão como instrumento de exposição pessoal. Cada uma dessas condutas transfere para o conjunto o custo reputacional.

## O que sustenta a confiança

A confiança se reconstrói por meio de elementos verificáveis:

- clareza sobre o que pode e o que não pode ser feito em cada caso;
- informação honesta sobre prazos e riscos, sem garantia de desfecho;
- respeito ao sigilo profissional, previsto no artigo 34 do Estatuto da OAB;
- técnica demonstrada no trabalho, e não anunciada em publicidade.

## Uma responsabilidade compartilhada

A valorização da advocacia depende de atuação institucional das entidades de classe e da conduta individual de cada profissional. As duas dimensões são inseparáveis: normas sem prática cotidiana não produzem efeito, e prática sem norma não se sustenta ao longo do tempo.`,
  },
];

export const artigosOrdenados = [...artigos].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function buscarArtigo(slug: string): Artigo | undefined {
  return artigos.find((artigo) => artigo.slug === slug);
}

export function artigosRecentes(quantidade = 3): Artigo[] {
  return artigosOrdenados.slice(0, quantidade);
}
