
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
import { Users, Play, PlusCircle, Trash2, Shuffle } from 'lucide-react';

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
        duration: 3000,
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
        duration: 3000,
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedPlayerNames = playerNames.map(name => name.trim());

    if (trimmedPlayerNames.some(name => name === '')) {
      toast({
        title: "Error de Validación",
        description: "Todos los nombres de los jugadores deben estar completos.",
        variant: "destructive",
      });
      return;
    }

    if (new Set(trimmedPlayerNames.map(name => name.toLowerCase())).size !== trimmedPlayerNames.length) {
      toast({
        title: "Error de Validación",
        description: "Los nombres de los jugadores deben ser únicos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const gameData: GameData = initializePlayers(trimmedPlayerNames);
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
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-background">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary flex items-center justify-center">
          <Shuffle className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3 text-accent" />
          Mr. White
          <span className="text-foreground/80 ml-1.5 sm:ml-2">Game Manager</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-md sm:text-lg">¿Quién es el impostor?</p>
      </div>

      <Card className="w-full max-w-md sm:max-w-lg shadow-2xl border-2 border-primary/20 bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">
            Configuración de Partida
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm sm:text-base">
            Reúne a tus amigos, ¡la intriga está por comenzar! ({MIN_PLAYERS}-{MAX_PLAYERS} jugadores)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center gap-2 text-lg sm:text-xl font-medium text-primary">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" /> Jugadores ({playerNames.length} / {MAX_PLAYERS})
              </Label>
              <div className="space-y-2.5 sm:space-y-3 max-h-[240px] sm:max-h-[280px] overflow-y-auto pr-2 rounded-md bg-background/50 p-3 border border-input">
                {playerNames.map((name, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`playerName-${index}`} className="text-xs sm:text-sm text-foreground/90">{`Nombre del Jugador ${index + 1}`}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`playerName-${index}`}
                        type="text"
                        value={name}
                        onChange={(e) => handlePlayerNameChange(index, e)}
                        placeholder={`Jugador ${index + 1}`}
                        required
                        maxLength={25}
                        className="flex-grow bg-input border-border focus:border-primary focus:ring-primary text-sm sm:text-base"
                      />
                      {playerNames.length > MIN_PLAYERS && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(index)}
                          aria-label={`Eliminar Jugador ${index + 1}`}
                          className="text-destructive hover:bg-destructive/10 p-1.5 sm:p-2 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                className="w-full border-dashed hover:border-accent hover:text-accent text-foreground/80 text-sm sm:text-base py-2.5"
              >
                <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Añadir Jugador
              </Button>
            )}

            <CardFooter className="p-0 pt-4 sm:pt-6">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-md sm:text-lg py-3 sm:py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                disabled={playerNames.some(name => name.trim() === '') || playerNames.length < MIN_PLAYERS}
                aria-label="Empezar juego"
              >
                <Play className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Empezar Juego
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 sm:mt-8 text-xs text-muted-foreground text-center">
        Tip: Mínimo {MIN_PLAYERS} jugadores, máximo {MAX_PLAYERS}.<br/>
        Las reglas de Mr. White y Payaso varían según el número de jugadores.
      </p>
    </div>
  );
}

