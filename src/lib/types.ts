export interface Player {
  id: string;
  name: string;
  word: string;
  isMrWhite: boolean;
  wordRevealed: boolean;
}

export interface GameData {
  players: Player[];
  civilianWord: string;
  mrWhiteNames?: string[]; // Cambiado a un array para múltiples Mr. Whites
}
