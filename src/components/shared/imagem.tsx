import fs from "node:fs";
import path from "node:path";

import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** 8x8 em bordô-900: usado como placeholder desfocado. */
export const BLUR_BORDO =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%278%27%3E%3Crect width=%278%27 height=%278%27 fill=%27%234A0E11%27/%3E%3C/svg%3E";

const cacheExistencia = new Map<string, boolean>();

/** Verifica em /public se o arquivo já foi fornecido pelo cliente. */
function arquivoExiste(src: string): boolean {
  if (!src.startsWith("/")) return true;
  const cacheado = cacheExistencia.get(src);
  if (cacheado !== undefined) return cacheado;

  const caminho = path.join(process.cwd(), "public", src);
  let existe = false;
  try {
    existe = fs.existsSync(caminho) && fs.statSync(caminho).isFile();
  } catch {
    existe = false;
  }
  cacheExistencia.set(src, existe);
  return existe;
}

export type TratamentoImagem = "pb" | "bordo" | "nenhum";

interface ImagemProps {
  src: string;
  /** Alt real e descritivo. String vazia apenas para imagem decorativa. */
  alt: string;
  /** Classe do contêiner. Defina aqui a proporção (ex.: aspect-[4/3]). */
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Placeholder desfocado em bordô, evita flash branco no LCP. */
  blur?: boolean;
  /** Padrão: cor original. "pb" e "bordo" só onde houver texto sobreposto. */
  tratamento?: TratamentoImagem;
  /**
   * "contain" para artes que precisam aparecer inteiras, como o brasao.
   * Nesse caso defina o fundo e o respiro pelo className do contêiner.
   */
  ajuste?: "cover" | "contain";
  /** Texto exibido no placeholder enquanto a imagem real não existe. */
  legenda?: string;
  /** Escurece a imagem para garantir contraste de texto sobreposto. */
  overlayForte?: boolean;
}

/**
 * Imagem do site. Enquanto o arquivo não existir em /public, exibe um
 * placeholder tratado no padrão visual do escritório. Nunca um retângulo
 * colorido vazio, que é justamente o defeito do site antigo.
 */
export function Imagem({
  src,
  alt,
  className,
  sizes,
  priority = false,
  blur = false,
  tratamento = "nenhum",
  ajuste = "cover",
  legenda,
  overlayForte = false,
}: ImagemProps) {
  const existe = arquivoExiste(src);

  /* Onde houver texto claro sobreposto, o placeholder precisa ser escuro:
     um placeholder claro sob texto branco repetiria o erro de contraste do
     site antigo. */
  const temaPlaceholder = overlayForte ? "escuro" : "claro";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        temaPlaceholder === "escuro" ? "bg-bordo-900" : "bg-areia-100",
        className,
      )}
    >
      {existe ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            {...(blur
              ? ({ placeholder: "blur", blurDataURL: BLUR_BORDO } as const)
              : {})}
            className={cn(
              ajuste === "contain" ? "object-contain" : "object-cover",
              tratamento !== "nenhum" && "grayscale",
            )}
          />
          {tratamento === "bordo" ? (
            <span
              aria-hidden
              className="absolute inset-0 bg-bordo-900/40 mix-blend-multiply"
            />
          ) : null}
          {overlayForte ? (
            <span
              aria-hidden
              className="absolute inset-0 bg-bordo-900/85"
            />
          ) : null}
        </>
      ) : (
        <PlaceholderImagem
          legenda={legenda ?? alt}
          caminho={src}
          tema={temaPlaceholder}
        />
      )}
    </div>
  );
}

/**
 * Placeholder tratado, no padrão visual do site.
 * No tema escuro a legenda vai para o rodapé do quadro, para não disputar
 * espaço com o texto sobreposto.
 */
export function PlaceholderImagem({
  legenda,
  caminho,
  className,
  tema = "claro",
}: {
  legenda: string;
  caminho?: string;
  className?: string;
  tema?: "claro" | "escuro";
}) {
  const escuro = tema === "escuro";

  /*
   * O tema escuro só aparece atrás de texto sobreposto, como no topo da home.
   * Ali a imagem é decorativa: enquanto o arquivo não existe, fica apenas o
   * fundo texturizado. Legenda e caminho seriam ruído por cima do conteúdo.
   */
  if (escuro) {
    return (
      <div
        aria-hidden
        className={cn(
          "textura-placeholder-escura absolute inset-0 bg-bordo-900",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "textura-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 bg-areia-100 p-6 text-center",
        className,
      )}
      role="img"
      aria-label={legenda}
    >
      <span className="flex size-11 items-center justify-center border border-dourado-700/50">
        <ImageIcon aria-hidden className="size-5 text-dourado-700" />
      </span>
      <span className="filete" />
      <span className="max-w-[34ch] text-[0.8125rem] leading-snug text-grafite-600">
        {legenda}
      </span>
      {caminho ? (
        <code className="text-[0.6875rem] tracking-wide text-grafite-600/80">
          {caminho}
        </code>
      ) : null}
    </div>
  );
}
