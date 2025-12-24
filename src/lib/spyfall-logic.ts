import type { SpyfallGameData, SpyfallPlayer, SpyfallLocation } from './types';
import { SPYFALL_LOCATIONS, getRandomLocation, getRandomRole } from './spyfall-locations';

export const MIN_SPYFALL_PLAYERS = 3;
export const MAX_SPYFALL_PLAYERS = 10;
export const DEFAULT_TIMER_SECONDS = 480; // 8 minutes

export function initializeSpyfallGame(
  playerNames: string[],
  timerSeconds?: number
): SpyfallGameData {
  if (playerNames.length < MIN_SPYFALL_PLAYERS || playerNames.length > MAX_SPYFALL_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_SPYFALL_PLAYERS} y ${MAX_SPYFALL_PLAYERS}`);
  }

  // Select random location
  const location = getRandomLocation();

  // Randomly select spy
  const spyIndex = Math.floor(Math.random() * playerNames.length);

  // Create shuffled roles for non-spy players
  const shuffledRoles = [...location.roles].sort(() => Math.random() - 0.5);

  // Create players
  const players: SpyfallPlayer[] = playerNames.map((name, index) => {
    const isSpy = index === spyIndex;
    return {
      id: `player_${index}_${Date.now()}`,
      name,
      isSpy,
      role: isSpy ? undefined : shuffledRoles[index % shuffledRoles.length],
      locationRevealed: false,
    };
  });

  return {
    players,
    location,
    allLocations: SPYFALL_LOCATIONS,
    gamePhase: 'locationReveal',
    spyName: players[spyIndex].name,
    timerSeconds: timerSeconds || DEFAULT_TIMER_SECONDS,
    startTime: undefined, // Will be set when game starts
  };
}

export function resetSpyfallGame(gameData: SpyfallGameData): SpyfallGameData {
  const playerNames = gameData.players.map(p => p.name);
  return initializeSpyfallGame(playerNames, gameData.timerSeconds);
}
