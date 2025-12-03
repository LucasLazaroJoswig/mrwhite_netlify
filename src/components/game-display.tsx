
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, RotateCcw, Home, User, Crown, AlertTriangle, PartyPopper, Skull, ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { resetGameWithSamePlayers } from '@/lib/game-logic';
import { CATEGORIES } from '@/lib/words';

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWordModal, setShowWordModal] = useState(false);
  const [playerForModal, setPlayerForModal] = useState<Player | null>(null);

  const allPlayersRevealed = gameData.players.every(p => p.wordRevealed);

  useEffect(() => {
    if (gameData.gamePhase === 'wordReveal' && !allPlayersRevealed) {
      const nextIdx = gameData.players.findIndex(p => !p.wordRevealed);
      setCurrentPlayerIndex(nextIdx !== -1 ? nextIdx : 0);
    } else if (allPlayersRevealed && gameData.gamePhase === 'wordReveal') {
      setGameData(prev => prev ? ({ ...prev, gamePhase: 'playing' }) : null);
    }
  }, [gameData.players, allPlayersRevealed, gameData.gamePhase, setGameData]);

  const currentPlayer = gameData.gamePhase === 'wordReveal' && !allPlayersRevealed
    ? gameData.players[currentPlayerIndex]
    : undefined;

  const handleRevealWord = () => {
    if (!currentPlayer) return;
    setPlayerForModal(currentPlayer);
    setShowWordModal(true);
  };

  const handleWordSeen = () => {
    if (!playerForModal) return;
    const updatedPlayers = gameData.players.map((p) =>
      p.id === playerForModal.id ? { ...p, wordRevealed: true } : p
    );
    setGameData(prev => prev ? { ...prev, players: updatedPlayers } : null);
    setShowWordModal(false);
    setTimeout(() => setPlayerForModal(null), 200);
  };

  const handleRevealImpostor = () => {
    setGameData(prev => prev ? ({ ...prev, gamePhase: 'results' }) : null);
  };

  const handlePlayAgain = () => {
    const newGame = resetGameWithSamePlayers(gameData);
    setGameData(newGame);
    setCurrentPlayerIndex(0);
  };

  const handleNewGame = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/';
  };

  const getCategoryInfo = () => {
    if (gameData.category) {
      const cat = CATEGORIES.find(c => c.id === gameData.category);
      return cat ? `${cat.icon} ${cat.name}` : '';
    }
    return '';
  };

  // Word Reveal Phase
  if (gameData.gamePhase === 'wordReveal') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary/30 bg-card">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">🕵️</div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Repartiendo Roles
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Cada jugador debe ver su carta en secreto
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current player indicator */}
            <div className="bg-accent/10 border-2 border-accent rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Turno de:</p>
              <p className="text-2xl font-bold text-accent">{currentPlayer?.name}</p>
            </div>

            <Button
              onClick={handleRevealWord}
              className="w-full bg-gradient-to-r from-primary to-accent text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Eye className="mr-2 h-5 w-5" /> Ver Mi Carta
            </Button>

            {/* Player list */}
            <div className="bg-secondary/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> Jugadores ({gameData.players.filter(p => p.wordRevealed).length}/{gameData.players.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {gameData.players.map((player, idx) => (
                  <Badge
                    key={player.id}
                    variant={player.wordRevealed ? "default" : "outline"}
                    className={`${
                      player.wordRevealed
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : idx === currentPlayerIndex
                        ? 'bg-accent/20 text-accent border-accent animate-pulse'
                        : 'text-muted-foreground border-muted'
                    }`}
                  >
                    {player.wordRevealed && <CheckCircle className="w-3 h-3 mr-1" />}
                    {player.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Word reveal modal */}
        <Dialog open={showWordModal} onOpenChange={setShowWordModal}>
          <DialogContent className="sm:max-w-sm bg-card border-2 border-primary/50">
            {playerForModal && (
              <>
                <DialogHeader className="text-center">
                  <div className={`text-6xl mb-4 ${playerForModal.isImpostor ? 'animate-pulse' : ''}`}>
                    {playerForModal.isImpostor ? '🎭' : '👤'}
                  </div>
                  <DialogTitle className={`text-3xl font-black ${
                    playerForModal.isImpostor ? 'text-red-500' : 'text-primary'
                  }`}>
                    {playerForModal.isImpostor ? '¡IMPOSTOR!' : 'CIVIL'}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    {playerForModal.isImpostor
                      ? 'No sabes la palabra. ¡Intenta descubrirla sin que te pillen!'
                      : 'Tu palabra secreta es:'
                    }
                  </DialogDescription>
                </DialogHeader>

                {!playerForModal.isImpostor ? (
                  <div className="my-6 p-6 bg-primary/10 border-2 border-primary/30 rounded-2xl text-center">
                    <p className="text-4xl font-black text-primary break-all">
                      {playerForModal.word}
                    </p>
                    {gameData.subtype && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Tipo: <span className="text-accent font-semibold">{gameData.subtype}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="my-6 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-center">
                    {gameData.gameMode === 'withHint' && gameData.hint ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">Tu pista:</p>
                        <p className="text-2xl font-bold text-red-400">{gameData.hint}</p>
                      </>
                    ) : gameData.gameMode === 'categories' && gameData.category ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">Categoría:</p>
                        <p className="text-2xl font-bold text-red-400">{getCategoryInfo()}</p>
                        {gameData.subtype && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Tipo: <span className="font-semibold">{gameData.subtype}</span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xl text-red-400">
                        No tienes ninguna pista. ¡Buena suerte!
                      </p>
                    )}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    onClick={handleWordSeen}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg py-5"
                  >
                    <CheckCircle className="mr-2" /> Entendido
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Playing Phase
  if (gameData.gamePhase === 'playing') {
    const startingPlayer = gameData.players.find(p => p.isStartingPlayer);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-accent/30 bg-card">
          <CardHeader className="text-center pb-2">
            <div className="text-5xl mb-3">🎮</div>
            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              ¡A JUGAR!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Starting player */}
            <div className="bg-accent/10 border-2 border-accent/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                <Crown className="w-4 h-4 text-accent" /> Empieza:
              </p>
              <p className="text-2xl font-bold text-accent">{startingPlayer?.name}</p>
            </div>

            {/* Game info */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="outline" className="text-primary border-primary">
                  {gameData.gameMode === 'classic' ? 'Clásico' :
                   gameData.gameMode === 'withHint' ? 'Con Pista' :
                   getCategoryInfo()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Jugadores:</span>
                <span className="font-semibold text-foreground">{gameData.players.length}</span>
              </div>
              {gameData.subtype && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-semibold text-accent">{gameData.subtype}</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" /> Cómo jugar:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  Por turnos, cada uno dice UNA palabra relacionada
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  Debatid y votad quién creéis que es el impostor
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  Cuando decidáis, pulsad el botón para revelar
                </li>
              </ul>
            </div>

            {/* Player order */}
            <div className="bg-secondary/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-2">Orden de turnos:</p>
              <div className="flex flex-wrap gap-2">
                {gameData.players.map((player, idx) => (
                  <Badge
                    key={player.id}
                    variant="outline"
                    className={`${
                      player.isStartingPlayer
                        ? 'bg-accent/20 text-accent border-accent'
                        : 'text-foreground/80 border-muted'
                    }`}
                  >
                    {player.isStartingPlayer && <Crown className="w-3 h-3 mr-1" />}
                    {idx + 1}. {player.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleRevealImpostor}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Skull className="mr-2 h-5 w-5" /> Revelar Impostor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Phase
  if (gameData.gamePhase === 'results') {
    const impostor = gameData.players.find(p => p.isImpostor);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-red-500/30 bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-red-500/20 to-accent/20 p-6 text-center">
            <div className="text-6xl mb-3 animate-bounce">🎭</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-accent">
              ¡REVELACIÓN!
            </h2>
          </div>

          <CardContent className="space-y-6 pt-6">
            {/* Impostor reveal */}
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">El impostor era:</p>
              <p className="text-4xl font-black text-red-500">{impostor?.name}</p>
            </div>

            {/* Secret word */}
            <div className="bg-primary/10 border-2 border-primary/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">La palabra secreta era:</p>
              <p className="text-3xl font-black text-primary">{gameData.secretWord}</p>
              {gameData.subtype && (
                <p className="text-sm text-muted-foreground mt-1">
                  ({gameData.subtype})
                </p>
              )}
            </div>

            {/* Player roles */}
            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">Roles:</p>
              <div className="space-y-2">
                {gameData.players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      player.isImpostor ? 'bg-red-500/20' : 'bg-green-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.isImpostor ? '🎭' : '👤'}</span>
                      <span className="font-medium text-foreground">{player.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={player.isImpostor
                        ? 'text-red-400 border-red-500'
                        : 'text-green-400 border-green-500'
                      }
                    >
                      {player.isImpostor ? 'Impostor' : 'Civil'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-accent to-primary text-white text-lg py-5 rounded-xl"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Jugar Otra Vez
              </Button>
              <Button
                onClick={handleNewGame}
                variant="outline"
                className="w-full text-lg py-5 rounded-xl border-muted-foreground/50"
              >
                <Home className="mr-2 h-5 w-5" /> Menú Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Estado del juego desconocido</p>
          <Button onClick={handleNewGame}>Volver al inicio</Button>
        </CardContent>
      </Card>
    </div>
  );
}
