
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
