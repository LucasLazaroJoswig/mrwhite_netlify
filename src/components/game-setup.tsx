
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
import { Users, Play, PlusCircle, Trash2, Shuffle } from 'lucide-react'; // Added Shuffle for a more gamey feel

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
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gradient-to-br from-background to-card">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary flex items-center justify-center">
          <Shuffle className="w-12 h-12 mr-3 text-accent" />
          Mr. White
          <span className="text-foreground/80 ml-2">Game Manager</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">¿Quién es el impostor?</p>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-foreground">
            Configuración de Partida
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Reúne a tus amigos, ¡la intriga está por comenzar!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-xl font-medium text-primary">
                <Users className="h-6 w-6" /> Jugadores ({playerNames.length} / {MAX_PLAYERS})
              </Label>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 rounded-md bg-background/50 p-3 border border-input">
                {playerNames.map((name, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`playerName-${index}`} className="text-sm text-foreground/90">{`Nombre del Jugador ${index + 1}`}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`playerName-${index}`}
                        type="text"
                        value={name}
                        onChange={(e) => handlePlayerNameChange(index, e)}
                        placeholder={`Jugador ${index + 1}`}
                        required
                        maxLength={25}
                        className="flex-grow bg-input border-border focus:border-primary focus:ring-primary text-base"
                      />
                      {playerNames.length > MIN_PLAYERS && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(index)}
                          aria-label={`Eliminar Jugador ${index + 1}`}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-full"
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
                className="w-full border-dashed hover:border-accent hover:text-accent text-foreground/80"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Jugador
              </Button>
            )}
            
            <CardFooter className="p-0 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                disabled={playerNames.some(name => name.trim() === '') || playerNames.length < MIN_PLAYERS}
              >
                <Play className="mr-2 h-6 w-6" /> Empezar Juego
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <p className="mt-8 text-xs text-muted-foreground">
        Tip: Mínimo {MIN_PLAYERS} jugadores, máximo {MAX_PLAYERS}.
      </p>
    </div>
  );
}
