"use client";

import React, { useState, useEffect } from 'react';
import type { SpyfallGameData } from '@/lib/types';
import SpyfallDisplay from '@/components/spyfall-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Loader2 } from 'lucide-react';

export default function SpyfallWrapper() {
  const [gameData, setGameData] = useState<SpyfallGameData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('spyfallGameData');
    if (storedData) {
      try {
        setGameData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing spyfall game data:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (gameData) {
      localStorage.setItem('spyfallGameData', JSON.stringify(gameData));
    }
  }, [gameData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="mt-4 text-muted-foreground">Cargando partida...</p>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md text-center border-2 border-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-foreground">No hay partida activa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Parece que no tienes una partida de Spyfall en curso.
            </p>
            <Button
              onClick={() => window.location.href = '/spyfall'}
              className="bg-gradient-to-r from-indigo-500 to-blue-600"
            >
              <Home className="mr-2 h-4 w-4" /> Nueva Partida
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SpyfallDisplay gameData={gameData} setGameData={setGameData} />;
}
