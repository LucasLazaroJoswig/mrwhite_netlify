
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, User, Eye, CheckCircle, HelpCircle, RotateCcw, Sparkles, Settings2, UsersRound, Brain, MessageSquarePlus, Send, Vote as VoteIcon, VenetianMask, ShieldQuestion, Users, Shuffle, Mic2, Lightbulb, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializePlayers, MR_WHITE_MESSAGE } from '@/lib/game-logic';
import { rankClues } from '@/ai/flows/rank-clues-flow';
import { suggestClue } from '@/ai/flows/suggest-clue-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';


interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

const GameLogo = () => (
  <div className="text-center mb-4">
    <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
      <Shuffle className="w-8 h-8 mr-2 text-accent" />
      Mr. White
      <span className="text-foreground/80 ml-1.5">Game Manager</span>
    </h1>
  </div>
);

const RoleImage = ({ role, altText, className }: { role: Player['role'], altText: string, className?: string }) => {
  let src = "https://placehold.co/150x150.png?text=Rol";
  let hint = "question mark";
  if (role === 'civilian') {
    src = "https://placehold.co/150x150/78909C/FFFFFF.png?text=Civil";
    hint = "group people";
  } else if (role === 'mrwhite') {
    src = "https://placehold.co/150x150/263238/FFFFFF.png?text=Mr.W";
    hint = "detective mystery";
  } else if (role === 'payaso') {
    src = "https://placehold.co/150x150/FF8F00/FFFFFF.png?text=Payaso";
    hint = "clown mask";
  }

  return (
    <Image 
      src={src} 
      alt={altText} 
      width={100} 
      height={100} 
      data-ai-hint={hint}
      className={className ? className : "rounded-lg mx-auto mb-3 shadow-md"}
    />
  );
};


export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerForModal, setPlayerForModal] = useState<Player | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  
  const [playerCluesLocal, setPlayerCluesLocal] = useState<{ [playerId: string]: string }>(gameData.playerClues || {});
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [selectedAccusationTargetId, setSelectedAccusationTargetId] = useState<string | null>(null);
  
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);

  const [isSuggestingClue, setIsSuggestingClue] = useState<string | null>(null); // Player ID for whom suggestion is active
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [clueSuggestion, setClueSuggestion] = useState<{ clue: string, justification: string } | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const { toast } = useToast();

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
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al rankear pistas.";
      setRankingError(`Error al obtener el ranking de pistas de la IA. ${errorMessage}`);
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
    if (!playerForModal) return;

    const updatedPlayers = gameData.players.map((p) =>
      p.id === playerForModal.id ? { ...p, wordRevealed: true } : p
    );
    
    setGameData(prev => prev ? { ...prev, players: updatedPlayers } : null);
    setShowWordModal(false); 
    // playerForModal will be cleared by onOpenChange of Dialog
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
    setClueSuggestion(null);
    setSuggestionError(null);
  };

  const handleClueChange = (playerId: string, value: string) => {
    setPlayerCluesLocal(prev => ({ ...prev, [playerId]: value }));
  };

  const handleFinalizeDiscussion = () => {
    setGameData(prev => prev ? ({ ...prev, playerClues: playerCluesLocal, gamePhase: 'selectAccused' }) : null);
  };

  const handleConfirmAccusation = () => {
    if (!selectedAccusationTargetId) return;
    setGameData(prev => prev ? ({ 
      ...prev, 
      votedPlayerId: selectedAccusationTargetId, 
      gamePhase: 'results' 
    }) : null);
    setSelectedAccusationTargetId(null); // Reset for next potential game
    // setShowAccusationModal(false); // Already handled by Dialog's onOpenChange
  };

  const handleSuggestClue = async (player: Player) => {
    setIsSuggestingClue(player.id);
    setSuggestionError(null);
    setClueSuggestion(null);
    setShowSuggestionModal(true);
    try {
      const suggestion = await suggestClue({
        civilianWord: gameData.civilianWord,
        playerRole: player.role,
      });
      setClueSuggestion(suggestion);
    } catch (err) {
      console.error("Error suggesting clue:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al sugerir pista.";
      setSuggestionError(`Error al obtener sugerencia: ${errorMessage}`);
    } finally {
      setIsSuggestingClue(null);
    }
  };

  const handleCopySuggestion = (clue: string) => {
    navigator.clipboard.writeText(clue).then(() => {
      toast({ title: "Pista copiada", description: `"${clue}" copiada al portapapeles.`});
    }).catch(err => {
      toast({ variant: "destructive", title: "Error al copiar", description: "No se pudo copiar la pista."});
    });
  };

  const getRoleDisplayName = (role: Player['role']) => {
    if (role === 'civilian') return 'Civil';
    if (role === 'mrwhite') return 'Mr. White';
    if (role === 'payaso') return 'Payaso';
    return 'Desconocido';
  };


  // Fase 1: Revelando palabras
  if (gameData.gamePhase === 'wordReveal') {
    // ... (sin cambios significativos, se mantiene la lógica existente)
    if (!currentPlayer && allPlayersWordRevealed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center bg-card border-primary/30">
            <CardHeader><GameLogo /><CardTitle className="text-primary text-2xl">Preparando Siguiente Fase...</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Todos los jugadores han visto sus roles.</p></CardContent>
          </Card>
        </div>
      );
    }
    if (!currentPlayer && !allPlayersWordRevealed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center bg-card border-destructive/50">
            <CardHeader><GameLogo /><CardTitle className="text-destructive text-2xl">Error de Sincronización</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Ocurrió un problema al determinar el jugador actual. Intenta recargar o iniciar una nueva partida.</p>
                <Button onClick={handleStartNewGameSetup} className="mt-4 bg-primary hover:bg-primary/90">Ir a Configuración</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-2xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
            <GameLogo />
            <CardTitle className="text-3xl font-semibold text-foreground">Fase de Revelación</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cada jugador debe ver su rol y palabra en secreto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlayer && (
              <Alert variant="default" className="mb-6 bg-secondary/50 border-secondary rounded-lg">
                <ShieldQuestion className="h-6 w-6 text-accent" />
                <AlertTitle className="font-semibold text-xl text-accent">Turno de: {currentPlayer.name}</AlertTitle>
                <AlertDescription className="text-foreground/80">
                  ¡Es tu turno, {currentPlayer.name}! Haz clic abajo para descubrir tu identidad secreta. Asegúrate de que nadie más mire.
                </AlertDescription>
              </Alert>
            )}
            <div className="text-center mb-6">
              <Button 
                onClick={handleRevealWord} 
                disabled={!currentPlayer}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Eye className="mr-2 h-6 w-6" /> Revelar Mi Rol y Palabra
              </Button>
            </div>

            <Dialog open={showWordModal} onOpenChange={(isOpen) => { 
                setShowWordModal(isOpen); 
                if (!isOpen) setTimeout(() => setPlayerForModal(null), 300);
              }}>
              <DialogContent className="sm:max-w-lg bg-card shadow-2xl rounded-lg border-primary/50">
                {playerForModal && (
                  <>
                    <DialogHeader className="text-center">
                      <RoleImage role={playerForModal.role} altText={getRoleDisplayName(playerForModal.role)} />
                      <DialogTitle className="text-3xl text-primary">
                        {playerForModal.role === 'payaso' ? `¡Eres el Payaso, ${playerForModal.name}!` : 
                         playerForModal.role === 'mrwhite' ? `Tu Identidad Secreta, ${playerForModal.name}` : 
                         `Tu Palabra Secreta, ${playerForModal.name}`}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground text-base mt-1">
                        {playerForModal.role === 'payaso' ? `Tu objetivo: ¡que te voten como si fueras Mr. White! Tu palabra civil es:` : 
                         playerForModal.role === 'mrwhite' ? `No conoces la palabra civil. ¡Descúbrela y que no te pillen!` : 
                         `Memoriza esta palabra. ¡Es la clave!`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-6 p-6 bg-secondary/40 rounded-md text-center">
                      <p className={`text-4xl font-bold ${playerForModal?.role === 'mrwhite' ? 'text-destructive' : (playerForModal?.role === 'payaso' ? 'text-orange-400' : 'text-accent')}`}>
                        {playerForModal.role === 'payaso' ? playerForModal.word : 
                         (playerForModal.role === 'mrwhite' ? MR_WHITE_MESSAGE : playerForModal.word)}
                      </p>
                    </div>
                    <DialogFooter className="sm:justify-center">
                      <Button onClick={handleWordSeen} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                        <CheckCircle className="mr-2" /> ¡Entendido!
                      </Button>
                    </DialogFooter>
                  </>
                )}
                {!playerForModal && <p className="text-center text-muted-foreground p-8">Cargando información del jugador...</p>}
              </DialogContent>
            </Dialog>

            <Card className="mt-8 bg-secondary/20 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2 text-primary"><List /> Jugadores en Espera ({gameData.players.filter(p => !p.wordRevealed).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <ul className="space-y-2.5">
                    {gameData.players.map((player) => (
                      <li key={player.id} 
                          className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out 
                                      ${player.id === currentPlayer?.id && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent shadow-lg' : 'bg-card/50'} 
                                      ${player.wordRevealed ? 'opacity-50 line-through' : ''}`}>
                        <div className="flex items-center gap-3">
                          <User className={`h-5 w-5 ${player.id === currentPlayer?.id && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                          <span className="font-medium text-foreground/90">{player.name}</span>
                          {player.id === currentPlayer?.id && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse text-xs">ES TU TURNO</Badge>}
                        </div>
                        {player.wordRevealed ? <Badge variant="outline" className="text-green-400 border-green-600 bg-green-900/30 text-xs"><CheckCircle className="mr-1 h-3 w-3" /> Visto</Badge> : <Badge variant="outline" className="text-muted-foreground border-muted-foreground/50 text-xs">Pendiente...</Badge>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="mt-8 text-center">
                <Button onClick={handleStartNewGameSetup} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Settings2 className="mr-2" /> Nueva Configuración
                </Button>
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
        <Card className="w-full max-w-3xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
            <GameLogo />
            <CardTitle className="text-3xl font-semibold text-foreground flex items-center justify-center gap-2">
              <Mic2 /> ¡A Debatir y Dar Pistas!
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Todos han visto su rol. La discusión comienza con <strong className="text-accent">{discussionStarter}</strong>.
              Cada jugador debe dar <strong className="text-primary">una única palabra</strong> como pista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-8">
            <ScrollArea className="h-[calc(100vh-550px)] min-h-[200px] pr-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {gameData.players.map(player => (
                  <div key={player.id} className="space-y-1.5 p-3 bg-secondary/30 rounded-lg border border-border">
                    <Label htmlFor={`clue-${player.id}`} className="text-base font-medium text-foreground/90 flex items-center">
                      <User className="w-4 h-4 mr-2 text-primary" />Pista de {player.name}:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id={`clue-${player.id}`}
                        type="text"
                        value={playerCluesLocal[player.id] || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleClueChange(player.id, e.target.value)}
                        placeholder="Tu palabra pista..."
                        className="flex-grow bg-input border-border focus:border-accent focus:ring-accent text-base"
                        maxLength={25}
                        disabled={gameData.gamePhase === 'selectAccused'}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSuggestClue(player)}
                        disabled={isSuggestingClue === player.id || gameData.gamePhase === 'selectAccused'}
                        className="text-accent hover:bg-accent/20 p-2"
                        aria-label={`Sugerir pista para ${player.name}`}
                      >
                        {isSuggestingClue === player.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lightbulb className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button 
                onClick={handleFinalizeDiscussion} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 mt-4"
                disabled={!allCluesFilled || gameData.gamePhase === 'selectAccused'}
            >
              <Send className="mr-2 h-5 w-5" /> Finalizar Discusión y Registrar Voto
            </Button>
             <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button onClick={handlePlayAgainSamePlayers} variant="secondary" className="w-full py-3"  disabled={gameData.gamePhase === 'selectAccused'}>
                    <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
                </Button>
                <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full py-3 border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary"  disabled={gameData.gamePhase === 'selectAccused'}>
                    <UsersRound className="mr-2" /> Nueva Configuración de Partida
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showAccusationModal} onOpenChange={(isOpen) => {
          if (!isOpen && gameData.gamePhase === 'selectAccused') { // If closed without confirming
            setGameData(prev => prev ? { ...prev, gamePhase: 'discussionAndClues' } : null);
          }
          setShowAccusationModal(isOpen);
        }}>
          <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg border-primary/50">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl text-primary">Registrar Jugador Acusado</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                El grupo ha deliberado y votado en persona. Selecciona al jugador que ha sido acusado.
              </DialogDescription>
            </DialogHeader>
            <div className="my-6">
              <Select onValueChange={setSelectedAccusationTargetId} value={selectedAccusationTargetId || undefined}>
                <SelectTrigger className="w-full bg-input border-border focus:border-accent focus:ring-accent text-base py-3">
                  <SelectValue placeholder="Selecciona al jugador acusado" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {gameData.players.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-base focus:bg-accent/20">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="sm:justify-center gap-2">
               <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleConfirmAccusation} disabled={!selectedAccusationTargetId} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground text-base py-3">
                <VoteIcon className="mr-2" /> Confirmar Voto y Ver Resultados
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para Sugerencia de Pista */}
        <Dialog open={showSuggestionModal} onOpenChange={setShowSuggestionModal}>
            <DialogContent className="sm:max-w-md bg-card shadow-xl rounded-lg border-accent/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-accent flex items-center gap-2"><Lightbulb /> Sugerencia de Pista IA</DialogTitle>
                </DialogHeader>
                <div className="my-4 space-y-3">
                    {isSuggestingClue && !clueSuggestion && !suggestionError && (
                        <div className="flex items-center justify-center space-x-2 p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generando sugerencia...</p>
                        </div>
                    )}
                    {suggestionError && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error de Sugerencia</AlertTitle>
                            <AlertDescription>{suggestionError}</AlertDescription>
                        </Alert>
                    )}
                    {clueSuggestion && (
                        <Card className="bg-secondary/30 p-4">
                            <CardContent className="p-0 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-semibold text-primary">{clueSuggestion.clue}</p>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopySuggestion(clueSuggestion.clue)} className="text-muted-foreground hover:text-accent">
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground italic"><strong>Justificación IA:</strong> {clueSuggestion.justification}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    );
  }
  
  // Fase 4: Resultados
  if (gameData.gamePhase === 'results') {
    let winnerMessage = "";
    let winnerIcon = <Sparkles className="h-8 w-8 text-accent" />;
    const votedPlayer = gameData.players.find(p => p.id === gameData.votedPlayerId);

    if (votedPlayer) {
      if (votedPlayer.role === 'payaso') {
        winnerMessage = `¡El Payaso ${votedPlayer.name} ha ganado engañando a todos!`;
        winnerIcon = <VenetianMask className="h-8 w-8 text-orange-400" />;
      } else if (votedPlayer.role === 'mrwhite') {
        winnerMessage = `¡Los Civiles han ganado! Descubrieron a Mr. White: ${votedPlayer.name}.`;
        winnerIcon = <Users className="h-8 w-8 text-green-400" />;
      } else { 
        const mrWhitesWin = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0;
        if (mrWhitesWin) {
          winnerMessage = `¡Mr. White (${gameData.mrWhiteNames?.join(', ')}) ha ganado! ${votedPlayer.name} era un Civil.`;
          winnerIcon = <ShieldQuestion className="h-8 w-8 text-destructive" />;
        } else { // Should not happen if roles are assigned correctly
           winnerMessage = `¡Vaya! ${votedPlayer.name} era un Civil. No había Mr. White o error en la configuración.`;
           winnerIcon = <HelpCircle className="h-8 w-8 text-muted-foreground" />;
        }
      }
    } else {
      winnerMessage = "No se registró ningún voto. Error en la partida."; // Fallback
      winnerIcon = <HelpCircle className="h-8 w-8 text-muted-foreground" />;
    }
    
    const mrWhiteDisplayNames = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0 
      ? gameData.mrWhiteNames.join(', ') 
      : 'Ninguno (Error de asignación)';
    const payasoDisplayName = gameData.payasoName ? gameData.payasoName : 'Ninguno';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Card className="w-full max-w-3xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
             <GameLogo />
            <CardTitle className="text-3xl font-semibold text-foreground flex items-center justify-center gap-2">
              {winnerIcon} ¡Resultados Finales!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-8">
            <Alert variant="default" className="bg-accent/10 border-accent/50 rounded-lg text-center relative">
               {votedPlayer && <Badge variant="default" className="absolute -top-3 -right-3 px-2 py-1 text-xs bg-destructive text-destructive-foreground">{votedPlayer.name} fue acusado</Badge>}
              <AlertTitle className="text-xl font-semibold text-accent">{winnerMessage}</AlertTitle>
            </Alert>
            
            <Card className="p-4 bg-secondary/30 border-border">
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div><p className="text-lg text-foreground/90">Palabra Civil: <strong className="text-primary">{gameData.civilianWord}</strong></p></div>
                <div><p className="text-lg text-foreground/90">Mr. White(s) era(n): <strong className="text-destructive">{mrWhiteDisplayNames}</strong></p></div>
                {gameData.players.some(p => p.role === 'payaso') && (
                  <div className="md:col-span-2"><p className="text-lg text-foreground/90">Payaso era: <strong className="text-orange-400">{payasoDisplayName}</strong></p></div>
                )}
              </CardContent>
            </Card>

            <Separator className="my-6 bg-border/50" />

            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2 text-primary"><Brain className="w-7 h-7" /> Ranking de Pistas (IA)</h3>
              {isRankingLoading && (
                <div className="space-y-3 mt-2">
                  {[...Array(gameData.players.length || 3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg bg-muted/50" />)}
                </div>
              )}
              {rankingError && <Alert variant="destructive" className="mt-2"><AlertTitle>Error de IA</AlertTitle><AlertDescription>{rankingError}</AlertDescription></Alert>}
              
              {gameData.clueRanking && gameData.clueRanking.length > 0 && (
                <ScrollArea className="h-80 mt-2 pr-2">
                  <ul className="space-y-3">
                    {gameData.clueRanking.map((item, index) => (
                      <li key={index} className="p-4 bg-card/80 rounded-lg shadow-md border border-border hover:border-primary/50 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                          <div className="flex items-center gap-2 mb-2 sm:mb-0">
                            <span className={`text-2xl font-bold ${item.rank === 1 ? 'text-accent' : (item.rank === 2 ? 'text-primary' : 'text-foreground/80')}`}>{item.rank}.</span>
                            <RoleImage role={item.role} altText={getRoleDisplayName(item.role)} className="w-8 h-8 rounded-full shadow-sm" />
                            <span className="font-semibold text-lg text-foreground">{item.playerName}</span>
                            <Badge variant={item.role === 'mrwhite' ? 'destructive' : item.role === 'payaso' ? 'default' : 'secondary'} 
                                   className={`${item.role === 'payaso' ? 'bg-orange-500 text-white' : ''} ml-1 text-xs`}>
                              {getRoleDisplayName(item.role)}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-sm text-primary border-primary/50 bg-primary/10 self-start sm:self-center">Pista: "{item.clue}"</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic ml-1">Justificación IA: {item.justification}</p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
               {gameData.clueRanking && gameData.clueRanking.length === 0 && !isRankingLoading && !rankingError && (
                 <p className="text-muted-foreground mt-4 text-center">No hay pistas para rankear o la IA no pudo procesarlas adecuadamente.</p>
               )}
            </div>
            
            <CardFooter className="p-0 pt-8 flex flex-col sm:flex-row gap-3">
                <Button onClick={handlePlayAgainSamePlayers} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105">
                    <RotateCcw className="mr-2 h-6 w-6" /> Jugar de Nuevo (Mismos Jugadores)
                </Button>
                <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full text-lg py-6 rounded-lg border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary">
                    <UsersRound className="mr-2 h-6 w-6" /> Nueva Configuración de Juego
                </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl text-center bg-card border-destructive/50">
        <CardHeader><GameLogo /><CardTitle className="text-destructive text-2xl">Error de Fase</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Estado del juego desconocido: {gameData.gamePhase}. Por favor, intenta reiniciar.</p>
          <Button onClick={handleStartNewGameSetup} className="mt-4 bg-primary hover:bg-primary/90">
            Ir a Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    