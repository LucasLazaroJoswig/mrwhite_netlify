
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, User, Eye, CheckCircle, HelpCircle, RotateCcw, Sparkles, Settings2, UsersRound, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializePlayers } from '@/lib/game-logic';

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerForModal, setPlayerForModal] = useState<Player | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [allWordsRevealed, setAllWordsRevealed] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    const allPlayerWordsRevealedStatus = gameData.players.every(p => p.wordRevealed);
    setAllWordsRevealed(allPlayerWordsRevealedStatus);

    if (!allPlayerWordsRevealedStatus) {
      const nextPlayerIdx = gameData.players.findIndex(p => !p.wordRevealed);
      setCurrentPlayerIndex(nextPlayerIdx !== -1 ? nextPlayerIdx : 0);
      setResultsVisible(false); 
      setPlayerForModal(null); 
    } else {
      // No es necesario cambiar currentPlayerIndex aquí
    }
  }, [gameData]);

  const currentPlayer: Player | undefined = !allWordsRevealed && gameData.players.length > currentPlayerIndex 
    ? gameData.players[currentPlayerIndex] 
    : undefined;

  const handleRevealWord = () => {
    if (!currentPlayer) return;
    setPlayerForModal(currentPlayer); // Mostrar la palabra del jugador actual en el modal
    setShowWordModal(true);
  };

  const handleWordSeen = () => {
    setShowWordModal(false);
    if (!playerForModal) return; // Asegurar que playerForModal existe

    const updatedPlayers = gameData.players.map((p) =>
      p.id === playerForModal.id ? { ...p, wordRevealed: true } : p
    );
    
    const newGameData = { ...gameData, players: updatedPlayers };
    setGameData(newGameData); 
    // No limpiar playerForModal aquí, se limpiará en el useEffect si cambia la fase,
    // o al cerrar el diálogo (onOpenChange)
  };
  
  const handleStartNewGameSetup = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/'; 
  };

  const handlePlayAgainSamePlayers = () => {
    const playerNames = gameData.players.map(p => p.name);
    // Pasar la palabra civil actual para intentar evitar su repetición
    const newGameSetup = initializePlayers(playerNames, gameData.civilianWord);
    setGameData(newGameSetup);
    // El useEffect que observa gameData reseteará los estados locales necesarios.
  };

  const handleRevealResults = () => {
    setResultsVisible(true);
  };

  // Fase 1: Revelando palabras a los jugadores
  if (!allWordsRevealed) {
    if (!currentPlayer) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ocurrió un problema al determinar el jugador actual.</p>
              <Button onClick={handleStartNewGameSetup} className="mt-4">Ir a Configuración</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-primary">Juego de Mr. White en Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-6 bg-secondary/50">
              <HelpCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold">Turno del Jugador: {currentPlayer.name}</AlertTitle>
              <AlertDescription>
                Es tu turno, {currentPlayer.name}. Haz clic en el botón de abajo para revelar tu palabra en secreto.
                ¡Asegúrate de que nadie más esté mirando!
              </AlertDescription>
            </Alert>

            <div className="text-center mb-6">
              <Button onClick={handleRevealWord} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <Eye className="mr-2" /> Revelar Mi Palabra
              </Button>
            </div>

            <Dialog open={showWordModal} onOpenChange={(isOpen) => {
              setShowWordModal(isOpen);
              if (!isOpen) setPlayerForModal(null); // Limpiar playerForModal al cerrar
            }}>
              <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary text-center">Tu Palabra Secreta, {playerForModal?.name}</DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    ¡Guarda esta palabra para ti!
                  </DialogDescription>
                </DialogHeader>
                <div className="my-6 p-6 bg-secondary/30 rounded-md text-center">
                  <p className={`text-3xl font-bold ${playerForModal?.isMrWhite ? 'text-accent' : 'text-primary'}`}>
                    {playerForModal?.word}
                  </p>
                </div>
                <DialogFooter className="sm:justify-center">
                  <Button onClick={handleWordSeen} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <CheckCircle className="mr-2" /> ¡Entendido!
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2"><List /> Jugadores ({gameData.players.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <ul className="space-y-2">
                    {gameData.players.map((player) => (
                      <li
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out
                          ${player.id === currentPlayer.id && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent' : 'bg-secondary/20'}
                          ${player.wordRevealed ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <User className={`h-5 w-5 ${player.id === currentPlayer.id && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                          <span className="font-medium">{player.name}</span>
                          {player.id === currentPlayer.id && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse">Turno Actual</Badge>}
                        </div>
                        {player.wordRevealed ? (
                          <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="mr-1 h-4 w-4" /> Palabra Vista</Badge>
                        ) : (
                          <Badge variant="outline">Esperando...</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
                <Button 
                  onClick={handleStartNewGameSetup} 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Settings2 className="mr-2" /> Nueva Configuración de Juego
                </Button>
              </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fase 2: Discusión (todas las palabras reveladas, resultados aún no visibles)
  if (allWordsRevealed && !resultsVisible) {
    const discussionStarter = gameData.players.length > 0 ? gameData.players[0].name : "El primer jugador";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-lg shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <ListChecks /> ¡Hora de Discutir!
            </CardTitle>
            <CardDescription>
              Todas las palabras han sido reveladas. La discusión comienza con <span className="font-semibold text-accent">{discussionStarter}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">¡Jugadores, discutan e intenten encontrar a Mr. White!</p>
            <Button onClick={handleRevealResults} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Eye className="mr-2" /> Revelar Mr. White y Palabra
            </Button>
            <Button onClick={handlePlayAgainSamePlayers} variant="secondary" className="w-full">
              <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
            </Button>
            <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full">
              <UsersRound className="mr-2" /> Nueva Configuración de Juego
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fase 3: Resultados visibles
  if (allWordsRevealed && resultsVisible) {
    const mrWhiteDisplayNames = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0 
      ? gameData.mrWhiteNames.join(', ') 
      : 'Nadie (esto es un error, ¡todos son civiles!)';
    
    const mrWhiteLabel = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 1 
      ? "Los Mr. White eran: " 
      : "Mr. White era: ";
    
    const noMrWhites = !gameData.mrWhiteNames || gameData.mrWhiteNames.length === 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-lg shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles /> ¡Resultados!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">La palabra civil era: <strong className="text-primary">{gameData.civilianWord}</strong></p>
            {noMrWhites ? (
              <p className="text-lg mb-4 text-accent">¡Vaya! Parece que no hubo Mr. White en esta ronda.</p>
            ) : (
              <p className="text-lg mb-4">{mrWhiteLabel}<strong className="text-accent">{mrWhiteDisplayNames}</strong></p>
            )}
            
            <Button onClick={handlePlayAgainSamePlayers} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
            </Button>
            <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full">
              <UsersRound className="mr-2" /> Nueva Configuración de Juego
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback, idealmente no se alcanza
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      Cargando estado del juego...
    </div>
  );
}
