import type { Player } from './types';

export const SECRET_WORDS = [
  "Manzana", "Playa", "Coche", "Perro", "Sol", "Luna", "Libro", "Silla", "Casa", "Río",
  "Montaña", "Bosque", "Nube", "Estrella", "Llave", "Candado", "Puente", "Camino", "Barco", "Tren",
  "Flor", "Jardín", "Rueda", "Gato", "Avión", "Escuela", "Raton", "Mesa", "Ventana", "Lapiz"
];
export const MR_WHITE_MESSAGE = "Eres Mr. White";
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 16; // Aumentado a 16

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializePlayers(playerNames: string[]): { players: Player[], civilianWord: string, mrWhiteNames: string[] } {
  if (playerNames.length < MIN_PLAYERS || playerNames.length > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  const civilianWord = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
  
  let numberOfMrWhites = 1;
  if (playerNames.length >= 14) {
    numberOfMrWhites = 4;
  } else if (playerNames.length >= 10) {
    numberOfMrWhites = 3;
  } else if (playerNames.length >= 6) {
    numberOfMrWhites = 2;
  }

  // Seleccionar índices aleatorios para los Mr. White
  const shuffledPlayerIndices = Array.from(Array(playerNames.length).keys());
  for (let i = shuffledPlayerIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayerIndices[i], shuffledPlayerIndices[j]] = [shuffledPlayerIndices[j], shuffledPlayerIndices[i]];
  }

  const mrWhiteIndices = new Set<number>();
  for (let i = 0; i < numberOfMrWhites; i++) {
    mrWhiteIndices.add(shuffledPlayerIndices[i]);
  }

  const mrWhiteNamesList: string[] = [];
  const players: Player[] = playerNames.map((name, index) => {
    const isMrWhite = mrWhiteIndices.has(index);
    if (isMrWhite) {
      mrWhiteNamesList.push(name);
    }
    return {
      id: `${name}-${index}-${Date.now()}`, // Simple unique ID
      name,
      word: isMrWhite ? MR_WHITE_MESSAGE : civilianWord,
      isMrWhite: isMrWhite,
      wordRevealed: false,
    };
  });

  // Barajar jugadores para el orden de turno y para ocultar la posición original de Mr. White
  return { players: shuffleArray(players), civilianWord, mrWhiteNames: mrWhiteNamesList };
}
