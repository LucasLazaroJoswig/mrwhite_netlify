"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initializePlayers, MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game-logic';
import type { GameData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Users, Play } from 'lucide-react';

export default function GameSetup() {
  const [numPlayers, setNumPlayers] = useState<number>(MIN_PLAYERS);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const router = useRouter();
  const { toast } = useToast();

  const handleNumPlayersChange = (value: string) => {
    const count = parseInt(value, 10);
    setNumPlayers(count);
    setPlayerNames(Array(count).fill('').map((_, i) => playerNames[i] || ''));
  };

  const handlePlayerNameChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = event.target.value;
    setPlayerNames(newPlayerNames);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (playerNames.some(name => name.trim() === '')) {
      toast({
        title: "Validation Error",
        description: "All player names must be filled.",
        variant: "destructive",
      });
      return;
    }
    
    if (new Set(playerNames.map(name => name.trim().toLowerCase())).size !== playerNames.length) {
      toast({
        title: "Validation Error",
        description: "Player names must be unique.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { players, civilianWord, mrWhiteName } = initializePlayers(playerNames.map(name => name.trim()));
      const gameData: GameData = { players, civilianWord, mrWhiteName };
      
      localStorage.setItem('mrWhiteGameData', JSON.stringify(gameData));
      router.push('/game');
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Game Setup Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Mr. White Game</CardTitle>
          <CardDescription className="text-muted-foreground">Setup your game session</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numPlayers" className="flex items-center gap-2">
                <Users className="text-primary" /> Number of Players
              </Label>
              <Select
                value={numPlayers.toString()}
                onValueChange={handleNumPlayersChange}
              >
                <SelectTrigger id="numPlayers" className="w-full">
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i).map(count => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} Players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {playerNames.map((name, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`playerName-${index}`}>{`Player ${index + 1} Name`}</Label>
                <Input
                  id={`playerName-${index}`}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e)}
                  placeholder={`Enter Player ${index + 1}'s Name`}
                  required
                  maxLength={20}
                  className="w-full"
                />
              </div>
            ))}
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="mr-2" /> Start Game
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
