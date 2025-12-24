
// Main game types
export type GameType = 'impostor' | 'spyfall' | 'wavelength';

// Impostor game modes
export type GameMode = 'classic' | 'withHint' | 'categories' | 'hiddenOpinion';

export type CategoryType = 'football' | 'movies' | 'music' | 'food' | 'countries' | 'animals' | 'professions' | 'sports';

export interface CategoryWord {
  word: string;
  hint?: string; // Pista vaga para modo withHint
  subtype?: string; // Ej: "jugador" o "equipo" para fútbol
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  words: CategoryWord[];
}

// Interface for opinion questions (hiddenOpinion mode)
export interface OpinionQuestion {
  id: string;
  civilQuestion: string;      // Question for civilians
  impostorQuestion: string;   // Different question for impostor
}

export interface Player {
  id: string;
  name: string;
  word: string;
  isImpostor: boolean;
  wordRevealed: boolean;
  isStartingPlayer: boolean;
  answer?: string; // For hiddenOpinion mode - player's answer to their question
}

export type GamePhase = 'setup' | 'modeSelect' | 'categorySelect' | 'playerSetup' | 'wordReveal' | 'playing' | 'voting' | 'results' | 'answerReveal';

export interface GameData {
  players: Player[];
  secretWord: string;
  hint?: string; // Solo para modo withHint
  subtype?: string; // Ej: "Jugador" o "Equipo"
  gamePhase: GamePhase;
  gameMode: GameMode;
  category?: CategoryType;
  impostorName?: string;
  startingPlayerName?: string;
  votedPlayerId?: string;
  // For hiddenOpinion mode
  civilQuestion?: string;
  impostorQuestion?: string;
}

// ============ SPYFALL TYPES ============

export interface SpyfallLocation {
  id: string;
  name: string;
  icon: string;
  roles: string[]; // Possible roles at this location
}

export interface SpyfallPlayer {
  id: string;
  name: string;
  isSpy: boolean;
  role?: string; // Role at the location (only for non-spies)
  locationRevealed: boolean;
}

export type SpyfallPhase = 'playerSetup' | 'locationReveal' | 'playing' | 'voting' | 'results';

export interface SpyfallGameData {
  players: SpyfallPlayer[];
  location: SpyfallLocation;
  allLocations: SpyfallLocation[]; // All possible locations (for spy reference)
  gamePhase: SpyfallPhase;
  spyName?: string;
  timerSeconds?: number; // Optional timer
  startTime?: number;
}

// ============ WAVELENGTH TYPES ============

export type WavelengthCategory = 'classic' | 'football' | 'custom';

export interface WavelengthSpectrum {
  id: string;
  leftLabel: string;  // e.g., "Frío"
  rightLabel: string; // e.g., "Caliente"
}

export interface WavelengthPlayer {
  id: string;
  name: string;
  score: number;
  isPsychic: boolean;
}

export type WavelengthPhase = 'playerSetup' | 'psychicReveal' | 'psychicTurn' | 'teamGuess' | 'reveal' | 'results';

export interface WavelengthGameData {
  players: WavelengthPlayer[];
  currentSpectrum: WavelengthSpectrum;
  targetPosition: number; // 0-100, where the target is on the spectrum
  teamGuess?: number; // 0-100, where the team guessed
  psychicClue?: string; // The clue given by the psychic
  gamePhase: WavelengthPhase;
  currentPsychicIndex: number;
  roundNumber: number;
  maxRounds: number;
  category: WavelengthCategory;
  customSpectrums?: WavelengthSpectrum[]; // For custom mode
}
