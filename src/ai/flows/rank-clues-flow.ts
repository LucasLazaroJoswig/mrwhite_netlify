
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

const PlayerClueInputSchema = z.object({
  name: z.string().describe('Nombre del jugador.'),
  role: z.enum(['civilian', 'mrwhite', 'payaso', 'undercover']).describe('Rol REAL del jugador en la partida. Este es el rol en el que debes basar tu evaluación.'),
  clue: z.string().describe('Palabra pista dada por el jugador.'),
  wordKnownByPlayer: z.string().describe('La palabra específica que este jugador conocía (palabra civil, mensaje de Mr. White, o palabra del Undercover).'),
});

const RankCluesInputSchema = z.object({
  civilianWord: z.string().describe('La palabra secreta principal para los civiles.'),
  players: z.array(PlayerClueInputSchema).describe('Lista de jugadores con sus roles REALES, pistas y la palabra que conocían.'),
});
export type RankCluesInput = z.infer<typeof RankCluesInputSchema>;

const ClueRankingItemSchema = z.object({
  playerName: z.string().describe('Nombre del jugador.'),
  clue: z.string().describe('La pista dada por el jugador.'),
  role: z.enum(['civilian', 'mrwhite', 'payaso', 'undercover']).describe('Rol REAL del jugador durante la partida.'),
  rank: z.number().int().min(1).describe('Ranking numérico de la pista (1 es la mejor).'),
  justification: z.string().describe('Breve justificación para el ranking, explicando por qué fue buena o mala basada en las reglas del juego, el rol REAL del jugador, la palabra que conocía el jugador, la palabra civil principal, y la inteligencia/creatividad de la pista.'),
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
Eres un analista experto del juego de deducción social "Mr. White" y sus variantes.
Tu tarea es rankear la "pista" (palabra clave) dada por cada jugador. La pista es una ÚNICA palabra.
Se te proporcionará el rol REAL de cada jugador y la palabra específica que ese jugador conocía (que puede ser la palabra civil, un mensaje especial si es Mr. White, o una palabra similar si es Undercover). También se te dará la palabra civil principal del juego. Tu evaluación DEBE basarse estrictamente en estos datos. NO intentes adivinar o cambiar el rol del jugador.

Reglas del Juego y Objetivos de Rol (MUY IMPORTANTE para tu evaluación):
- Civiles y el Payaso (si está en juego) conocen la "Palabra Civil Principal".
  - Objetivo del Civil: Dar una pista relacionada con la "Palabra Civil Principal". Buenas pistas de civiles son entendibles por otros Civiles pero NO demasiado obvias para Mr. White o el Undercover. Se valora la sutileza, la inteligencia y la creatividad. Una pista que parezca simple pero tenga una conexión profunda o ingeniosa es excelente. Ejemplo: para la palabra "Rana", la pista "Tortellini" podría ser excelente si se justifica que "Rana" es una marca conocida de pasta fresca (tortellini). Esto requiere pensar más allá.
- Mr. White NO conoce la "Palabra Civil Principal" (su 'wordKnownByPlayer' será un mensaje especial).
  - Objetivo de Mr. White: Mezclarse y adivinar la palabra escuchando las pistas. Debe dar una pista intentando hacer parecer que conoce la palabra. Una buena pista de Mr. White podría ser general, astuta, o aprovechar inteligentemente otras pistas ya dadas. Una mala pista lo expone. Si da una pista muy buena para la palabra civil (aunque no la conozca), valora positivamente su audacia y capacidad de deducción.
- El Payaso conoce la "Palabra Civil Principal".
  - Objetivo del Payaso: Ser votado como si fuera Mr. White o el Undercover. Si lo votan, el Payaso gana. Una buena pista del Payaso es aquella que lo hace parecer sospechoso, como si no conociera la palabra, o incluso una pista que sea deliberadamente "mala" o extraña para atraer votos. No la juzgues con los mismos criterios que un Civil. Una pista "desfasada" o muy obvia puede ser excelente para el Payaso si logra su objetivo.
- El Undercover conoce una palabra ('wordKnownByPlayer') que es SIMILAR pero NO IDÉNTICA a la "Palabra Civil Principal". El Undercover NO SABE que es el Undercover; cree que su palabra es la correcta.
  - Objetivo del Undercover: Dar una pista que sea coherente con SU palabra, intentando convencer a los demás de que tiene la palabra correcta (sin saber que es diferente). Una buena pista de Undercover es sutilmente diferente, lo suficientemente ambigua para no ser inmediatamente descubierto, pero fiel a su propia palabra. Si su pista se alinea demasiado con la Palabra Civil Principal, puede que no esté jugando bien su rol de despiste sutil. Si su pista es demasiado alejada de ambas, también es malo.

Criterios de Ranking (Debes aplicar esto rigurosamente, basándote en el rol REAL asignado y la palabra que conocía):
Proporciona un ranking numérico (1 siendo la mejor pista).
Basa tu ranking en:
1.  Para Civiles: Qué tan bien la pista ayuda a otros Civiles a identificarse entre ellos y la "Palabra Civil Principal" SIN ser demasiado obvia para Mr. White/Undercover. Explica conexiones ingeniosas. Valora la profundidad.
2.  Para Mr. White: Qué tan bien su pista le ayuda a mezclarse o parecer que conoce la "Palabra Civil Principal". ¿Es una pista general creíble? ¿O es demasiado vaga o arriesgada?
3.  Para el Payaso: Qué tan bien su pista le ayuda a lograr su objetivo de ser votado. Una pista que lo haga parecer culpable o despistado es buena para el Payaso.
4.  Para el Undercover: Qué tan bien su pista se alinea con SU palabra ('wordKnownByPlayer') y si crea una confusión sutil o si es demasiado obvia/desconectada. Considera la relación entre su palabra y la "Palabra Civil Principal".
5.  Inteligencia general, creatividad y adhesión al objetivo de su rol asignado. Una pista no es inherentemente buena o mala; depende del rol, su estrategia y la palabra que conocía.

IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido que coincida estrictamente con el esquema de salida proporcionado. No incluyas ningún texto explicativo antes o después del JSON.
El objeto JSON DEBE contener una clave llamada "rankedClues". El valor de "rankedClues" DEBE ser un array de objetos.
Cada objeto en "rankedClues" debe tener: "playerName", "clue", "role" (el rol real), "rank", "justification".
DEBES rankear a todos los jugadores. Si una pista es mala PARA EL ROL DEL JUGADOR Y SU PALABRA, el ranking y la justificación deben explicar por qué. El array "rankedClues" NUNCA debe ser nulo o estar vacío a menos que no se proporcionen jugadores o todas las pistas estén vacías; este es un último recurso.
Ordena el array "rankedClues" por tu ranking (rank 1 arriba).
Analiza cada pista individualmente en el contexto del rol REAL del jugador y la palabra que este conocía. Valora el "pensar más allá".
`;

const rankCluesPromptObject = ai.definePrompt({
  name: 'rankCluesPrompt',
  input: { schema: RankCluesInputSchema },
  output: { schema: RankCluesOutputSchema },
  model: 'googleai/gemini-2.0-flash',
  config: {
    temperature: 0.2,
  },
  prompt: `${rankCluesSystemPrompt}

Palabra Civil Principal: {{{civilianWord}}}

Jugadores y Pistas (con sus roles REALES y la palabra que conocían):
{{#each players}}
- Jugador: {{name}} (Rol: {{role}}, Palabra que conocía: "{{wordKnownByPlayer}}"), Pista: "{{clue}}"
{{/each}}

Proporciona tu ranking como un objeto JSON que coincida con el esquema de salida.`,
});

const rankCluesFlow = ai.defineFlow(
  {
    name: 'rankCluesFlow',
    inputSchema: RankCluesInputSchema,
    outputSchema: RankCluesOutputSchema,
  },
  async (input) => {
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

    output.rankedClues.sort((a, b) => a.rank - b.rank);
    console.log(`[rankCluesFlow] Successfully ranked clues for word "${input.civilianWord}". Output size: ${output.rankedClues.length}`);
    return output;
  }
);
