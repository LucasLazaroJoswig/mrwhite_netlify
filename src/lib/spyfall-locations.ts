import type { SpyfallLocation } from './types';

export const SPYFALL_LOCATIONS: SpyfallLocation[] = [
  {
    id: 'hospital',
    name: 'Hospital',
    icon: '🏥',
    roles: ['Doctor', 'Enfermera', 'Paciente', 'Cirujano', 'Recepcionista', 'Visitante', 'Paramédico', 'Celador']
  },
  {
    id: 'avion',
    name: 'Avión',
    icon: '✈️',
    roles: ['Piloto', 'Azafata', 'Pasajero', 'Copiloto', 'Air Marshal', 'Bebé llorón', 'Viajero frecuente', 'Primera clase']
  },
  {
    id: 'banco',
    name: 'Banco',
    icon: '🏦',
    roles: ['Cajero', 'Guardia', 'Cliente', 'Gerente', 'Asesor financiero', 'Atracador', 'Limpiador', 'Inversor']
  },
  {
    id: 'playa',
    name: 'Playa',
    icon: '🏖️',
    roles: ['Bañista', 'Socorrista', 'Surfista', 'Vendedor ambulante', 'Niño con cubo', 'Turista quemado', 'Pescador', 'Nudista']
  },
  {
    id: 'casino',
    name: 'Casino',
    icon: '🎰',
    roles: ['Crupier', 'Jugador', 'Seguridad', 'Camarero', 'Tahúr', 'Apostador compulsivo', 'Cantante', 'VIP']
  },
  {
    id: 'circo',
    name: 'Circo',
    icon: '🎪',
    roles: ['Payaso', 'Domador', 'Malabarista', 'Trapecista', 'Mago', 'Hombre bala', 'Espectador', 'Director']
  },
  {
    id: 'colegio',
    name: 'Colegio',
    icon: '🏫',
    roles: ['Profesor', 'Alumno', 'Director', 'Conserje', 'Padre', 'Empollón', 'Matón', 'Bedel']
  },
  {
    id: 'crucero',
    name: 'Crucero',
    icon: '🚢',
    roles: ['Capitán', 'Pasajero', 'Camarero', 'Animador', 'Músico', 'Chef', 'Marinero', 'Rico jubilado']
  },
  {
    id: 'estadio',
    name: 'Estadio de Fútbol',
    icon: '⚽',
    roles: ['Jugador', 'Árbitro', 'Entrenador', 'Aficionado', 'Comentarista', 'Ultra', 'Vendedor de cerveza', 'Portero']
  },
  {
    id: 'estacion_espacial',
    name: 'Estación Espacial',
    icon: '🛸',
    roles: ['Astronauta', 'Comandante', 'Científico', 'Ingeniero', 'Alien', 'Turista espacial', 'IA de la nave', 'Polizón']
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    icon: '🍽️',
    roles: ['Chef', 'Camarero', 'Cliente', 'Sommelier', 'Crítico gastronómico', 'Lavaplatos', 'Maitre', 'Cocinero']
  },
  {
    id: 'supermercado',
    name: 'Supermercado',
    icon: '🛒',
    roles: ['Cajero', 'Cliente', 'Reponedor', 'Guardia', 'Gerente', 'Promotora', 'Ladrón', 'Repartidor']
  },
  {
    id: 'universidad',
    name: 'Universidad',
    icon: '🎓',
    roles: ['Estudiante', 'Profesor', 'Decano', 'Bedel', 'Erasmus', 'Doctorando', 'Bibliotecario', 'Fiestero']
  },
  {
    id: 'zoologico',
    name: 'Zoológico',
    icon: '🦁',
    roles: ['Cuidador', 'Visitante', 'Veterinario', 'Fotógrafo', 'Niño perdido', 'Activista', 'Guía', 'Vendedor']
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: '🏨',
    roles: ['Recepcionista', 'Huésped', 'Botones', 'Limpiadora', 'Gerente', 'Turista', 'Ladrón de toallas', 'Conserje']
  },
  {
    id: 'gimnasio',
    name: 'Gimnasio',
    icon: '💪',
    roles: ['Entrenador', 'Deportista', 'Recepcionista', 'Culturista', 'Novato', 'Instructor de yoga', 'Vendedor de suplementos', 'Selfie-adicto']
  },
  {
    id: 'cine',
    name: 'Cine',
    icon: '🎬',
    roles: ['Taquillero', 'Espectador', 'Acomodador', 'Pareja', 'Proyeccionista', 'Vendedor de palomitas', 'Crítico', 'Pirata']
  },
  {
    id: 'prision',
    name: 'Prisión',
    icon: '🔒',
    roles: ['Preso', 'Guardia', 'Director', 'Cocinero', 'Abogado', 'Visita', 'Fugitivo', 'Psicólogo']
  },
  {
    id: 'iglesia',
    name: 'Iglesia',
    icon: '⛪',
    roles: ['Cura', 'Feligrés', 'Monaguillo', 'Organista', 'Novia', 'Novio', 'Pecador', 'Turista']
  },
  {
    id: 'spa',
    name: 'Spa',
    icon: '🧖',
    roles: ['Masajista', 'Cliente', 'Recepcionista', 'Influencer', 'Pareja', 'Esteticista', 'Jubilado', 'Terapeuta']
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    icon: '📚',
    roles: ['Bibliotecario', 'Estudiante', 'Escritor', 'Vagabundo', 'Investigador', 'Empollón', 'Dormilón', 'Opositor']
  },
  {
    id: 'parque_atracciones',
    name: 'Parque de Atracciones',
    icon: '🎢',
    roles: ['Operador', 'Visitante', 'Payaso', 'Familia', 'Adolescente', 'Vendedor', 'Personaje disfrazado', 'Niño asustado']
  },
  {
    id: 'comisaria',
    name: 'Comisaría',
    icon: '🚔',
    roles: ['Policía', 'Detenido', 'Detective', 'Abogado', 'Víctima', 'Testigo', 'Periodista', 'Recepcionista']
  },
  {
    id: 'boda',
    name: 'Boda',
    icon: '💒',
    roles: ['Novio', 'Novia', 'Cura', 'Padrino', 'Ex', 'Fotógrafo', 'DJ', 'Abuela borracha']
  },
  {
    id: 'funeral',
    name: 'Funeral',
    icon: '⚰️',
    roles: ['Viuda', 'Familiar', 'Cura', 'Enterrador', 'Abogado del testamento', 'Llorón profesional', 'Ex amante', 'Heredero ansioso']
  },
  {
    id: 'concierto',
    name: 'Concierto',
    icon: '🎸',
    roles: ['Cantante', 'Fan', 'Seguridad', 'Roadie', 'Técnico de sonido', 'VIP', 'Vendedor de merchandising', 'Groupie']
  },
  {
    id: 'metro',
    name: 'Metro',
    icon: '🚇',
    roles: ['Pasajero', 'Conductor', 'Músico callejero', 'Mendigo', 'Turista perdido', 'Revisor', 'Carterista', 'Vendedor ambulante']
  },
  {
    id: 'granja',
    name: 'Granja',
    icon: '🚜',
    roles: ['Granjero', 'Veterinario', 'Jornalero', 'Espantapájaros', 'Niño de ciudad', 'Vendedor', 'Mecánico', 'Vaca']
  },
  {
    id: 'peluqueria',
    name: 'Peluquería',
    icon: '💇',
    roles: ['Peluquero', 'Cliente', 'Aprendiz', 'Cotilla', 'Niño llorando', 'Recepcionista', 'Manicurista', 'Señora con secador']
  },
  {
    id: 'discoteca',
    name: 'Discoteca',
    icon: '🪩',
    roles: ['DJ', 'Bailarín', 'Portero', 'Camarero', 'Borracho', 'Ligón', 'Grupo de despedida', 'Relaciones públicas']
  }
];

export function getRandomLocation(): SpyfallLocation {
  const randomIndex = Math.floor(Math.random() * SPYFALL_LOCATIONS.length);
  return SPYFALL_LOCATIONS[randomIndex];
}

export function getRandomRole(location: SpyfallLocation): string {
  const randomIndex = Math.floor(Math.random() * location.roles.length);
  return location.roles[randomIndex];
}
