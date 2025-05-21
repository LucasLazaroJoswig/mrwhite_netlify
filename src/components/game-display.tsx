
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, User, Eye, CheckCircle, HelpCircle, MessageSquareText, RotateCcw, Sparkles, Settings2, UsersRound, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializePlayers } from '@/lib/game-logic'; // Import initializePlayers

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWordModal, setShowWordModal] = useState(false);
  const [allWordsRevealed, setAllWordsRevealed] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    const allPlayerWordsRevealed = gameData.players.every(p => p.wordRevealed);
    setAllWordsRevealed(allPlayerWordsRevealed);

    if (!allPlayerWordsRevealed) {
      // Word revealing phase
      const nextPlayerIdx = gameData.players.findIndex(p => !p.wordRevealed);
      setCurrentPlayerIndex(nextPlayerIdx !== -1 ? nextPlayerIdx : 0);
      setShowWordModal(false); // Ensure modal is closed if gameData changes (e.g. new round)
      setResultsVisible(false); // Results should not be visible if we are back in word reveal phase
    }
    // If allPlayerWordsRevealed is true, we are in discussion or results phase.
    // currentPlayerIndex is not actively used for turns.
    // resultsVisible is controlled by user action.
  }, [gameData]);

  const currentPlayer: Player | undefined = !allWordsRevealed && gameData.players.length > currentPlayerIndex 
    ? gameData.players[currentPlayerIndex] 
    : undefined;

  const handleRevealWord = () => {
    if (!currentPlayer) return; // Should not happen if !allWordsRevealed
    setShowWordModal(true);
  };

  const handleWordSeen = () => {
    setShowWordModal(false);
    if (!currentPlayer) return;

    const updatedPlayers = gameData.players.map((p) =>
      p.id === currentPlayer.id ? { ...p, wordRevealed: true } : p
    );
    
    const newGameData = { ...gameData, players: updatedPlayers };
    setGameData(newGameData); // This will trigger save in GamePlayWrapper and the useEffect above
  };
  
  const handleStartNewGameSetup = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/'; // Navigate to setup
  };

  const handlePlayAgainSamePlayers = () => {
    const playerNames = gameData.players.map(p => p.name);
    const newGameSetup = initializePlayers(playerNames);
    setGameData(newGameSetup);
    // The useEffect listening to gameData will reset other local states like
    // currentPlayerIndex, allWordsRevealed, resultsVisible, showWordModal.
  };

  const handleRevealResults = () => {
    setResultsVisible(true);
  };

  // Phase 1: Revealing words to players
  if (!allWordsRevealed) {
    if (!currentPlayer) {
      // This case should ideally not be reached if logic is correct,
      // but it's a safe fallback.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>An issue occurred determining the current player.</p>
              <Button onClick={handleStartNewGameSetup} className="mt-4">Go to Setup</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-primary">Mr. White Game In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-6 bg-secondary/50">
              <HelpCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold">Player's Turn: {currentPlayer.name}</AlertTitle>
              <AlertDescription>
                It's your turn, {currentPlayer.name}. Click the button below to reveal your word secretly.
                Make sure no one else is looking!
              </AlertDescription>
            </Alert>

            <div className="text-center mb-6">
              <Button onClick={handleRevealWord} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <Eye className="mr-2" /> Reveal My Word
              </Button>
            </div>

            <Dialog open={showWordModal} onOpenChange={setShowWordModal}>
              <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary text-center">Your Secret Word, {currentPlayer.name}</DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    Keep this word to yourself!
                  </DialogDescription>
                </DialogHeader>
                <div className="my-6 p-6 bg-secondary/30 rounded-md text-center">
                  <p className={`text-3xl font-bold ${currentPlayer.isMrWhite ? 'text-accent' : 'text-primary'}`}>
                    {currentPlayer.word}
                  </p>
                </div>
                <DialogFooter className="sm:justify-center">
                  <Button onClick={handleWordSeen} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <CheckCircle className="mr-2" /> Got It!
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2"><List /> Players ({gameData.players.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <ul className="space-y-2">
                    {gameData.players.map((player) => (
                      <li
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out
                          ${player.id === currentPlayer.id && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent' : 'bg-secondary/20'}
                          ${player.wordRevealed ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <User className={`h-5 w-5 ${player.id === currentPlayer.id && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                          <span className="font-medium">{player.name}</span>
                          {player.id === currentPlayer.id && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse">Current Turn</Badge>}
                        </div>
                        {player.wordRevealed ? (
                          <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="mr-1 h-4 w-4" /> Word Seen</Badge>
                        ) : (
                          <Badge variant="outline">Waiting...</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
                <Button 
                  onClick={handleStartNewGameSetup} 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Settings2 className="mr-2" /> New Game Setup
                </Button>
              </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Phase 2: Discussion phase (all words revealed, but results not yet visible)
  if (allWordsRevealed && !resultsVisible) {
    const discussionStarter = gameData.players.length > 0 ? gameData.players[0].name : "The first player";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-lg shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <ListChecks /> Time to Discuss!
            </CardTitle>
            <CardDescription>
              All words have been revealed. The discussion begins with <span className="font-semibold text-accent">{discussionStarter}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Players, discuss and try to find Mr. White!</p>
            <Button onClick={handleRevealResults} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Eye className="mr-2" /> Reveal Mr. White & Word
            </Button>
            <Button onClick={handlePlayAgainSamePlayers} variant="secondary" className="w-full">
              <RotateCcw className="mr-2" /> Play Again (Same Players)
            </Button>
            <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full">
              <UsersRound className="mr-2" /> New Game Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Phase 3: Results are visible
  if (allWordsRevealed && resultsVisible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-lg shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles /> Results!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">The civilian word was: <strong className="text-primary">{gameData.civilianWord}</strong></p>
            <p className="text-lg mb-4">Mr. White was: <strong className="text-accent">{gameData.mrWhiteName || 'someone'}</strong></p>
            
            <Button onClick={handlePlayAgainSamePlayers} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <RotateCcw className="mr-2" /> Play Again (Same Players)
            </Button>
            <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full">
              <UsersRound className="mr-2" /> New Game Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback, should ideally not be reached
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      Loading game state...
    </div>
  );
}

