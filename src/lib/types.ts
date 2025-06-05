
export interface Player {
  id: string;
  name: string;
  word: string; // La palabra que este jugador conoce (puede ser la civil, la de Mr. White, o la del Undercover)
  isMrWhite: boolean; // True si role es 'mrwhite'
  role: 'civilian' | 'mrwhite' | 'payaso' | 'undercover';
  wordRevealed: boolean;
  clue?: string;
}

export interface ClueRankingItem {
  playerName: string;
  clue: string;
  role: 'civilian' | 'mrwhite' | 'payaso' | 'undercover';
  rank: number;
  justification: string;
}

export type GamePhase = 'wordReveal' | 'discussionAndClues' | 'selectAccused' | 'results';
export type GameMode = 'mrWhite' | 'undercover';

export interface GameData {
  players: Player[];
  civilianWord: string; // La palabra principal de los civiles
  mrWhiteNames?: string[];
  payasoName?: string;
  undercoverPlayer?: { name: string; word: string }; // Nombre y palabra del Undercover
  gamePhase: GamePhase;
  gameMode: GameMode;
  playerClues?: { [playerId: string]: string };
  votedPlayerId?: string;
  clueRanking?: ClueRankingItem[];
  numberOfMrWhites: number; // El número real de Mr. Whites en la partida actual
}
