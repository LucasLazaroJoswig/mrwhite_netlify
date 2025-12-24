"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import type { SpyfallGameData, SpyfallPlayer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, RotateCcw, Home, User, MapPin, Skull, Users, HelpCircle, Timer, Search } from 'lucide-react';
import { resetSpyfallGame } from '@/lib/spyfall-logic';

interface SpyfallDisplayProps {
  gameData: SpyfallGameData;
  setGameData: Dispatch<SetStateAction<SpyfallGameData | null>>;
}

export default function SpyfallDisplay({ gameData, setGameData }: SpyfallDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [playerForModal, setPlayerForModal] = useState<SpyfallPlayer | null>(null);
  const [showRemindModal, setShowRemindModal] = useState(false);
  const [showRemindLocationModal, setShowRemindLocationModal] = useState(false);
  const [remindPlayer, setRemindPlayer] = useState<SpyfallPlayer | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const allPlayersRevealed = gameData.players.every(p => p.locationRevealed);

  useEffect(() => {
    if (gameData.gamePhase === 'locationReveal' && !allPlayersRevealed) {
      const nextIdx = gameData.players.findIndex(p => !p.locationRevealed);
      setCurrentPlayerIndex(nextIdx !== -1 ? nextIdx : 0);
    } else if (allPlayersRevealed && gameData.gamePhase === 'locationReveal') {
      // Start the game and timer
      setGameData(prev => prev ? ({
        ...prev,
        gamePhase: 'playing',
        startTime: Date.now()
      }) : null);
    }
  }, [gameData.players, allPlayersRevealed, gameData.gamePhase, setGameData]);

  // Timer logic
  useEffect(() => {
    if (gameData.gamePhase === 'playing' && gameData.startTime && gameData.timerSeconds) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameData.startTime!) / 1000);
        const remaining = gameData.timerSeconds! - elapsed;
        setTimeRemaining(remaining > 0 ? remaining : 0);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameData.gamePhase, gameData.startTime, gameData.timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPlayer = gameData.gamePhase === 'locationReveal' && !allPlayersRevealed
    ? gameData.players[currentPlayerIndex]
    : undefined;

  const handleRevealLocation = () => {
    if (!currentPlayer) return;
    setPlayerForModal(currentPlayer);
    setShowLocationModal(true);
  };

  const handleLocationSeen = () => {
    if (!playerForModal) return;
    const updatedPlayers = gameData.players.map((p) =>
      p.id === playerForModal.id ? { ...p, locationRevealed: true } : p
    );
    setGameData(prev => prev ? { ...prev, players: updatedPlayers } : null);
    setShowLocationModal(false);
    setTimeout(() => setPlayerForModal(null), 200);
  };

  const handleRevealSpy = () => {
    setGameData(prev => prev ? ({ ...prev, gamePhase: 'results' }) : null);
  };

  const handlePlayAgain = () => {
    const newGame = resetSpyfallGame(gameData);
    setGameData(newGame);
    setCurrentPlayerIndex(0);
    setTimeRemaining(null);
  };

  const handleNewGame = () => {
    localStorage.removeItem('spyfallGameData');
    window.location.href = '/';
  };

  const handleSelectPlayerToRemind = (player: SpyfallPlayer) => {
    setRemindPlayer(player);
    setShowRemindModal(false);
    setShowRemindLocationModal(true);
  };

  const handleCloseRemindLocation = () => {
    setShowRemindLocationModal(false);
    setTimeout(() => setRemindPlayer(null), 200);
  };

  // Location Reveal Phase
  if (gameData.gamePhase === 'locationReveal') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-indigo-500/30 bg-card">
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
            <div className="bg-indigo-500/10 border-2 border-indigo-500 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Turno de:</p>
              <p className="text-2xl font-bold text-indigo-400">{currentPlayer?.name}</p>
            </div>

            <Button
              onClick={handleRevealLocation}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Eye className="mr-2 h-5 w-5" /> Ver Mi Carta
            </Button>

            {/* Player list */}
            <div className="bg-secondary/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> Jugadores ({gameData.players.filter(p => p.locationRevealed).length}/{gameData.players.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {gameData.players.map((player, idx) => (
                  <Badge
                    key={player.id}
                    variant={player.locationRevealed ? "default" : "outline"}
                    className={`${
                      player.locationRevealed
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : idx === currentPlayerIndex
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500 animate-pulse'
                        : 'text-muted-foreground border-muted'
                    }`}
                  >
                    {player.locationRevealed && <CheckCircle className="w-3 h-3 mr-1" />}
                    {player.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location reveal modal */}
        <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
          <DialogContent className="sm:max-w-sm bg-card border-2 border-indigo-500/50">
            {playerForModal && (
              <>
                <DialogHeader className="text-center">
                  <div className={`text-6xl mb-4 ${playerForModal.isSpy ? 'animate-pulse' : ''}`}>
                    {playerForModal.isSpy ? '🕵️' : gameData.location.icon}
                  </div>
                  <DialogTitle className={`text-3xl font-black ${
                    playerForModal.isSpy ? 'text-red-500' : 'text-indigo-400'
                  }`}>
                    {playerForModal.isSpy ? '¡ERES EL ESPÍA!' : gameData.location.name}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    {playerForModal.isSpy
                      ? 'No sabes el lugar. ¡Descúbrelo sin que te pillen!'
                      : `Tu rol: ${playerForModal.role}`
                    }
                  </DialogDescription>
                </DialogHeader>

                {playerForModal.isSpy ? (
                  <div className="my-6 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-center">
                    <p className="text-sm text-muted-foreground mb-2">Posibles lugares:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {gameData.allLocations.slice(0, 8).map(loc => (
                        <Badge key={loc.id} variant="outline" className="text-xs">
                          {loc.icon} {loc.name}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{gameData.allLocations.length - 8} más
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="my-6 p-6 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-2xl text-center">
                    <p className="text-4xl font-black text-indigo-400">
                      {gameData.location.icon}
                    </p>
                    <p className="text-2xl font-bold text-indigo-400 mt-2">
                      {gameData.location.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Tu rol: <span className="text-indigo-300 font-semibold">{playerForModal.role}</span>
                    </p>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    onClick={handleLocationSeen}
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-indigo-500/30 bg-card">
          <CardHeader className="text-center pb-2">
            <div className="text-5xl mb-3">🔍</div>
            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              ¡A INTERROGAR!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer */}
            {timeRemaining !== null && (
              <div className={`border-2 rounded-xl p-4 text-center ${
                timeRemaining < 60 ? 'bg-red-500/10 border-red-500/50' : 'bg-indigo-500/10 border-indigo-500/50'
              }`}>
                <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <Timer className={`w-4 h-4 ${timeRemaining < 60 ? 'text-red-400' : 'text-indigo-400'}`} /> Tiempo restante
                </p>
                <p className={`text-3xl font-bold ${
                  timeRemaining < 60 ? 'text-red-400 animate-pulse' : 'text-indigo-400'
                }`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                Cómo jugar:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Por turnos, haced preguntas a otros jugadores</li>
                <li>• Las preguntas deben ser sobre el lugar</li>
                <li>• El espía intenta descubrir el lugar</li>
                <li>• Los demás intentan descubrir al espía</li>
                <li>• En cualquier momento podéis votar</li>
              </ul>
            </div>

            {/* All possible locations (reference) */}
            <div className="bg-secondary/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Lugares posibles
              </p>
              <div className="grid grid-cols-3 gap-2">
                {gameData.allLocations.map(loc => (
                  <div key={loc.id} className="text-center p-2 rounded-lg bg-card border border-muted">
                    <span className="text-lg">{loc.icon}</span>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{loc.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleRevealSpy}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Skull className="mr-2 h-5 w-5" /> Revelar Espía
            </Button>

            <Button
              onClick={() => setShowRemindModal(true)}
              variant="outline"
              className="w-full border-muted-foreground/30 hover:bg-secondary/50 text-indigo-400 hover:border-indigo-500"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Ver mi carta
            </Button>
          </CardContent>
        </Card>

        {/* Modal para seleccionar jugador */}
        <Dialog open={showRemindModal} onOpenChange={setShowRemindModal}>
          <DialogContent className="sm:max-w-sm bg-card border-2 border-indigo-500/50">
            <DialogHeader className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <DialogTitle className="text-xl font-bold">¿Quién eres?</DialogTitle>
              <DialogDescription>
                Selecciona tu nombre para ver tu carta
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {gameData.players.map((player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 hover:bg-indigo-500/20 hover:border-indigo-500"
                  onClick={() => handleSelectPlayerToRemind(player)}
                >
                  <User className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{player.name}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para mostrar la ubicación */}
        <Dialog open={showRemindLocationModal} onOpenChange={setShowRemindLocationModal}>
          <DialogContent className="sm:max-w-sm bg-card border-2 border-indigo-500/50">
            {remindPlayer && (
              <>
                <DialogHeader className="text-center">
                  <div className={`text-6xl mb-4 ${remindPlayer.isSpy ? 'animate-pulse' : ''}`}>
                    {remindPlayer.isSpy ? '🕵️' : gameData.location.icon}
                  </div>
                  <DialogTitle className={`text-3xl font-black ${
                    remindPlayer.isSpy ? 'text-red-500' : 'text-indigo-400'
                  }`}>
                    {remindPlayer.isSpy ? '¡ERES EL ESPÍA!' : gameData.location.name}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    {remindPlayer.isSpy
                      ? '¡Intenta descubrir el lugar sin que te pillen!'
                      : `Tu rol: ${remindPlayer.role}`
                    }
                  </DialogDescription>
                </DialogHeader>

                {remindPlayer.isSpy && (
                  <div className="my-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground mb-2">Posibles lugares:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {gameData.allLocations.slice(0, 6).map(loc => (
                        <Badge key={loc.id} variant="outline" className="text-xs">
                          {loc.icon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    onClick={handleCloseRemindLocation}
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

  // Results Phase
  if (gameData.gamePhase === 'results') {
    const spy = gameData.players.find(p => p.isSpy);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-indigo-500/30 bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500/20 to-red-500/20 p-6 text-center">
            <div className="text-6xl mb-3 animate-bounce">🕵️</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-red-500">
              ¡REVELACIÓN!
            </h2>
          </div>

          <CardContent className="space-y-6 pt-6">
            {/* Spy reveal */}
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">El espía era:</p>
              <p className="text-4xl font-black text-red-500">{spy?.name}</p>
            </div>

            {/* Location reveal */}
            <div className="bg-indigo-500/10 border-2 border-indigo-500/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">El lugar era:</p>
              <p className="text-5xl mb-2">{gameData.location.icon}</p>
              <p className="text-2xl font-black text-indigo-400">{gameData.location.name}</p>
            </div>

            {/* Player roles */}
            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">Roles:</p>
              <div className="space-y-2">
                {gameData.players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      player.isSpy ? 'bg-red-500/20' : 'bg-green-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.isSpy ? '🕵️' : '👤'}</span>
                      <span className="font-medium text-foreground">{player.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={player.isSpy
                        ? 'text-red-400 border-red-500'
                        : 'text-indigo-400 border-indigo-500'
                      }
                    >
                      {player.isSpy ? 'Espía' : player.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-lg py-5 rounded-xl"
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
