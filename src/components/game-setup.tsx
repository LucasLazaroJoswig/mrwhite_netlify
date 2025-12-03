
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeGame, MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game-logic';
import { CATEGORIES } from '@/lib/words';
import type { GameMode, CategoryType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Users, Play, PlusCircle, Trash2, ArrowLeft, Sparkles, Target, Grid3X3, HelpCircle } from 'lucide-react';

type SetupPhase = 'modeSelect' | 'categorySelect' | 'playerSetup';

export default function GameSetup() {
  const [phase, setPhase] = useState<SetupPhase>('modeSelect');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [category, setCategory] = useState<CategoryType | undefined>();
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const router = useRouter();
  const { toast } = useToast();

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'categories') {
      setPhase('categorySelect');
    } else {
      setCategory(undefined);
      setPhase('playerSetup');
    }
  };

  const handleCategorySelect = (cat: CategoryType) => {
    setCategory(cat);
    setPhase('playerSetup');
  };

  const handleBack = () => {
    if (phase === 'categorySelect') {
      setPhase('modeSelect');
    } else if (phase === 'playerSetup') {
      if (gameMode === 'categories') {
        setPhase('categorySelect');
      } else {
        setPhase('modeSelect');
      }
    }
  };

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
        title: "Máximo alcanzado",
        description: `No puedes tener más de ${MAX_PLAYERS} jugadores.`,
        duration: 3000,
      });
    }
  };

  const removePlayer = (indexToRemove: number) => {
    if (playerNames.length > MIN_PLAYERS) {
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
      const gameData = initializeGame(trimmedPlayerNames, gameMode, category);
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
      router.push('/game');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ha ocurrido un error";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const getModeDescription = (mode: GameMode) => {
    switch (mode) {
      case 'classic':
        return 'El impostor no sabe la palabra. Todos discuten y votan.';
      case 'withHint':
        return 'El impostor recibe una pista vaga. Ideal para pocos jugadores.';
      case 'categories':
        return 'Elige una categoría temática. El impostor sabrá la categoría.';
    }
  };

  // Mode Selection Screen
  if (phase === 'modeSelect') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-background">
        <div className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
            MR. WHITE
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">By Lucas Lazaro</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-center text-foreground mb-6">
            Elige el modo de juego
          </h2>

          {/* Classic Mode */}
          <button
            onClick={() => handleModeSelect('classic')}
            className="w-full group"
          >
            <Card className="border-2 border-primary/30 hover:border-primary bg-card hover:bg-primary/5 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-foreground">Clásico</h3>
                  <p className="text-sm text-muted-foreground">{getModeDescription('classic')}</p>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* With Hint Mode */}
          <button
            onClick={() => handleModeSelect('withHint')}
            className="w-full group"
          >
            <Card className="border-2 border-accent/30 hover:border-accent bg-card hover:bg-accent/5 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <HelpCircle className="w-7 h-7 text-accent" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-foreground">Con Pista</h3>
                  <p className="text-sm text-muted-foreground">{getModeDescription('withHint')}</p>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Categories Mode */}
          <button
            onClick={() => handleModeSelect('categories')}
            className="w-full group"
          >
            <Card className="border-2 border-green-500/30 hover:border-green-500 bg-card hover:bg-green-500/5 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Grid3X3 className="w-7 h-7 text-green-500" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-foreground">Categorías</h3>
                  <p className="text-sm text-muted-foreground">{getModeDescription('categories')}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
          Un jugador será el impostor. Los demás conocen la palabra secreta.
          Discutid y descubrid quién es el impostor.
        </p>
      </div>
    );
  }

  // Category Selection Screen
  if (phase === 'categorySelect') {
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
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            Elige una categoría
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            El impostor sabrá la categoría pero no la palabra
          </p>

          <div className="w-full max-w-lg grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group"
              >
                <Card className={`border-2 ${cat.id === 'football' ? 'border-green-500/50 hover:border-green-500' : 'border-border hover:border-primary'} bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]`}>
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    {cat.id === 'football' && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Player Setup Screen
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
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20 bg-card">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                gameMode === 'classic' ? 'bg-primary/20 text-primary' :
                gameMode === 'withHint' ? 'bg-accent/20 text-accent' :
                'bg-green-500/20 text-green-500'
              }`}>
                {gameMode === 'classic' ? 'Clásico' : gameMode === 'withHint' ? 'Con Pista' : `${CATEGORIES.find(c => c.id === category)?.icon} ${CATEGORIES.find(c => c.id === category)?.name}`}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Jugadores
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {MIN_PLAYERS}-{MAX_PLAYERS} jugadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e)}
                      placeholder={`Jugador ${index + 1}`}
                      required
                      maxLength={20}
                      className="flex-grow bg-input border-border focus:border-primary"
                    />
                    {playerNames.length > MIN_PLAYERS && (
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
                disabled={playerNames.some(name => name.trim() === '') || playerNames.length < MIN_PLAYERS}
              >
                <Play className="mr-2 h-5 w-5" /> JUGAR
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
