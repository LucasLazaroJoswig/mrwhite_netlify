
'use server';
/**
 * @fileOverview Ranks player clues in the Mr. White game.
 *
 * - rankClues - A function that calls the Genkit flow to rank clues.
 * - RankCluesInput - The input type for the rankClues flow.
 * - RankCluesOutput - The return type for the rankClues flow.
 * - ClueRankingItem - Type for an individual ranked clue item.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas are internal to this file and not exported directly
const PlayerClueInputSchema = z.object({
  name: z.string().describe('Nombre del jugador.'),
  role: z.enum(['civilian', 'mrwhite', 'payaso']).describe('Rol del jugador en la partida. Este es el rol REAL y en el que debes basar tu evaluación.'),
  clue: z.string().describe('Palabra pista dada por el jugador.'),
});

const RankCluesInputSchema = z.object({
  civilianWord: z.string().describe('La palabra secreta para los civiles y el payaso.'),
  players: z.array(PlayerClueInputSchema).describe('Lista de jugadores con sus roles REALES y pistas.'),
});
export type RankCluesInput = z.infer<typeof RankCluesInputSchema>;

const ClueRankingItemSchema = z.object({
  playerName: z.string().describe('Nombre del jugador.'),
  clue: z.string().describe('La pista dada por el jugador.'),
  role: z.enum(['civilian', 'mrwhite', 'payaso']).describe('Rol REAL del jugador durante la partida.'),
  rank: z.number().int().min(1).describe('Ranking numérico de la pista (1 es la mejor).'),
  justification: z.string().describe('Breve justificación para el ranking, explicando por qué fue buena o mala basada en las reglas del juego, el rol REAL del jugador, y la inteligencia/creatividad de la pista.'),
});
export type ClueRankingItem = z.infer<typeof ClueRankingItemSchema>;

const RankCluesOutputSchema = z.object({
  rankedClues: z.array(ClueRankingItemSchema).describe('Una lista de pistas, rankeadas de mejor a peor, con justificaciones.'),
});
export type RankCluesOutput = z.infer<typeof RankCluesOutputSchema>;

export async function rankClues(input: RankCluesInput): Promise<RankCluesOutput> {
  return rankCluesFlow(input);
}

const rankCluesSystemPrompt = `
Eres un analista experto del juego de deducción social "Mr. White".
Tu tarea es rankear la "pista" (palabra clave) dada por cada jugador. La pista es una ÚNICA palabra.
Se te proporcionará el rol REAL de cada jugador. Tu evaluación DEBE basarse estrictamente en este rol y en cómo su pista ayuda a cumplir los objetivos de ESE rol. NO intentes adivinar o cambiar el rol del jugador.

Reglas del Juego y Objetivos de Rol (MUY IMPORTANTE para tu evaluación):
- Civiles y el Payaso conocen la "Palabra Civil" secreta.
  - Objetivo del Civil: Dar una pista relacionada con la "Palabra Civil". Buenas pistas de civiles son entendibles por otros Civiles pero NO demasiado obvias para Mr. White. Se valora la sutileza, la inteligencia y la creatividad. Una pista que parezca simple pero tenga una conexión profunda o ingeniosa es excelente. Ejemplo: para la palabra "Rana", la pista "Tortellini" podría ser excelente si se justifica que "Rana" es una marca conocida de pasta fresca (tortellini). Esto requiere pensar más allá.
- Mr. White NO conoce la "Palabra Civil".
  - Objetivo de Mr. White: Mezclarse y adivinar la palabra escuchando las pistas. Debe dar una pista intentando hacer parecer que conoce la palabra. Una buena pista de Mr. White podría ser general, astuta, o aprovechar inteligentemente otras pistas ya dadas. Una mala pista lo expone. Si da una pista muy buena para la palabra civil (aunque no la conozca), valora positivamente su audacia y capacidad de deducción.
- El Payaso conoce la "Palabra Civil".
  - Objetivo del Payaso: Ser votado como si fuera Mr. White. Si lo votan, el Payaso gana. Una buena pista del Payaso es aquella que lo hace parecer sospechoso, como si no conociera la palabra, o incluso una pista que sea deliberadamente "mala" o extraña para atraer votos. No la juzgues con los mismos criterios que un Civil. Una pista "desfasada" o muy obvia puede ser excelente para el Payaso si logra su objetivo.

Criterios de Ranking (Debes aplicar esto rigurosamente, basándote en el rol REAL asignado):
Proporciona un ranking numérico (1 siendo la mejor pista).
Basa tu ranking en:
1.  Para Civiles: Qué tan bien la pista ayuda a otros Civiles a identificarse entre ellos y la "Palabra Civil" SIN ser demasiado obvia para Mr. White. Considera juegos de palabras, dobles sentidos o conexiones no literales que requieran "pensar más allá". Explica estas conexiones en tu justificación si las encuentras. Valora la profundidad.
2.  Para Mr. White: Qué tan bien su pista le ayuda a mezclarse o parecer que conoce la "Palabra Civil". ¿Es una pista general creíble? ¿Se basa inteligentemente en pistas anteriores? ¿O es demasiado vaga o arriesgada?
3.  Para el Payaso: Qué tan bien su pista le ayuda a lograr su objetivo de ser votado. Una pista que lo haga parecer culpable o despistado es buena para el Payaso. No es malo que el payaso sea "evidente" si eso cumple su objetivo.
4.  Inteligencia general, creatividad y adhesión al objetivo de su rol asignado. Una pista no es inherentemente buena o mala; depende del rol y su estrategia. Una pista profundamente conectada pero no obvia es mejor que una pista simple y directa. Valora la capacidad de "pensar más allá".

IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido que coincida estrictamente con el esquema de salida proporcionado. No incluyas ningún texto explicativo antes o después del JSON.
El objeto JSON DEBE contener una clave llamada "rankedClues". El valor de "rankedClues" DEBE ser un array de objetos, donde cada objeto representa a un jugador y su pista rankeada.
Cada objeto en el array "rankedClues" debe tener los campos: "playerName" (string), "clue" (string), "role" (enum: 'civilian', 'mrwhite', 'payaso' - este es el rol real que te pasamos), "rank" (integer), "justification" (string).
DEBES rankear a todos los jugadores proporcionados. Si una pista es particularmente mala o buena PARA EL ROL DEL JUGADOR, el ranking debería reflejar esto y la justificación debería explicar por qué. El array "rankedClues" NUNCA debe ser nulo; debe ser un array de objetos. Si, después de un esfuerzo genuino, consideras que es imposible rankear (por ejemplo, todas las pistas están vacías o no hay jugadores), SOLO ENTONCES puedes devolver un array vacío para "rankedClues", pero esto debe ser un último recurso. NUNCA omitas la clave "rankedClues" ni devuelvas null o undefined para ella.
Ordena el array "rankedClues" por tu ranking (la mejor pista primero, es decir, rank 1 arriba).
Considera el contexto de todas las pistas dadas al rankear una pista individual.
Analiza cada pista individualmente en el contexto del rol REAL del jugador. Valora el "pensar más allá" y los juegos de palabras ingeniosos.
`;

const rankCluesPromptObject = ai.definePrompt({
  name: 'rankCluesPrompt',
  input: { schema: RankCluesInputSchema },
  output: { schema: RankCluesOutputSchema },
  model: 'googleai/gemini-2.0-flash', // o 'googleai/gemini-1.5-flash-latest'
  config: {
    temperature: 0.2, // Más bajo para respuestas JSON consistentes
  },
  prompt: `${rankCluesSystemPrompt}

Palabra Civil: {{{civilianWord}}}

Jugadores y Pistas (con sus roles REALES):
{{#each players}}
- Jugador: {{name}} (Rol: {{role}}), Pista: "{{clue}}"
{{/each}}

Proporciona tu ranking como un objeto JSON que coincida con el esquema de salida. Rankea a todos los jugadores. Recuerda que el rol REAL de cada jugador (Civil, MrWhite, Payaso) es CRUCIAL para tu evaluación.`,
});

const rankCluesFlow = ai.defineFlow(
  {
    name: 'rankCluesFlow',
    inputSchema: RankCluesInputSchema,
    outputSchema: RankCluesOutputSchema,
  },
  async (input) => {
    // Log the input to the AI for easier debugging if issues persist
    console.log(`[rankCluesFlow] Input to AI for ${rankCluesPromptObject.name}:`, JSON.stringify(input, null, 2));

    const { output, usage, error } = await rankCluesPromptObject(input);

    if (error) {
      console.error(`[rankCluesFlow] Error from AI model (${rankCluesPromptObject.name}):`, error);
      console.error('[rankCluesFlow] Input to AI that caused error:', JSON.stringify(input, null, 2));
      console.error('[rankCluesFlow] Usage data (if available):', JSON.stringify(usage, null, 2));
      throw new Error(`Error de la IA al procesar la solicitud: ${error.message || 'Error desconocido'}`);
    }

    if (!output) {
      console.error(
        `[rankCluesFlow] AI response was null or undefined after Zod parsing for prompt ${rankCluesPromptObject.name}. This likely means the model returned non-JSON or JSON that did not match the expected schema.`
      );
      console.error('[rankCluesFlow] Input to AI:', JSON.stringify(input, null, 2));
      console.error('[rankCluesFlow] Usage data (if available):', JSON.stringify(usage, null, 2));
      // Consider if you want to get the raw response from the model here if possible for deeper debugging
      throw new Error('La IA no devolvió una respuesta JSON parseable que coincida con el esquema esperado.');
    }

    if (!Array.isArray(output.rankedClues)) {
        console.error(
            `[rankCluesFlow] AI response was parsed, but rankedClues is not an array for prompt ${rankCluesPromptObject.name}. Received:`, output.rankedClues
        );
        console.error('[rankCluesFlow] Full AI output object:', JSON.stringify(output, null, 2));
        console.error('[rankCluesFlow] Input to AI:', JSON.stringify(input, null, 2));
        console.error('[rankCluesFlow] Usage data (if available):', JSON.stringify(usage, null, 2));
        throw new Error('La IA devolvió una respuesta donde `rankedClues` no era un array, según lo esperado.');
    }

    // Ensure sorting happens if rankedClues is an array
    output.rankedClues.sort((a, b) => a.rank - b.rank);
    console.log(`[rankCluesFlow] Successfully ranked clues for word "${input.civilianWord}". Output size: ${output.rankedClues.length}`);
    return output;
  }
);
