
import type { OpinionQuestion } from './types';

// Question pairs for the Hidden Opinion mode
// DESIGN PRINCIPLE: Both civil and impostor questions must have the SAME answer type
// Example: Both answer with a movie name, both answer with a food, both with a country, etc.
// This way, answers sound similar regardless of which question was asked

export const OPINION_QUESTIONS: OpinionQuestion[] = [
  // ============ SERIES & PELÍCULAS ============
  {
    id: 'series-1',
    civilQuestion: '¿Qué serie recomendarías a todo el mundo?',
    impostorQuestion: '¿Qué serie popular no soportas?',
  },
  {
    id: 'series-2',
    civilQuestion: '¿Qué serie has visto más de una vez?',
    impostorQuestion: '¿Qué serie empezaste pero nunca terminaste?',
  },
  {
    id: 'series-3',
    civilQuestion: '¿Qué serie te enganchó desde el primer capítulo?',
    impostorQuestion: '¿Qué serie tardaste mucho en darle una oportunidad?',
  },
  {
    id: 'movie-1',
    civilQuestion: '¿Cuál es tu película favorita de la infancia?',
    impostorQuestion: '¿Qué película de tu infancia verías hoy?',
  },
  {
    id: 'movie-2',
    civilQuestion: '¿Qué película te hizo llorar?',
    impostorQuestion: '¿Qué película te dejó pensando varios días?',
  },
  {
    id: 'movie-3',
    civilQuestion: '¿Qué película verías esta noche?',
    impostorQuestion: '¿Qué película has recomendado más veces?',
  },
  {
    id: 'movie-4',
    civilQuestion: '¿Qué película te gustaría ver por primera vez otra vez?',
    impostorQuestion: '¿Qué película te sorprendió con su final?',
  },

  // ============ COMIDA & BEBIDA ============
  {
    id: 'food-1',
    civilQuestion: '¿Qué comida pedirías en tu última cena?',
    impostorQuestion: '¿Qué comida te recuerda a tu infancia?',
  },
  {
    id: 'food-2',
    civilQuestion: '¿Qué comida podrías comer todos los días?',
    impostorQuestion: '¿Qué comida preparas mejor?',
  },
  {
    id: 'food-3',
    civilQuestion: '¿Qué plato pedirías en un restaurante elegante?',
    impostorQuestion: '¿Qué plato pedirías a domicilio un domingo?',
  },
  {
    id: 'food-4',
    civilQuestion: '¿Qué postre te hace más feliz?',
    impostorQuestion: '¿Qué postre asocias con celebraciones?',
  },
  {
    id: 'food-5',
    civilQuestion: '¿Qué comida de otro país te encanta?',
    impostorQuestion: '¿Qué comida exótica probarías?',
  },
  {
    id: 'drink-1',
    civilQuestion: '¿Cuál es tu bebida favorita?',
    impostorQuestion: '¿Qué bebes cuando sales de fiesta?',
  },
  {
    id: 'drink-2',
    civilQuestion: '¿Qué café o té prefieres?',
    impostorQuestion: '¿Qué pides en una cafetería?',
  },

  // ============ VIAJES & LUGARES ============
  {
    id: 'travel-1',
    civilQuestion: '¿A qué país te gustaría viajar?',
    impostorQuestion: '¿Qué país te parece el más bonito?',
  },
  {
    id: 'travel-2',
    civilQuestion: '¿En qué ciudad te gustaría vivir?',
    impostorQuestion: '¿Qué ciudad visitarías de nuevo?',
  },
  {
    id: 'travel-3',
    civilQuestion: '¿Cuál ha sido tu viaje favorito?',
    impostorQuestion: '¿A dónde irías en tu luna de miel?',
  },
  {
    id: 'travel-4',
    civilQuestion: '¿Qué destino de playa te gusta más?',
    impostorQuestion: '¿Dónde pasarías unas vacaciones de verano?',
  },
  {
    id: 'travel-5',
    civilQuestion: '¿Qué monumento te gustaría visitar?',
    impostorQuestion: '¿Qué lugar histórico te fascina?',
  },
  {
    id: 'travel-6',
    civilQuestion: '¿Dónde te gustaría jubilarte?',
    impostorQuestion: '¿Dónde te gustaría tener una segunda residencia?',
  },

  // ============ MÚSICA & ARTISTAS ============
  {
    id: 'music-1',
    civilQuestion: '¿Quién es tu artista musical favorito?',
    impostorQuestion: '¿A qué artista te gustaría ver en concierto?',
  },
  {
    id: 'music-2',
    civilQuestion: '¿Qué canción pondrías en tu boda?',
    impostorQuestion: '¿Qué canción te pone de buen humor?',
  },
  {
    id: 'music-3',
    civilQuestion: '¿Qué canción tienes en bucle últimamente?',
    impostorQuestion: '¿Qué canción te sube el ánimo cuando estás triste?',
  },
  {
    id: 'music-4',
    civilQuestion: '¿Qué álbum escucharías completo?',
    impostorQuestion: '¿Qué álbum marcó tu adolescencia?',
  },
  {
    id: 'music-5',
    civilQuestion: '¿Qué música pondrías en una fiesta?',
    impostorQuestion: '¿Qué música escuchas cuando estás solo?',
  },

  // ============ FAMOSOS & CELEBRIDADES ============
  {
    id: 'celeb-1',
    civilQuestion: '¿Con qué famoso te gustaría cenar?',
    impostorQuestion: '¿A qué famoso te gustaría conocer?',
  },
  {
    id: 'celeb-2',
    civilQuestion: '¿Quién es el mejor deportista de la historia?',
    impostorQuestion: '¿Qué deportista actual admiras?',
  },
  {
    id: 'celeb-3',
    civilQuestion: '¿Quién debería ganar el próximo Balón de Oro?',
    impostorQuestion: '¿Quién crees que ganará el mundial?',
  },
  {
    id: 'celeb-4',
    civilQuestion: '¿Quién es el mejor actor de la historia?',
    impostorQuestion: '¿Qué actor ves en todas sus películas?',
  },
  {
    id: 'celeb-5',
    civilQuestion: '¿Qué famoso te cae muy bien?',
    impostorQuestion: '¿A qué famoso te pareces según otros?',
  },

  // ============ SUPERPODERES & FANTASÍA ============
  {
    id: 'power-1',
    civilQuestion: '¿Qué superpoder te gustaría tener?',
    impostorQuestion: '¿Qué superpoder crees que está sobrevalorado?',
  },
  {
    id: 'power-2',
    civilQuestion: '¿Qué superpoder sería el más útil en tu vida diaria?',
    impostorQuestion: '¿Qué superpoder sería el más divertido?',
  },
  {
    id: 'power-3',
    civilQuestion: '¿Qué superhéroe te gusta más?',
    impostorQuestion: '¿Qué superhéroe serías tú?',
  },
  {
    id: 'fantasy-1',
    civilQuestion: '¿En qué mundo ficticio te gustaría vivir?',
    impostorQuestion: '¿Qué universo de película/serie explorarías?',
  },

  // ============ TRABAJO & CARRERA ============
  {
    id: 'work-1',
    civilQuestion: '¿Cuál sería tu trabajo soñado?',
    impostorQuestion: '¿Qué trabajo harías gratis?',
  },
  {
    id: 'work-2',
    civilQuestion: '¿Qué profesión te parece admirable?',
    impostorQuestion: '¿Qué profesión elegirías si empezaras de nuevo?',
  },
  {
    id: 'work-3',
    civilQuestion: '¿Qué querías ser de pequeño?',
    impostorQuestion: '¿Qué trabajo te parecía genial de niño?',
  },
  {
    id: 'work-4',
    civilQuestion: '¿En qué empresa te gustaría trabajar?',
    impostorQuestion: '¿Qué empresa te parece innovadora?',
  },

  // ============ DEPORTES ============
  {
    id: 'sports-1',
    civilQuestion: '¿Cuál es tu equipo de fútbol favorito?',
    impostorQuestion: '¿Qué equipo de fútbol respetas aunque no sea el tuyo?',
  },
  {
    id: 'sports-2',
    civilQuestion: '¿Qué deporte te gusta practicar?',
    impostorQuestion: '¿Qué deporte te gusta ver por televisión?',
  },
  {
    id: 'sports-3',
    civilQuestion: '¿Qué evento deportivo te gustaría ver en vivo?',
    impostorQuestion: '¿Qué momento deportivo te encantaría haber presenciado?',
  },

  // ============ VIDEOJUEGOS & ENTRETENIMIENTO ============
  {
    id: 'games-1',
    civilQuestion: '¿Cuál es tu videojuego favorito?',
    impostorQuestion: '¿A qué videojuego has dedicado más horas?',
  },
  {
    id: 'games-2',
    civilQuestion: '¿Qué videojuego recomendarías a cualquiera?',
    impostorQuestion: '¿Qué videojuego te marcó?',
  },
  {
    id: 'games-3',
    civilQuestion: '¿Qué juego de mesa te gusta más?',
    impostorQuestion: '¿A qué juego nunca te cansas de jugar?',
  },

  // ============ LIBROS & LECTURA ============
  {
    id: 'books-1',
    civilQuestion: '¿Qué libro recomendarías a un amigo?',
    impostorQuestion: '¿Qué libro te cambió la forma de pensar?',
  },
  {
    id: 'books-2',
    civilQuestion: '¿Cuál es tu libro favorito?',
    impostorQuestion: '¿Qué libro releerías?',
  },
  {
    id: 'books-3',
    civilQuestion: '¿Qué autor te gusta más?',
    impostorQuestion: '¿De qué autor tienes más libros?',
  },

  // ============ ANIMALES ============
  {
    id: 'animals-1',
    civilQuestion: '¿Qué animal tendrías como mascota?',
    impostorQuestion: '¿Qué animal te parece el más inteligente?',
  },
  {
    id: 'animals-2',
    civilQuestion: '¿Qué animal te parece el más bonito?',
    impostorQuestion: '¿Qué animal te fascina?',
  },
  {
    id: 'animals-3',
    civilQuestion: '¿Qué animal serías si pudieras elegir?',
    impostorQuestion: '¿Qué animal crees que representa tu personalidad?',
  },

  // ============ REDES SOCIALES & TECNOLOGÍA ============
  {
    id: 'tech-1',
    civilQuestion: '¿Qué app usas más en el móvil?',
    impostorQuestion: '¿Qué app no podrías dejar de usar?',
  },
  {
    id: 'tech-2',
    civilQuestion: '¿Qué red social te gusta más?',
    impostorQuestion: '¿En qué red social pasas más tiempo?',
  },
  {
    id: 'tech-3',
    civilQuestion: '¿Qué youtuber o streamer sigues?',
    impostorQuestion: '¿Qué contenido consumes antes de dormir?',
  },
  {
    id: 'tech-4',
    civilQuestion: '¿Qué gadget no podrías vivir sin él?',
    impostorQuestion: '¿Qué tecnología te parece imprescindible?',
  },

  // ============ EXPERIENCIAS & AVENTURAS ============
  {
    id: 'exp-1',
    civilQuestion: '¿Qué es lo más loco que has hecho?',
    impostorQuestion: '¿Qué aventura te gustaría vivir?',
  },
  {
    id: 'exp-2',
    civilQuestion: '¿Cuál es tu mejor recuerdo con amigos?',
    impostorQuestion: '¿Qué plan harías con tus amigos este finde?',
  },
  {
    id: 'exp-3',
    civilQuestion: '¿Qué experiencia cambió tu vida?',
    impostorQuestion: '¿Qué momento repetirías sin dudarlo?',
  },
  {
    id: 'exp-4',
    civilQuestion: '¿Qué harías si nadie te juzgara?',
    impostorQuestion: '¿Qué harías con un día libre inesperado?',
  },

  // ============ PERSONAS & RELACIONES ============
  {
    id: 'people-1',
    civilQuestion: '¿Quién te inspira?',
    impostorQuestion: '¿A quién admiras secretamente?',
  },
  {
    id: 'people-2',
    civilQuestion: '¿Quién te conoce mejor?',
    impostorQuestion: '¿A quién le cuentas tus problemas?',
  },
  {
    id: 'people-3',
    civilQuestion: '¿Quién te hace reír más?',
    impostorQuestion: '¿Con quién te sientes más tú mismo?',
  },
  {
    id: 'people-4',
    civilQuestion: '¿A quién invitarías a cenar de cualquier época?',
    impostorQuestion: '¿Con quién te gustaría pasar un día entero?',
  },

  // ============ HIPOTÉTICOS ============
  {
    id: 'hypo-1',
    civilQuestion: '¿Qué harías si ganaras la lotería?',
    impostorQuestion: '¿En qué gastarías un millón de euros?',
  },
  {
    id: 'hypo-2',
    civilQuestion: '¿Qué harías si fueras invisible por un día?',
    impostorQuestion: '¿Qué harías si pudieras parar el tiempo?',
  },
  {
    id: 'hypo-3',
    civilQuestion: '¿Qué época histórica visitarías?',
    impostorQuestion: '¿En qué década te habría gustado vivir?',
  },
  {
    id: 'hypo-4',
    civilQuestion: '¿Qué cambiarías de tu pasado?',
    impostorQuestion: '¿Qué decisión tomarías diferente?',
  },
  {
    id: 'hypo-5',
    civilQuestion: '¿Qué consejo le darías a tu yo de 15 años?',
    impostorQuestion: '¿Qué te hubiera gustado saber antes?',
  },

  // ============ VIDA COTIDIANA ============
  {
    id: 'daily-1',
    civilQuestion: '¿Cuál es tu hora favorita del día?',
    impostorQuestion: '¿En qué momento eres más productivo?',
  },
  {
    id: 'daily-2',
    civilQuestion: '¿Qué es lo primero que haces al despertar?',
    impostorQuestion: '¿Qué es lo último que haces antes de dormir?',
  },
  {
    id: 'daily-3',
    civilQuestion: '¿Cuál es tu lugar favorito de tu casa?',
    impostorQuestion: '¿Dónde pasas más tiempo en tu casa?',
  },
  {
    id: 'daily-4',
    civilQuestion: '¿Cuál es tu día de la semana favorito?',
    impostorQuestion: '¿Qué día de la semana eres más feliz?',
  },

  // ============ GUSTOS PERSONALES ============
  {
    id: 'taste-1',
    civilQuestion: '¿Cuál es tu color favorito?',
    impostorQuestion: '¿De qué color pintarías tu habitación?',
  },
  {
    id: 'taste-2',
    civilQuestion: '¿Cuál es tu estación del año favorita?',
    impostorQuestion: '¿En qué época del año te sientes mejor?',
  },
  {
    id: 'taste-3',
    civilQuestion: '¿Qué hobby te gustaría aprender?',
    impostorQuestion: '¿Qué habilidad te encantaría dominar?',
  },
  {
    id: 'taste-4',
    civilQuestion: '¿Cuál sería tu coche de ensueño?',
    impostorQuestion: '¿Qué coche te comprarías si pudieras?',
  },

  // ============ REGALOS & OCASIONES ============
  {
    id: 'gift-1',
    civilQuestion: '¿Cuál es el mejor regalo que has recibido?',
    impostorQuestion: '¿Qué regalo te gustaría recibir?',
  },
  {
    id: 'gift-2',
    civilQuestion: '¿Qué regalo harías a tu mejor amigo?',
    impostorQuestion: '¿Qué regalo te encanta hacer a otros?',
  },
  {
    id: 'gift-3',
    civilQuestion: '¿Cuál es tu día festivo favorito?',
    impostorQuestion: '¿Qué celebración disfrutas más?',
  },

  // ============ FUTURO & METAS ============
  {
    id: 'future-1',
    civilQuestion: '¿Cómo te imaginas en 10 años?',
    impostorQuestion: '¿Qué esperas lograr en los próximos años?',
  },
  {
    id: 'future-2',
    civilQuestion: '¿Qué objetivo tienes pendiente?',
    impostorQuestion: '¿Qué sueño quieres cumplir?',
  },
  {
    id: 'future-3',
    civilQuestion: '¿Por qué te gustaría ser recordado?',
    impostorQuestion: '¿Qué legado quieres dejar?',
  },

  // ============ PREGUNTAS INGENIOSAS - NUEVAS ============

  // Respuestas tipo: Nombre de persona/personaje
  {
    id: 'clever-1',
    civilQuestion: '¿Qué personaje de ficción te representa?',
    impostorQuestion: '¿Qué personaje de ficción te gustaría ser?',
  },
  {
    id: 'clever-2',
    civilQuestion: '¿Quién sería el padrino de tu boda?',
    impostorQuestion: '¿Quién daría el mejor discurso en tu cumpleaños?',
  },
  {
    id: 'clever-3',
    civilQuestion: '¿Qué villano de película entiendes?',
    impostorQuestion: '¿Qué villano te parece carismático?',
  },

  // Respuestas tipo: Lugar específico
  {
    id: 'clever-4',
    civilQuestion: '¿Dónde tendrías tu primera cita ideal?',
    impostorQuestion: '¿Dónde propondrías matrimonio?',
  },
  {
    id: 'clever-5',
    civilQuestion: '¿En qué restaurante celebrarías algo especial?',
    impostorQuestion: '¿A qué restaurante llevarías a tus padres?',
  },
  {
    id: 'clever-6',
    civilQuestion: '¿Dónde te esconderías en un apocalipsis zombie?',
    impostorQuestion: '¿Dónde montarías tu base secreta?',
  },

  // Respuestas tipo: Actividad/Acción
  {
    id: 'clever-7',
    civilQuestion: '¿Qué harías primero en una isla desierta?',
    impostorQuestion: '¿Qué habilidad de supervivencia te falta?',
  },
  {
    id: 'clever-8',
    civilQuestion: '¿Qué harías si te quedaran 24 horas de vida?',
    impostorQuestion: '¿Qué harías si fuera tu último día de vacaciones?',
  },
  {
    id: 'clever-9',
    civilQuestion: '¿Qué deporte extremo probarías?',
    impostorQuestion: '¿Qué cosa loca harías con un buen seguro?',
  },

  // Respuestas tipo: Objeto específico
  {
    id: 'clever-10',
    civilQuestion: '¿Qué objeto salvarías de un incendio?',
    impostorQuestion: '¿Qué objeto tiene más valor sentimental para ti?',
  },
  {
    id: 'clever-11',
    civilQuestion: '¿Qué llevarías a una isla desierta?',
    impostorQuestion: '¿Sin qué objeto no puedes salir de casa?',
  },
  {
    id: 'clever-12',
    civilQuestion: '¿Qué invento te parece el más útil?',
    impostorQuestion: '¿Qué invento crees que cambió el mundo?',
  },

  // Respuestas tipo: Comida/Bebida específica
  {
    id: 'clever-13',
    civilQuestion: '¿Qué pedirías en un menú de degustación?',
    impostorQuestion: '¿Qué plato prepararías para impresionar?',
  },
  {
    id: 'clever-14',
    civilQuestion: '¿Qué comida callejera te vuelve loco?',
    impostorQuestion: '¿Qué snack podrías comer sin parar?',
  },
  {
    id: 'clever-15',
    civilQuestion: '¿Qué desayuno te pone de buen humor?',
    impostorQuestion: '¿Qué comerías después de una resaca?',
  },

  // Respuestas tipo: Película/Serie específica
  {
    id: 'clever-16',
    civilQuestion: '¿Qué película ves cuando estás enfermo?',
    impostorQuestion: '¿Qué película es tu guilty pleasure?',
  },
  {
    id: 'clever-17',
    civilQuestion: '¿Qué película pondrías en un vuelo largo?',
    impostorQuestion: '¿Qué película verías con tus abuelos?',
  },
  {
    id: 'clever-18',
    civilQuestion: '¿Qué serie verías con tu pareja?',
    impostorQuestion: '¿Qué serie empezarías hoy?',
  },

  // Respuestas tipo: Canción/Artista
  {
    id: 'clever-19',
    civilQuestion: '¿Qué canción cantarías en un karaoke?',
    impostorQuestion: '¿Qué canción sabes de memoria?',
  },
  {
    id: 'clever-20',
    civilQuestion: '¿Qué canción pondrías en un road trip?',
    impostorQuestion: '¿Qué canción te recuerda al verano?',
  },
  {
    id: 'clever-21',
    civilQuestion: '¿Qué canción bailarías en tu boda?',
    impostorQuestion: '¿Qué canción te hace llorar?',
  },

  // Respuestas tipo: País/Ciudad
  {
    id: 'clever-22',
    civilQuestion: '¿Dónde aprenderías un nuevo idioma?',
    impostorQuestion: '¿En qué país vivirías un año?',
  },
  {
    id: 'clever-23',
    civilQuestion: '¿Qué ciudad tiene la mejor vida nocturna?',
    impostorQuestion: '¿Dónde celebrarías Nochevieja?',
  },
  {
    id: 'clever-24',
    civilQuestion: '¿Qué país tiene la gente más amable?',
    impostorQuestion: '¿Dónde te sentiste más bienvenido?',
  },

  // Respuestas tipo: Profesión/Rol
  {
    id: 'clever-25',
    civilQuestion: '¿Qué serías en una película de acción?',
    impostorQuestion: '¿Qué rol tendrías en un atraco?',
  },
  {
    id: 'clever-26',
    civilQuestion: '¿Qué serías en un grupo de supervivencia?',
    impostorQuestion: '¿Qué aportarías en un equipo de aventura?',
  },
  {
    id: 'clever-27',
    civilQuestion: '¿Qué trabajo harías en un circo?',
    impostorQuestion: '¿Qué talento mostrarías en un talent show?',
  },

  // Respuestas tipo: Marca/Producto
  {
    id: 'clever-28',
    civilQuestion: '¿Qué marca representa tu estilo?',
    impostorQuestion: '¿Qué tienda es tu favorita?',
  },
  {
    id: 'clever-29',
    civilQuestion: '¿Qué perfume o colonia usas?',
    impostorQuestion: '¿Qué olor te encanta?',
  },

  // Respuestas tipo: Momento/Época
  {
    id: 'clever-30',
    civilQuestion: '¿Cuál fue la mejor etapa de tu vida?',
    impostorQuestion: '¿A qué edad eras más feliz?',
  },
  {
    id: 'clever-31',
    civilQuestion: '¿Qué año repetirías?',
    impostorQuestion: '¿Cuándo tomaste tu mejor decisión?',
  },

  // Respuestas tipo: Celebridad
  {
    id: 'clever-32',
    civilQuestion: '¿Con qué famoso irías de viaje?',
    impostorQuestion: '¿Qué famoso sería tu compañero de piso ideal?',
  },
  {
    id: 'clever-33',
    civilQuestion: '¿Qué famoso te haría de wingman?',
    impostorQuestion: '¿Qué famoso invitarías a tu fiesta?',
  },
  {
    id: 'clever-34',
    civilQuestion: '¿Qué actor interpretaría tu vida?',
    impostorQuestion: '¿A qué famoso te pareces en personalidad?',
  },

  // Respuestas tipo: Habilidad/Talento
  {
    id: 'clever-35',
    civilQuestion: '¿Qué instrumento tocarías?',
    impostorQuestion: '¿Qué talento te gustaría tener de nacimiento?',
  },
  {
    id: 'clever-36',
    civilQuestion: '¿En qué idioma te gustaría soñar?',
    impostorQuestion: '¿Qué idioma suena más bonito?',
  },
  {
    id: 'clever-37',
    civilQuestion: '¿Qué arte dominarías si tuvieras tiempo?',
    impostorQuestion: '¿Qué habilidad impresionaría a cualquiera?',
  },

  // Respuestas tipo: Situación/Escenario
  {
    id: 'clever-38',
    civilQuestion: '¿Cómo sería tu domingo perfecto?',
    impostorQuestion: '¿Cómo sería tu día libre ideal?',
  },
  {
    id: 'clever-39',
    civilQuestion: '¿Cómo celebrarías ganar un premio?',
    impostorQuestion: '¿Cómo te gustaría que fuera tu fiesta sorpresa?',
  },
  {
    id: 'clever-40',
    civilQuestion: '¿Dónde sería tu oficina ideal?',
    impostorQuestion: '¿Desde dónde trabajarías si pudieras elegir?',
  },

  // Respuestas tipo: Libro/Autor
  {
    id: 'clever-41',
    civilQuestion: '¿Qué libro regalarías a un desconocido?',
    impostorQuestion: '¿Qué libro te gustaría haber escrito?',
  },
  {
    id: 'clever-42',
    civilQuestion: '¿En qué libro te gustaría vivir?',
    impostorQuestion: '¿Qué mundo literario explorarías?',
  },

  // Respuestas tipo: Deporte/Actividad física
  {
    id: 'clever-43',
    civilQuestion: '¿Qué deporte verías en las Olimpiadas?',
    impostorQuestion: '¿En qué deporte competirías si pudieras?',
  },
  {
    id: 'clever-44',
    civilQuestion: '¿Con qué deporte desconectas?',
    impostorQuestion: '¿Qué actividad física te hace feliz?',
  },

  // Respuestas tipo: App/Tecnología
  {
    id: 'clever-45',
    civilQuestion: '¿Qué app inventarías?',
    impostorQuestion: '¿Qué función añadirías a tu móvil?',
  },
  {
    id: 'clever-46',
    civilQuestion: '¿Qué gadget del futuro quieres ya?',
    impostorQuestion: '¿Qué invento de ciencia ficción debería existir?',
  },

  // Respuestas tipo: Característica personal
  {
    id: 'clever-47',
    civilQuestion: '¿Cuál es tu mayor virtud?',
    impostorQuestion: '¿Por qué te contratarían?',
  },
  {
    id: 'clever-48',
    civilQuestion: '¿Qué rasgo heredaste de tu familia?',
    impostorQuestion: '¿Qué te define según tus amigos?',
  },

  // Respuestas tipo: Miedo/Fobia
  {
    id: 'clever-49',
    civilQuestion: '¿Qué miedo has superado?',
    impostorQuestion: '¿Qué cosa te daba miedo de pequeño?',
  },
  {
    id: 'clever-50',
    civilQuestion: '¿Qué situación te pone nervioso?',
    impostorQuestion: '¿Cuándo sudas frío?',
  },
];

export function getRandomQuestion(): OpinionQuestion {
  // Import dynamically to avoid SSR issues
  const { filterUnplayedQuestions, markQuestionAsPlayed } = require('./game-history');

  // Filter out played questions
  const unplayedQuestions = filterUnplayedQuestions(OPINION_QUESTIONS);
  const selectedQuestion = unplayedQuestions[Math.floor(Math.random() * unplayedQuestions.length)];
  markQuestionAsPlayed(selectedQuestion.id);
  return selectedQuestion;
}
