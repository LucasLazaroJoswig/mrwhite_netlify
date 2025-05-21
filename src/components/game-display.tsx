
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import type { GameData, Player, ClueRankingItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, User, Eye, CheckCircle, HelpCircle, RotateCcw, Sparkles, Settings2, UsersRound, Brain, MessageSquarePlus, Send, Vote as VoteIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializePlayers, MR_WHITE_MESSAGE, PAYASO_MESSAGE_PREFIX } from '@/lib/game-logic';
import { rankClues } from '@/ai/flows/rank-clues-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerForModal, setPlayerForModal] = useState<Player | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  
  const [playerCluesLocal, setPlayerCluesLocal] = useState<{ [playerId: string]: string }>({});
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [selectedAccusationTargetId, setSelectedAccusationTargetId] = useState<string | null>(null);
  
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);

  const allPlayersWordRevealed = gameData.players.every(p => p.wordRevealed);

  useEffect(() => {
    if (gameData.players.length > 0 && !allPlayersWordRevealed && gameData.gamePhase === 'wordReveal') {
      const nextPlayerIdx = gameData.players.findIndex(p => !p.wordRevealed);
      setCurrentPlayerIndex(nextPlayerIdx !== -1 ? nextPlayerIdx : 0);
    } else if (allPlayersWordRevealed && gameData.gamePhase === 'wordReveal') {
      setGameData(prev => prev ? ({ ...prev, gamePhase: 'discussionAndClues' }) : null);
    }
  }, [gameData.players, allPlayersWordRevealed, gameData.gamePhase, setGameData]);
  
  useEffect(() => {
    if (gameData.playerClues) {
      setPlayerCluesLocal(gameData.playerClues);
    }
  }, [gameData.playerClues]);

  useEffect(() => {
    if (gameData.gamePhase === 'selectAccused' && !showAccusationModal) {
      setShowAccusationModal(true);
    }
    if (gameData.gamePhase !== 'selectAccused' && showAccusationModal) {
      setShowAccusationModal(false);
    }
  }, [gameData.gamePhase, showAccusationModal]);


  const callRankCluesAPI = useCallback(async () => {
    if (!gameData || !gameData.playerClues || gameData.clueRanking || isRankingLoading) return;

    setIsRankingLoading(true);
    setRankingError(null);
    try {
      const playersForAI = gameData.players.map(p => ({
        name: p.name,
        role: p.role,
        clue: gameData.playerClues![p.id] || "" 
      }));
      const rankedOutput = await rankClues({
        civilianWord: gameData.civilianWord,
        players: playersForAI
      });
      setGameData(prev => prev ? ({ ...prev, clueRanking: rankedOutput.rankedClues }) : null);
    } catch (err) {
      console.error("Error ranking clues:", err);
      setRankingError("Error al obtener el ranking de pistas de la IA.");
    } finally {
      setIsRankingLoading(false);
    }
  }, [gameData, setGameData, isRankingLoading]);

  useEffect(() => {
    if (gameData?.gamePhase === 'results' && gameData.votedPlayerId && gameData.playerClues && !gameData.clueRanking && !isRankingLoading && !rankingError) {
      callRankCluesAPI();
    }
  }, [gameData, isRankingLoading, rankingError, callRankCluesAPI]);


  const currentPlayer: Player | undefined = !allPlayersWordRevealed && gameData.players.length > currentPlayerIndex && gameData.gamePhase === 'wordReveal'
    ? gameData.players[currentPlayerIndex] 
    : undefined;

  const handleRevealWord = () => {
    if (!currentPlayer) return;
    setPlayerForModal(currentPlayer);
    setShowWordModal(true);
  };

  const handleWordSeen = () => {
    setShowWordModal(false);
    if (!playerForModal) return;

    const updatedPlayers = gameData.players.map((p) =>
      p.id === playerForModal.id ? { ...p, wordRevealed: true } : p
    );
    
    setGameData(prev => prev ? { ...prev, players: updatedPlayers } : null);
    // No limpiar playerForModal aquí, se limpiará cuando se cierre el Dialog por completo.
  };
  
  const handleStartNewGameSetup = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/'; 
  };

  const handlePlayAgainSamePlayers = () => {
    const playerNames = gameData.players.map(p => p.name);
    const newGameSetup = initializePlayers(playerNames, gameData.civilianWord);
    setGameData(newGameSetup);
    setPlayerCluesLocal({});
    setSelectedAccusationTargetId(null);
    setIsRankingLoading(false);
    setRankingError(null);
  };

  const handleClueChange = (playerId: string, value: string) => {
    setPlayerCluesLocal(prev => ({ ...prev, [playerId]: value }));
  };

  const handleFinalizeDiscussion = () => {
    setGameData(prev => prev ? ({ ...prev, playerClues: playerCluesLocal, gamePhase: 'selectAccused' }) : null);
    // setShowAccusationModal(true); // Esto se manejará por el useEffect
  };

  const handleConfirmAccusation = () => {
    if (!selectedAccusationTargetId) return;
    setGameData(prev => prev ? ({ 
      ...prev, 
      votedPlayerId: selectedAccusationTargetId, 
      gamePhase: 'results' 
    }) : null);
    // setShowAccusationModal(false); // Se maneja por useEffect
    setSelectedAccusationTargetId(null);
  };


  // Fase 1: Revelando palabras
  if (gameData.gamePhase === 'wordReveal') {
    if (!currentPlayer) {
       // Esto puede ocurrir brevemente si todos han visto sus palabras y la fase está cambiando
      if (allPlayersWordRevealed) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md shadow-xl text-center">
              <CardHeader><CardTitle className="text-primary">Preparando Siguiente Fase...</CardTitle></CardHeader>
              <CardContent><p>Todos los jugadores han visto sus roles.</p></CardContent>
            </Card>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center">
            <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
            <CardContent><p>Ocurrió un problema al determinar el jugador actual.</p><Button onClick={handleStartNewGameSetup} className="mt-4">Ir a Configuración</Button></CardContent>
          </Card>
        </div>
      );
    }
    let modalTitle = `Tu Palabra Secreta, ${playerForModal?.name}`;
    let modalDescription = "¡Guarda esta información para ti!";
    let modalWordToDisplay = playerForModal?.word;

    if (playerForModal?.role === 'payaso') {
      modalTitle = `¡Eres el Payaso, ${playerForModal?.name}!`;
      modalDescription = `Tu objetivo: ¡que te voten como si fueras Mr. White! Conoces la palabra civil.`;
      modalWordToDisplay = `${PAYASO_MESSAGE_PREFIX}: ${playerForModal?.word}`;
    } else if (playerForModal?.role === 'mrwhite') {
        modalWordToDisplay = MR_WHITE_MESSAGE;
    }


    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-primary">Juego de Mr. White: Revelación</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-6 bg-secondary/50">
              <HelpCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold">Turno del Jugador: {currentPlayer.name}</AlertTitle>
              <AlertDescription>
                Es tu turno, {currentPlayer.name}. Haz clic abajo para revelar tu rol y palabra en secreto.
                ¡Que nadie más mire!
              </AlertDescription>
            </Alert>
            <div className="text-center mb-6">
              <Button onClick={handleRevealWord} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <Eye className="mr-2" /> Revelar Mi Rol y Palabra
              </Button>
            </div>
            <Dialog open={showWordModal} onOpenChange={(isOpen) => { 
                setShowWordModal(isOpen); 
                if (!isOpen) setPlayerForModal(null); 
              }}>
              <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary text-center">{playerForModal ? (playerForModal.role === 'payaso' ? `¡Eres el Payaso, ${playerForModal.name}!` : (playerForModal.role === 'mrwhite' ? `Tu Identidad Secreta, ${playerForModal.name}` : `Tu Palabra Secreta, ${playerForModal.name}`)) : "Cargando..."}</DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    {playerForModal ? (playerForModal.role === 'payaso' ? `Tu objetivo: ¡que te voten como si fueras Mr. White! Conoces la palabra civil.` : (playerForModal.role === 'mrwhite' ? `No conoces la palabra civil. ¡Intenta adivinarla y que no te descubran!` : "¡Guarda esta información para ti!")) : ""}
                  </DialogDescription>
                </DialogHeader>
                <div className="my-6 p-6 bg-secondary/30 rounded-md text-center">
                  <p className={`text-3xl font-bold ${playerForModal?.role === 'mrwhite' || playerForModal?.role === 'payaso' ? 'text-accent' : 'text-primary'}`}>
                    {playerForModal ? (playerForModal.role === 'payaso' ? `${PAYASO_MESSAGE_PREFIX}: ${playerForModal.word}` : (playerForModal.role === 'mrwhite' ? MR_WHITE_MESSAGE : playerForModal.word)) : "..."}
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
              <CardHeader className="pb-2"><CardTitle className="text-xl flex items-center gap-2"><List /> Jugadores ({gameData.players.length})</CardTitle></CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <ul className="space-y-2">
                    {gameData.players.map((player) => (
                      <li key={player.id} className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out ${player.id === currentPlayer?.id && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent' : 'bg-secondary/20'} ${player.wordRevealed ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-2">
                          <User className={`h-5 w-5 ${player.id === currentPlayer?.id && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                          <span className="font-medium">{player.name}</span>
                          {player.id === currentPlayer?.id && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse">Turno Actual</Badge>}
                        </div>
                        {player.wordRevealed ? <Badge variant="outline" className="text-green-400 border-green-600"><CheckCircle className="mr-1 h-4 w-4" /> Visto</Badge> : <Badge variant="outline">Esperando...</Badge>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
                <Button onClick={handleStartNewGameSetup} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10"><Settings2 className="mr-2" /> Nueva Configuración</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fase 2: Discusión y Pistas
  if (gameData.gamePhase === 'discussionAndClues' || gameData.gamePhase === 'selectAccused') {
    const discussionStarter = gameData.players.length > 0 ? gameData.players[0].name : "El primer jugador";
    const allCluesFilled = gameData.players.every(p => playerCluesLocal[p.id] && playerCluesLocal[p.id].trim() !== '');

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <MessageSquarePlus /> ¡A Debatir y Dar Pistas!
            </CardTitle>
            <CardDescription>
              Todos han visto su rol. La discusión comienza con <span className="font-semibold text-accent">{discussionStarter}</span>.
              Cada jugador debe dar una palabra pista. La votación se hará en persona.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-60 pr-3">
              <div className="space-y-3">
                {gameData.players.map(player => (
                  <div key={player.id} className="space-y-1">
                    <Label htmlFor={`clue-${player.id}`} className="text-sm font-medium">Pista de {player.name}:</Label>
                    <Input 
                      id={`clue-${player.id}`}
                      type="text"
                      value={playerCluesLocal[player.id] || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleClueChange(player.id, e.target.value)}
                      placeholder="Escribe tu palabra pista aquí"
                      className="bg-input"
                      maxLength={30}
                      disabled={gameData.gamePhase === 'selectAccused'}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button 
                onClick={handleFinalizeDiscussion} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
                disabled={!allCluesFilled || gameData.gamePhase === 'selectAccused'}
            >
              <Send className="mr-2" /> Finalizar Discusión y Registrar Voto
            </Button>
             <div className="flex gap-2 mt-4">
                <Button onClick={handlePlayAgainSamePlayers} variant="secondary" className="w-full"  disabled={gameData.gamePhase === 'selectAccused'}>
                    <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
                </Button>
                <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full"  disabled={gameData.gamePhase === 'selectAccused'}>
                    <UsersRound className="mr-2" /> Nueva Configuración
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showAccusationModal} onOpenChange={(isOpen) => {
          if (!isOpen && gameData.gamePhase === 'selectAccused') {
            // Si se cierra el modal sin confirmar, volver a la fase de discusión
            setGameData(prev => prev ? { ...prev, gamePhase: 'discussionAndClues' } : null);
          }
          setShowAccusationModal(isOpen);
        }}>
          <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary text-center">Registrar Jugador Acusado</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                El grupo ha votado en persona. Selecciona al jugador que ha sido acusado.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Select onValueChange={setSelectedAccusationTargetId} value={selectedAccusationTargetId || undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un jugador para acusar" />
                </SelectTrigger>
                <SelectContent>
                  {gameData.players.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button onClick={handleConfirmAccusation} disabled={!selectedAccusationTargetId} className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <VoteIcon className="mr-2" /> Confirmar Voto y Ver Resultados
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  // Fase 4: Resultados
  if (gameData.gamePhase === 'results') {
    let winnerMessage = "";
    const votedPlayer = gameData.players.find(p => p.id === gameData.votedPlayerId);

    if (votedPlayer) {
      if (votedPlayer.role === 'payaso') {
        winnerMessage = `¡El Payaso ${votedPlayer.name} ha ganado engañando a todos!`;
      } else if (votedPlayer.role === 'mrwhite') {
        winnerMessage = `¡Los Civiles han ganado! Descubrieron a Mr. White: ${votedPlayer.name}.`;
      } else { 
        const mrWhitesWin = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0;
        if (mrWhitesWin) {
          winnerMessage = `¡Mr. White (o los Mr. Whites: ${gameData.mrWhiteNames?.join(', ')}) han ganado! ${votedPlayer.name} era un Civil.`;
        } else {
           winnerMessage = `¡Vaya! ${votedPlayer.name} era un Civil. Hubo un error en la partida.`;
        }
      }
    } else {
      winnerMessage = "No se registró ningún voto. Error en la partida.";
    }
    
    const mrWhiteDisplayNames = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0 
      ? gameData.mrWhiteNames.join(', ') 
      : 'Ninguno (error)';
    const payasoDisplayName = gameData.payasoName ? gameData.payasoName : 'Ninguno';


    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles /> ¡Resultados Finales!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-accent/20">
              <Badge variant="default" className="absolute -top-3 -right-3 px-2 py-1 text-xs bg-accent text-accent-foreground">{gameData.players.find(p => p.id === gameData.votedPlayerId)?.name || 'Jugador'} fue acusado</Badge>
              <AlertTitle className="text-xl font-semibold text-accent">{winnerMessage}</AlertTitle>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left p-4 bg-secondary/30 rounded-md">
              <div><p className="text-lg">Palabra Civil: <strong className="text-primary">{gameData.civilianWord}</strong></p></div>
              <div><p className="text-lg">Mr. White(s) era(n): <strong className="text-destructive">{mrWhiteDisplayNames}</strong></p></div>
              {gameData.players.some(p => p.role === 'payaso') && (
                <div><p className="text-lg">Payaso era: <strong className="text-orange-400">{payasoDisplayName}</strong></p></div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-2 text-primary"><Brain /> Ranking de Pistas por IA</h3>
              {isRankingLoading && (
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-3/4 rounded-md" />
                </div>
              )}
              {rankingError && <p className="text-destructive mt-2">{rankingError}</p>}
              {gameData.clueRanking && gameData.clueRanking.length > 0 && (
                <ScrollArea className="h-72 mt-2 border rounded-md p-1">
                  <ul className="space-y-3 p-3">
                    {gameData.clueRanking.map((item, index) => (
                      <li key={index} className="p-3 bg-card rounded-md shadow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-lg text-primary">
                            {item.rank}. {item.playerName} <Badge variant={item.role === 'mrwhite' ? 'destructive' : item.role === 'payaso' ? 'default' : 'secondary'} className={`${item.role === 'payaso' ? 'bg-orange-500 text-white' : ''} ml-1`}>
                              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                            </Badge>
                          </span>
                          <Badge variant="outline" className="text-sm">Pista: "{item.clue}"</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">IA: {item.justification}</p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
               {gameData.clueRanking && gameData.clueRanking.length === 0 && !isRankingLoading && !rankingError && (
                 <p className="text-muted-foreground mt-2">No hay pistas para rankear o la IA no pudo procesarlas.</p>
               )}
            </div>
            
            <div className="flex gap-2 mt-6">
                <Button onClick={handlePlayAgainSamePlayers} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
                </Button>
                <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full">
                    <UsersRound className="mr-2" /> Nueva Configuración de Juego
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      Cargando estado del juego... Error de fase: {gameData.gamePhase}
    </div>
  );
}
