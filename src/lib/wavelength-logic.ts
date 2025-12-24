import type { WavelengthGameData, WavelengthPlayer } from './types';
import { getRandomSpectrum, getRandomTargetPosition } from './wavelength-spectrums';

export const MIN_WAVELENGTH_PLAYERS = 2;
export const MAX_WAVELENGTH_PLAYERS = 12;
export const DEFAULT_MAX_ROUNDS = 5;

export function initializeWavelengthGame(
  playerNames: string[],
  maxRounds?: number
): WavelengthGameData {
  if (playerNames.length < MIN_WAVELENGTH_PLAYERS || playerNames.length > MAX_WAVELENGTH_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_WAVELENGTH_PLAYERS} y ${MAX_WAVELENGTH_PLAYERS}`);
  }

  // Create players with initial score
  const players: WavelengthPlayer[] = playerNames.map((name, index) => ({
    id: `player_${index}_${Date.now()}`,
    name,
    score: 0,
    isPsychic: index === 0, // First player starts as psychic
  }));

  return {
    players,
    currentSpectrum: getRandomSpectrum(),
    targetPosition: getRandomTargetPosition(),
    teamGuess: undefined,
    psychicClue: undefined,
    gamePhase: 'psychicReveal',
    currentPsychicIndex: 0,
    roundNumber: 1,
    maxRounds: maxRounds || DEFAULT_MAX_ROUNDS,
  };
}

export function startNextRound(gameData: WavelengthGameData): WavelengthGameData {
  const nextPsychicIndex = (gameData.currentPsychicIndex + 1) % gameData.players.length;

  // Update players to set new psychic
  const updatedPlayers = gameData.players.map((player, index) => ({
    ...player,
    isPsychic: index === nextPsychicIndex,
  }));

  return {
    ...gameData,
    players: updatedPlayers,
    currentSpectrum: getRandomSpectrum(),
    targetPosition: getRandomTargetPosition(),
    teamGuess: undefined,
    psychicClue: undefined,
    gamePhase: 'psychicReveal',
    currentPsychicIndex: nextPsychicIndex,
    roundNumber: gameData.roundNumber + 1,
  };
}

export function calculateScore(targetPosition: number, guess: number): number {
  const difference = Math.abs(targetPosition - guess);

  if (difference <= 5) return 4;   // Bullseye!
  if (difference <= 10) return 3;  // Very close
  if (difference <= 20) return 2;  // Close
  if (difference <= 30) return 1;  // Not bad
  return 0;                        // Miss
}

export function getScoreLabel(score: number): string {
  switch (score) {
    case 4: return '¡Diana!';
    case 3: return '¡Muy cerca!';
    case 2: return 'Cerca';
    case 1: return 'No está mal';
    default: return 'Fallaste';
  }
}

export function resetWavelengthGame(gameData: WavelengthGameData): WavelengthGameData {
  const playerNames = gameData.players.map(p => p.name);
  return initializeWavelengthGame(playerNames, gameData.maxRounds);
}
