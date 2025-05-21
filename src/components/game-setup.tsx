
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { initializePlayers, MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game-logic';
import type { GameData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Users, Play, PlusCircle, Trash2 } from 'lucide-react';

export default function GameSetup() {
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const router = useRouter();
  const { toast } = useToast();

  const handlePlayerNameChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = event.target.value;
    setPlayerNames(newPlayerNames);
  };

  const addPlayer = () => {
    if (playerNames.length < MAX_PLAYERS) {
      setPlayerNames([...playerNames, '']);
    } else {
      toast({
        title: "Máximo de Jugadores Alcanzado",
        description: `No puedes tener más de ${MAX_PLAYERS} jugadores.`,
        variant: "default",
      });
    }
  };

  const removePlayer = (indexToRemove: number) => {
    if (playerNames.length > MIN_PLAYERS) {
      setPlayerNames(playerNames.filter((_, index) => index !== indexToRemove));
    } else {
      toast({
        title: "Mínimo de Jugadores Requerido",
        description: `Necesitas al menos ${MIN_PLAYERS} jugadores.`,
        variant: "default",
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (playerNames.some(name => name.trim() === '')) {
      toast({
        title: "Error de Validación",
        description: "Todos los nombres de los jugadores deben estar completos.",
        variant: "destructive",
      });
      return;
    }
    
    if (new Set(playerNames.map(name => name.trim().toLowerCase())).size !== playerNames.length) {
      toast({
        title: "Error de Validación",
        description: "Los nombres de los jugadores deben ser únicos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // initializePlayers ahora devuelve el objeto GameData completo
      const gameData: GameData = initializePlayers(playerNames.map(name => name.trim()));
      
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
      router.push('/game');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ha ocurrido un error desconocido";
      toast({
        title: "Error al Configurar el Juego",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-background to-card">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">El Juego de Mr. White</CardTitle>
          <CardDescription className="text-muted-foreground">Configura tu sesión de juego</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-lg font-medium">
                <Users className="text-primary h-5 w-5" /> Jugadores ({playerNames.length})
              </Label>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {playerNames.map((name, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`playerName-${index}`}>{`Nombre del Jugador ${index + 1}`}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`playerName-${index}`}
                        type="text"
                        value={name}
                        onChange={(e) => handlePlayerNameChange(index, e)}
                        placeholder={`Introduce el nombre del Jugador ${index + 1}`}
                        required
                        maxLength={20}
                        className="flex-grow"
                      />
                      {playerNames.length > MIN_PLAYERS && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(index)}
                          aria-label={`Eliminar Jugador ${index + 1}`}
                          className="text-destructive hover:bg-destructive/10 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {playerNames.length < MAX_PLAYERS && (
              <Button
                type="button"
                variant="outline"
                onClick={addPlayer}
                className="w-full border-dashed hover:border-primary hover:text-primary"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Jugador
              </Button>
            )}
            
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                <Play className="mr-2 h-5 w-5" /> Empezar Juego
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
