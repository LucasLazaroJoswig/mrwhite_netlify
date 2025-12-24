"use client";

import React, { useState, useEffect } from 'react';
import type { WavelengthGameData } from '@/lib/types';
import WavelengthDisplay from '@/components/wavelength-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Loader2 } from 'lucide-react';

export default function WavelengthWrapper() {
  const [gameData, setGameData] = useState<WavelengthGameData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('wavelengthGameData');
    if (storedData) {
      try {
        setGameData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing wavelength game data:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (gameData) {
      localStorage.setItem('wavelengthGameData', JSON.stringify(gameData));
    }
  }, [gameData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="mt-4 text-muted-foreground">Cargando partida...</p>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md text-center border-2 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-foreground">No hay partida activa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Parece que no tienes una partida de Wavelength en curso.
            </p>
            <Button
              onClick={() => window.location.href = '/wavelength'}
              className="bg-gradient-to-r from-pink-500 to-rose-600"
            >
              <Home className="mr-2 h-4 w-4" /> Nueva Partida
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <WavelengthDisplay gameData={gameData} setGameData={setGameData} />;
}
