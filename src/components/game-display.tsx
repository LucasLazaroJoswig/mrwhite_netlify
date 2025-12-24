
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import type { GameData, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, RotateCcw, Home, User, Crown, AlertTriangle, Skull, ChevronRight, Users, HelpCircle, Settings2, MessageCircleQuestion, Send, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { resetGameWithSamePlayers } from '@/lib/game-logic';
import { CATEGORIES } from '@/lib/words';
import PlayerManager from '@/components/player-manager';

interface GameDisplayProps {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

export default function GameDisplay({ gameData, setGameData }: GameDisplayProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWordModal, setShowWordModal] = useState(false);
  const [playerForModal, setPlayerForModal] = useState<Player | null>(null);
  const [showRemindModal, setShowRemindModal] = useState(false);
  const [showRemindWordModal, setShowRemindWordModal] = useState(false);
  const [remindPlayer, setRemindPlayer] = useState<Player | null>(null);
  const [showPlayerManager, setShowPlayerManager] = useState(false);
  // Hidden Opinion mode states
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);

  const allPlayersRevealed = gameData.players.every(p => p.wordRevealed);
  const isHiddenOpinionMode = gameData.gameMode === 'hiddenOpinion';

  useEffect(() => {
    if (gameData.gamePhase === 'wordReveal' && !allPlayersRevealed) {
      const nextIdx = gameData.players.findIndex(p => !p.wordRevealed);
      setCurrentPlayerIndex(nextIdx !== -1 ? nextIdx : 0);
      // Reset states for next player in hiddenOpinion mode
      setCurrentAnswer('');
      setShowQuestion(false);
    } else if (allPlayersRevealed && gameData.gamePhase === 'wordReveal') {
      // For hiddenOpinion, go to answerReveal phase; for others, go to playing
      if (isHiddenOpinionMode) {
        setGameData(prev => prev ? ({ ...prev, gamePhase: 'answerReveal' }) : null);
      } else {
        setGameData(prev => prev ? ({ ...prev, gamePhase: 'playing' }) : null);
      }
    }
  }, [gameData.players, allPlayersRevealed, gameData.gamePhase, setGameData, isHiddenOpinionMode]);

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

  // Handler for submitting answer in hiddenOpinion mode
  const handleSubmitAnswer = () => {
    if (!currentPlayer || !currentAnswer.trim()) return;
    const updatedPlayers = gameData.players.map((p) =>
      p.id === currentPlayer.id ? { ...p, wordRevealed: true, answer: currentAnswer.trim() } : p
    );
    setGameData(prev => prev ? { ...prev, players: updatedPlayers } : null);
    setCurrentAnswer('');
    setShowQuestion(false);
  };

  // Get the question for a player (impostor gets different question)
  const getQuestionForPlayer = (player: Player) => {
    return player.isImpostor ? gameData.impostorQuestion : gameData.civilQuestion;
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

  const handleSelectPlayerToRemind = (player: Player) => {
    setRemindPlayer(player);
    setShowRemindModal(false);
    setShowRemindWordModal(true);
  };

  const handleCloseRemindWord = () => {
    setShowRemindWordModal(false);
    setTimeout(() => setRemindPlayer(null), 200);
  };

  const handleUpdatePlayers = (players: Player[]) => {
    setGameData(prev => prev ? { ...prev, players } : null);
  };

  // Word Reveal Phase - HIDDEN OPINION MODE (completely different flow)
  if (gameData.gamePhase === 'wordReveal' && isHiddenOpinionMode) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header with progress */}
        <div className="bg-violet-500/10 border-b border-violet-500/30 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Opinión Oculta</span>
            </div>
            <Badge variant="outline" className="text-violet-400 border-violet-500">
              {gameData.players.filter(p => p.wordRevealed).length}/{gameData.players.length}
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {!showQuestion ? (
            // Step 1: Show who's turn and button to reveal
            <Card className="w-full max-w-md shadow-2xl border-2 border-violet-500/30 bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🙈</div>
                  <p className="text-muted-foreground text-sm mb-2">Pasa el móvil a:</p>
                  <h2 className="text-3xl font-black text-violet-400">{currentPlayer?.name}</h2>
                </div>

                <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Cuando solo <span className="text-violet-400 font-semibold">{currentPlayer?.name}</span> pueda ver la pantalla, pulsa el botón
                  </p>
                </div>

                <Button
                  onClick={() => setShowQuestion(true)}
                  className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white text-lg py-6 rounded-xl shadow-lg"
                >
                  <Eye className="mr-2 h-5 w-5" /> Ver Mi Pregunta
                </Button>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 pt-2">
                  {gameData.players.map((player, idx) => (
                    <div
                      key={player.id}
                      className={`w-3 h-3 rounded-full transition-all ${
                        player.wordRevealed
                          ? 'bg-green-500'
                          : idx === currentPlayerIndex
                          ? 'bg-violet-500 animate-pulse scale-125'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Step 2: Show question and input for answer
            <Card className="w-full max-w-md shadow-2xl border-2 border-violet-500/30 bg-card">
              <CardContent className="p-6 space-y-5">
                {/* Player name header */}
                <div className="text-center pb-2 border-b border-violet-500/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Pregunta para</p>
                  <h3 className="text-xl font-bold text-violet-400">{currentPlayer?.name}</h3>
                </div>

                {/* Question display */}
                <div className="bg-violet-500/10 border-2 border-violet-500/30 rounded-2xl p-5">
                  <p className="text-lg sm:text-xl font-semibold text-center text-foreground leading-relaxed">
                    {currentPlayer && getQuestionForPlayer(currentPlayer)}
                  </p>
                </div>

                {/* Answer input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Tu respuesta:
                  </label>
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="min-h-[100px] text-lg bg-background border-violet-500/30 focus:border-violet-500 resize-none"
                    autoFocus
                  />
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="mr-2 h-5 w-5" /> Enviar y Pasar
                </Button>

                {/* Hint */}
                <p className="text-xs text-center text-muted-foreground">
                  Nadie más puede ver esta pantalla. Sé honesto con tu respuesta.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Word Reveal Phase - OTHER MODES (classic, withHint, categories)
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

        {/* Word reveal modal for other modes */}
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

  // Answer Reveal Phase - HIDDEN OPINION MODE
  if (gameData.gamePhase === 'answerReveal' && isHiddenOpinionMode) {
    const impostor = gameData.players.find(p => p.isImpostor);

    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <div className="bg-violet-500/10 border-b border-violet-500/30 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Opinión Oculta</span>
            </div>
            <Badge variant="outline" className="text-violet-400 border-violet-500">
              Respuestas
            </Badge>
          </div>
        </div>

        <div className="flex-1 p-4 pb-32">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Civil Question Display */}
            <Card className="border-2 border-violet-500/50 bg-violet-500/5">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 text-center">
                  La pregunta era:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-center text-violet-300 leading-relaxed">
                  {gameData.civilQuestion}
                </p>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-sm text-amber-400 text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alguien tenía una pregunta diferente. ¿Quién será?
              </p>
            </div>

            {/* All Answers */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Respuestas de todos:
              </h3>

              {gameData.players.map((player) => (
                <Card
                  key={player.id}
                  className="border border-muted bg-card hover:border-violet-500/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{player.name}</p>
                        <p className="text-muted-foreground mt-1 break-words">
                          "{player.answer || 'Sin respuesta'}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-violet-500/30">
          <div className="max-w-lg mx-auto space-y-3">
            <p className="text-xs text-center text-muted-foreground">
              Discutid y votad quién creéis que es el impostor
            </p>
            <Button
              onClick={handleRevealImpostor}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 rounded-xl shadow-lg"
            >
              <Skull className="mr-2 h-5 w-5" /> Revelar Impostor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Phase
  if (gameData.gamePhase === 'playing') {
    const startingPlayer = gameData.players.find(p => p.isStartingPlayer);
    const isHiddenOpinion = gameData.gameMode === 'hiddenOpinion';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className={`w-full max-w-md shadow-2xl border-2 bg-card ${
          isHiddenOpinion ? 'border-violet-500/30' : 'border-accent/30'
        }`}>
          <CardHeader className="text-center pb-2">
            <div className="text-5xl mb-3">{isHiddenOpinion ? '🗣️' : '🎮'}</div>
            <CardTitle className={`text-3xl font-black text-transparent bg-clip-text ${
              isHiddenOpinion
                ? 'bg-gradient-to-r from-violet-400 to-violet-600'
                : 'bg-gradient-to-r from-primary to-accent'
            }`}>
              {isHiddenOpinion ? '¡A DEBATIR!' : '¡A JUGAR!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Starting player */}
            <div className={`border-2 rounded-xl p-4 text-center ${
              isHiddenOpinion
                ? 'bg-violet-500/10 border-violet-500/50'
                : 'bg-accent/10 border-accent/50'
            }`}>
              <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                <Crown className={`w-4 h-4 ${isHiddenOpinion ? 'text-violet-400' : 'text-accent'}`} /> Empieza:
              </p>
              <p className={`text-2xl font-bold ${isHiddenOpinion ? 'text-violet-400' : 'text-accent'}`}>
                {startingPlayer?.name}
              </p>
            </div>

            {/* Game info */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="outline" className={
                  isHiddenOpinion ? 'text-violet-400 border-violet-500' : 'text-primary border-primary'
                }>
                  {gameData.gameMode === 'classic' ? 'Clásico' :
                   gameData.gameMode === 'withHint' ? 'Con Pista' :
                   gameData.gameMode === 'hiddenOpinion' ? '💬 Opinión Oculta' :
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

            {/* Instructions - Different for Hidden Opinion */}
            <div className={`rounded-xl p-4 border ${
              isHiddenOpinion
                ? 'bg-violet-500/5 border-violet-500/20'
                : 'bg-primary/5 border-primary/20'
            }`}>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${isHiddenOpinion ? 'text-violet-400' : 'text-accent'}`} />
                Cómo jugar:
              </h3>
              {isHiddenOpinion ? (
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                    Por turnos, cada uno dice su RESPUESTA a la pregunta
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                    El impostor tiene una pregunta diferente, ¡atentos a respuestas raras!
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                    Debatid y votad quién creéis que es el impostor
                  </li>
                </ul>
              ) : (
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
              )}
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
                        ? isHiddenOpinion
                          ? 'bg-violet-500/20 text-violet-400 border-violet-500'
                          : 'bg-accent/20 text-accent border-accent'
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

            <div className="flex gap-2">
              <Button
                onClick={() => setShowRemindModal(true)}
                variant="outline"
                className={`flex-1 border-muted-foreground/30 hover:bg-secondary/50 ${
                  isHiddenOpinion ? 'text-violet-400 hover:border-violet-500' : 'text-muted-foreground'
                }`}
              >
                {isHiddenOpinion
                  ? <><MessageCircleQuestion className="mr-2 h-4 w-4" /> ¿Tu pregunta?</>
                  : <><HelpCircle className="mr-2 h-4 w-4" /> ¿Tu palabra?</>
                }
              </Button>
              <Button
                onClick={() => setShowPlayerManager(true)}
                variant="outline"
                className="flex-1 text-muted-foreground border-muted-foreground/30 hover:bg-secondary/50"
              >
                <Settings2 className="mr-2 h-4 w-4" /> Jugadores
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal para seleccionar jugador */}
        <Dialog open={showRemindModal} onOpenChange={setShowRemindModal}>
          <DialogContent className={`sm:max-w-sm bg-card border-2 ${
            isHiddenOpinion ? 'border-violet-500/50' : 'border-primary/50'
          }`}>
            <DialogHeader className="text-center">
              <div className="text-4xl mb-2">{isHiddenOpinion ? '💬' : '🤔'}</div>
              <DialogTitle className="text-xl font-bold">¿Quién eres?</DialogTitle>
              <DialogDescription>
                Selecciona tu nombre para ver tu {isHiddenOpinion ? 'pregunta' : 'carta'} de nuevo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {gameData.players.map((player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 hover:bg-accent/20 hover:border-accent"
                  onClick={() => handleSelectPlayerToRemind(player)}
                >
                  <User className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{player.name}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para mostrar la palabra/pregunta */}
        <Dialog open={showRemindWordModal} onOpenChange={setShowRemindWordModal}>
          <DialogContent className={`sm:max-w-sm bg-card border-2 ${
            isHiddenOpinion ? 'border-violet-500/50' : 'border-primary/50'
          }`}>
            {remindPlayer && (
              <>
                <DialogHeader className="text-center">
                  {isHiddenOpinion ? (
                    // Hidden Opinion Mode
                    <>
                      <div className={`text-6xl mb-4 ${remindPlayer.isImpostor ? 'animate-pulse' : ''}`}>
                        {remindPlayer.isImpostor ? '🎭' : '💬'}
                      </div>
                      <DialogTitle className={`text-2xl font-black ${
                        remindPlayer.isImpostor ? 'text-red-500' : 'text-violet-400'
                      }`}>
                        {remindPlayer.isImpostor ? '¡ERES EL IMPOSTOR!' : 'TU PREGUNTA'}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground mt-2">
                        {remindPlayer.isImpostor
                          ? '¡Tu pregunta es diferente! Intenta encajar con los demás.'
                          : 'Piensa tu respuesta y recuérdala bien.'
                        }
                      </DialogDescription>
                    </>
                  ) : (
                    // Other modes
                    <>
                      <div className={`text-6xl mb-4 ${remindPlayer.isImpostor ? 'animate-pulse' : ''}`}>
                        {remindPlayer.isImpostor ? '🎭' : '👤'}
                      </div>
                      <DialogTitle className={`text-3xl font-black ${
                        remindPlayer.isImpostor ? 'text-red-500' : 'text-primary'
                      }`}>
                        {remindPlayer.isImpostor ? '¡IMPOSTOR!' : 'CIVIL'}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground mt-2">
                        {remindPlayer.isImpostor
                          ? 'No sabes la palabra. ¡Intenta descubrirla sin que te pillen!'
                          : 'Tu palabra secreta es:'
                        }
                      </DialogDescription>
                    </>
                  )}
                </DialogHeader>

                {isHiddenOpinion ? (
                  // Hidden Opinion - Show question
                  <div className={`my-6 p-6 rounded-2xl text-center ${
                    remindPlayer.isImpostor
                      ? 'bg-red-500/10 border-2 border-red-500/30'
                      : 'bg-violet-500/10 border-2 border-violet-500/30'
                  }`}>
                    <p className="text-sm text-muted-foreground mb-3">Tu pregunta:</p>
                    <p className={`text-xl font-bold leading-relaxed ${
                      remindPlayer.isImpostor ? 'text-red-400' : 'text-violet-300'
                    }`}>
                      {remindPlayer.isImpostor ? gameData.impostorQuestion : gameData.civilQuestion}
                    </p>
                    {remindPlayer.isImpostor && (
                      <p className="text-xs text-red-400/70 mt-4 italic">
                        (Los demás tienen una pregunta diferente)
                      </p>
                    )}
                  </div>
                ) : !remindPlayer.isImpostor ? (
                  <div className="my-6 p-6 bg-primary/10 border-2 border-primary/30 rounded-2xl text-center">
                    <p className="text-4xl font-black text-primary break-all">
                      {remindPlayer.word}
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
                    onClick={handleCloseRemindWord}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg py-5"
                  >
                    <CheckCircle className="mr-2" /> Entendido
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Player Manager */}
        <PlayerManager
          open={showPlayerManager}
          onOpenChange={setShowPlayerManager}
          gameData={gameData}
          onUpdatePlayers={handleUpdatePlayers}
        />
      </div>
    );
  }

  // Results Phase
  if (gameData.gamePhase === 'results') {
    const impostor = gameData.players.find(p => p.isImpostor);
    const isHiddenOpinion = gameData.gameMode === 'hiddenOpinion';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className={`w-full max-w-md shadow-2xl border-2 bg-card overflow-hidden ${
          isHiddenOpinion ? 'border-violet-500/30' : 'border-red-500/30'
        }`}>
          <div className={`p-6 text-center ${
            isHiddenOpinion
              ? 'bg-gradient-to-r from-violet-500/20 to-red-500/20'
              : 'bg-gradient-to-r from-red-500/20 to-accent/20'
          }`}>
            <div className="text-6xl mb-3 animate-bounce">🎭</div>
            <h2 className={`text-3xl font-black text-transparent bg-clip-text ${
              isHiddenOpinion
                ? 'bg-gradient-to-r from-violet-400 to-red-500'
                : 'bg-gradient-to-r from-red-500 to-accent'
            }`}>
              ¡REVELACIÓN!
            </h2>
          </div>

          <CardContent className="space-y-6 pt-6">
            {/* Impostor reveal */}
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">El impostor era:</p>
              <p className="text-4xl font-black text-red-500">{impostor?.name}</p>
            </div>

            {isHiddenOpinion ? (
              // Hidden Opinion - Show both questions and answers
              <>
                <div className="bg-violet-500/10 border-2 border-violet-500/50 rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pregunta de los civiles:</p>
                  <p className="text-lg font-bold text-violet-400">{gameData.civilQuestion}</p>
                </div>

                <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pregunta del impostor:</p>
                  <p className="text-lg font-bold text-red-400">{gameData.impostorQuestion}</p>
                </div>

                {/* Player answers with roles */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Respuestas y roles:
                  </p>
                  {gameData.players.map(player => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-xl border-2 ${
                        player.isImpostor
                          ? 'bg-red-500/10 border-red-500/50'
                          : 'bg-green-500/5 border-green-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{player.isImpostor ? '🎭' : '👤'}</span>
                          <span className="font-semibold text-foreground">{player.name}</span>
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
                      <p className="text-sm text-muted-foreground pl-7">
                        "{player.answer || 'Sin respuesta'}"
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Other modes - Show secret word and roles
              <>
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
              </>
            )}

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
