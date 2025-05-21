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
  mrWhiteName?: string; // Optional: store Mr. White's name for easier reveal later
}
