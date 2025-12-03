
export type GameMode = 'classic' | 'withHint' | 'categories';

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

export interface Player {
  id: string;
  name: string;
  word: string;
  isImpostor: boolean;
  wordRevealed: boolean;
  isStartingPlayer: boolean;
}

export type GamePhase = 'setup' | 'modeSelect' | 'categorySelect' | 'playerSetup' | 'wordReveal' | 'playing' | 'voting' | 'results';

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
}
