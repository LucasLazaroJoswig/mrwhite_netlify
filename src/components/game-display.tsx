
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GameData, Player, GameMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, User, Eye, CheckCircle, HelpCircle, RotateCcw, Sparkles, Settings2, UsersRound, Brain, Mic2, Send, Vote as VoteIcon, VenetianMask, ShieldQuestion, Users as UsersIcon, Shuffle, Lightbulb, Copy, Loader2, AlertTriangle, FileText, Drama, Smile, ShieldAlert, Glasses } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializePlayers, MR_WHITE_MESSAGE } from '@/lib/game-logic';
import { rankClues } from '@/ai/flows/rank-clues-flow';
import type { RankCluesInput, ClueRankingItem } from '@/ai/flows/rank-clues-flow';
import { suggestClue } from '@/ai/flows/suggest-clue-flow';
import type { SuggestClueInput, SuggestClueOutput } from '@/ai/flows/suggest-clue-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';


interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

const GameLogo = () => (
  <div className="text-center mb-4">
    <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center justify-center">
      <Shuffle className="w-8 h-8 sm:w-10 sm:h-10 mr-2 text-accent" />
      Mr. White
      <span className="text-foreground/80 ml-1.5">Game Manager</span>
    </h1>
  </div>
);

const getRoleIcon = (role: Player['role'] | null) => {
  if (role === 'civilian') return <Smile className="inline-block mr-1.5 text-blue-400" size={20} />;
  if (role === 'mrwhite') return <ShieldAlert className="inline-block mr-1.5 text-red-400" size={20} />;
  if (role === 'payaso') return <Drama className="inline-block mr-1.5 text-orange-400" size={20} />;
  if (role === 'undercover') return <Glasses className="inline-block mr-1.5 text-purple-400" size={20} />;
  return <HelpCircle className="inline-block mr-1.5 text-muted-foreground" size={20} />;
};

const getRoleTextColor = (role: Player['role'] | null) => {
  if (role === 'civilian') return 'text-blue-400';
  if (role === 'mrwhite') return 'text-red-400';
  if (role === 'payaso') return 'text-orange-400';
  if (role === 'undercover') return 'text-purple-400';
  return 'text-muted-foreground';
};


const RoleImage = ({ role, altText, className }: { role: Player['role'] | null, altText: string, className?: string }) => {
  let src = "https://placehold.co/100x100/455A64/FFFFFF.png?text=Rol";
  let hint = "question mark";
  let bgColorClass = "bg-slate-700"; // Darker default

  if (role === 'civilian') {
    src = "https://placehold.co/100x100/5c9ded/FFFFFF.png?text=Civil"; // Lighter blue
    hint = "group people";
    bgColorClass = "bg-blue-800"; // Darker blue
  } else if (role === 'mrwhite') {
    src = "https://placehold.co/100x100/e57373/FFFFFF.png?text=Mr.W"; // Lighter red
    hint = "detective mystery";
    bgColorClass = "bg-red-800"; // Darker red
  } else if (role === 'payaso') {
    src = "https://placehold.co/100x100/ffb74d/FFFFFF.png?text=Payaso"; // Lighter orange
    hint = "clown mask";
    bgColorClass = "bg-orange-700"; // Darker orange
  } else if (role === 'undercover') {
    src = "https://placehold.co/100x100/ab47bc/FFFFFF.png?text=Undr"; // Lighter purple
    hint = "secret agent";
    bgColorClass = "bg-purple-800"; // Darker purple
  }


  return (
    <div className={`p-1 rounded-lg shadow-md ${bgColorClass} ${className ? className : 'mx-auto mb-2'}`}>
      <Image
        src={src}
        alt={altText}
        width={80}
        height={80}
        data-ai-hint={hint}
        className="rounded-md object-cover"
      />
    </div>
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

  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [clueSuggestion, setClueSuggestion] = useState<{ suggestedClue: string, justification: string } | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [selectedRoleForSuggestion, setSelectedRoleForSuggestion] = useState<Player['role'] | null>(null);


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
      const playersForAI: RankCluesInput['players'] = gameData.players.map(p => ({
        name: p.name,
        role: p.role,
        clue: gameData.playerClues![p.id] || "",
        wordKnownByPlayer: p.word,
      }));

      if (playersForAI.some(p => !p.clue.trim())) {
         setGameData(prev => prev ? ({ ...prev, clueRanking: [] }) : null); // Set empty ranking if any clue is missing
         setRankingError("Algunos jugadores no dieron pistas. No se puede generar ranking.");
         setIsRankingLoading(false);
         return;
      }
      
      const rankedOutput = await rankClues({
        civilianWord: gameData.civilianWord,
        players: playersForAI
      });
      setGameData(prev => prev ? ({ ...prev, clueRanking: rankedOutput.rankedClues }) : null);
    } catch (err) {
      console.error("Error ranking clues:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al rankear pistas.";
      setRankingError(`Error al obtener el ranking de pistas de la IA. ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Error de Ranking IA",
        description: errorMessage,
      });
    } finally {
      setIsRankingLoading(false);
    }
  }, [gameData, setGameData, isRankingLoading, toast]);

  useEffect(() => {
    if (gameData?.gamePhase === 'results' && gameData.votedPlayerId && gameData.playerClues && !gameData.clueRanking && !isRankingLoading && !rankingError) {
       const allCluesProvided = gameData.players.every(p => gameData.playerClues![p.id] && gameData.playerClues![p.id].trim() !== '');
        if (allCluesProvided) {
            callRankCluesAPI();
        } else {
            setGameData(prev => prev ? ({ ...prev, clueRanking: [] }) : null);
            setRankingError("Ranking no disponible porque no todos los jugadores dieron una pista.");
        }
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
    // Do not reset playerForModal immediately to allow modal fade-out animation
    setTimeout(() => setPlayerForModal(null), 300);
  };

  const handleStartNewGameSetup = () => {
    localStorage.removeItem('mrWhiteGameData');
    window.location.href = '/';
  };

  const handlePlayAgainSamePlayers = () => {
    if (!gameData) return;
    let rotatedPlayerNames: string[];
    if (gameData.players.length > 1) {
      const currentPlayersCopy = [...gameData.players];
      const firstPlayer = currentPlayersCopy.shift();
      if (firstPlayer) {
        currentPlayersCopy.push(firstPlayer);
      }
      rotatedPlayerNames = currentPlayersCopy.map(p => p.name);
    } else {
      rotatedPlayerNames = gameData.players.map(p => p.name);
    }

    const newGameSetup = initializePlayers(
        rotatedPlayerNames,
        gameData.gameMode,
        gameData.numberOfMrWhites,
        gameData.numberOfPayasos, // Pass number of payasos
        gameData.civilianWord
    );
    setGameData(newGameSetup);
    setPlayerCluesLocal({});
    setSelectedAccusationTargetId(null);
    setIsRankingLoading(false);
    setRankingError(null);
    setClueSuggestion(null);
    setSuggestionError(null);
    setSelectedRoleForSuggestion(null);
    setCurrentPlayerIndex(0);
    toast({ title: "Nueva Partida", description: "Se ha reiniciado el juego con los mismos jugadores en orden rotado." });
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
    setSelectedAccusationTargetId(null);
    setShowAccusationModal(false); // Close modal on confirmation
  };

  const handleOpenSuggestionModal = () => {
    setClueSuggestion(null);
    setSuggestionError(null);
    setSelectedRoleForSuggestion(null); // Reset selected role for new suggestion
    setShowSuggestionModal(true);
  };

  const handleGenerateSuggestion = async () => {
    if (!selectedRoleForSuggestion || !gameData) {
      setSuggestionError("Por favor, selecciona un rol para la sugerencia.");
      return;
    }
    setIsGeneratingSuggestion(true);
    setSuggestionError(null);
    setClueSuggestion(null);

    let wordKnownBySelectedRole = gameData.civilianWord;
    let actualCivilianWordForAI = gameData.civilianWord;

    if (selectedRoleForSuggestion === 'mrwhite') {
        wordKnownBySelectedRole = MR_WHITE_MESSAGE;
    } else if (selectedRoleForSuggestion === 'undercover' && gameData.undercoverPlayer) {
        wordKnownBySelectedRole = gameData.undercoverPlayer.word;
        // actualCivilianWordForAI remains gameData.civilianWord
    }
    // For Civilian and Payaso, wordKnownBySelectedRole is gameData.civilianWord

    try {
      const suggestionInput: SuggestClueInput = {
        playerRole: selectedRoleForSuggestion,
        wordKnownByPlayer: wordKnownBySelectedRole,
        actualCivilianWord: actualCivilianWordForAI,
      };
      const suggestion = await suggestClue(suggestionInput);
      setClueSuggestion(suggestion);
    } catch (err) {
      console.error("Error suggesting clue:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al sugerir pista.";
      setSuggestionError(`Error al obtener sugerencia: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Error de Sugerencia IA",
        description: errorMessage,
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleCopySuggestion = (clue: string) => {
    navigator.clipboard.writeText(clue).then(() => {
      toast({ title: "Pista copiada", description: `"${clue}" copiada al portapapeles.` });
    }).catch(err => {
      toast({ variant: "destructive", title: "Error al copiar", description: "No se pudo copiar la pista." });
    });
  };

  const getRoleDisplayName = (role: Player['role'] | null, forModal: boolean = false, withIcon = false) => {
    let name = 'Desconocido';
    let iconElement = getRoleIcon(role);

    if (forModal && role === 'undercover') {
      name = 'Civil';
      iconElement = getRoleIcon('civilian'); // Show as Civil in modal
    } else {
      if (role === 'civilian') name = 'Civil';
      if (role === 'mrwhite') name = 'Mr. White';
      if (role === 'payaso') name = 'Payaso';
      if (role === 'undercover') name = 'Undercover';
    }
    
    return withIcon ? <>{iconElement} {name}</> : name;
  };


  if (gameData.gamePhase === 'wordReveal') {
    if (!currentPlayer && allPlayersWordRevealed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-xl text-center bg-card border-primary/30">
            <CardHeader><GameLogo /><CardTitle className="text-primary text-2xl">Preparando Siguiente Fase...</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Todos los jugadores han visto sus roles.</p><Loader2 className="mx-auto mt-4 h-8 w-8 animate-spin text-primary" /></CardContent>
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
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
            <GameLogo />
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">Fase de Revelación</CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              {`Turno de ${currentPlayer?.name || 'jugador actual'}. Cada jugador debe ver su rol y palabra en secreto.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlayer && (
              <Alert variant="default" className="mb-6 bg-secondary/50 border-secondary rounded-lg">
                <ShieldQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                <AlertTitle className="font-semibold text-lg sm:text-xl text-accent">Turno de: {currentPlayer.name}</AlertTitle>
                <AlertDescription className="text-foreground/80 text-sm sm:text-base">
                  ¡Es tu turno, {currentPlayer.name}! Haz clic abajo para descubrir tu identidad secreta. Asegúrate de que nadie más mire.
                </AlertDescription>
              </Alert>
            )}
            <div className="text-center mb-6">
              <Button
                onClick={handleRevealWord}
                disabled={!currentPlayer}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-md sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Revelar mi rol y palabra"
              >
                <Eye className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Revelar Mi Rol y Palabra
              </Button>
            </div>

            <Dialog open={showWordModal} onOpenChange={(isOpen) => {
              setShowWordModal(isOpen);
              if (!isOpen) setTimeout(() => setPlayerForModal(null), 300);
            }}>
              <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-lg border-primary/50">
                {playerForModal && (
                  <>
                    <DialogHeader className="text-center">
                      <RoleImage 
                        role={playerForModal.role === 'undercover' ? 'civilian' : playerForModal.role} 
                        altText={getRoleDisplayName(playerForModal.role, true) as string} 
                        className="w-24 h-24 mx-auto mb-3" 
                      />
                      <DialogTitle className={`text-2xl sm:text-3xl font-bold ${getRoleTextColor(playerForModal.role === 'undercover' ? 'civilian' : playerForModal.role)} flex items-center justify-center`}>
                        {getRoleIcon(playerForModal.role === 'undercover' ? 'civilian' : playerForModal.role)}
                        {playerForModal.role === 'payaso' ? `¡Eres el Payaso!` :
                          playerForModal.role === 'mrwhite' ? `¡Eres Mr. White!` :
                          playerForModal.role === 'undercover' ? `Eres un Civil` : 
                            `Eres un Civil`}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground text-sm sm:text-base mt-1">
                        {playerForModal.role === 'payaso' ? `Tu objetivo: ¡que te voten como si fueras Mr. White! Tu palabra civil es:` :
                          playerForModal.role === 'mrwhite' ? `No conoces la palabra civil. ¡Descúbrela y que no te pillen! Tu mensaje es:` :
                          playerForModal.role === 'undercover' ? `Tu palabra secreta es:` :
                            `Tu palabra secreta es:`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-4 sm:my-6 p-4 sm:p-6 bg-secondary/40 rounded-md text-center">
                      <p className={`text-4xl sm:text-5xl font-extrabold ${getRoleTextColor(playerForModal.role === 'undercover' ? 'civilian' : playerForModal.role)} break-all`}>
                        {playerForModal.word} 
                      </p>
                    </div>
                    <DialogFooter className="sm:justify-center">
                      <Button onClick={handleWordSeen} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-md sm:text-lg py-3">
                        <CheckCircle className="mr-2" /> ¡Entendido!
                      </Button>
                    </DialogFooter>
                  </>
                )}
                {!playerForModal && <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="text-muted-foreground mt-2">Cargando...</p></div>}
              </DialogContent>
            </Dialog>

            <Card className="mt-8 bg-secondary/20 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary"><List /> Jugadores en Espera ({gameData.players.filter(p => !p.wordRevealed).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40 sm:h-48">
                  <ul className="space-y-2">
                    {gameData.players.map((player) => (
                      <li key={player.id}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-md transition-all duration-300 ease-in-out
                                      ${player.id === currentPlayer?.id && !player.wordRevealed ? 'bg-accent/20 ring-2 ring-accent shadow-lg' : 'bg-card/50'}
                                      ${player.wordRevealed ? 'opacity-50 ' : ''}`}>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <User className={`h-4 w-4 sm:h-5 sm:w-5 ${player.id === currentPlayer?.id && !player.wordRevealed ? 'text-accent' : 'text-primary'}`} />
                          <span className={`font-medium text-foreground/90 text-sm sm:text-base ${player.wordRevealed ? 'line-through' : ''}`}>{player.name}</span>
                          {player.id === currentPlayer?.id && !player.wordRevealed && <Badge variant="default" className="bg-accent text-accent-foreground ml-2 animate-pulse text-xs px-1.5 py-0.5">ES TU TURNO</Badge>}
                        </div>
                        {player.wordRevealed ? <Badge variant="outline" className="text-green-400 border-green-600 bg-green-900/30 text-xs px-1.5 py-0.5"><CheckCircle className="mr-1 h-3 w-3" /> Visto</Badge> : <Badge variant="outline" className="text-muted-foreground border-muted-foreground/50 text-xs px-1.5 py-0.5">Pendiente</Badge>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="mt-8 text-center">
              <Button onClick={handleStartNewGameSetup} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive text-sm sm:text-base">
                <Settings2 className="mr-2" /> Nueva Configuración
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameData.gamePhase === 'discussionAndClues' || gameData.gamePhase === 'selectAccused') {
    const discussionStarter = gameData.players.length > 0 ? gameData.players[0].name : "El primer jugador";
    const allCluesFilled = gameData.players.every(p => playerCluesLocal[p.id] && playerCluesLocal[p.id].trim() !== '');

    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 sm:pt-12 space-y-6">
        <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
            <GameLogo />
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center justify-center gap-2">
              <Mic2 /> ¡A Debatir y Dar Pistas!
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
              La discusión comienza con <strong className="text-accent">{discussionStarter}</strong>.
              Cada jugador debe dar <strong className="text-primary">una única palabra</strong> como pista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 md:px-8">
            <ScrollArea className="h-[calc(100vh-580px)] min-h-[150px] sm:min-h-[200px] md:min-h-[250px] pr-2 sm:pr-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
                {gameData.players.map(player => (
                  <div key={player.id} className="space-y-1 p-2.5 sm:p-3 bg-secondary/30 rounded-lg border border-border">
                    <Label htmlFor={`clue-${player.id}`} className="text-sm sm:text-base font-medium text-foreground/90 flex items-center">
                      <User className="w-4 h-4 mr-1.5 sm:mr-2 text-primary" />Pista de {player.name}:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`clue-${player.id}`}
                        type="text"
                        value={playerCluesLocal[player.id] || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleClueChange(player.id, e.target.value)}
                        placeholder="Tu palabra pista..."
                        className="flex-grow bg-input border-border focus:border-accent focus:ring-accent text-sm sm:text-base"
                        maxLength={25}
                        disabled={gameData.gamePhase === 'selectAccused'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              onClick={handleFinalizeDiscussion}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md sm:text-lg py-4 sm:py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 mt-2 sm:mt-4"
              disabled={!allCluesFilled || gameData.gamePhase === 'selectAccused'}
              aria-label="Finalizar discusión y registrar voto"
            >
              <Send className="mr-2 h-5 w-5" /> Finalizar Discusión y Registrar Voto
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Button onClick={handlePlayAgainSamePlayers} variant="secondary" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" disabled={gameData.gamePhase === 'selectAccused'}>
                <RotateCcw className="mr-2" /> Jugar de Nuevo (Mismos Jugadores)
              </Button>
              <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full py-2.5 sm:py-3 border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary text-sm sm:text-base" disabled={gameData.gamePhase === 'selectAccused'}>
                <UsersRound className="mr-2" /> Nueva Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAccusationModal} onOpenChange={(isOpen) => {
          if (!isOpen && gameData.gamePhase === 'selectAccused') {
            // Keep modal open if game phase is still selectAccused, unless explicitly closed by confirm/cancel.
            // This prevents closing by clicking outside if we want to force a selection.
            // For now, let's allow closing by clicking outside.
            // If an explicit cancel is needed, the DialogClose asChild button handles it.
             if (!selectedAccusationTargetId) { // If no target is selected yet (i.e. not confirmed)
                setGameData(prev => prev ? { ...prev, gamePhase: 'discussionAndClues' } : null);
             }
          }
          setShowAccusationModal(isOpen);
        }}>
          <DialogContent className="sm:max-w-sm bg-card shadow-2xl rounded-lg border-primary/50">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl sm:text-2xl text-primary">Registrar Jugador Acusado</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
                El grupo ha deliberado y votado en persona. Selecciona al jugador que ha sido acusado.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 sm:my-6">
              <Select onValueChange={setSelectedAccusationTargetId} value={selectedAccusationTargetId || undefined}>
                <SelectTrigger className="w-full bg-input border-border focus:border-accent focus:ring-accent text-sm sm:text-base py-2.5 sm:py-3">
                  <SelectValue placeholder="Selecciona al jugador acusado" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {gameData.players.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-sm sm:text-base focus:bg-accent/20">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto text-sm sm:text-base" onClick={() => {
                    if (gameData.gamePhase === 'selectAccused') {
                       setGameData(prev => prev ? { ...prev, gamePhase: 'discussionAndClues' } : null);
                    }
                }}>Cancelar</Button>
              </DialogClose>
              <Button onClick={handleConfirmAccusation} disabled={!selectedAccusationTargetId} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm sm:text-base py-2.5 sm:py-3">
                <VoteIcon className="mr-2" /> Confirmar Voto y Ver Resultados
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (gameData.gamePhase === 'results') {
    let winnerMessage = "";
    let winnerIcon = <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />;
    const votedPlayer = gameData.players.find(p => p.id === gameData.votedPlayerId);

    if (votedPlayer) {
        const payasosVotados = gameData.payasoNames?.includes(votedPlayer.name);
        
        if (payasosVotados) {
            winnerMessage = `¡El Payaso ${votedPlayer.name} ha ganado engañando a todos!`;
            winnerIcon = getRoleIcon('payaso');
        } else if (votedPlayer.role === 'mrwhite') {
            winnerMessage = `¡Los Civiles han ganado! Descubrieron a Mr. White: ${votedPlayer.name}.`;
            winnerIcon = getRoleIcon('civilian'); 
        } else if (votedPlayer.role === 'undercover') {
            winnerMessage = `¡Los Civiles han ganado! Descubrieron al Undercover: ${votedPlayer.name}.`;
            winnerIcon = getRoleIcon('civilian'); 
        } else { // Votaron a un Civil
            const mrWhitesEnJuego = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0;
            const undercoverEnJuego = !!gameData.undercoverPlayer;
            const payasosEnJuegoNoVotados = gameData.payasoNames && gameData.payasoNames.length > 0 && !payasosVotados;

            if (mrWhitesEnJuego) {
                winnerMessage = `¡Mr. White (${gameData.mrWhiteNames!.join(', ')}) ha ganado! ${votedPlayer.name} era un Civil.`;
                winnerIcon = getRoleIcon('mrwhite');
            } else if (undercoverEnJuego) {
                winnerMessage = `¡El Undercover (${gameData.undercoverPlayer!.name}) ha ganado! ${votedPlayer.name} era un Civil.`;
                winnerIcon = getRoleIcon('undercover');
            } else if (payasosEnJuegoNoVotados) {
                 winnerMessage = `¡Los Payasos (${gameData.payasoNames!.join(', ')}) ganan! ${votedPlayer.name} era un Civil y los Payasos no fueron descubiertos.`;
                 winnerIcon = getRoleIcon('payaso');
            } else { 
                 winnerMessage = `¡Vaya! ${votedPlayer.name} era un Civil. No había roles especiales de impostor en juego o no fueron descubiertos.`;
                 winnerIcon = <HelpCircle className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />;
            }
        }
    } else {
        winnerMessage = "No se registró ningún voto. Error en la partida.";
        winnerIcon = <HelpCircle className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />;
    }

    const mrWhiteDisplayNames = gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0
      ? gameData.mrWhiteNames.join(', ')
      : 'Ninguno';
    
    const payasoDisplayNames = gameData.payasoNames && gameData.payasoNames.length > 0
      ? gameData.payasoNames.join(', ')
      : 'Ninguno';

    const undercoverDisplayName = gameData.undercoverPlayer ? `${gameData.undercoverPlayer.name} (palabra: "${gameData.undercoverPlayer.word}")` : 'Ninguno';

    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 sm:pt-12 space-y-6">
        <Card className="w-full max-w-lg sm:max-w-xl md:max-w-3xl shadow-2xl bg-card border-primary/30">
          <CardHeader className="text-center pb-4">
            <GameLogo />
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center justify-center gap-2">
              {winnerIcon} ¡Resultados Finales!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 md:px-8">
            <Alert variant="default" className="bg-accent/10 border-accent/50 rounded-lg text-center relative py-4">
              {votedPlayer && <Badge variant="default" className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-destructive text-destructive-foreground shadow-md">{votedPlayer.name} fue acusado</Badge>}
              <AlertTitle className="text-lg sm:text-xl font-semibold text-accent">{winnerMessage}</AlertTitle>
            </Alert>

            <Card className="p-3 sm:p-4 bg-secondary/30 border-border">
                <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left">
                    <div><p className="text-md sm:text-lg text-foreground/90">Palabra Civil Principal: <strong className="text-primary">{gameData.civilianWord}</strong></p></div>
                    {gameData.gameMode === 'mrWhite' && <div><p className="text-md sm:text-lg text-foreground/90 flex items-center">{getRoleIcon('mrwhite')}Mr. White(s): <strong className={getRoleTextColor('mrwhite')}>{mrWhiteDisplayNames}</strong></p></div>}
                    {gameData.gameMode === 'undercover' && <div><p className="text-md sm:text-lg text-foreground/90 flex items-center">{getRoleIcon('undercover')}Undercover: <strong className={getRoleTextColor('undercover')}>{undercoverDisplayName}</strong></p></div>}
                    {(gameData.payasoNames && gameData.payasoNames.length > 0) && (
                    <div className={ (gameData.gameMode === 'mrWhite' && gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0) || gameData.gameMode === 'undercover' ? "" : "sm:col-span-2"}> 
                        <p className="text-md sm:text-lg text-foreground/90 flex items-center">{getRoleIcon('payaso')}Payaso(s): <strong className={getRoleTextColor('payaso')}>{payasoDisplayNames}</strong></p>
                    </div>
                    )}
                </CardContent>
            </Card>


            <Separator className="my-4 sm:my-6 bg-border/50" />

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center justify-center gap-2 text-primary"><Brain className="w-6 h-6 sm:w-7 sm:h-7" /> Ranking de Pistas (IA)</h3>
              {isRankingLoading && (
                <div className="space-y-2.5 sm:space-y-3 mt-2">
                  {[...Array(gameData.players.length || 3)].map((_, i) => <Skeleton key={i} className="h-16 sm:h-20 w-full rounded-lg bg-muted/50" />)}
                </div>
              )}
              {rankingError && <Alert variant="destructive" className="mt-2"><AlertTriangle className="h-4 w-4" /> <AlertTitle>Error de IA</AlertTitle><AlertDescription>{rankingError}</AlertDescription></Alert>}

              {gameData.clueRanking && gameData.clueRanking.length > 0 && (
                <ScrollArea className="h-72 sm:h-80 mt-2 pr-1 sm:pr-2">
                  <ul className="space-y-2.5 sm:space-y-3">
                    {gameData.clueRanking.map((item, index) => (
                      <li key={index} className="p-3 sm:p-4 bg-card/80 rounded-lg shadow-md border border-border hover:border-primary/50 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1.5 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-0">
                            <span className={`text-xl sm:text-2xl font-bold ${item.rank === 1 ? 'text-accent' : (item.rank === 2 ? 'text-primary' : 'text-foreground/80')}`}>{item.rank}.</span>
                            <RoleImage role={item.role} altText={getRoleDisplayName(item.role) as string} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm" />
                            <span className="font-semibold text-md sm:text-lg text-foreground">{item.playerName}</span>
                             <Badge variant="outline"
                              className={`${getRoleTextColor(item.role)} ${
                                item.role === 'payaso' ? 'bg-orange-500/20 border-orange-600' : 
                                item.role === 'mrwhite' ? 'bg-red-500/20 border-red-600' : 
                                item.role === 'undercover' ? 'bg-purple-500/20 border-purple-600' : 
                                'bg-blue-500/20 border-blue-600'} text-xs px-1.5 py-0.5`}>
                              {getRoleIcon(item.role)} {getRoleDisplayName(item.role)}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-sm text-primary border-primary/50 bg-primary/10 self-start sm:self-auto px-2 py-1">Pista: "{item.clue}"</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground italic ml-0.5 sm:ml-1 flex">
                           <FileText size={16} className="mr-1.5 shrink-0 mt-0.5" />
                           <span className="flex-1">Justificación IA: {item.justification}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
              {gameData.clueRanking && gameData.clueRanking.length === 0 && !isRankingLoading && !rankingError && (
                <p className="text-muted-foreground mt-4 text-center text-sm sm:text-base">No hay pistas para rankear o la IA no pudo procesarlas.</p>
              )}
            </div>

            <div className="mt-5 sm:mt-6 text-center">
              <Button onClick={handleOpenSuggestionModal} variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent text-sm sm:text-base">
                <Lightbulb className="mr-2" /> ¿Cuál habría sido una buena pista? (IA)
              </Button>
            </div>

            <CardFooter className="p-0 pt-6 sm:pt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button onClick={handlePlayAgainSamePlayers} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md sm:text-lg py-4 sm:py-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105">
                <RotateCcw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Jugar de Nuevo (Mismos Jugadores)
              </Button>
              <Button onClick={handleStartNewGameSetup} variant="outline" className="w-full text-md sm:text-lg py-4 sm:py-6 rounded-lg border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary">
                <UsersRound className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Nueva Configuración de Juego
              </Button>
            </CardFooter>
          </CardContent>
        </Card>

        <Dialog open={showSuggestionModal} onOpenChange={setShowSuggestionModal}>
          <DialogContent className="sm:max-w-md bg-card shadow-xl rounded-lg border-accent/50">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl text-accent flex items-center gap-2"><Lightbulb /> Sugerencia de Pista IA</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
                Selecciona un rol para obtener una sugerencia de pista basada en la palabra civil de esta partida: <strong className="text-primary">{gameData.civilianWord}</strong>.
                {gameData.gameMode === 'undercover' && gameData.undercoverPlayer && (
                    <>
                    <br/>El Undercover tenía la palabra: <strong className="text-purple-400">{gameData.undercoverPlayer.word}</strong>.
                    </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="role-suggestion" className="text-xs sm:text-sm font-medium text-foreground/90">Sugerir pista para el rol de:</Label>
                <Select onValueChange={(value) => setSelectedRoleForSuggestion(value as Player['role'])} value={selectedRoleForSuggestion || undefined}>
                  <SelectTrigger id="role-suggestion" className="w-full bg-input border-border focus:border-accent focus:ring-accent text-sm sm:text-base py-2.5 sm:py-3 mt-1">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="civilian" className="text-sm sm:text-base focus:bg-accent/20">{getRoleIcon('civilian')} Civil</SelectItem>
                    {gameData.gameMode === 'mrWhite' && (gameData.mrWhiteNames && gameData.mrWhiteNames.length > 0) && <SelectItem value="mrwhite" className="text-sm sm:text-base focus:bg-accent/20">{getRoleIcon('mrwhite')} Mr. White</SelectItem>}
                    {gameData.gameMode === 'undercover' && gameData.undercoverPlayer && <SelectItem value="undercover" className="text-sm sm:text-base focus:bg-accent/20">{getRoleIcon('undercover')} Undercover</SelectItem>}
                    {gameData.payasoNames && gameData.payasoNames.length > 0 && <SelectItem value="payaso" className="text-sm sm:text-base focus:bg-accent/20">{getRoleIcon('payaso')} Payaso</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              {isGeneratingSuggestion && (
                <div className="flex items-center justify-center space-x-2 p-3 sm:p-4">
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm sm:text-base">Generando sugerencia...</p>
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
                <Card className="bg-secondary/30 p-3 sm:p-4">
                  <CardHeader className="p-0 pb-2">
                     <CardTitle className="text-lg sm:text-xl text-primary flex items-center justify-between">
                        <span>Pista: <strong className="text-accent">{clueSuggestion.suggestedClue}</strong></span>
                        <Button variant="ghost" size="icon" onClick={() => handleCopySuggestion(clueSuggestion.suggestedClue)} className="text-muted-foreground hover:text-accent h-7 w-7 sm:h-8 sm:w-8">
                            <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-xs sm:text-sm text-muted-foreground italic">
                        <strong>Justificación IA:</strong> {clueSuggestion.justification}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="text-sm sm:text-base">Cerrar</Button>
              </DialogClose>
              <Button
                onClick={handleGenerateSuggestion}
                disabled={isGeneratingSuggestion || !selectedRoleForSuggestion}
                className="bg-primary hover:bg-primary/80 text-sm sm:text-base"
              >
                {isGeneratingSuggestion ? <Loader2 className="animate-spin mr-2" /> : <Lightbulb className="mr-1.5 sm:mr-2" />}
                Generar Sugerencia
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl text-center bg-card border-destructive/50">
        <CardHeader><GameLogo /><CardTitle className="text-destructive text-2xl">Error de Fase</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Estado del juego desconocido: {gameData.gamePhase}. Por favor, intenta reiniciar.</p>
          <Button onClick={handleStartNewGameSetup} className="mt-4 bg-primary hover:bg-primary/90 text-sm sm:text-base">
            Ir a Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
