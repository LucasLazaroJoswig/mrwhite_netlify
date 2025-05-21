
export interface Player {
  id: string;
  name: string;
  word: string;
  isMrWhite: boolean; // Puede ser útil mantenerlo para lógica simple, aunque 'role' es más específico
  role: 'civilian' | 'mrwhite' | 'payaso';
  wordRevealed: boolean;
  clue?: string;
}

export interface ClueRankingItem {
  playerName: string;
  clue: string;
  role: 'civilian' | 'mrwhite' | 'payaso';
  rank: number;
  justification: string;
}

export interface GameData {
  players: Player[];
  civilianWord: string;
  mrWhiteNames?: string[];
  payasoName?: string; // Nombre del payaso, si existe
  gamePhase: 'wordReveal' | 'discussionAndClues' | 'voting' | 'results';
  playerClues?: { [playerId: string]: string };
  votedPlayerId?: string; // ID del jugador que fue votado
  clueRanking?: ClueRankingItem[];
}
