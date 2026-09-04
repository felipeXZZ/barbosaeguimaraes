"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { enviarContato } from "@/app/actions/contato";
import { registrarEvento } from "@/lib/analytics";
import {
  areasParaSelect,
  esquemaContato,
  type DadosContato,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** Aplica a máscara (11) 91234-5678 conforme o usuário digita. */
function mascararTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos.replace(/^(\d{0,2})/, "($1");
  if (digitos.length <= 6)
    return digitos.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (digitos.length <= 10)
    return digitos.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digitos.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

type Estado = "inativo" | "enviando" | "sucesso" | "erro";

export function FormularioContato({
  /** "curto" omite a área de interesse: usado no bloco final da home. */
  variante = "completo",
  tema = "claro",
  areaPreSelecionada,
  origem,
}: {
  variante?: "completo" | "curto";
  /** "claro" = sobre fundo areia. "escuro" = sobre fundo bordô. */
  tema?: "claro" | "escuro";
  areaPreSelecionada?: string;
  origem: string;
}) {
  const [estado, setEstado] = React.useState<Estado>("inativo");
  const [erroServidor, setErroServidor] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DadosContato>({
    resolver: zodResolver(esquemaContato),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      area: areaPreSelecionada ?? "",
      mensagem: "",
      site: "",
    },
  });

  const escuro = tema === "escuro";

  const classeRotulo = cn(
    "block text-[0.875rem] font-medium",
    escuro ? "text-areia-50" : "text-grafite-900",
  );

  const classeCampo = cn(
    "mt-2 block h-12 w-full rounded-[2px] border px-3 text-[0.9375rem] transition-colors outline-none",
    escuro
      ? "border-areia-50/40 bg-bordo-800 text-areia-50 placeholder:text-areia-200/70 focus:border-dourado-400"
      : "border-grafite-400 bg-white text-grafite-900 placeholder:text-grafite-600/70 focus:border-bordo-700",
  );

  const classeErro = cn(
    "mt-1.5 flex items-start gap-1.5 text-[0.8125rem]",
    escuro ? "text-dourado-400" : "text-erro",
  );

  async function aoEnviar(dados: DadosContato) {
    setEstado("enviando");
    setErroServidor("");

    const resultado = await enviarContato(dados);

    if (resultado.status === "ok") {
      setEstado("sucesso");
      registrarEvento("envio_formulario", { origem, area: dados.area });
      reset();
      return;
    }

    setEstado("erro");
    setErroServidor(resultado.mensagem);
    registrarEvento("erro_formulario", { origem });
  }

  if (estado === "sucesso") {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-start gap-4 border p-6",
          escuro
            ? "border-dourado-500/50 bg-bordo-800 text-areia-50"
            : "border-areia-200 bg-areia-100 text-grafite-900",
        )}
      >
        <CheckCircle2
          aria-hidden
          className={cn("size-6", escuro ? "text-dourado-400" : "text-sucesso")}
        />
        <h3 className="font-serif text-[1.25rem]">Mensagem recebida</h3>
        <p className={escuro ? "text-areia-200" : "text-grafite-600"}>
          O escritório retornará pelo canal informado. Se preferir um retorno
          mais rápido, fale pelo WhatsApp ou pelo telefone.
        </p>
        <button
          type="button"
          onClick={() => setEstado("inativo")}
          className={cn(
            "text-[0.875rem] font-medium underline underline-offset-4",
            escuro ? "text-dourado-400" : "text-bordo-700",
          )}
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} noValidate className="flex flex-col gap-5">
      {/* Honeypot: fora da ordem de tabulação e invisível a leitores de tela */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`site-${origem}`}>Não preencha este campo</label>
        <input
          id={`site-${origem}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("site")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`nome-${origem}`} className={classeRotulo}>
            Nome completo
          </label>
          <input
            id={`nome-${origem}`}
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? `erro-nome-${origem}` : undefined}
            className={classeCampo}
            {...register("nome")}
          />
          {errors.nome ? (
            <p id={`erro-nome-${origem}`} className={classeErro}>
              <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {errors.nome.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`telefone-${origem}`} className={classeRotulo}>
            Telefone
          </label>
          <input
            id={`telefone-${origem}`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 91234-5678"
            aria-invalid={Boolean(errors.telefone)}
            aria-describedby={
              errors.telefone ? `erro-telefone-${origem}` : undefined
            }
            className={classeCampo}
            {...register("telefone", {
              onChange: (evento) => {
                setValue("telefone", mascararTelefone(evento.target.value));
              },
            })}
          />
          {errors.telefone ? (
            <p id={`erro-telefone-${origem}`} className={classeErro}>
              <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {errors.telefone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={`email-${origem}`} className={classeRotulo}>
          E-mail
        </label>
        <input
          id={`email-${origem}`}
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `erro-email-${origem}` : undefined}
          className={classeCampo}
          {...register("email")}
        />
        {errors.email ? (
          <p id={`erro-email-${origem}`} className={classeErro}>
            <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {variante === "completo" ? (
        <div>
          <label htmlFor={`area-${origem}`} className={classeRotulo}>
            Área de interesse
          </label>
          <select
            id={`area-${origem}`}
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? `erro-area-${origem}` : undefined}
            className={cn(classeCampo, "appearance-none bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%237A6212' stroke-width='1.5'/%3E%3C/svg%3E\")",
              backgroundPosition: "right 0.875rem center",
            }}
            {...register("area")}
          >
            <option value="">Selecione a área</option>
            {areasParaSelect.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
          {errors.area ? (
            <p id={`erro-area-${origem}`} className={classeErro}>
              <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {errors.area.message}
            </p>
          ) : null}
        </div>
      ) : (
        <input type="hidden" value={areaPreSelecionada ?? "outra"} {...register("area")} />
      )}

      <div>
        <label htmlFor={`mensagem-${origem}`} className={classeRotulo}>
          Como podemos ajudar
        </label>
        <textarea
          id={`mensagem-${origem}`}
          rows={variante === "curto" ? 4 : 6}
          placeholder="Descreva brevemente a situação. Não inclua documentos ou dados sigilosos neste primeiro contato."
          aria-invalid={Boolean(errors.mensagem)}
          aria-describedby={
            errors.mensagem ? `erro-mensagem-${origem}` : undefined
          }
          className={cn(classeCampo, "h-auto py-3 leading-relaxed")}
          {...register("mensagem")}
        />
        {errors.mensagem ? (
          <p id={`erro-mensagem-${origem}`} className={classeErro}>
            <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {errors.mensagem.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`consentimento-${origem}`}
            type="checkbox"
            className={cn(
              "mt-1 size-5 shrink-0 rounded-[2px] border",
              escuro
                ? "border-areia-50/50 accent-dourado-500"
                : "border-grafite-400 accent-[#8C1A1F]",
            )}
            aria-invalid={Boolean(errors.consentimento)}
            aria-describedby={
              errors.consentimento ? `erro-consentimento-${origem}` : undefined
            }
            {...register("consentimento")}
          />
          <label
            htmlFor={`consentimento-${origem}`}
            className={cn(
              "text-[0.875rem] leading-relaxed",
              escuro ? "text-areia-200" : "text-grafite-600",
            )}
          >
            Autorizo o escritório a tratar os dados informados para responder a
            este contato, nos termos da{" "}
            <Link
              href="/politica-de-privacidade"
              className={cn(
                "underline underline-offset-4",
                escuro ? "text-areia-50" : "text-bordo-700",
              )}
            >
              política de privacidade
            </Link>
            .
          </label>
        </div>
        {errors.consentimento ? (
          <p id={`erro-consentimento-${origem}`} className={classeErro}>
            <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {errors.consentimento.message}
          </p>
        ) : null}
      </div>

      {estado === "erro" && erroServidor ? (
        <p
          role="alert"
          className={cn(
            "flex items-start gap-2 border p-4 text-[0.875rem]",
            escuro
              ? "border-dourado-500/50 bg-bordo-800 text-areia-50"
              : "border-erro/40 bg-white text-erro",
          )}
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {erroServidor}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-[0.9375rem] font-medium transition-colors disabled:opacity-70",
          escuro
            ? "bg-areia-50 text-bordo-900 hover:bg-white"
            : "bg-bordo-700 text-white hover:bg-bordo-600",
        )}
      >
        {estado === "enviando" ? (
          <>
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar mensagem"
        )}
      </button>
    </form>
  );
}
