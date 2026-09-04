/**
 * Injeta um bloco JSON-LD. O conteúdo é gerado pelo próprio código
 * (nunca vem do usuário), e as tags de fechamento são escapadas.
 */
export function DadosEstruturados({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
