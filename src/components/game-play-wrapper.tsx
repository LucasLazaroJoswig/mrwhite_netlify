
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
        if (
          parsedData &&
          parsedData.players &&
          parsedData.players.length > 0 &&
          parsedData.secretWord &&
          parsedData.gamePhase &&
          parsedData.gameMode
        ) {
          setGameData(parsedData);
        } else {
          setError("Datos de partida inválidos. Por favor, inicia una nueva partida.");
          localStorage.removeItem('mrWhiteGameData');
        }
      } else {
        setError("No se encontraron datos de la partida. Por favor, inicia una nueva partida.");
      }
    } catch (e) {
      console.error("Error al cargar los datos de la partida:", e);
      setError("Error al cargar los datos. Por favor, inicia una nueva partida.");
      localStorage.removeItem('mrWhiteGameData');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameData && !loading) {
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
    }
  }, [gameData, loading]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 space-y-4 text-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Cargando partida...</p>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-lg text-center border-2 border-destructive/30">
          <CardHeader>
            <div className="text-5xl mb-3">😵</div>
            <CardTitle className="text-2xl text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error || "Ha ocurrido un error inesperado."}</p>
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-primary to-accent text-white text-lg py-5"
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <GameDisplay gameData={gameData} setGameData={setGameData} />;
}
