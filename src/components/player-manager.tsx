"use client";

import React, { useState } from 'react';
import type { Player, GameData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Crown,
  AlertTriangle,
  UserPlus,
  GripVertical,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlayerManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameData: GameData;
  onUpdatePlayers: (players: Player[]) => void;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 30;

export default function PlayerManager({
  open,
  onOpenChange,
  gameData,
  onUpdatePlayers,
}: PlayerManagerProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    const newPlayers = [...gameData.players];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newPlayers.length) return;

    [newPlayers[index], newPlayers[newIndex]] = [newPlayers[newIndex], newPlayers[index]];
    onUpdatePlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    const trimmedName = newPlayerName.trim();

    if (!trimmedName) {
      toast({
        title: "Nombre requerido",
        description: "Introduce un nombre para el jugador.",
        duration: 3000,
      });
      return;
    }

    if (gameData.players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast({
        title: "Nombre duplicado",
        description: "Ya existe un jugador con ese nombre.",
        duration: 3000,
      });
      return;
    }

    if (gameData.players.length >= MAX_PLAYERS) {
      toast({
        title: "Máximo alcanzado",
        description: `No puedes tener más de ${MAX_PLAYERS} jugadores.`,
        duration: 3000,
      });
      return;
    }

    const newPlayer: Player = {
      id: `player-${gameData.players.length}-${Date.now()}`,
      name: trimmedName,
      word: gameData.secretWord,
      isImpostor: false,
      wordRevealed: false,
      isStartingPlayer: false,
    };

    onUpdatePlayers([...gameData.players, newPlayer]);
    setNewPlayerName('');
    setShowAddDialog(false);

    toast({
      title: "Jugador añadido",
      description: `${trimmedName} se ha unido a la partida como civil.`,
      duration: 3000,
    });
  };

  const handleDeletePlayer = (player: Player) => {
    if (gameData.players.length <= MIN_PLAYERS) {
      toast({
        title: "Mínimo alcanzado",
        description: `Necesitas al menos ${MIN_PLAYERS} jugadores.`,
        duration: 3000,
      });
      return;
    }

    setPlayerToDelete(player);
  };

  const confirmDeletePlayer = () => {
    if (!playerToDelete) return;

    const newPlayers = gameData.players.filter(p => p.id !== playerToDelete.id);

    // Si eliminamos al que empieza, asignar al primero
    if (playerToDelete.isStartingPlayer && newPlayers.length > 0) {
      newPlayers[0] = { ...newPlayers[0], isStartingPlayer: true };
    }

    onUpdatePlayers(newPlayers);
    setPlayerToDelete(null);

    toast({
      title: "Jugador eliminado",
      description: `${playerToDelete.name} ha salido de la partida.`,
      duration: 3000,
    });
  };

  const setStartingPlayer = (player: Player) => {
    const newPlayers = gameData.players.map(p => ({
      ...p,
      isStartingPlayer: p.id === player.id,
    }));
    onUpdatePlayers(newPlayers);

    toast({
      title: "Jugador inicial cambiado",
      description: `${player.name} ahora empieza la ronda.`,
      duration: 2000,
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-accent" />
              Gestionar Jugadores
            </SheetTitle>
            <SheetDescription>
              Añade, elimina o reordena jugadores durante la partida
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100%-80px)]">
            {/* Lista de jugadores */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {gameData.players.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    player.isStartingPlayer
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-secondary/30 border-transparent'
                  }`}
                >
                  {/* Indicador de posición */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent/20"
                      onClick={() => movePlayer(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground font-mono w-4 text-center">
                      {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent/20"
                      onClick={() => movePlayer(index, 'down')}
                      disabled={index === gameData.players.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Grip icon */}
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />

                  {/* Nombre y badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {player.name}
                      </span>
                      {player.isStartingPlayer && (
                        <Crown className="w-4 h-4 text-accent shrink-0" />
                      )}
                    </div>
                    {!player.wordRevealed && (
                      <span className="text-xs text-yellow-500">
                        Aún no ha visto su carta
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1">
                    {!player.isStartingPlayer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent/20"
                        onClick={() => setStartingPlayer(player)}
                        title="Hacer que empiece"
                      >
                        <Crown className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        gameData.players.length <= MIN_PLAYERS
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-red-500/20 hover:text-red-400'
                      }`}
                      onClick={() => handleDeletePlayer(player)}
                      disabled={gameData.players.length <= MIN_PLAYERS}
                      title="Eliminar jugador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón añadir jugador */}
            <div className="pt-4 border-t border-border mt-4">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="w-full bg-gradient-to-r from-accent to-primary text-white py-5"
                disabled={gameData.players.length >= MAX_PLAYERS}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Añadir Jugador ({gameData.players.length}/{MAX_PLAYERS})
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Los nuevos jugadores se añaden como civiles
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog para añadir jugador */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-sm bg-card border-2 border-accent/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" />
              Añadir Jugador
            </DialogTitle>
            <DialogDescription>
              El nuevo jugador se unirá como civil y conocerá la palabra secreta.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Nombre del jugador"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="text-lg py-5"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewPlayerName('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddPlayer}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={!!playerToDelete} onOpenChange={() => setPlayerToDelete(null)}>
        <DialogContent className="sm:max-w-sm bg-card border-2 border-red-500/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <DialogTitle>¿Eliminar jugador?</DialogTitle>
                <DialogDescription className="mt-1">
                  {playerToDelete?.name} será eliminado de la partida.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPlayerToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDeletePlayer}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
