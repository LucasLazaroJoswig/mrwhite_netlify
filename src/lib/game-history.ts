
// Game history system to avoid repeating words/questions

const HISTORY_KEY = 'mrWhiteGameHistory';
const MAX_HISTORY_SIZE = 200; // Keep last 200 played items

interface GameHistory {
  playedWords: string[];       // For classic, withHint, categories modes
  playedQuestions: string[];   // For hiddenOpinion mode (question IDs)
  lastUpdated: number;
}

function getHistory(): GameHistory {
  if (typeof window === 'undefined') {
    return { playedWords: [], playedQuestions: [], lastUpdated: Date.now() };
  }

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading game history:', e);
  }

  return { playedWords: [], playedQuestions: [], lastUpdated: Date.now() };
}

function saveHistory(history: GameHistory): void {
  if (typeof window === 'undefined') return;

  try {
    // Trim history if too large
    if (history.playedWords.length > MAX_HISTORY_SIZE) {
      history.playedWords = history.playedWords.slice(-MAX_HISTORY_SIZE);
    }
    if (history.playedQuestions.length > MAX_HISTORY_SIZE) {
      history.playedQuestions = history.playedQuestions.slice(-MAX_HISTORY_SIZE);
    }

    history.lastUpdated = Date.now();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving game history:', e);
  }
}

// Check if a word has been played recently
export function hasWordBeenPlayed(word: string): boolean {
  const history = getHistory();
  return history.playedWords.includes(word.toLowerCase());
}

// Check if a question has been played recently
export function hasQuestionBeenPlayed(questionId: string): boolean {
  const history = getHistory();
  return history.playedQuestions.includes(questionId);
}

// Mark a word as played
export function markWordAsPlayed(word: string): void {
  const history = getHistory();
  const lowerWord = word.toLowerCase();

  if (!history.playedWords.includes(lowerWord)) {
    history.playedWords.push(lowerWord);
    saveHistory(history);
  }
}

// Mark a question as played
export function markQuestionAsPlayed(questionId: string): void {
  const history = getHistory();

  if (!history.playedQuestions.includes(questionId)) {
    history.playedQuestions.push(questionId);
    saveHistory(history);
  }
}

// Get all unplayed words from a list
export function filterUnplayedWords<T extends { word: string }>(words: T[]): T[] {
  const history = getHistory();
  const filtered = words.filter(w => !history.playedWords.includes(w.word.toLowerCase()));

  // If all words have been played, reset and return all
  if (filtered.length === 0) {
    return words;
  }

  return filtered;
}

// Get all unplayed questions from a list
export function filterUnplayedQuestions<T extends { id: string }>(questions: T[]): T[] {
  const history = getHistory();
  const filtered = questions.filter(q => !history.playedQuestions.includes(q.id));

  // If all questions have been played, reset and return all
  if (filtered.length === 0) {
    return questions;
  }

  return filtered;
}

// Clear all history
export function clearGameHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing game history:', e);
  }
}

// Get history stats
export function getHistoryStats(): { wordsPlayed: number; questionsPlayed: number } {
  const history = getHistory();
  return {
    wordsPlayed: history.playedWords.length,
    questionsPlayed: history.playedQuestions.length,
  };
}
