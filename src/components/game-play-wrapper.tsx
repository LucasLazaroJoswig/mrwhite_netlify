
"use client";

import React, { useEffect, useState } from 'react';
import type { GameData } from '@/lib/types';
import GameDisplay from './game-display';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializePlayers } from '@/lib/game-logic';


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
        // Enhanced validation for the new GameData structure
        if (
          parsedData &&
          parsedData.players &&
          parsedData.players.length > 0 &&
          parsedData.civilianWord &&
          parsedData.gamePhase // Ensure gamePhase exists
        ) {
          // Ensure new optional fields exist or initialize them if loading older data
          const validatedGameData: GameData = {
            ...parsedData,
            payasoName: parsedData.payasoName || undefined,
            playerClues: parsedData.playerClues || {},
            votedPlayerId: parsedData.votedPlayerId || undefined,
            clueRanking: parsedData.clueRanking || undefined,
          };
          // Ensure all players have a role and clue property
          validatedGameData.players = validatedGameData.players.map(p => ({
            ...p,
            role: p.role || (p.isMrWhite ? 'mrwhite' : 'civilian'), // Basic role inference for older data
            clue: p.clue || '',
          }));

          setGameData(validatedGameData);
        } else {
          setError("Datos de partida inválidos o incompletos. Por favor, inicia una nueva partida.");
          localStorage.removeItem('mrWhiteGameData');
        }
      } else {
        setError("No se encontraron datos de la partida. Por favor, inicia una nueva partida.");
      }
    } catch (e) {
      console.error("Error al cargar los datos de la partida:", e);
      setError("Error al cargar los datos de la partida. Por favor, intenta iniciar una nueva partida.");
      localStorage.removeItem('mrWhiteGameData');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to save gameData to localStorage when it changes
  useEffect(() => {
    if (gameData && !loading) { 
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
    }
  }, [gameData, loading]);


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Cargando tu partida...</p>
      </div>
    );
  }

  if (error || !gameData) {
    return (
       <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-8 w-8" /> Error al Cargar la Partida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error || "Ha ocurrido un error inesperado."}</p>
            <Button onClick={() => router.push('/')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Empezar Nueva Partida
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Fallback if gameData.players is somehow empty after loading. Reinitialize.
  if (gameData && gameData.players.length === 0) {
     const playerNames = ["Jugador1", "Jugador2", "Jugador3"]; // Default players
     const newGameData = initializePlayers(playerNames);
     setGameData(newGameData);
     // This will cause a re-render and the game will proceed with new data
     return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Reiniciando datos de partida...</p>
      </div>
    );
  }


  return <GameDisplay gameData={gameData} setGameData={setGameData} />;
}
