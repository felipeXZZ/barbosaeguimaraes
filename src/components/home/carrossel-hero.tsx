"use client";

import * as React from "react";
import Image from "next/image";

import { slidesHero } from "@/content/hero";
import { cn } from "@/lib/utils";

const INTERVALO_MS = 6000;
/** Arrasto mínimo, em px, para trocar de imagem em vez de voltar ao lugar. */
const LIMIAR_ARRASTO = 48;

/**
 * Carrossel do topo da home. Passa sozinho, no arrasto, pelos pontos ou pelas
 * setas do teclado. A troca automática para quando o visitante interage, quando
 * a aba sai de foco ou quando o sistema pede menos animação — imagem que se
 * mexe sem controle atrapalha a leitura do título ao lado.
 */
export function CarrosselHero() {
  const total = slidesHero.length;
  const [atual, setAtual] = React.useState(0);
  const [interagindo, setInteragindo] = React.useState(false);
  const [abaOculta, setAbaOculta] = React.useState(false);
  const [menosMovimento, setMenosMovimento] = React.useState(false);
  const [arrasto, setArrasto] = React.useState(0);
  const [arrastando, setArrastando] = React.useState(false);
  const inicioX = React.useRef<number | null>(null);

  React.useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setMenosMovimento(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  React.useEffect(() => {
    const aoTrocarVisibilidade = () => setAbaOculta(document.hidden);
    document.addEventListener("visibilitychange", aoTrocarVisibilidade);
    return () =>
      document.removeEventListener("visibilitychange", aoTrocarVisibilidade);
  }, []);

  const parado = interagindo || abaOculta || menosMovimento || total < 2;

  React.useEffect(() => {
    if (parado) return;
    const id = window.setInterval(
      () => setAtual((indice) => (indice + 1) % total),
      INTERVALO_MS,
    );
    return () => window.clearInterval(id);
  }, [parado, total]);

  function aoPressionar(evento: React.PointerEvent<HTMLDivElement>) {
    if (evento.pointerType === "mouse" && evento.button !== 0) return;
    inicioX.current = evento.clientX;
    evento.currentTarget.setPointerCapture(evento.pointerId);
    setArrastando(true);
    setInteragindo(true);
  }

  function aoMover(evento: React.PointerEvent<HTMLDivElement>) {
    if (inicioX.current === null) return;
    const deslocamento = evento.clientX - inicioX.current;
    /* Nas pontas o arrasto fica pesado, sinalizando que não há para onde ir. */
    const naPonta =
      (atual === 0 && deslocamento > 0) ||
      (atual === total - 1 && deslocamento < 0);
    setArrasto(naPonta ? deslocamento / 3 : deslocamento);
  }

  function aoSoltar() {
    if (inicioX.current === null) return;
    const deslocamento = arrasto;
    inicioX.current = null;
    setArrastando(false);
    setArrasto(0);
    setInteragindo(false);

    if (deslocamento <= -LIMIAR_ARRASTO && atual < total - 1) {
      setAtual(atual + 1);
    } else if (deslocamento >= LIMIAR_ARRASTO && atual > 0) {
      setAtual(atual - 1);
    }
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "ArrowRight" && atual < total - 1) {
      setAtual(atual + 1);
    } else if (evento.key === "ArrowLeft" && atual > 0) {
      setAtual(atual - 1);
    } else {
      return;
    }
    evento.preventDefault();
  }

  return (
    <div
      aria-roledescription="carrossel"
      aria-label="Imagens do escritório"
      onMouseEnter={() => setInteragindo(true)}
      onMouseLeave={() => setInteragindo(false)}
      onFocusCapture={() => setInteragindo(true)}
      onBlurCapture={() => setInteragindo(false)}
      onKeyDown={aoTeclar}
    >
      <div className="relative">
        {/*
          Moldura dourada deslocada: o mesmo filete do resto do site, em escala.
          Usa a própria proporção 4:3 em vez de inset-0 para acompanhar só a
          imagem, e não a altura dos indicadores logo abaixo.
        */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[4/3] translate-x-3 translate-y-3 border border-dourado-500/35 sm:block"
        />

        {/* touch-pan-y deixa a rolagem vertical da página passar direto. */}
        <div
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          className={cn(
            "relative aspect-[4/3] w-full touch-pan-y overflow-hidden bg-areia-50 select-none ring-1 ring-dourado-500/30 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)]",
            total > 1 && (arrastando ? "cursor-grabbing" : "cursor-grab"),
          )}
        >
          <div
            className={cn(
              "flex h-full",
              !arrastando &&
                "transition-transform duration-500 ease-out motion-reduce:transition-none",
            )}
            style={{
              transform: `translate3d(calc(${-atual * 100}% + ${arrasto}px), 0, 0)`,
            }}
          >
            {slidesHero.map((slide, indice) => (
              <div
                key={slide.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${indice + 1} de ${total}`}
                aria-hidden={indice !== atual}
                className={cn(
                  "relative h-full w-full shrink-0",
                  slide.ajuste === "contain" && "bg-areia-50 p-8 sm:p-10",
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  priority={indice === 0}
                  className={
                    slide.ajuste === "contain"
                      ? "object-contain"
                      : "object-cover"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
        Pontos logo abaixo do quadro. A linha é curta de propósito: um alvo de
        toque alto aqui abriria um vão grande entre a imagem e o texto seguinte.
      */}
      {total > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1 sm:mt-4 lg:justify-end">
          {slidesHero.map((slide, indice) => {
            const ativo = indice === atual;
            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => setAtual(indice)}
                aria-label={`Ver imagem ${indice + 1} de ${total}`}
                aria-current={ativo ? "true" : undefined}
                className="group inline-flex size-8 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado-500"
              >
                <span
                  aria-hidden
                  className={cn(
                    "block size-2 rounded-full transition-all duration-300 ease-out",
                    ativo
                      ? "scale-125 bg-dourado-500"
                      : "bg-areia-50/30 group-hover:bg-areia-50/70",
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
