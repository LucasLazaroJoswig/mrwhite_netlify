
'use server';
/**
 * @fileOverview Sugiere una pista para un jugador en el juego Mr. White.
 *
 * - suggestClue - Una función que llama al flujo de Genkit para sugerir una pista.
 * - SuggestClueInput - El tipo de entrada para el flujo suggestClue.
 * - SuggestClueOutput - El tipo de retorno para el flujo suggestClue.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClueInputSchema = z.object({
  playerRole: z.enum(['civilian', 'mrwhite', 'payaso', 'undercover']).describe('El rol del jugador que solicita la sugerencia.'),
  wordKnownByPlayer: z.string().describe('La palabra específica que conoce el jugador (palabra civil, mensaje de Mr. White, o palabra del Undercover).'),
  actualCivilianWord: z.string().describe('La palabra civil principal del juego. Para Mr. White, puede ser la misma que wordKnownByPlayer si se prefiere no revelarla, pero para Undercover es crucial.'),
});
export type SuggestClueInput = z.infer<typeof SuggestClueInputSchema>;

const SuggestClueOutputSchema = z.object({
  suggestedClue: z.string().describe('La palabra pista sugerida por la IA. Debe ser una única palabra.'),
  justification: z.string().describe('Una breve explicación de por qué esta pista es buena para el rol y las palabras dadas.'),
});
export type SuggestClueOutput = z.infer<typeof SuggestClueOutputSchema>;

export async function suggestClue(input: SuggestClueInput): Promise<SuggestClueOutput> {
  return suggestClueFlow(input);
}

const suggestClueSystemPrompt = `
Eres un asistente experto en el juego de deducción social "Mr. White" y sus variantes.
Tu tarea es sugerir una ÚNICA palabra como pista para un jugador, basada en su rol, la palabra que conoce y la palabra civil principal del juego.
La pista debe ser MUY BUENA y la justificación concisa y útil.

Objetivos de Rol para la Pista Sugerida:
- Si el rol es 'civilian': Sugiere una pista sutil e inteligente relacionada con su 'wordKnownByPlayer' (que será la 'actualCivilianWord'). Debe ayudar a otros civiles a identificar la palabra sin revelarla demasiado a Mr. White o al Undercover. Valora la creatividad y los juegos de palabras. Evita pistas demasiado obvias.
- Si el rol es 'mrwhite': Como Mr. White no conoce la palabra civil ('wordKnownByPlayer' será un mensaje especial), sugiere una pista general, ambigua o astuta que podría encajar con muchas palabras o que le permita mezclarse. La justificación debe explicar cómo esta pista le ayuda a parecer que conoce la 'actualCivilianWord'.
- Si el rol es 'payaso': Sugiere una pista que sea extraña, confusa o que haga al jugador parecer sospechoso (como si fuera Mr. White/Undercover), basada en la 'actualCivilianWord'. El objetivo es que lo voten. La justificación debe explicar cómo la pista ayuda a este objetivo.
- Si el rol es 'undercover': El jugador conoce 'wordKnownByPlayer' (su palabra similar) y tú conoces la 'actualCivilianWord'. Sugiere una pista que sea buena para 'wordKnownByPlayer' pero que pueda ser sutilmente confusa o no encajar perfectamente con la 'actualCivilianWord', o que juegue con la ambigüedad entre ambas. El objetivo es parecer un civil de su propia palabra sin ser descubierto fácilmente.

IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido que coincida estrictamente con el esquema de salida proporcionado. No incluyas ningún texto explicativo antes o después del JSON.
El objeto JSON DEBE contener las claves "suggestedClue" (string, una sola palabra) y "justification" (string).
La pista ("suggestedClue") DEBE SER UNA ÚNICA PALABRA.
`;

const suggestCluePromptObject = ai.definePrompt({
  name: 'suggestCluePrompt',
  input: { schema: SuggestClueInputSchema },
  output: { schema: SuggestClueOutputSchema },
  model: 'googleai/gemini-2.0-flash',
  config: {
    temperature: 0.7,
  },
  prompt: `${suggestClueSystemPrompt}

Rol del Jugador: {{{playerRole}}}
Palabra Conocida por el Jugador: {{{wordKnownByPlayer}}}
Palabra Civil Principal del Juego: {{{actualCivilianWord}}}

Genera una única palabra como pista y una breve justificación.`,
});

const suggestClueFlow = ai.defineFlow(
  {
    name: 'suggestClueFlow',
    inputSchema: SuggestClueInputSchema,
    outputSchema: SuggestClueOutputSchema,
  },
  async (input) => {
    const { output, error } = await suggestCluePromptObject(input);

    if (error) {
      console.error(`Error from AI model (${suggestCluePromptObject.name}) during suggestClueFlow:`, error);
      console.error('Input to AI that caused error:', JSON.stringify(input, null, 2));
      throw new Error(`Error de la IA al procesar la solicitud de sugerencia: ${error.message || 'Error desconocido'}`);
    }
    
    if (!output) {
      console.error(
        `AI response was null or undefined after Zod parsing for prompt ${suggestCluePromptObject.name}. Input:`, input
      );
      throw new Error('La IA no devolvió una respuesta JSON parseable para la sugerencia.');
    }
    
    return output;
  }
);
