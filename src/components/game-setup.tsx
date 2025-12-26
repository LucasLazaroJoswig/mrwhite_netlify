
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
import { Users, Play, PlusCircle, Trash2, ArrowLeft, Target, Grid3X3, HelpCircle, MessageCircleQuestion, UserX, Minus, Plus } from 'lucide-react';

type SetupPhase = 'modeSelect' | 'categorySelect' | 'playerSetup';

export default function GameSetup() {
  const [phase, setPhase] = useState<SetupPhase>('modeSelect');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [category, setCategory] = useState<CategoryType | undefined>();
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const [impostorCount, setImpostorCount] = useState<number>(1);
  const router = useRouter();
  const { toast } = useToast();

  // Máximo de impostores: número de jugadores - 1 (al menos un civil)
  const maxImpostors = Math.max(1, playerNames.length - 1);

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
      // Asegurarse de que el número de impostores no exceda el máximo permitido
      const validImpostorCount = Math.min(impostorCount, trimmedPlayerNames.length - 1);
      const gameData = initializeGame(trimmedPlayerNames, gameMode, category, validImpostorCount);
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

  const incrementImpostors = () => {
    if (impostorCount < maxImpostors) {
      setImpostorCount(impostorCount + 1);
    }
  };

  const decrementImpostors = () => {
    if (impostorCount > 1) {
      setImpostorCount(impostorCount - 1);
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
      case 'hiddenOpinion':
        return 'Todos responden una pregunta. El impostor recibe una diferente.';
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

          {/* Hidden Opinion Mode */}
          <button
            onClick={() => handleModeSelect('hiddenOpinion')}
            className="w-full group"
          >
            <Card className="border-2 border-violet-500/30 hover:border-violet-500 bg-card hover:bg-violet-500/5 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-violet-500/10 rounded-full blur-xl" />
              <div className="absolute -left-2 -bottom-2 w-12 h-12 bg-violet-400/10 rounded-full blur-lg" />

              <CardContent className="p-6 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/30 flex items-center justify-center group-hover:from-violet-500/30 group-hover:to-violet-600/40 transition-all shadow-lg shadow-violet-500/10">
                  <MessageCircleQuestion className="w-7 h-7 text-violet-500" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    Opinión Oculta
                    <span className="text-[10px] font-medium bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">NUEVO</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{getModeDescription('hiddenOpinion')}</p>
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
                className="group aspect-square"
              >
                <Card className="border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="font-semibold text-foreground">{cat.name}</span>
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
                gameMode === 'hiddenOpinion' ? 'bg-violet-500/20 text-violet-400' :
                'bg-green-500/20 text-green-500'
              }`}>
                {gameMode === 'classic' ? 'Clásico' :
                 gameMode === 'withHint' ? 'Con Pista' :
                 gameMode === 'hiddenOpinion' ? '💬 Opinión Oculta' :
                 `${CATEGORIES.find(c => c.id === category)?.icon} ${CATEGORIES.find(c => c.id === category)?.name}`}
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

              {/* Selector de número de impostores */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-foreground">Mr. White</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementImpostors}
                      disabled={impostorCount <= 1}
                      className="h-8 w-8 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg text-foreground">
                      {impostorCount}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementImpostors}
                      disabled={impostorCount >= maxImpostors}
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Máximo: {maxImpostors} {maxImpostors === 1 ? 'impostor' : 'impostores'} ({playerNames.length} jugadores)
                </p>
              </div>

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
