import type { Player } from './types';

export const SECRET_WORDS = [
  "Manzana", "Playa", "Coche", "Perro", "Sol", "Luna", "Libro", "Silla", "Casa", "Río",
  "Montaña", "Bosque", "Nube", "Estrella", "Llave", "Candado", "Puente", "Camino", "Barco", "Tren"
];
export const MR_WHITE_MESSAGE = "Eres Mr. White";
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 8;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializePlayers(playerNames: string[]): { players: Player[], civilianWord: string, mrWhiteName: string } {
  if (playerNames.length < MIN_PLAYERS || playerNames.length > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  const civilianWord = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
  const mrWhiteIndex = Math.floor(Math.random() * playerNames.length);
  const mrWhiteName = playerNames[mrWhiteIndex];

  const players: Player[] = playerNames.map((name, index) => ({
    id: `${name}-${index}-${Date.now()}`, // Simple unique ID
    name,
    word: index === mrWhiteIndex ? MR_WHITE_MESSAGE : civilianWord,
    isMrWhite: index === mrWhiteIndex,
    wordRevealed: false,
  }));

  // Shuffle players after assignment to ensure random turn order for word reveal
  // and to make Mr. White's position in the game random.
  return { players: shuffleArray(players), civilianWord, mrWhiteName };
}
