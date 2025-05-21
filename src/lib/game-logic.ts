
import type { Player, GameData } from './types';

export const SECRET_WORDS = [
  // Originales
  "Manzana", "Playa", "Coche", "Perro", "Sol", "Luna", "Libro", "Silla", "Casa", "Río",
  "Montaña", "Bosque", "Nube", "Estrella", "Llave", "Candado", "Puente", "Camino", "Barco", "Tren",
  "Flor", "Jardín", "Rueda", "Gato", "Avión", "Escuela", "Ratón", "Mesa", "Ventana", "Lápiz",
  "Reloj", "Vaso", "Tenedor", "Cuchara", "Plato", "Calcetín", "Zapato", "Abrigo", "Sombrero",
  "Guante", "Bufanda", "Pantalón", "Camisa", "Falda", "Vestido", "Anillo", "Collar", "Pulsera", "Pendiente",
  // Animales
  "León", "Tigre", "Elefante", "Jirafa", "Cebra", "Caballo", "Vaca", "Oveja", "Cerdo", "Pollo",
  "Pato", "Pavo", "Águila", "Halcón", "Búho", "Loro", "Pingüino", "Delfín", "Ballena", "Tiburón",
  "Pulpo", "Cangrejo", "Serpiente", "Lagarto", "Tortuga", "Rana", "Mariposa", "Abeja", "Hormiga", "Araña",
  // Comida y Bebida
  "Naranja", "Plátano", "Uva", "Fresa", "Sandía", "Melón", "Piña", "Mango", "Kiwi", "Cereza",
  "Limón", "Tomate", "Patata", "Cebolla", "Ajo", "Zanahoria", "Lechuga", "Pepino", "Pimiento", "Brócoli",
  "Arroz", "Pasta", "Pan", "Queso", "Huevo", "Leche", "Yogur", "Mantequilla", "Aceite", "Vinagre",
  "Sal", "Azúcar", "Pimienta", "Café", "Té", "Zumo", "Agua", "Vino", "Cerveza", "Chocolate",
  // Objetos Caseros
  "Sofá", "Cama", "Armario", "Espejo", "Lámpara", "Alfombra", "Cortina", "Cojín", "Escritorio", "Estantería",
  "Ordenador", "Televisión", "Teléfono", "Radio", "Nevera", "Horno", "Microondas", "Lavadora", "Aspiradora", "Plancha",
  // Naturaleza y Geografía
  "Volcán", "Desierto", "Isla", "Océano", "Mar", "Lago", "Glaciar", "Valle", "Colina", "Cueva",
  "Árbol", "Hoja", "Raíz", "Semilla", "Hierba", "Piedra", "Arena", "Tierra", "Fuego", "Viento",
  "Lluvia", "Nieve", "Hielo", "Trueno", "Rayo", "Arcoíris", "Amanecer", "Atardecer", "Invierno", "Verano",
  "Otoño", "Primavera", "Continente", "País", "Ciudad", "Pueblo",
  // Herramientas y Transporte
  "Martillo", "Destornillador", "Sierra", "Clavo", "Tornillo", "Taladro", "Escalera", "Pincel", "Rodillo", "Tijeras",
  "Bicicleta", "Motocicleta", "Autobús", "Camión", "Helicóptero", "Globo", "Cohete", "Submarino", "Canoa", "Monopatín",
  // Ropa y Accesorios (más)
  "Cinturón", "Gorra", "Bikini", "Bañador", "Pijama", "Bata", "Zapatillas", "Botas", "Sandalias", "Joyas",
  // Lugares
  "Aeropuerto", "Estación", "Hospital", "Biblioteca", "Museo", "Teatro", "Cine", "Restaurante", "Hotel", "Gimnasio",
  "Parque", "Zoológico", "Circo", "Universidad", "Oficina", "Fábrica", "Tienda", "Mercado", "Iglesia", "Castillo",
  // Profesiones (sustantivos relacionados)
  "Pizarra", "Libreta", "Maletín", "Bisturí", "Estetoscopio", "Casco", "Escudo", "Micrófono", "Cámara", "Partitura",
  // Deportes (equipamiento)
  "Balón", "Raqueta", "Red", "Guantes de boxeo", "Patinetes", "Esquís", "Canasta", "Portería", "Bate", "Palo de golf",
  // Instrumentos Musicales
  "Guitarra", "Piano", "Violín", "Batería", "Flauta", "Trompeta", "Saxofón", "Tambor", "Arpa", "Acordeón",
  // Abstractos (pocos y simples)
  "Sueño", "Idea", "Risa", "Juego", "Fiesta", "Música", "Silencio", "Amor", "Paz", "Guerra",
  // Misceláneos
  "Bandera", "Mapa", "Tesoro", "Regalo", "Foto", "Carta", "Periódico", "Revista", "Dinero", "Billete"
];

export const MR_WHITE_MESSAGE = "Eres Mr. White";
export const PAYASO_MESSAGE_PREFIX = "Eres el Payaso. Tu palabra es"; // Se completará con la palabra civil
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 16;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializePlayers(
  playerNames: string[],
  previousCivilianWord?: string
): GameData {
  if (playerNames.length < MIN_PLAYERS || playerNames.length > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  let availableWords = SECRET_WORDS;
  if (previousCivilianWord) {
    availableWords = SECRET_WORDS.filter(word => word !== previousCivilianWord);
    if (availableWords.length === 0) {
      availableWords = SECRET_WORDS;
    }
  }
  
  const civilianWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  
  let numberOfMrWhites = 1;
  if (playerNames.length >= 14) numberOfMrWhites = 4;
  else if (playerNames.length >= 10) numberOfMrWhites = 3;
  else if (playerNames.length >= 6) numberOfMrWhites = 2;

  const playerIndices = Array.from(Array(playerNames.length).keys());
  let shuffledPlayerIndices = shuffleArray(playerIndices);

  const mrWhiteIndices = new Set<number>();
  for (let i = 0; i < numberOfMrWhites; i++) {
    mrWhiteIndices.add(shuffledPlayerIndices[i]);
  }

  let payasoIndex: number | undefined = undefined;
  let payasoName: string | undefined = undefined;

  if (playerNames.length >= 7) {
    const potentialPayasoIndices = shuffledPlayerIndices.filter(index => !mrWhiteIndices.has(index));
    if (potentialPayasoIndices.length > 0) {
      payasoIndex = potentialPayasoIndices[Math.floor(Math.random() * potentialPayasoIndices.length)];
    }
  }

  const mrWhiteNamesList: string[] = [];
  const players: Player[] = playerNames.map((name, index) => {
    const isMrWhite = mrWhiteIndices.has(index);
    const isPayaso = index === payasoIndex;
    let role: 'civilian' | 'mrwhite' | 'payaso' = 'civilian';
    let word = civilianWord;

    if (isMrWhite) {
      role = 'mrwhite';
      word = MR_WHITE_MESSAGE;
      mrWhiteNamesList.push(name);
    } else if (isPayaso) {
      role = 'payaso';
      word = civilianWord; // Payaso conoce la palabra
      payasoName = name;
    }

    return {
      id: `${name.replace(/\s+/g, '-')}-${index}-${Date.now()}`,
      name,
      word,
      isMrWhite: role === 'mrwhite', // Para compatibilidad o lógica simple
      role,
      wordRevealed: false,
      clue: '', // Inicializar clue
    };
  });

  return {
    players: shuffleArray(players), // Barajar el orden de juego final
    civilianWord,
    mrWhiteNames: mrWhiteNamesList,
    payasoName,
    gamePhase: 'wordReveal',
    playerClues: {},
    votedPlayerId: undefined,
    clueRanking: undefined,
  };
}
