import * as React from "react";

/**
 * Renderizador do subconjunto de Markdown usado nos artigos:
 * `## título`, parágrafos e listas com `- `.
 * Quando o conteúdo migrar para MDX, este componente é substituído sem
 * mudança no tipo Artigo.
 */
export function ConteudoMarkdown({ conteudo }: { conteudo: string }) {
  const blocos = conteudo.trim().split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-6">
      {blocos.map((bloco, indice) => {
        const chave = `${indice}-${bloco.slice(0, 24)}`;

        if (bloco.startsWith("## ")) {
          return (
            <h2
              key={chave}
              className="mt-4 text-[1.375rem] text-bordo-900 sm:text-[1.625rem]"
            >
              {bloco.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (bloco.startsWith("- ")) {
          const itens = bloco.split("\n").map((linha) => linha.replace(/^-\s+/, ""));
          return (
            <ul key={chave} className="flex flex-col gap-2 pl-1">
              {itens.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-grafite-600 before:mt-[0.85em] before:h-px before:w-3 before:shrink-0 before:bg-dourado-700 before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={chave} className="text-grafite-600">
            {bloco}
          </p>
        );
      })}
    </div>
  );
}
