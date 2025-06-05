
import type { Player, GameData, GameMode } from './types';

export const SECRET_WORDS = [
  "Manzana", "Playa", "Coche", "Perro", "Sol", "Luna", "Libro", "Silla", "Casa", "Río",
  "Montaña", "Bosque", "Nube", "Estrella", "Llave", "Candado", "Puente", "Camino", "Barco", "Tren",
  "Flor", "Jardín", "Rueda", "Gato", "Avión", "Escuela", "Ratón", "Mesa", "Ventana", "Lápiz",
  "Reloj", "Vaso", "Tenedor", "Cuchara", "Plato", "Calcetín", "Zapato", "Abrigo", "Sombrero",
  "Guante", "Bufanda", "Pantalón", "Camisa", "Falda", "Vestido", "Anillo", "Collar", "Pulsera", "Pendiente",
  "León", "Tigre", "Elefante", "Jirafa", "Cebra", "Caballo", "Vaca", "Oveja", "Cerdo", "Pollo",
  "Pato", "Pavo", "Águila", "Halcón", "Búho", "Loro", "Pingüino", "Delfín", "Ballena", "Tiburón",
  "Pulpo", "Cangrejo", "Serpiente", "Lagarto", "Tortuga", "Rana", "Mariposa", "Abeja", "Hormiga", "Araña", "Murciélago", "Ardilla",
  "Naranja", "Plátano", "Uva", "Fresa", "Sandía", "Melón", "Piña", "Mango", "Kiwi", "Cereza",
  "Limón", "Tomate", "Patata", "Cebolla", "Ajo", "Zanahoria", "Lechuga", "Pepino", "Pimiento", "Brócoli",
  "Arroz", "Pasta", "Pan", "Queso", "Huevo", "Leche", "Yogur", "Mantequilla", "Aceite", "Vinagre",
  "Sal", "Azúcar", "Pimienta", "Café", "Té", "Zumo", "Agua", "Vino", "Cerveza", "Chocolate", "Galleta", "Helado", "Miel",
  "Sofá", "Cama", "Armario", "Espejo", "Lámpara", "Alfombra", "Cortina", "Cojín", "Escritorio", "Estantería",
  "Ordenador", "Televisión", "Teléfono", "Radio", "Nevera", "Horno", "Microondas", "Lavadora", "Aspiradora", "Plancha",
  "Escoba", "Fregona", "Jarrón", "Cuadro", "Toalla", "Jabón", "Cepillo",
  "Volcán", "Desierto", "Isla", "Océano", "Mar", "Lago", "Glaciar", "Valle", "Colina", "Cueva",
  "Árbol", "Hoja", "Raíz", "Semilla", "Hierba", "Piedra", "Arena", "Tierra", "Fuego", "Viento",
  "Lluvia", "Nieve", "Hielo", "Trueno", "Rayo", "Arcoíris", "Amanecer", "Atardecer", "Invierno", "Verano",
  "Otoño", "Primavera", "Continente", "País", "Ciudad", "Pueblo", "Selva", "Pantano", "Catarata",
  "Martillo", "Destornillador", "Sierra", "Clavo", "Tornillo", "Taladro", "Escalera", "Pincel", "Rodillo", "Tijeras",
  "Bicicleta", "Motocicleta", "Autobús", "Camión", "Helicóptero", "Globo", "Cohete", "Submarino", "Canoa", "Monopatín",
  "Patin", "Yate", "Furgoneta",
  "Cinturón", "Gorra", "Bikini", "Bañador", "Pijama", "Bata", "Zapatillas", "Botas", "Sandalias", "Joyas",
  "Medias", "Corbata", "Pajarita", "Traje", "Chaqueta",
  "Aeropuerto", "Estación", "Hospital", "Biblioteca", "Museo", "Teatro", "Cine", "Restaurante", "Hotel", "Gimnasio",
  "Parque", "Zoológico", "Circo", "Universidad", "Oficina", "Fábrica", "Tienda", "Mercado", "Iglesia", "Castillo",
  "Farmacia", "Banco", "Supermercado", "Plaza", "Estadio",
  "Pizarra", "Libreta", "Maletín", "Bisturí", "Estetoscopio", "Casco", "Escudo", "Micrófono", "Cámara", "Partitura",
  "Balón", "Raqueta", "Red", "Guantes de boxeo", "Patinetes", "Esquís", "Canasta", "Portería", "Bate", "Palo de golf",
  "Guitarra", "Piano", "Violín", "Batería", "Flauta", "Trompeta", "Saxofón", "Tambor", "Arpa", "Acordeón",
  "Sueño", "Idea", "Risa", "Juego", "Fiesta", "Música", "Silencio", "Amor", "Paz", "Guerra",
  "Bandera", "Mapa", "Tesoro", "Regalo", "Foto", "Carta", "Periódico", "Revista", "Dinero", "Billete",
  "Moneda", "Semáforo", "Señal", "Fantasma", "Robot", "Dragón", "Unicornio", "Espada", "Varita",
  "Poción", "Corona", "Trineo", "Pirámide", "Estatua", "Fuente", "Ducha", "Bañera", "Bolsa", "Mochila",
  "Paraguas", "Caja", "Botella", "Lata", "Dado", "Ficha", "Peonza", "Cometa", "Puzzle", "Bomba"
];

export const WORD_PAIRS: { civilian: string; undercover: string; category?: string }[] = [
  { civilian: "Playa", undercover: "Desierto", category: "Lugares" },
  { civilian: "Sol", undercover: "Bombilla", category: "Objetos/Naturaleza" },
  { civilian: "Río", undercover: "Carretera", category: "Geografía/Construcción" },
  { civilian: "Perro", undercover: "Lobo", category: "Animales" },
  { civilian: "Manzana", undercover: "Tomate", category: "Comida" },
  { civilian: "Coche", undercover: "Tren", category: "Transporte" },
  { civilian: "Libro", undercover: "Revista", category: "Objetos" },
  { civilian: "Silla", undercover: "Sofá", category: "Muebles" },
  { civilian: "Nube", undercover: "Algodón", category: "Naturaleza/Materiales" },
  { civilian: "Montaña", undercover: "Edificio", category: "Geografía/Construcción" },
  { civilian: "Helado", undercover: "Nieve", category: "Comida/Naturaleza" },
  { civilian: "Guitarra", undercover: "Violín", category: "Instrumentos" },
  { civilian: "Amarillo", undercover: "Dorado", category: "Colores" },
  { civilian: "Correr", undercover: "Caminar", category: "Acciones" },
  { civilian: "Médico", undercover: "Enfermero", category: "Profesiones" },
  { civilian: "Leche", undercover: "Agua", category: "Bebidas" },
  { civilian: "Fútbol", undercover: "Baloncesto", category: "Deportes" },
  { civilian: "Pintar", undercover: "Dibujar", category: "Arte" },
  { civilian: "Frío", undercover: "Congelado", category: "Sensaciones" },
  { civilian: "Luna", undercover: "Satélite", category: "Astronomía" }
];


export const MR_WHITE_MESSAGE = "Eres Mr. White";
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
  gameMode: GameMode,
  requestedNumMrWhites: number, // Número solicitado desde la UI
  previousCivilianWord?: string
): GameData {
  const numTotalPlayers = playerNames.length;
  if (numTotalPlayers < MIN_PLAYERS || numTotalPlayers > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  let civilianWord: string;
  let undercoverWordForGame: string | undefined = undefined;

  if (gameMode === 'undercover') {
    let availablePairs = WORD_PAIRS;
    if (previousCivilianWord) {
      availablePairs = WORD_PAIRS.filter(pair => pair.civilian !== previousCivilianWord && pair.undercover !== previousCivilianWord);
    }
    if (availablePairs.length === 0) availablePairs = WORD_PAIRS; // Fallback
    const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    civilianWord = selectedPair.civilian;
    undercoverWordForGame = selectedPair.undercover;
  } else {
    let availableWords = SECRET_WORDS.filter(word => word !== previousCivilianWord);
    if (availableWords.length === 0) availableWords = SECRET_WORDS; // Fallback
    civilianWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  }

  let actualNumMrWhites = 0;
  let isUndercoverInGame = false;
  let includePayaso = false;

  // Determinar si hay Payaso basado en el número total de jugadores
  if (numTotalPlayers >= 8) {
    includePayaso = true;
  }

  if (gameMode === 'undercover') {
    isUndercoverInGame = true;
    actualNumMrWhites = 0; // Undercover reemplaza a Mr. White
  } else { // gameMode === 'mrWhite'
    // Validar y ajustar requestedNumMrWhites
    if (numTotalPlayers <= 2) { // Aunque MIN_PLAYERS es 3
        actualNumMrWhites = Math.min(requestedNumMrWhites, numTotalPlayers -1, 1);
    } else { // numTotalPlayers >= 3
        const maxMrWhites = numTotalPlayers - 2; // Para dejar al menos 2 no Mr. White (o 1 Civil + 1 Payaso)
        actualNumMrWhites = Math.max(1, Math.min(requestedNumMrWhites, maxMrWhites));
    }
  }
  
  // Asegurar que no haya demasiados roles especiales
  let specialRolesCount = actualNumMrWhites + (isUndercoverInGame ? 1 : 0) + (includePayaso ? 1 : 0);
  if (specialRolesCount >= numTotalPlayers) {
    // Prioridad: 1. Undercover/MrWhite, 2. Payaso. Reducir Payaso si es necesario.
    if (includePayaso) {
      includePayaso = false;
      specialRolesCount--;
    }
    // Si aún es demasiado, reducir Mr. Whites (esto no debería pasar con la lógica de maxMrWhites)
    if (gameMode === 'mrWhite' && specialRolesCount >= numTotalPlayers && actualNumMrWhites > 0) {
        actualNumMrWhites = Math.max(0, numTotalPlayers - (isUndercoverInGame ? 1 : 0) - (includePayaso ? 1 : 0) -1);
    }
     if (actualNumMrWhites < 0) actualNumMrWhites = 0;
  }


  const playerIndices = Array.from(Array(numTotalPlayers).keys());
  const shuffledPlayerIndices = shuffleArray(playerIndices); // Barajar para asignar roles

  const mrWhiteAssignedIndices = new Set<number>();
  let undercoverAssignedIndex: number | undefined = undefined;
  let payasoAssignedIndex: number | undefined = undefined;

  let tempIndices = [...shuffledPlayerIndices];

  if (isUndercoverInGame) {
    undercoverAssignedIndex = tempIndices.pop();
  }

  for (let i = 0; i < actualNumMrWhites; i++) {
    if (tempIndices.length > 0) {
      mrWhiteAssignedIndices.add(tempIndices.pop()!);
    }
  }

  if (includePayaso && tempIndices.length > 0) {
    payasoAssignedIndex = tempIndices.pop();
  }

  const mrWhiteNamesList: string[] = [];
  let payasoName: string | undefined = undefined;
  let undercoverPlayerDetails: GameData['undercoverPlayer'] = undefined;

  const players: Player[] = playerNames.map((name, originalIndex) => {
    let role: Player['role'] = 'civilian';
    let word = civilianWord;
    let isMrWhiteFlag = false;

    if (undercoverAssignedIndex === originalIndex) {
      role = 'undercover';
      word = undercoverWordForGame!;
      undercoverPlayerDetails = { name, word };
    } else if (mrWhiteAssignedIndices.has(originalIndex)) {
      role = 'mrwhite';
      word = MR_WHITE_MESSAGE;
      isMrWhiteFlag = true;
      mrWhiteNamesList.push(name);
    } else if (payasoAssignedIndex === originalIndex) {
      role = 'payaso';
      // Payaso conoce la palabra civil
      payasoName = name;
    }

    return {
      id: `${name.replace(/\s+/g, '-')}-${originalIndex}-${Date.now()}`,
      name,
      word,
      isMrWhite: isMrWhiteFlag,
      role,
      wordRevealed: false,
      clue: '',
    };
  });

  return {
    players, // Mantiene el orden original de entrada
    civilianWord,
    mrWhiteNames: mrWhiteNamesList,
    payasoName,
    undercoverPlayer: undercoverPlayerDetails,
    gamePhase: 'wordReveal',
    gameMode,
    playerClues: {},
    votedPlayerId: undefined,
    clueRanking: undefined,
    numberOfMrWhites: actualNumMrWhites,
  };
}
