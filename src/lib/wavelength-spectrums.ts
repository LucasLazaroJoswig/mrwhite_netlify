import type { WavelengthSpectrum, WavelengthCategory } from './types';

// ============ FOOTBALL SPECTRUMS ============
export const FOOTBALL_SPECTRUMS: WavelengthSpectrum[] = [
  // Player evaluation
  { id: 'fb-overrated-underrated', leftLabel: 'Sobrevalorado', rightLabel: 'Infravalorado' },
  { id: 'fb-legendary-forgotten', leftLabel: 'Leyenda', rightLabel: 'Olvidado' },
  { id: 'fb-technical-physical', leftLabel: 'Técnico', rightLabel: 'Físico' },
  { id: 'fb-consistent-inconsistent', leftLabel: 'Constante', rightLabel: 'Irregular' },
  { id: 'fb-team-individual', leftLabel: 'Jugador de equipo', rightLabel: 'Individualista' },

  // Team evaluation
  { id: 'fb-big-small', leftLabel: 'Equipo grande', rightLabel: 'Equipo chico' },
  { id: 'fb-offensive-defensive', leftLabel: 'Ofensivo', rightLabel: 'Defensivo' },
  { id: 'fb-academy-signings', leftLabel: 'Cantera', rightLabel: 'Fichajes' },
  { id: 'fb-boring-entertaining', leftLabel: 'Aburrido', rightLabel: 'Entretenido' },
  { id: 'fb-historic-modern', leftLabel: 'Histórico', rightLabel: 'Nuevo rico' },

  // Moments & Events
  { id: 'fb-iconic-forgettable', leftLabel: 'Momento olvidable', rightLabel: 'Momento icónico' },
  { id: 'fb-robbery-deserved', leftLabel: 'Robo', rightLabel: 'Merecido' },
  { id: 'fb-flop-success', leftLabel: 'Fracaso total', rightLabel: 'Éxito absoluto' },
  { id: 'fb-worst-best', leftLabel: 'Peor fichaje', rightLabel: 'Mejor fichaje' },

  // Style & Culture
  { id: 'fb-toxic-healthy', leftLabel: 'Afición tóxica', rightLabel: 'Afición sana' },
  { id: 'fb-cold-passionate', leftLabel: 'Estadio frío', rightLabel: 'Estadio caliente' },
  { id: 'fb-plastic-authentic', leftLabel: 'Club plástico', rightLabel: 'Club auténtico' },
  { id: 'fb-ugly-beautiful', leftLabel: 'Equipación fea', rightLabel: 'Equipación bonita' },

  // Competition & Results
  { id: 'fb-easy-difficult', leftLabel: 'Grupo fácil', rightLabel: 'Grupo de la muerte' },
  { id: 'fb-weak-strong', leftLabel: 'Liga débil', rightLabel: 'Liga fuerte' },
];

// ============ CLASSIC SPECTRUMS ============
export const WAVELENGTH_SPECTRUMS: WavelengthSpectrum[] = [
  // Temperature & Sensation
  { id: 'hot-cold', leftLabel: 'Frío', rightLabel: 'Caliente' },
  { id: 'soft-hard', leftLabel: 'Blando', rightLabel: 'Duro' },
  { id: 'light-heavy', leftLabel: 'Ligero', rightLabel: 'Pesado' },
  { id: 'smooth-rough', leftLabel: 'Suave', rightLabel: 'Áspero' },
  { id: 'wet-dry', leftLabel: 'Húmedo', rightLabel: 'Seco' },

  // Size & Quantity
  { id: 'small-big', leftLabel: 'Pequeño', rightLabel: 'Grande' },
  { id: 'short-tall', leftLabel: 'Bajo', rightLabel: 'Alto' },
  { id: 'few-many', leftLabel: 'Pocos', rightLabel: 'Muchos' },
  { id: 'thin-thick', leftLabel: 'Delgado', rightLabel: 'Grueso' },
  { id: 'narrow-wide', leftLabel: 'Estrecho', rightLabel: 'Ancho' },

  // Speed & Time
  { id: 'slow-fast', leftLabel: 'Lento', rightLabel: 'Rápido' },
  { id: 'old-young', leftLabel: 'Viejo', rightLabel: 'Joven' },
  { id: 'ancient-modern', leftLabel: 'Antiguo', rightLabel: 'Moderno' },
  { id: 'temporary-permanent', leftLabel: 'Temporal', rightLabel: 'Permanente' },

  // Emotion & Mood
  { id: 'sad-happy', leftLabel: 'Triste', rightLabel: 'Feliz' },
  { id: 'boring-exciting', leftLabel: 'Aburrido', rightLabel: 'Emocionante' },
  { id: 'calm-angry', leftLabel: 'Tranquilo', rightLabel: 'Enfadado' },
  { id: 'scary-safe', leftLabel: 'Aterrador', rightLabel: 'Seguro' },
  { id: 'stressful-relaxing', leftLabel: 'Estresante', rightLabel: 'Relajante' },

  // Quality & Value
  { id: 'bad-good', leftLabel: 'Malo', rightLabel: 'Bueno' },
  { id: 'cheap-expensive', leftLabel: 'Barato', rightLabel: 'Caro' },
  { id: 'ugly-beautiful', leftLabel: 'Feo', rightLabel: 'Bonito' },
  { id: 'simple-complex', leftLabel: 'Simple', rightLabel: 'Complejo' },
  { id: 'common-rare', leftLabel: 'Común', rightLabel: 'Raro' },

  // Social & Status
  { id: 'unknown-famous', leftLabel: 'Desconocido', rightLabel: 'Famoso' },
  { id: 'normal-weird', leftLabel: 'Normal', rightLabel: 'Raro' },
  { id: 'formal-casual', leftLabel: 'Formal', rightLabel: 'Informal' },
  { id: 'private-public', leftLabel: 'Privado', rightLabel: 'Público' },
  { id: 'individual-group', leftLabel: 'Individual', rightLabel: 'Grupal' },

  // Flavor & Food
  { id: 'sweet-salty', leftLabel: 'Dulce', rightLabel: 'Salado' },
  { id: 'bland-spicy', leftLabel: 'Suave', rightLabel: 'Picante' },
  { id: 'healthy-unhealthy', leftLabel: 'Saludable', rightLabel: 'No saludable' },

  // Abstract Concepts
  { id: 'failure-success', leftLabel: 'Fracaso', rightLabel: 'Éxito' },
  { id: 'fantasy-reality', leftLabel: 'Fantasía', rightLabel: 'Realidad' },
  { id: 'past-future', leftLabel: 'Pasado', rightLabel: 'Futuro' },
  { id: 'local-global', leftLabel: 'Local', rightLabel: 'Global' },
  { id: 'art-science', leftLabel: 'Arte', rightLabel: 'Ciencia' },

  // Intensity
  { id: 'quiet-loud', leftLabel: 'Silencioso', rightLabel: 'Ruidoso' },
  { id: 'dark-bright', leftLabel: 'Oscuro', rightLabel: 'Brillante' },
  { id: 'weak-strong', leftLabel: 'Débil', rightLabel: 'Fuerte' },
  { id: 'subtle-obvious', leftLabel: 'Sutil', rightLabel: 'Obvio' },

  // Character Traits
  { id: 'introverted-extroverted', leftLabel: 'Introvertido', rightLabel: 'Extrovertido' },
  { id: 'lazy-hardworking', leftLabel: 'Perezoso', rightLabel: 'Trabajador' },
  { id: 'pessimist-optimist', leftLabel: 'Pesimista', rightLabel: 'Optimista' },
  { id: 'follower-leader', leftLabel: 'Seguidor', rightLabel: 'Líder' },

  // Fun & Entertainment
  { id: 'serious-funny', leftLabel: 'Serio', rightLabel: 'Gracioso' },
  { id: 'childish-mature', leftLabel: 'Infantil', rightLabel: 'Maduro' },
  { id: 'mainstream-underground', leftLabel: 'Mainstream', rightLabel: 'Underground' },
  { id: 'overrated-underrated', leftLabel: 'Sobrevalorado', rightLabel: 'Infravalorado' },

  // Nature & Environment
  { id: 'urban-rural', leftLabel: 'Urbano', rightLabel: 'Rural' },
  { id: 'natural-artificial', leftLabel: 'Natural', rightLabel: 'Artificial' },
  { id: 'wild-domestic', leftLabel: 'Salvaje', rightLabel: 'Doméstico' },

  // Miscellaneous
  { id: 'guilty-innocent', leftLabel: 'Culpable', rightLabel: 'Inocente' },
  { id: 'necessary-luxury', leftLabel: 'Necesario', rightLabel: 'Lujo' },
  { id: 'practical-theoretical', leftLabel: 'Práctico', rightLabel: 'Teórico' },
  { id: 'easy-difficult', leftLabel: 'Fácil', rightLabel: 'Difícil' },
  { id: 'risky-safe', leftLabel: 'Arriesgado', rightLabel: 'Seguro' },
];

export function getSpectrumsByCategory(category: WavelengthCategory): WavelengthSpectrum[] {
  switch (category) {
    case 'football':
      return FOOTBALL_SPECTRUMS;
    case 'classic':
    default:
      return WAVELENGTH_SPECTRUMS;
  }
}

export function getRandomSpectrum(category: WavelengthCategory = 'classic', customSpectrums?: WavelengthSpectrum[]): WavelengthSpectrum {
  if (category === 'custom' && customSpectrums && customSpectrums.length > 0) {
    const randomIndex = Math.floor(Math.random() * customSpectrums.length);
    return customSpectrums[randomIndex];
  }

  const spectrums = getSpectrumsByCategory(category);
  const randomIndex = Math.floor(Math.random() * spectrums.length);
  return spectrums[randomIndex];
}

export function getRandomTargetPosition(): number {
  // Returns a position between 10 and 90 (avoid extremes)
  return Math.floor(Math.random() * 81) + 10;
}
