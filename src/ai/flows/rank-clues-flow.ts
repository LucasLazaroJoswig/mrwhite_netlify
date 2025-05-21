
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
  role: z.enum(['civilian', 'mrwhite', 'payaso']).describe('Rol del jugador en la partida.'),
  clue: z.string().describe('Palabra pista dada por el jugador.'),
});

const RankCluesInputSchema = z.object({
  civilianWord: z.string().describe('La palabra secreta para los civiles y el payaso.'),
  players: z.array(PlayerClueInputSchema).describe('Lista de jugadores con sus roles y pistas.'),
});
export type RankCluesInput = z.infer<typeof RankCluesInputSchema>;

const ClueRankingItemSchema = z.object({
  playerName: z.string().describe('Nombre del jugador.'),
  clue: z.string().describe('La pista dada por el jugador.'),
  role: z.enum(['civilian', 'mrwhite', 'payaso']).describe('Rol del jugador durante la partida.'),
  rank: z.number().int().min(1).describe('Ranking numérico de la pista (1 es la mejor).'),
  justification: z.string().describe('Breve justificación para el ranking, explicando por qué fue buena o mala basada en las reglas del juego y el rol del jugador.'),
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
Tu tarea es rankear la "pista" (palabra clave) dada por cada jugador.

Reglas del Juego:
- Civiles y el Payaso conocen la "Palabra Civil" secreta. Su objetivo es dar una pista relacionada con esta palabra.
  - Buenas pistas de civiles son entendibles por otros Civiles pero no demasiado obvias para Mr. White.
- Mr. White NO conoce la "Palabra Civil". Su objetivo es mezclarse y adivinar la palabra escuchando las pistas.
  - Mr. White también da una pista, intentando hacer parecer que conoce la palabra.
- El Payaso conoce la "Palabra Civil". Su objetivo es ser votado como si fuera Mr. White. Si lo votan, el Payaso gana.
  - Una buena pista del Payaso podría hacerle parecer sospechoso o como si no conociera la palabra, para atraer votos.

Criterios de Ranking:
Proporciona un ranking numérico (1 siendo la mejor pista).
Basa tu ranking en:
1. Para Civiles: Qué tan bien la pista ayuda a otros Civiles a identificarse entre ellos y la "Palabra Civil" SIN ser demasiado obvia para Mr. White. Pistas inteligentes y sutiles son mejores.
2. Para Mr. White: Qué tan bien su pista le ayuda a mezclarse o parecer que conoce la "Palabra Civil". Una buena pista de Mr. White podría ser general o aprovechar inteligentemente otras pistas. Una mala podría ser completamente irrelevante o exponerlo.
3. Para el Payaso: Qué tan bien su pista le ayuda a lograr su objetivo de ser votado. Esto podría significar dar una pista extraña, engañosa o que parezca de "Mr. White".
4. Inteligencia general y adhesión al objetivo de su rol.

IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido que coincida estrictamente con el esquema de salida proporcionado. No incluyas ningún texto explicativo antes o después del JSON.
El objeto JSON DEBE contener una clave llamada "rankedClues". El valor de "rankedClues" DEBE ser un array de objetos, donde cada objeto representa a un jugador y su pista rankeada.
Cada objeto en el array "rankedClues" debe tener los campos: "playerName" (string), "clue" (string), "role" (enum: 'civilian', 'mrwhite', 'payaso'), "rank" (integer), "justification" (string).
Incluso si tienes dificultades para rankear, o si no hay pistas significativas, o si hay muy pocos jugadores, DEBES devolver un array vacío para "rankedClues" si es necesario, por ejemplo: {"rankedClues": []}. NUNCA omitas la clave "rankedClues" ni devuelvas null para ella.
Ordena el array "rankedClues" por tu ranking (la mejor pista primero, es decir, rank 1 arriba).
Considera el contexto de todas las pistas dadas al rankear una pista individual.
Asegúrate que la respuesta siempre sea un JSON válido que cumpla con el esquema de salida.
`;

const rankCluesFlow = ai.defineFlow(
  {
    name: 'rankCluesFlow',
    inputSchema: RankCluesInputSchema,
    outputSchema: RankCluesOutputSchema,
  },
  async (input) => {
    const modelName = 'googleai/gemini-2.0-flash'; // O el modelo que estés usando
    const { output, usage, error } = await ai.generate({
      prompt: `${rankCluesSystemPrompt}

Palabra Civil: {{{civilianWord}}}

Jugadores y Pistas:
{{#each players}}
- Jugador: {{name}} (Rol: {{role}}), Pista: "{{clue}}"
{{/each}}

Proporciona tu ranking como un objeto JSON que coincida con el esquema de salida. Rankea a todos los jugadores.`,
      model: modelName,
      output: { schema: RankCluesOutputSchema },
      config: {
        temperature: 0.2, 
      }
    });

    if (error) {
      console.error(`Error from AI model (${modelName}) during rankCluesFlow:`, error);
      console.error('Input to AI that caused error:', JSON.stringify(input, null, 2));
      console.error('Usage data (if available):', JSON.stringify(usage, null, 2));
      throw new Error(`Error de la IA al procesar la solicitud: ${error.message || 'Error desconocido'}`);
    }
    
    if (!output) {
      console.error(
        `AI response was null or undefined after Zod parsing for model ${modelName}. This likely means the model returned non-JSON or JSON that did not match the expected schema.`
      );
      console.error('Input to AI:', JSON.stringify(input, null, 2));
      console.error('Usage data (if available):', JSON.stringify(usage, null, 2));
      throw new Error('La IA no devolvió una respuesta JSON parseable que coincida con el esquema esperado.');
    }
    
    // Si output.rankedClues es undefined o null (aunque Zod debería prevenir esto si el parseo fue exitoso),
    // pero el prompt exige que sea un array, incluso vacío.
    if (!Array.isArray(output.rankedClues)) {
        console.error(
            `AI response was parsed, but rankedClues is not an array for model ${modelName}. Received:`, output.rankedClues
        );
        console.error('Full AI output object:', JSON.stringify(output, null, 2));
        console.error('Input to AI:', JSON.stringify(input, null, 2));
        console.error('Usage data (if available):', JSON.stringify(usage, null, 2));
        // Forzar un array vacío si el prompt no fue seguido, para evitar errores posteriores,
        // aunque idealmente la IA debería cumplir. O lanzar un error.
        // Por ahora, lanzaremos error para ser estrictos.
        throw new Error('La IA devolvió una respuesta donde `rankedClues` no era un array, según lo esperado.');
    }
    
    output.rankedClues.sort((a, b) => a.rank - b.rank);
    return output;
  }
);

