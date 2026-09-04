/** Primeiro elemento focável da página: pula direto para o conteúdo. */
export function LinkPularConteudo() {
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:inline-flex focus:h-11 focus:items-center focus:rounded-[2px] focus:bg-areia-50 focus:px-4 focus:text-[0.9375rem] focus:font-medium focus:text-bordo-900 focus:outline-2 focus:outline-offset-2 focus:outline-dourado-700"
    >
      Pular para o conteúdo
    </a>
  );
}
