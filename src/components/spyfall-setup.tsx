"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeSpyfallGame, MIN_SPYFALL_PLAYERS, MAX_SPYFALL_PLAYERS } from '@/lib/spyfall-logic';
import { useToast } from '@/hooks/use-toast';
import { Users, Play, PlusCircle, Trash2, ArrowLeft, MapPin } from 'lucide-react';

export default function SpyfallSetup() {
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_SPYFALL_PLAYERS).fill(''));
  const router = useRouter();
  const { toast } = useToast();

  const handleBack = () => {
    router.push('/');
  };

  const handlePlayerNameChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = event.target.value;
    setPlayerNames(newPlayerNames);
  };

  const addPlayer = () => {
    if (playerNames.length < MAX_SPYFALL_PLAYERS) {
      setPlayerNames([...playerNames, '']);
    } else {
      toast({
        title: "Máximo alcanzado",
        description: `No puedes tener más de ${MAX_SPYFALL_PLAYERS} jugadores.`,
        duration: 3000,
      });
    }
  };

  const removePlayer = (indexToRemove: number) => {
    if (playerNames.length > MIN_SPYFALL_PLAYERS) {
      setPlayerNames(playerNames.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedPlayerNames = playerNames.map(name => name.trim());

    if (trimmedPlayerNames.some(name => name === '')) {
      toast({
        title: "Faltan nombres",
        description: "Todos los jugadores deben tener nombre.",
        variant: "destructive",
      });
      return;
    }

    if (new Set(trimmedPlayerNames.map(name => name.toLowerCase())).size !== trimmedPlayerNames.length) {
      toast({
        title: "Nombres duplicados",
        description: "Los nombres deben ser únicos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const gameData = initializeSpyfallGame(trimmedPlayerNames);
      localStorage.setItem('spyfallGameData', JSON.stringify(gameData));
      router.push('/spyfall/game');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ha ocurrido un error";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="self-start mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
            SPYFALL
          </h1>
          <p className="text-muted-foreground mt-2">
            Encuentra al espía
          </p>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-2 border-indigo-500/20 bg-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" />
              Jugadores
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {MIN_SPYFALL_PLAYERS}-{MAX_SPYFALL_PLAYERS} jugadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e)}
                      placeholder={`Jugador ${index + 1}`}
                      required
                      maxLength={20}
                      className="flex-grow bg-input border-border focus:border-indigo-500"
                    />
                    {playerNames.length > MIN_SPYFALL_PLAYERS && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlayer(index)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {playerNames.length < MAX_SPYFALL_PLAYERS && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPlayer}
                  className="w-full border-dashed hover:border-indigo-500 hover:text-indigo-400"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Jugador
                </Button>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-lg py-6 rounded-xl shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02] transition-all"
                disabled={playerNames.some(name => name.trim() === '') || playerNames.length < MIN_SPYFALL_PLAYERS}
              >
                <Play className="mr-2 h-5 w-5" /> JUGAR
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 max-w-md text-center">
          <p className="text-xs text-muted-foreground">
            Todos conocen el lugar secreto excepto el espía.
            <br />
            Haced preguntas para descubrir quién es el espía.
          </p>
        </div>
      </div>
    </div>
  );
}
