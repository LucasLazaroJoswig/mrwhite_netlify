
"use client";

import React, { useEffect, useState } from 'react';
import type { GameData } from '@/lib/types';
import GameDisplay from './game-display';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GamePlayWrapper() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('mrWhiteGameData');
      if (storedData) {
        const parsedData: GameData = JSON.parse(storedData);
        // Basic validation
        if (parsedData && parsedData.players && parsedData.players.length > 0 && parsedData.civilianWord) {
          setGameData(parsedData);
        } else {
          setError("Invalid game data found. Please start a new game.");
          localStorage.removeItem('mrWhiteGameData');
        }
      } else {
        setError("No game data found. Please start a new game.");
      }
    } catch (e) {
      console.error("Failed to load game data:", e);
      setError("Failed to load game data. Please try starting a new game.");
      localStorage.removeItem('mrWhiteGameData');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to save gameData to localStorage whenever it changes
  useEffect(() => {
    if (gameData && !loading) { // Ensure not to save during initial load if data is null
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
    }
  }, [gameData, loading]);


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your game...</p>
      </div>
    );
  }

  if (error || !gameData) {
    return (
       <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-8 w-8" /> Error Loading Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error || "An unexpected error occurred."}</p>
            <Button onClick={() => router.push('/')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Start New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <GameDisplay gameData={gameData} setGameData={setGameData} />;
}
