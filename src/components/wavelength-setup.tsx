"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeWavelengthGame, MIN_WAVELENGTH_PLAYERS, MAX_WAVELENGTH_PLAYERS } from '@/lib/wavelength-logic';
import type { WavelengthCategory, WavelengthSpectrum } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Users, Play, PlusCircle, Trash2, ArrowLeft, Radio, Sparkles, Trophy, Pencil, ArrowRight, Check } from 'lucide-react';

type SetupStep = 'category' | 'custom' | 'players';

interface CategoryOption {
  id: WavelengthCategory;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'classic',
    name: 'Clásico',
    description: '55+ espectros variados',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'football',
    name: 'Fútbol',
    description: '20 espectros futboleros',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-600',
    badge: 'NUEVO',
  },
  {
    id: 'custom',
    name: 'Personalizado',
    description: 'Crea tus propios espectros',
    icon: <Pencil className="w-8 h-8" />,
    color: 'from-violet-500 to-purple-600',
  },
];

export default function WavelengthSetup() {
  const [step, setStep] = useState<SetupStep>('category');
  const [category, setCategory] = useState<WavelengthCategory>('classic');
  const [customSpectrums, setCustomSpectrums] = useState<WavelengthSpectrum[]>([
    { id: 'custom-1', leftLabel: '', rightLabel: '' }
  ]);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(MIN_WAVELENGTH_PLAYERS).fill(''));
  const router = useRouter();
  const { toast } = useToast();

  const handleBack = () => {
    if (step === 'players') {
      setStep(category === 'custom' ? 'custom' : 'category');
    } else if (step === 'custom') {
      setStep('category');
    } else {
      router.push('/');
    }
  };

  const handleCategorySelect = (selectedCategory: WavelengthCategory) => {
    setCategory(selectedCategory);
    if (selectedCategory === 'custom') {
      setStep('custom');
    } else {
      setStep('players');
    }
  };

  const handleCustomSpectrumChange = (index: number, field: 'leftLabel' | 'rightLabel', value: string) => {
    const updated = [...customSpectrums];
    updated[index] = { ...updated[index], [field]: value };
    setCustomSpectrums(updated);
  };

  const addCustomSpectrum = () => {
    if (customSpectrums.length < 20) {
      setCustomSpectrums([...customSpectrums, { id: `custom-${Date.now()}`, leftLabel: '', rightLabel: '' }]);
    }
  };

  const removeCustomSpectrum = (index: number) => {
    if (customSpectrums.length > 1) {
      setCustomSpectrums(customSpectrums.filter((_, i) => i !== index));
    }
  };

  const handleCustomContinue = () => {
    const validSpectrums = customSpectrums.filter(s => s.leftLabel.trim() && s.rightLabel.trim());
    if (validSpectrums.length === 0) {
      toast({
        title: "Necesitas al menos un espectro",
        description: "Añade al menos un espectro con ambos lados rellenos.",
        variant: "destructive",
      });
      return;
    }
    setCustomSpectrums(validSpectrums);
    setStep('players');
  };

  const handlePlayerNameChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = event.target.value;
    setPlayerNames(newPlayerNames);
  };

  const addPlayer = () => {
    if (playerNames.length < MAX_WAVELENGTH_PLAYERS) {
      setPlayerNames([...playerNames, '']);
    } else {
      toast({
        title: "Máximo alcanzado",
        description: `No puedes tener más de ${MAX_WAVELENGTH_PLAYERS} jugadores.`,
        duration: 3000,
      });
    }
  };

  const removePlayer = (indexToRemove: number) => {
    if (playerNames.length > MIN_WAVELENGTH_PLAYERS) {
      setPlayerNames(playerNames.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedPlayerNames = playerNames.map(name => name.trim());

    if (trimmedPlayerNames.some(name => name === '')) {
      toast({
        title: "Faltan nombres",
        description: "Todos los jugadores deben tener nombre.",
        variant: "destructive",
      });
      return;
    }

    if (new Set(trimmedPlayerNames.map(name => name.toLowerCase())).size !== trimmedPlayerNames.length) {
      toast({
        title: "Nombres duplicados",
        description: "Los nombres deben ser únicos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const finalCustomSpectrums = category === 'custom' ? customSpectrums : undefined;
      const gameData = initializeWavelengthGame(trimmedPlayerNames, undefined, category, finalCustomSpectrums);
      localStorage.setItem('wavelengthGameData', JSON.stringify(gameData));
      router.push('/wavelength/game');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ha ocurrido un error";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Category Selection Step
  if (step === 'category') {
    return (
      <div className="flex flex-col min-h-screen p-4 bg-background">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="self-start mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Radio className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
              WAVELENGTH
            </h1>
            <p className="text-muted-foreground mt-2">
              Elige una categoría
            </p>
          </div>

          {/* Category Cards */}
          <div className="w-full max-w-md space-y-4">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleCategorySelect(option.id)}
                className="w-full group"
              >
                <Card className="relative overflow-hidden border-2 border-transparent hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 bg-card hover:scale-[1.02]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-lg`}>
                        {option.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground">{option.name}</h3>
                          {option.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Custom Spectrum Creation Step
  if (step === 'custom') {
    return (
      <div className="flex flex-col min-h-screen p-4 bg-background">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="self-start mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Pencil className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
              Espectros Personalizados
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Define los extremos de cada espectro
            </p>
          </div>

          <Card className="w-full max-w-md shadow-2xl border-2 border-violet-500/20 bg-card">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {customSpectrums.map((spectrum, index) => (
                  <div key={spectrum.id} className="relative">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-violet-500/10">
                      <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">
                        {index + 1}
                      </div>
                      <Input
                        type="text"
                        value={spectrum.leftLabel}
                        onChange={(e) => handleCustomSpectrumChange(index, 'leftLabel', e.target.value)}
                        placeholder="Izquierda"
                        maxLength={20}
                        className="flex-1 bg-input border-border focus:border-violet-500 text-sm"
                      />
                      <span className="text-muted-foreground text-xs">↔</span>
                      <Input
                        type="text"
                        value={spectrum.rightLabel}
                        onChange={(e) => handleCustomSpectrumChange(index, 'rightLabel', e.target.value)}
                        placeholder="Derecha"
                        maxLength={20}
                        className="flex-1 bg-input border-border focus:border-violet-500 text-sm"
                      />
                      {customSpectrums.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomSpectrum(index)}
                          className="text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {customSpectrums.length < 20 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomSpectrum}
                  className="w-full border-dashed hover:border-violet-500 hover:text-violet-400"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Espectro
                </Button>
              )}

              <div className="text-xs text-center text-muted-foreground">
                {customSpectrums.filter(s => s.leftLabel.trim() && s.rightLabel.trim()).length} espectros válidos
              </div>

              <Button
                onClick={handleCustomContinue}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg py-6 rounded-xl shadow-lg shadow-violet-500/30 transform hover:scale-[1.02] transition-all"
              >
                <Check className="mr-2 h-5 w-5" /> Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Players Setup Step
  return (
    <div className="flex flex-col min-h-screen p-4 bg-background">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="self-start mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
            category === 'football' ? 'from-green-500 to-emerald-600 shadow-green-500/30' :
            category === 'custom' ? 'from-violet-500 to-purple-600 shadow-violet-500/30' :
            'from-pink-500 to-rose-600 shadow-pink-500/30'
          } flex items-center justify-center shadow-lg`}>
            <Radio className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${
            category === 'football' ? 'from-green-400 to-emerald-500' :
            category === 'custom' ? 'from-violet-400 to-purple-500' :
            'from-pink-400 to-rose-500'
          }`}>
            WAVELENGTH
          </h1>
          <p className="text-muted-foreground mt-2">
            {category === 'football' ? 'Modo Fútbol' : category === 'custom' ? 'Modo Personalizado' : 'Modo Clásico'}
          </p>
        </div>

        <Card className={`w-full max-w-md shadow-2xl border-2 bg-card ${
          category === 'football' ? 'border-green-500/20' :
          category === 'custom' ? 'border-violet-500/20' :
          'border-pink-500/20'
        }`}>
          <CardHeader className="text-center pb-2">
            <CardTitle className={`text-2xl font-bold text-foreground flex items-center justify-center gap-2`}>
              <Users className={`w-6 h-6 ${
                category === 'football' ? 'text-green-400' :
                category === 'custom' ? 'text-violet-400' :
                'text-pink-400'
              }`} />
              Jugadores
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {MIN_WAVELENGTH_PLAYERS}-{MAX_WAVELENGTH_PLAYERS} jugadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      category === 'football' ? 'bg-green-500/20 text-green-400' :
                      category === 'custom' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-pink-500/20 text-pink-400'
                    }`}>
                      {index + 1}
                    </div>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e)}
                      placeholder={`Jugador ${index + 1}`}
                      required
                      maxLength={20}
                      className={`flex-grow bg-input border-border ${
                        category === 'football' ? 'focus:border-green-500' :
                        category === 'custom' ? 'focus:border-violet-500' :
                        'focus:border-pink-500'
                      }`}
                    />
                    {playerNames.length > MIN_WAVELENGTH_PLAYERS && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlayer(index)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {playerNames.length < MAX_WAVELENGTH_PLAYERS && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPlayer}
                  className={`w-full border-dashed ${
                    category === 'football' ? 'hover:border-green-500 hover:text-green-400' :
                    category === 'custom' ? 'hover:border-violet-500 hover:text-violet-400' :
                    'hover:border-pink-500 hover:text-pink-400'
                  }`}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Jugador
                </Button>
              )}

              <Button
                type="submit"
                className={`w-full text-white text-lg py-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all ${
                  category === 'football'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30'
                    : category === 'custom'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/30'
                    : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/30'
                }`}
                disabled={playerNames.some(name => name.trim() === '') || playerNames.length < MIN_WAVELENGTH_PLAYERS}
              >
                <Play className="mr-2 h-5 w-5" /> JUGAR
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 max-w-md text-center">
          <p className="text-xs text-muted-foreground">
            El psíquico da una pista, el equipo adivina
            <br />
            dónde está el objetivo en la escala.
          </p>
        </div>
      </div>
    </div>
  );
}
