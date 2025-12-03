
import type { Player, GameData, GameMode, CategoryType } from './types';
import { getRandomWord } from './words';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 16;

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
 * El impostor tiene ~15% menos probabilidad de empezar que los demás.
 * Ejemplo con 3 jugadores:
 *   - Normal: 33.3% cada uno
 *   - Con ajuste: impostor ~28%, otros ~36% cada uno
 */
function selectStartingPlayer(players: Player[]): Player {
  const impostorIndex = players.findIndex(p => p.isImpostor);
  const numPlayers = players.length;

  // Factor de reducción para el impostor (0.85 = 15% menos probabilidad)
  const impostorFactor = 0.85;

  // Calcular pesos
  // Si todos tuvieran peso 1, el total sería numPlayers
  // Con el ajuste, el impostor tiene peso impostorFactor
  const totalWeight = (numPlayers - 1) + impostorFactor;

  // Generar número aleatorio
  const random = Math.random() * totalWeight;

  // Calcular índice basado en pesos
  let cumulative = 0;
  for (let i = 0; i < players.length; i++) {
    const weight = i === impostorIndex ? impostorFactor : 1;
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
  category?: CategoryType
): GameData {
  const numPlayers = playerNames.length;

  if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  // Obtener palabra aleatoria según el modo
  const wordData = getRandomWord(gameMode, category);
  const secretWord = wordData.word;
  const hint = gameMode === 'withHint' ? wordData.hint : undefined;
  const subtype = wordData.subtype;

  // Seleccionar impostor aleatoriamente
  const impostorIndex = Math.floor(Math.random() * numPlayers);
  const impostorName = playerNames[impostorIndex];

  // Crear jugadores
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}-${Date.now()}`,
    name,
    word: index === impostorIndex ? "ERES EL IMPOSTOR" : secretWord,
    isImpostor: index === impostorIndex,
    wordRevealed: false,
    isStartingPlayer: false,
  }));

  // Seleccionar quién empieza (impostor con menos probabilidad)
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
    impostorName,
    startingPlayerName: startingPlayer.name,
    votedPlayerId: undefined,
  };
}

export function resetGameWithSamePlayers(gameData: GameData): GameData {
  const playerNames = gameData.players.map(p => p.name);
  return initializeGame(playerNames, gameData.gameMode, gameData.category);
}
