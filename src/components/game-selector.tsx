"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skull, MapPin, Radio, Users, Sparkles } from 'lucide-react';
import type { GameType } from '@/lib/types';

interface GameCardProps {
  type: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  players: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  isNew?: boolean;
  onClick: () => void;
}

function GameCard({
  title,
  description,
  icon,
  players,
  colorClass,
  glowClass,
  bgGradient,
  isNew,
  onClick
}: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
    >
      <Card className={`
        relative overflow-hidden border-2 ${colorClass}
        bg-card hover:bg-opacity-95
        transition-all duration-500 ease-out
        transform hover:scale-[1.02] hover:-translate-y-1
        cursor-pointer
        ${glowClass}
      `}>
        {/* Background gradient effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgGradient}`} />

        {/* Animated corner accents */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${bgGradient}`} />
        <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity ${bgGradient}`} />

        <CardContent className="relative z-10 p-6 sm:p-8">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Icon container */}
            <div className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
              flex items-center justify-center
              ${bgGradient}
              shadow-lg transform group-hover:scale-110 group-hover:rotate-3
              transition-all duration-300
            `}>
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-white transition-colors">
                  {title}
                </h3>
                {isNew && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0 animate-pulse">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NUEVO
                  </Badge>
                )}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                {description}
              </p>

              {/* Players badge */}
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className={`${colorClass} bg-background/50`}>
                  <Users className="w-3 h-3 mr-1" />
                  {players}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export default function GameSelector() {
  const router = useRouter();

  const handleSelectGame = (gameType: GameType) => {
    switch (gameType) {
      case 'impostor':
        router.push('/impostor');
        break;
      case 'spyfall':
        router.push('/spyfall');
        break;
      case 'wavelength':
        router.push('/wavelength');
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-background">
      {/* Header */}
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
          PARTY GAMES
        </h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">
          By Lucas Lazaro
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Elige un juego</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>

      {/* Game Cards */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full space-y-4 sm:space-y-6">

        {/* El Impostor (Mr. White) */}
        <GameCard
          type="impostor"
          title="El Impostor"
          description="Un jugador es el impostor y no conoce la palabra secreta. Discutid y descubrid quién es."
          icon={<Skull className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          players="3-16 jugadores"
          colorClass="border-orange-500/30 hover:border-orange-500"
          glowClass="hover:shadow-[0_0_40px_-5px] hover:shadow-orange-500/30"
          bgGradient="bg-gradient-to-br from-orange-500 to-red-600"
          onClick={() => handleSelectGame('impostor')}
        />

        {/* Spyfall */}
        <GameCard
          type="spyfall"
          title="Spyfall"
          description="Todos conocen el lugar secreto excepto el espía. Haced preguntas para descubrirlo."
          icon={<MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          players="3-10 jugadores"
          colorClass="border-indigo-500/30 hover:border-indigo-500"
          glowClass="hover:shadow-[0_0_40px_-5px] hover:shadow-indigo-500/30"
          bgGradient="bg-gradient-to-br from-indigo-500 to-blue-600"
          isNew
          onClick={() => handleSelectGame('spyfall')}
        />

        {/* Wavelength */}
        <GameCard
          type="wavelength"
          title="Wavelength"
          description="El psíquico da una pista. El equipo adivina dónde está el objetivo en la escala."
          icon={<Radio className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          players="2-12 jugadores"
          colorClass="border-pink-500/30 hover:border-pink-500"
          glowClass="hover:shadow-[0_0_40px_-5px] hover:shadow-pink-500/30"
          bgGradient="bg-gradient-to-br from-pink-500 to-rose-600"
          isNew
          onClick={() => handleSelectGame('wavelength')}
        />
      </div>

      {/* Footer */}
      <div className="text-center py-6 mt-4">
        <p className="text-xs text-muted-foreground">
          Pasa el móvil entre jugadores para jugar
        </p>
      </div>
    </div>
  );
}
