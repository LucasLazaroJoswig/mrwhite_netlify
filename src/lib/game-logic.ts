
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
  "Pulpo", "Cangrejo", "Serpiente", "Lagarto", "Tortuga", "Rana", "Mariposa", "Abeja", "Hormiga", "Araña", "Murciélago", "Ardilla",
  // Comida y Bebida
  "Naranja", "Plátano", "Uva", "Fresa", "Sandía", "Melón", "Piña", "Mango", "Kiwi", "Cereza",
  "Limón", "Tomate", "Patata", "Cebolla", "Ajo", "Zanahoria", "Lechuga", "Pepino", "Pimiento", "Brócoli",
  "Arroz", "Pasta", "Pan", "Queso", "Huevo", "Leche", "Yogur", "Mantequilla", "Aceite", "Vinagre",
  "Sal", "Azúcar", "Pimienta", "Café", "Té", "Zumo", "Agua", "Vino", "Cerveza", "Chocolate", "Galleta", "Helado", "Miel",
  // Objetos Caseros
  "Sofá", "Cama", "Armario", "Espejo", "Lámpara", "Alfombra", "Cortina", "Cojín", "Escritorio", "Estantería",
  "Ordenador", "Televisión", "Teléfono", "Radio", "Nevera", "Horno", "Microondas", "Lavadora", "Aspiradora", "Plancha",
  "Escoba", "Fregona", "Jarrón", "Cuadro", "Toalla", "Jabón", "Cepillo",
  // Naturaleza y Geografía
  "Volcán", "Desierto", "Isla", "Océano", "Mar", "Lago", "Glaciar", "Valle", "Colina", "Cueva",
  "Árbol", "Hoja", "Raíz", "Semilla", "Hierba", "Piedra", "Arena", "Tierra", "Fuego", "Viento",
  "Lluvia", "Nieve", "Hielo", "Trueno", "Rayo", "Arcoíris", "Amanecer", "Atardecer", "Invierno", "Verano",
  "Otoño", "Primavera", "Continente", "País", "Ciudad", "Pueblo", "Selva", "Pantano", "Catarata",
  // Herramientas y Transporte
  "Martillo", "Destornillador", "Sierra", "Clavo", "Tornillo", "Taladro", "Escalera", "Pincel", "Rodillo", "Tijeras",
  "Bicicleta", "Motocicleta", "Autobús", "Camión", "Helicóptero", "Globo", "Cohete", "Submarino", "Canoa", "Monopatín",
  "Patin", "Yate", "Furgoneta",
  // Ropa y Accesorios (más)
  "Cinturón", "Gorra", "Bikini", "Bañador", "Pijama", "Bata", "Zapatillas", "Botas", "Sandalias", "Joyas",
  "Medias", "Corbata", "Pajarita", "Traje", "Chaqueta",
  // Lugares
  "Aeropuerto", "Estación", "Hospital", "Biblioteca", "Museo", "Teatro", "Cine", "Restaurante", "Hotel", "Gimnasio",
  "Parque", "Zoológico", "Circo", "Universidad", "Oficina", "Fábrica", "Tienda", "Mercado", "Iglesia", "Castillo",
  "Farmacia", "Banco", "Supermercado", "Plaza", "Estadio",
  // Profesiones (sustantivos relacionados)
  "Pizarra", "Libreta", "Maletín", "Bisturí", "Estetoscopio", "Casco", "Escudo", "Micrófono", "Cámara", "Partitura",
  "Pincel", "Paleta", "Escenario", "Tribunal", "Herramienta",
  // Deportes (equipamiento)
  "Balón", "Raqueta", "Red", "Guantes de boxeo", "Patinetes", "Esquís", "Canasta", "Portería", "Bate", "Palo de golf",
  "Diana", "Dardos", "Casco deportivo", "Protector bucal",
  // Instrumentos Musicales
  "Guitarra", "Piano", "Violín", "Batería", "Flauta", "Trompeta", "Saxofón", "Tambor", "Arpa", "Acordeón",
  "Violonchelo", "Contrabajo", "Ukelele", "Gaita",
  // Abstractos (pocos y simples)
  "Sueño", "Idea", "Risa", "Juego", "Fiesta", "Música", "Silencio", "Amor", "Paz", "Guerra",
  "Suerte", "Miedo", "Alegría", "Tristeza", "Tiempo",
  // Misceláneos
  "Bandera", "Mapa", "Tesoro", "Regalo", "Foto", "Carta", "Periódico", "Revista", "Dinero", "Billete",
  "Moneda", "Semáforo", "Señal", "Fantasma", "Robot", "Dragón", "Unicornio", "Espada", "Escudo", "Varita",
  "Poción", "Corona", "Trineo", "Pirámide", "Estatua", "Fuente", "Ducha", "Bañera", "Bolsa", "Mochila",
  " Paraguas", "Caja", "Botella", "Lata", "Dado", "Ficha", "Peonza", "Cometa", "Puzzle", "Bomba"
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
  previousCivilianWord?: string
): GameData {
  if (playerNames.length < MIN_PLAYERS || playerNames.length > MAX_PLAYERS) {
    throw new Error(`El número de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`);
  }

  let availableWords = SECRET_WORDS;
  if (previousCivilianWord) {
    availableWords = SECRET_WORDS.filter(word => word !== previousCivilianWord);
    if (availableWords.length === 0) { // Fallback if all words were used (unlikely with a large list)
      availableWords = SECRET_WORDS;
    }
  }

  const civilianWord = availableWords[Math.floor(Math.random() * availableWords.length)];

  let numberOfMrWhites = 0;
  let includePayaso = false;

  // Distribución de roles actualizada
  if (playerNames.length >= 3 && playerNames.length <= 7) {
    numberOfMrWhites = 1;
    includePayaso = false;
  } else if (playerNames.length >= 8 && playerNames.length <= 11) {
    numberOfMrWhites = 1;
    includePayaso = true;
  } else if (playerNames.length >= 12 && playerNames.length <= MAX_PLAYERS) {
    numberOfMrWhites = 2;
    includePayaso = true;
  }


  const playerIndices = Array.from(Array(playerNames.length).keys());
  let shuffledPlayerIndicesForRoleAssignment = shuffleArray(playerIndices); // Barajar solo para la asignación de roles

  const mrWhiteIndices = new Set<number>();
  // Asignar Mr. Whites primero
  for (let i = 0; i < numberOfMrWhites; i++) {
    if (shuffledPlayerIndicesForRoleAssignment.length > 0) {
        const assignedIndex = shuffledPlayerIndicesForRoleAssignment.shift(); 
        if (assignedIndex !== undefined) {
            mrWhiteIndices.add(assignedIndex);
        }
    }
  }

  let payasoIndex: number | undefined = undefined;
  let payasoName: string | undefined = undefined;

  // Asignar Payaso si corresponde, de los índices restantes
  if (includePayaso && shuffledPlayerIndicesForRoleAssignment.length > 0) {
    payasoIndex = shuffledPlayerIndicesForRoleAssignment.shift(); 
  }


  const mrWhiteNamesList: string[] = [];
  const players: Player[] = playerNames.map((name, originalIndex) => { // Usar originalIndex para mantener el orden
    const isMrWhite = mrWhiteIndices.has(originalIndex);
    const isPayaso = originalIndex === payasoIndex;
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
      id: `${name.replace(/\s+/g, '-')}-${originalIndex}-${Date.now()}`,
      name,
      word,
      isMrWhite: role === 'mrwhite', // Mantener por si se usa en algún sitio, aunque role es más específico
      role,
      wordRevealed: false,
      clue: '',
    };
  });

  // NO barajar la lista de jugadores `players` aquí para mantener el orden de entrada.
  // El orden de las rondas será gestionado por la UI (empezando por players[0] o un índice rotatorio).

  return {
    players: players, // Lista de jugadores en el orden de entrada
    civilianWord,
    mrWhiteNames: mrWhiteNamesList,
    payasoName,
    gamePhase: 'wordReveal',
    playerClues: {},
    votedPlayerId: undefined,
    clueRanking: undefined,
  };
}
