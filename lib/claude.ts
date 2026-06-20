export async function generarHistoriaAlebrije(
  nombre: string,
  animales: string[],
  artesano: string,
  localidad: string
): Promise<ReadableStream> {
  const prompt = `Eres un narrador de arte popular mexicano. Crea una historia poética y breve (máximo 120 palabras) sobre el siguiente alebrije oaxaqueño.

Alebrije: "${nombre}"
Animales que lo componen: ${animales.join(" y ")}
Creado por: ${artesano}, de ${localidad}

La historia debe:
- Sonar como una leyenda zapoteca o mixteca
- Explicar por qué estos animales se unieron en una sola criatura
- Mencionar qué poderes o significados tiene esta fusión
- Usar lenguaje poético pero accesible
- Terminar con algo que invite al visitante a llevarse la pieza

Responde solo con la historia, sin título ni aclaraciones.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  return response.body!;
}
