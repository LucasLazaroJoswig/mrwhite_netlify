
import type { Player, GameData, GameMode, CategoryType } from './types';
import { getRandomWord } from './words';
import { getRandomQuestion } from './questions';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 30;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selecciona el jugador que empieza.
 * Los impostores tienen ~15% menos probabilidad de empezar que los demás.
 */
function selectStartingPlayer(players: Player[]): Player {
  const numPlayers = players.length;
  const impostorCount = players.filter(p => p.isImpostor).length;

  // Factor de reducción para los impostores (0.85 = 15% menos probabilidad)
  const impostorFactor = 0.85;

  // Calcular pesos
  const totalWeight = (numPlayers - impostorCount) + (impostorCount * impostorFactor);

  // Generar número aleatorio
  const random = Math.random() * totalWeight;

  // Calcular índice basado en pesos
  let cumulative = 0;
  for (let i = 0; i < players.length; i++) {
    const weight = players[i].isImpostor ? impostorFactor : 1;
    cumulative += weight;
    if (random < cumulative) {
      return players[i];
    }
  }

  // Fallback (no debería llegar aquí)
  return players[players.length - 1];
}

export function initializeGame(
  playerNames: string[],
  gameMode: GameMode,
  category?: CategoryType,
  impostorCount: number = 1
): GameData {
  const numPlayers = playerNames.length;

  if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  // Validar que el número de impostores sea válido
  const maxImpostors = numPlayers - 1; // Al menos un civil
  const validImpostorCount = Math.min(Math.max(1, impostorCount), maxImpostors);

  // Variables for different modes
  let secretWord = '';
  let hint: string | undefined;
  let subtype: string | undefined;
  let civilQuestion: string | undefined;
  let impostorQuestion: string | undefined;

  // Handle hiddenOpinion mode differently
  if (gameMode === 'hiddenOpinion') {
    const questionData = getRandomQuestion();
    civilQuestion = questionData.civilQuestion;
    impostorQuestion = questionData.impostorQuestion;
    secretWord = civilQuestion; // Use civil question as the "secret"
  } else {
    // Obtener palabra aleatoria según el modo
    const wordData = getRandomWord(gameMode, category);
    secretWord = wordData.word;
    hint = gameMode === 'withHint' ? wordData.hint : undefined;
    subtype = wordData.subtype;
  }

  // Seleccionar impostores aleatoriamente
  const shuffledIndices = shuffleArray([...Array(numPlayers).keys()]);
  const impostorIndices = new Set(shuffledIndices.slice(0, validImpostorCount));
  const impostorNames = shuffledIndices.slice(0, validImpostorCount).map(i => playerNames[i]);

  // Crear jugadores
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}-${Date.now()}`,
    name,
    word: impostorIndices.has(index) ? "ERES EL IMPOSTOR" : secretWord,
    isImpostor: impostorIndices.has(index),
    wordRevealed: false,
    isStartingPlayer: false,
  }));

  // Seleccionar quién empieza (impostores con menos probabilidad)
  const startingPlayer = selectStartingPlayer(players);
  startingPlayer.isStartingPlayer = true;

  return {
    players,
    secretWord,
    hint,
    subtype,
    gamePhase: 'wordReveal',
    gameMode,
    category,
    impostorName: impostorNames[0], // Mantener compatibilidad
    impostorNames,
    impostorCount: validImpostorCount,
    startingPlayerName: startingPlayer.name,
    votedPlayerId: undefined,
    civilQuestion,
    impostorQuestion,
  };
}

export function resetGameWithSamePlayers(gameData: GameData): GameData {
  const playerNames = gameData.players.map(p => p.name);
  return initializeGame(playerNames, gameData.gameMode, gameData.category, gameData.impostorCount);
}
