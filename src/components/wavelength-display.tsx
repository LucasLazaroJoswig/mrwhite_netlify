"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import type { WavelengthGameData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RotateCcw, Home, Crown, Radio, Eye, Target, Trophy, ArrowRight } from 'lucide-react';
import { startNextRound, calculateScore, getScoreLabel, resetWavelengthGame } from '@/lib/wavelength-logic';

interface WavelengthDisplayProps {
  gameData: WavelengthGameData;
  setGameData: Dispatch<SetStateAction<WavelengthGameData | null>>;
}

// Dial component for the wavelength spectrum
function WavelengthDial({
  leftLabel,
  rightLabel,
  targetPosition,
  showTarget,
  guessPosition,
  onGuessChange,
  disabled
}: {
  leftLabel: string;
  rightLabel: string;
  targetPosition: number;
  showTarget: boolean;
  guessPosition: number;
  onGuessChange?: (position: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Dial container */}
      <div className="relative h-24 rounded-full bg-gradient-to-r from-pink-600 via-pink-400 to-rose-600 overflow-hidden shadow-lg">
        {/* Target zone (only visible after reveal) */}
        {showTarget && (
          <div
            className="absolute top-0 bottom-0 w-12 bg-green-500/50 border-2 border-green-400 z-10"
            style={{ left: `calc(${targetPosition}% - 24px)` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Target className="w-6 h-6 text-green-400" />
            </div>
          </div>
        )}

        {/* Guess marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20 transition-all duration-150"
          style={{ left: `${guessPosition}%` }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Slider input (hidden but functional) */}
      {!disabled && onGuessChange && (
        <input
          type="range"
          min="0"
          max="100"
          value={guessPosition}
          onChange={(e) => onGuessChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-24 opacity-0 cursor-pointer z-30"
        />
      )}

      {/* Labels */}
      <div className="flex justify-between mt-3">
        <span className="text-sm font-semibold text-pink-400">{leftLabel}</span>
        <span className="text-sm font-semibold text-rose-400">{rightLabel}</span>
      </div>
    </div>
  );
}

export default function WavelengthDisplay({ gameData, setGameData }: WavelengthDisplayProps) {
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState(50);
  const [showTarget, setShowTarget] = useState(false);

  const psychic = gameData.players.find(p => p.isPsychic);

  const handleRevealTarget = () => {
    setShowTarget(true);
  };

  const handleProceedToPsychicTurn = () => {
    setShowTarget(false);
    setGameData(prev => prev ? ({ ...prev, gamePhase: 'psychicTurn' }) : null);
  };

  const handleSubmitClue = () => {
    if (!clue.trim()) return;
    setGameData(prev => prev ? ({
      ...prev,
      psychicClue: clue.trim(),
      gamePhase: 'teamGuess'
    }) : null);
  };

  const handleSubmitGuess = () => {
    const score = calculateScore(gameData.targetPosition, guess);

    // Update psychic's score
    const updatedPlayers = gameData.players.map(p =>
      p.isPsychic ? { ...p, score: p.score + score } : p
    );

    setGameData(prev => prev ? ({
      ...prev,
      players: updatedPlayers,
      teamGuess: guess,
      gamePhase: 'reveal'
    }) : null);
  };

  const handleNextRound = () => {
    if (gameData.roundNumber >= gameData.maxRounds) {
      setGameData(prev => prev ? ({ ...prev, gamePhase: 'results' }) : null);
    } else {
      const newGameData = startNextRound(gameData);
      setGameData(newGameData);
      setClue('');
      setGuess(50);
    }
  };

  const handlePlayAgain = () => {
    const newGame = resetWavelengthGame(gameData);
    setGameData(newGame);
    setClue('');
    setGuess(50);
  };

  const handleNewGame = () => {
    localStorage.removeItem('wavelengthGameData');
    window.location.href = '/';
  };

  // Psychic Reveal - Pass phone to psychic, then reveal target
  if (gameData.gamePhase === 'psychicReveal') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-500/30 bg-card">
          <CardContent className="p-6 space-y-6">
            {!showTarget ? (
              // Step 1: Pass phone to psychic
              <>
                <div className="text-center">
                  <Badge className="mb-4 bg-pink-500/20 text-pink-400 border-pink-500">
                    Ronda {gameData.roundNumber}/{gameData.maxRounds}
                  </Badge>
                  <div className="text-6xl mb-4">🙈</div>
                  <p className="text-muted-foreground text-sm mb-2">Pasa el móvil a:</p>
                  <h2 className="text-3xl font-black text-pink-400">{psychic?.name}</h2>
                  <p className="text-xs text-muted-foreground mt-2">
                    (Es el psíquico de esta ronda)
                  </p>
                </div>

                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Cuando solo <span className="text-pink-400 font-semibold">{psychic?.name}</span> pueda ver la pantalla, pulsa el botón
                  </p>
                </div>

                <Button
                  onClick={handleRevealTarget}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-lg py-6 rounded-xl shadow-lg"
                >
                  <Eye className="mr-2 h-5 w-5" /> Ver Mi Objetivo
                </Button>
              </>
            ) : (
              // Step 2: Show target to psychic
              <>
                <div className="text-center pb-2 border-b border-pink-500/20">
                  <Badge className="mb-2 bg-pink-500/20 text-pink-400 border-pink-500">
                    Ronda {gameData.roundNumber}/{gameData.maxRounds}
                  </Badge>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Psíquico</p>
                  <h3 className="text-xl font-bold text-pink-400">{psychic?.name}</h3>
                </div>

                <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-2xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">El espectro es:</p>
                  <p className="text-lg font-bold">
                    <span className="text-pink-400">{gameData.currentSpectrum.leftLabel}</span>
                    <span className="text-muted-foreground mx-2">↔</span>
                    <span className="text-rose-400">{gameData.currentSpectrum.rightLabel}</span>
                  </p>
                </div>

                <div className="py-4">
                  <p className="text-xs text-center text-muted-foreground mb-3">Tu objetivo está aquí:</p>
                  <WavelengthDial
                    leftLabel={gameData.currentSpectrum.leftLabel}
                    rightLabel={gameData.currentSpectrum.rightLabel}
                    targetPosition={gameData.targetPosition}
                    showTarget={true}
                    guessPosition={gameData.targetPosition}
                    disabled
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <p className="text-xs text-amber-400 text-center">
                    Memoriza la posición. Luego darás una pista al equipo.
                  </p>
                </div>

                <Button
                  onClick={handleProceedToPsychicTurn}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 rounded-xl shadow-lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" /> Entendido
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Psychic Turn - Give clue (target NOT visible - psychic must remember it)
  if (gameData.gamePhase === 'psychicTurn') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-500/30 bg-card">
          <CardHeader className="text-center pb-2">
            <Badge className="mx-auto mb-3 bg-pink-500/20 text-pink-400 border-pink-500">
              Ronda {gameData.roundNumber}/{gameData.maxRounds}
            </Badge>
            <div className="text-4xl mb-2">💭</div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Da tu Pista
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              <span className="text-pink-400 font-semibold">{psychic?.name}</span>, recuerda dónde estaba el objetivo
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Spectrum reminder (no target shown) */}
            <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-2xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">El espectro es:</p>
              <p className="text-lg font-bold">
                <span className="text-pink-400">{gameData.currentSpectrum.leftLabel}</span>
                <span className="text-muted-foreground mx-2">↔</span>
                <span className="text-rose-400">{gameData.currentSpectrum.rightLabel}</span>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Da una pista que ayude al equipo a adivinar
                <br />
                dónde está el objetivo en el espectro.
              </p>
            </div>

            {/* Clue input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                Tu pista (una palabra o frase corta):
              </label>
              <Input
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder="Escribe tu pista..."
                className="text-lg bg-background border-pink-500/30 focus:border-pink-500"
                maxLength={50}
                autoFocus
              />
            </div>

            <Button
              onClick={handleSubmitClue}
              disabled={!clue.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-lg py-6 rounded-xl shadow-lg disabled:opacity-50"
            >
              <CheckCircle className="mr-2 h-5 w-5" /> Dar Pista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Team Guess - Team guesses without seeing target
  if (gameData.gamePhase === 'teamGuess') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-500/30 bg-card">
          <CardHeader className="text-center pb-2">
            <Badge className="mx-auto mb-3 bg-pink-500/20 text-pink-400 border-pink-500">
              Ronda {gameData.roundNumber}/{gameData.maxRounds}
            </Badge>
            <div className="text-4xl mb-2">🎯</div>
            <CardTitle className="text-2xl font-bold text-foreground">
              ¡Adivina!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Psychic's clue */}
            <div className="bg-pink-500/10 border-2 border-pink-500/50 rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Pista de {psychic?.name}:
              </p>
              <p className="text-2xl font-black text-pink-400">
                "{gameData.psychicClue}"
              </p>
            </div>

            {/* Dial for guessing (no target visible) */}
            <div className="py-4">
              <WavelengthDial
                leftLabel={gameData.currentSpectrum.leftLabel}
                rightLabel={gameData.currentSpectrum.rightLabel}
                targetPosition={gameData.targetPosition}
                showTarget={false}
                guessPosition={guess}
                onGuessChange={setGuess}
              />
            </div>

            {/* Instructions */}
            <p className="text-sm text-center text-muted-foreground">
              Desliza para elegir dónde crees que está el objetivo
            </p>

            <Button
              onClick={handleSubmitGuess}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-lg py-6 rounded-xl shadow-lg"
            >
              <Target className="mr-2 h-5 w-5" /> Confirmar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reveal - Show results
  if (gameData.gamePhase === 'reveal') {
    const score = calculateScore(gameData.targetPosition, gameData.teamGuess!);
    const scoreLabel = getScoreLabel(score);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-500/30 bg-card overflow-hidden">
          <div className={`p-6 text-center ${
            score >= 3 ? 'bg-gradient-to-r from-green-500/20 to-pink-500/20' : 'bg-pink-500/10'
          }`}>
            <div className="text-6xl mb-3 animate-bounce">
              {score === 4 ? '🎯' : score >= 2 ? '👍' : '😅'}
            </div>
            <h2 className={`text-3xl font-black ${
              score >= 3 ? 'text-green-400' : score >= 1 ? 'text-pink-400' : 'text-muted-foreground'
            }`}>
              {scoreLabel}
            </h2>
            <p className="text-lg text-muted-foreground mt-1">+{score} puntos</p>
          </div>

          <CardContent className="space-y-6 pt-6">
            {/* Dial showing both target and guess */}
            <div className="py-4">
              <WavelengthDial
                leftLabel={gameData.currentSpectrum.leftLabel}
                rightLabel={gameData.currentSpectrum.rightLabel}
                targetPosition={gameData.targetPosition}
                showTarget={true}
                guessPosition={gameData.teamGuess!}
                disabled
              />
            </div>

            {/* Clue reminder */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pista: "{gameData.psychicClue}"</p>
            </div>

            {/* Scores */}
            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-pink-400" />
                Puntuaciones:
              </p>
              <div className="space-y-2">
                {gameData.players
                  .sort((a, b) => b.score - a.score)
                  .map((player, idx) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        idx === 0 && player.score > 0 ? 'bg-pink-500/20' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {idx === 0 && player.score > 0 && <Crown className="w-4 h-4 text-pink-400" />}
                        <span className="font-medium text-foreground">{player.name}</span>
                      </div>
                      <Badge variant="outline" className="text-pink-400 border-pink-500">
                        {player.score} pts
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <Button
              onClick={handleNextRound}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-lg py-6 rounded-xl shadow-lg"
            >
              {gameData.roundNumber >= gameData.maxRounds ? (
                <>
                  <Trophy className="mr-2 h-5 w-5" /> Ver Resultados
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-5 w-5" /> Siguiente Ronda
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Final Results
  if (gameData.gamePhase === 'results') {
    const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-500/30 bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-6 text-center">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
              ¡FIN DEL JUEGO!
            </h2>
          </div>

          <CardContent className="space-y-6 pt-6">
            {/* Winner */}
            <div className="bg-pink-500/10 border-2 border-pink-500/50 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Ganador:</p>
              <p className="text-4xl font-black text-pink-400">{winner.name}</p>
              <p className="text-lg text-muted-foreground mt-1">{winner.score} puntos</p>
            </div>

            {/* All scores */}
            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">Clasificación:</p>
              <div className="space-y-2">
                {sortedPlayers.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      idx === 0 ? 'bg-pink-500/20 border border-pink-500/50' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                      </span>
                      <span className="font-medium text-foreground">{player.name}</span>
                    </div>
                    <Badge variant="outline" className={
                      idx === 0 ? 'text-pink-400 border-pink-500' : 'text-muted-foreground'
                    }>
                      {player.score} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-lg py-5 rounded-xl"
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
