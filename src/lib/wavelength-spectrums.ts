import type { WavelengthSpectrum } from './types';

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

export function getRandomSpectrum(): WavelengthSpectrum {
  const randomIndex = Math.floor(Math.random() * WAVELENGTH_SPECTRUMS.length);
  return WAVELENGTH_SPECTRUMS[randomIndex];
}

export function getRandomTargetPosition(): number {
  // Returns a position between 10 and 90 (avoid extremes)
  return Math.floor(Math.random() * 81) + 10;
}
