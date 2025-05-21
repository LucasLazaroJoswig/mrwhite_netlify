"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, User, Eye, CheckCircle, Zap, ArrowRightCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWordModal, setShowWordModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentPlayer = gameData.players[currentPlayerIndex];

  const handleRevealWord = () => {
    setShowWordModal(true);
  };

  const handleWordSeen = () => {
    setShowWordModal(false);
    const updatedPlayers = gameData.players.map((p, index) =>
      index === currentPlayerIndex ? { ...p, wordRevealed: true } : p
    );
    
    const newGameData = { ...gameData, players: updatedPlayers };
    setGameData(newGameData); // Update state in parent

    if (updatedPlayers.every(p => p.wordRevealed)) {
      setIsGameOver(true);
    } else {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % gameData.players.length);
    }
  };
  
  const handlePlayAgain = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/'; // Navigate to setup
  };


  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-lg shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Zap /> All Words Revealed!
            </CardTitle>
            <CardDescription>The game has concluded. Mr. White was <span className="font-semibold text-accent">{gameData.mrWhiteName || 'someone'}</span>.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-2">The civilian word was: <strong className="text-primary">{gameData.civilianWord}</strong></p>
            <p className="text-muted-foreground">Time to discuss and find Mr. White!</p>
             <Button onClick={handlePlayAgain} className="mt-6 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Play Again
            </Button>
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
                  {gameData.players.map((player, index) => (
                    <li
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out
                        ${index === currentPlayerIndex && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent' : 'bg-secondary/20'}
                        ${player.wordRevealed ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <User className={`h-5 w-5 ${index === currentPlayerIndex && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                        <span className="font-medium">{player.name}</span>
                         {index === currentPlayerIndex && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse">Current Turn</Badge>}
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
                onClick={handlePlayAgain} 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                Restart Game
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
