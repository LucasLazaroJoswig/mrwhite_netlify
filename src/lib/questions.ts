
import type { OpinionQuestion } from './types';

// 50 question pairs for the Hidden Opinion mode
// Each pair has a civil question and a related but different impostor question
export const OPINION_QUESTIONS: OpinionQuestion[] = [
  // Food & Cuisine
  {
    id: 'food-1',
    civilQuestion: '¿Qué país tiene la mejor comida del mundo?',
    impostorQuestion: '¿Qué país tiene la peor comida del mundo?',
  },
  {
    id: 'food-2',
    civilQuestion: '¿Cuál es tu comida favorita?',
    impostorQuestion: '¿Qué comida odias con todo tu ser?',
  },
  {
    id: 'food-3',
    civilQuestion: '¿Qué restaurante recomendarías a un turista?',
    impostorQuestion: '¿A qué restaurante nunca volverías?',
  },
  {
    id: 'food-4',
    civilQuestion: '¿Qué postre te hace más feliz?',
    impostorQuestion: '¿Qué postre te parece asqueroso?',
  },
  {
    id: 'food-5',
    civilQuestion: '¿Qué comida pedirías en tu última cena?',
    impostorQuestion: '¿Qué comida comerías si quisieras castigarte?',
  },

  // Travel & Places
  {
    id: 'travel-1',
    civilQuestion: '¿A qué país te gustaría viajar?',
    impostorQuestion: '¿A qué país nunca irías?',
  },
  {
    id: 'travel-2',
    civilQuestion: '¿En qué ciudad te gustaría vivir?',
    impostorQuestion: '¿En qué ciudad sería horrible vivir?',
  },
  {
    id: 'travel-3',
    civilQuestion: '¿Cuál es tu destino de playa favorito?',
    impostorQuestion: '¿Qué destino turístico está sobrevalorado?',
  },
  {
    id: 'travel-4',
    civilQuestion: '¿Qué monumento te gustaría visitar?',
    impostorQuestion: '¿Qué atracción turística te parece aburrida?',
  },
  {
    id: 'travel-5',
    civilQuestion: '¿En qué país pasarías tu luna de miel?',
    impostorQuestion: '¿Qué destino romántico te parece horrible?',
  },

  // Entertainment
  {
    id: 'movie-1',
    civilQuestion: '¿Cuál es la mejor película de la historia?',
    impostorQuestion: '¿Cuál es la película más sobrevalorada?',
  },
  {
    id: 'movie-2',
    civilQuestion: '¿Qué serie recomendarías a todo el mundo?',
    impostorQuestion: '¿Qué serie popular no soportas?',
  },
  {
    id: 'music-1',
    civilQuestion: '¿Quién es el mejor artista musical de todos los tiempos?',
    impostorQuestion: '¿Qué artista famoso te parece terrible?',
  },
  {
    id: 'music-2',
    civilQuestion: '¿Qué canción pondrías en tu boda?',
    impostorQuestion: '¿Qué canción famosa odias?',
  },
  {
    id: 'music-3',
    civilQuestion: '¿A qué concierto te gustaría ir?',
    impostorQuestion: '¿A qué concierto no irías ni gratis?',
  },

  // People & Celebrities
  {
    id: 'celeb-1',
    civilQuestion: '¿Con qué famoso te gustaría cenar?',
    impostorQuestion: '¿Qué famoso te cae fatal?',
  },
  {
    id: 'celeb-2',
    civilQuestion: '¿Quién es el mejor deportista de la historia?',
    impostorQuestion: '¿Qué deportista famoso está sobrevalorado?',
  },
  {
    id: 'celeb-3',
    civilQuestion: '¿Quién debería ganar el próximo Balón de Oro?',
    impostorQuestion: '¿Quién ganó un Balón de Oro sin merecerlo?',
  },
  {
    id: 'celeb-4',
    civilQuestion: '¿Quién es el mejor actor/actriz del momento?',
    impostorQuestion: '¿Qué actor/actriz famoso no sabe actuar?',
  },
  {
    id: 'celeb-5',
    civilQuestion: '¿Qué influencer te parece genuino?',
    impostorQuestion: '¿Qué influencer te parece falso?',
  },

  // Lifestyle
  {
    id: 'life-1',
    civilQuestion: '¿Cuál es el mejor trabajo del mundo?',
    impostorQuestion: '¿Cuál es el peor trabajo del mundo?',
  },
  {
    id: 'life-2',
    civilQuestion: '¿Qué superpoder te gustaría tener?',
    impostorQuestion: '¿Qué superpoder sería el más inútil?',
  },
  {
    id: 'life-3',
    civilQuestion: '¿Cuál es el mejor hobby que existe?',
    impostorQuestion: '¿Qué hobby te parece una pérdida de tiempo?',
  },
  {
    id: 'life-4',
    civilQuestion: '¿Cuál sería tu coche de ensueño?',
    impostorQuestion: '¿Qué coche famoso te parece horrible?',
  },
  {
    id: 'life-5',
    civilQuestion: '¿Qué animal tendrías como mascota?',
    impostorQuestion: '¿Qué animal te da miedo o asco?',
  },

  // Opinions & Preferences
  {
    id: 'opinion-1',
    civilQuestion: '¿Cuál es la mejor estación del año?',
    impostorQuestion: '¿Cuál es la peor estación del año?',
  },
  {
    id: 'opinion-2',
    civilQuestion: '¿Cuál es el mejor día de la semana?',
    impostorQuestion: '¿Cuál es el peor día de la semana?',
  },
  {
    id: 'opinion-3',
    civilQuestion: '¿Qué red social es la mejor?',
    impostorQuestion: '¿Qué red social es la más tóxica?',
  },
  {
    id: 'opinion-4',
    civilQuestion: '¿Cuál es el mejor invento de la humanidad?',
    impostorQuestion: '¿Qué invento ha hecho más daño a la humanidad?',
  },
  {
    id: 'opinion-5',
    civilQuestion: '¿Qué época histórica te gustaría visitar?',
    impostorQuestion: '¿En qué época no querrías vivir jamás?',
  },

  // Sports
  {
    id: 'sports-1',
    civilQuestion: '¿Cuál es el mejor equipo de fútbol?',
    impostorQuestion: '¿Cuál es el equipo de fútbol más odiado?',
  },
  {
    id: 'sports-2',
    civilQuestion: '¿Cuál es el deporte más emocionante?',
    impostorQuestion: '¿Cuál es el deporte más aburrido?',
  },
  {
    id: 'sports-3',
    civilQuestion: '¿Qué Olimpiadas te gustaría haber visto en vivo?',
    impostorQuestion: '¿Qué evento deportivo te parece sobrevalorado?',
  },

  // School & Learning
  {
    id: 'school-1',
    civilQuestion: '¿Cuál era tu asignatura favorita?',
    impostorQuestion: '¿Qué asignatura odiabas en el colegio?',
  },
  {
    id: 'school-2',
    civilQuestion: '¿Qué idioma te gustaría aprender?',
    impostorQuestion: '¿Qué idioma te parece imposible de aprender?',
  },
  {
    id: 'school-3',
    civilQuestion: '¿Qué universidad es la mejor del mundo?',
    impostorQuestion: '¿Qué título universitario es inútil?',
  },

  // Random & Fun
  {
    id: 'fun-1',
    civilQuestion: '¿Qué harías con un millón de euros?',
    impostorQuestion: '¿En qué nunca gastarías dinero?',
  },
  {
    id: 'fun-2',
    civilQuestion: '¿Cuál es el mejor regalo que has recibido?',
    impostorQuestion: '¿Cuál es el peor regalo que has recibido?',
  },
  {
    id: 'fun-3',
    civilQuestion: '¿Qué aplicación del móvil usas más?',
    impostorQuestion: '¿Qué aplicación famosa nunca usarías?',
  },
  {
    id: 'fun-4',
    civilQuestion: '¿Cuál es tu día festivo favorito?',
    impostorQuestion: '¿Qué festividad te parece innecesaria?',
  },
  {
    id: 'fun-5',
    civilQuestion: '¿Qué programa de televisión verías todo el día?',
    impostorQuestion: '¿Qué programa de TV no soportas?',
  },

  // Tricky Questions (harder to blend in)
  {
    id: 'tricky-1',
    civilQuestion: '¿Qué edad es la mejor para casarse?',
    impostorQuestion: '¿Cuántos hijos te gustaría tener?',
  },
  {
    id: 'tricky-2',
    civilQuestion: '¿Qué te gustaría que dijeran en tu funeral?',
    impostorQuestion: '¿Cómo celebrarías tu 100 cumpleaños?',
  },
  {
    id: 'tricky-3',
    civilQuestion: '¿En qué gastarías tu primer sueldo?',
    impostorQuestion: '¿Qué harías si te despidieran mañana?',
  },
  {
    id: 'tricky-4',
    civilQuestion: '¿Qué consejo le darías a tu yo de 15 años?',
    impostorQuestion: '¿Qué le dirías a tu yo de 80 años?',
  },
  {
    id: 'tricky-5',
    civilQuestion: '¿Qué es lo primero que notas en una persona?',
    impostorQuestion: '¿Qué cosa te hace rechazar a alguien inmediatamente?',
  },

  // More varied topics
  {
    id: 'varied-1',
    civilQuestion: '¿Qué videojuego es el mejor de la historia?',
    impostorQuestion: '¿Qué videojuego popular es una pérdida de tiempo?',
  },
  {
    id: 'varied-2',
    civilQuestion: '¿Cuál es la mejor marca de ropa?',
    impostorQuestion: '¿Qué marca de moda está sobrevalorada?',
  },
  {
    id: 'varied-3',
    civilQuestion: '¿Qué comida rápida es tu favorita?',
    impostorQuestion: '¿Qué cadena de comida rápida evitas?',
  },
  {
    id: 'varied-4',
    civilQuestion: '¿Cuál es tu bebida favorita?',
    impostorQuestion: '¿Qué bebida popular no soportas?',
  },

  // NUEVAS PREGUNTAS - Variaciones más sutiles (no tan opuestas)

  // Sutiles - misma temática, diferente ángulo
  {
    id: 'subtle-1',
    civilQuestion: '¿Qué país tiene la mejor comida del mundo?',
    impostorQuestion: '¿Qué país tiene la comida más exótica?',
  },
  {
    id: 'subtle-2',
    civilQuestion: '¿A qué ciudad te gustaría viajar?',
    impostorQuestion: '¿Qué ciudad te parece más cara para vivir?',
  },
  {
    id: 'subtle-3',
    civilQuestion: '¿Cuál es tu película favorita?',
    impostorQuestion: '¿Qué película te hizo llorar?',
  },
  {
    id: 'subtle-4',
    civilQuestion: '¿Qué superpoder te gustaría tener?',
    impostorQuestion: '¿Qué superpoder sería el más peligroso?',
  },
  {
    id: 'subtle-5',
    civilQuestion: '¿Cuál es tu comida favorita?',
    impostorQuestion: '¿Qué comida te recuerda a tu infancia?',
  },
  {
    id: 'subtle-6',
    civilQuestion: '¿Qué artista musical te gusta más?',
    impostorQuestion: '¿Qué artista te gustaría ver en concierto?',
  },
  {
    id: 'subtle-7',
    civilQuestion: '¿Cuál es el mejor trabajo del mundo?',
    impostorQuestion: '¿Qué trabajo te daría más dinero?',
  },
  {
    id: 'subtle-8',
    civilQuestion: '¿Qué animal tendrías como mascota?',
    impostorQuestion: '¿Qué animal te parece el más inteligente?',
  },
  {
    id: 'subtle-9',
    civilQuestion: '¿Cuál es tu serie favorita?',
    impostorQuestion: '¿Qué serie has visto más de una vez?',
  },
  {
    id: 'subtle-10',
    civilQuestion: '¿Qué deporte te gusta practicar?',
    impostorQuestion: '¿Qué deporte te gusta ver por televisión?',
  },

  // Perspectiva temporal diferente
  {
    id: 'time-1',
    civilQuestion: '¿Qué es lo primero que harías si ganaras la lotería?',
    impostorQuestion: '¿Qué harías si solo te quedara un año de vida?',
  },
  {
    id: 'time-2',
    civilQuestion: '¿Qué te gustaría hacer este fin de semana?',
    impostorQuestion: '¿Qué planes tienes para el próximo verano?',
  },
  {
    id: 'time-3',
    civilQuestion: '¿Cuál fue tu momento más feliz?',
    impostorQuestion: '¿Qué momento de tu vida repetirías?',
  },
  {
    id: 'time-4',
    civilQuestion: '¿Qué querías ser de pequeño?',
    impostorQuestion: '¿Qué carrera elegirías si pudieras empezar de nuevo?',
  },
  {
    id: 'time-5',
    civilQuestion: '¿Cuál es tu recuerdo favorito de la infancia?',
    impostorQuestion: '¿Qué tradición familiar te gustaría mantener?',
  },

  // Misma pregunta con contexto diferente
  {
    id: 'context-1',
    civilQuestion: '¿Qué comida pedirías en un restaurante elegante?',
    impostorQuestion: '¿Qué comida pedirías a domicilio un domingo?',
  },
  {
    id: 'context-2',
    civilQuestion: '¿Qué música pondrías en una fiesta?',
    impostorQuestion: '¿Qué música escuchas cuando estás solo?',
  },
  {
    id: 'context-3',
    civilQuestion: '¿Qué libro recomendarías a un amigo?',
    impostorQuestion: '¿Qué libro te cambió la forma de pensar?',
  },
  {
    id: 'context-4',
    civilQuestion: '¿Qué regalo harías a tu mejor amigo?',
    impostorQuestion: '¿Qué regalo te gustaría recibir a ti?',
  },
  {
    id: 'context-5',
    civilQuestion: '¿Qué le dirías a tu jefe si pudieras ser sincero?',
    impostorQuestion: '¿Qué consejo le darías a alguien que empieza a trabajar?',
  },

  // Preferencias similares pero no iguales
  {
    id: 'pref-1',
    civilQuestion: '¿Playa o montaña?',
    impostorQuestion: '¿Ciudad o pueblo?',
  },
  {
    id: 'pref-2',
    civilQuestion: '¿Perro o gato?',
    impostorQuestion: '¿Animal grande o pequeño?',
  },
  {
    id: 'pref-3',
    civilQuestion: '¿Café o té?',
    impostorQuestion: '¿Mañana o noche?',
  },
  {
    id: 'pref-4',
    civilQuestion: '¿Dulce o salado?',
    impostorQuestion: '¿Frío o caliente?',
  },
  {
    id: 'pref-5',
    civilQuestion: '¿Libro o película?',
    impostorQuestion: '¿Solo o acompañado?',
  },

  // Opiniones sobre la vida
  {
    id: 'life-6',
    civilQuestion: '¿Qué es lo más importante en una relación?',
    impostorQuestion: '¿Qué es lo que más valoras en un amigo?',
  },
  {
    id: 'life-7',
    civilQuestion: '¿Cuál es tu mayor miedo?',
    impostorQuestion: '¿Qué riesgo te gustaría tomar?',
  },
  {
    id: 'life-8',
    civilQuestion: '¿Qué te hace realmente feliz?',
    impostorQuestion: '¿Qué te relaja después de un día duro?',
  },
  {
    id: 'life-9',
    civilQuestion: '¿Cuál es tu mayor logro?',
    impostorQuestion: '¿De qué estás más orgulloso?',
  },
  {
    id: 'life-10',
    civilQuestion: '¿Qué te gustaría aprender?',
    impostorQuestion: '¿Qué habilidad te gustaría tener?',
  },

  // Hipotéticos similares
  {
    id: 'hypo-1',
    civilQuestion: '¿Qué harías con un día libre inesperado?',
    impostorQuestion: '¿Qué harías si no tuvieras que trabajar nunca más?',
  },
  {
    id: 'hypo-2',
    civilQuestion: '¿A quién invitarías a cenar de cualquier época?',
    impostorQuestion: '¿Con quién te gustaría pasar un día entero?',
  },
  {
    id: 'hypo-3',
    civilQuestion: '¿Qué cambiarías de tu pasado?',
    impostorQuestion: '¿Qué decisión tomarías diferente?',
  },
  {
    id: 'hypo-4',
    civilQuestion: '¿Dónde te ves en 10 años?',
    impostorQuestion: '¿Cómo sería tu día perfecto?',
  },
  {
    id: 'hypo-5',
    civilQuestion: '¿Qué harías si fueras invisible por un día?',
    impostorQuestion: '¿Qué harías si pudieras leer mentes?',
  },

  // Cosas cotidianas
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
    civilQuestion: '¿Qué app usas más en el móvil?',
    impostorQuestion: '¿Qué app eliminarías de tu móvil?',
  },
  {
    id: 'daily-5',
    civilQuestion: '¿Cuál es tu día de la semana favorito?',
    impostorQuestion: '¿Qué día de la semana eres más feliz?',
  },

  // Gustos muy similares (difícil para el impostor)
  {
    id: 'similar-1',
    civilQuestion: '¿Cuál es tu color favorito?',
    impostorQuestion: '¿De qué color pintarías tu habitación?',
  },
  {
    id: 'similar-2',
    civilQuestion: '¿Cuál es tu número de la suerte?',
    impostorQuestion: '¿Qué número elegirías para una apuesta?',
  },
  {
    id: 'similar-3',
    civilQuestion: '¿Cuál es tu estación del año favorita?',
    impostorQuestion: '¿En qué época del año naciste?',
  },
  {
    id: 'similar-4',
    civilQuestion: '¿Pizza o hamburguesa?',
    impostorQuestion: '¿Patatas fritas o ensalada?',
  },
  {
    id: 'similar-5',
    civilQuestion: '¿Netflix o YouTube?',
    impostorQuestion: '¿Películas o series?',
  },

  // Experiencias personales
  {
    id: 'exp-1',
    civilQuestion: '¿Cuál ha sido tu viaje favorito?',
    impostorQuestion: '¿A dónde irías en tu luna de miel?',
  },
  {
    id: 'exp-2',
    civilQuestion: '¿Cuál es tu mejor recuerdo con amigos?',
    impostorQuestion: '¿Qué aventura te gustaría vivir con amigos?',
  },
  {
    id: 'exp-3',
    civilQuestion: '¿Qué es lo más loco que has hecho?',
    impostorQuestion: '¿Qué harías si nadie te juzgara?',
  },
  {
    id: 'exp-4',
    civilQuestion: '¿Cuál es tu anécdota más vergonzosa?',
    impostorQuestion: '¿Qué secreto nunca has contado?',
  },
  {
    id: 'exp-5',
    civilQuestion: '¿Qué te arrepientes de no haber hecho?',
    impostorQuestion: '¿Qué harías si pudieras volver atrás?',
  },

  // Completamente diferentes pero justificables
  {
    id: 'diff-1',
    civilQuestion: '¿Qué famoso te cae bien?',
    impostorQuestion: '¿A qué famoso te pareces físicamente?',
  },
  {
    id: 'diff-2',
    civilQuestion: '¿Cuál es tu frase motivadora favorita?',
    impostorQuestion: '¿Cuál fue el mejor consejo que te dieron?',
  },
  {
    id: 'diff-3',
    civilQuestion: '¿Qué cosa material valoras más?',
    impostorQuestion: '¿Qué objeto llevarías a una isla desierta?',
  },
  {
    id: 'diff-4',
    civilQuestion: '¿Cuál es tu canción favorita?',
    impostorQuestion: '¿Qué canción te sube el ánimo?',
  },
  {
    id: 'diff-5',
    civilQuestion: '¿Qué talento oculto tienes?',
    impostorQuestion: '¿En qué eres mejor que la mayoría?',
  },

  // Preguntas sobre gustos culturales
  {
    id: 'culture-1',
    civilQuestion: '¿Qué género de película prefieres?',
    impostorQuestion: '¿Qué película verías esta noche?',
  },
  {
    id: 'culture-2',
    civilQuestion: '¿Qué tipo de música escuchas más?',
    impostorQuestion: '¿Qué canción tienes en bucle últimamente?',
  },
  {
    id: 'culture-3',
    civilQuestion: '¿Qué red social usas más?',
    impostorQuestion: '¿En qué red social pasas más tiempo?',
  },
  {
    id: 'culture-4',
    civilQuestion: '¿Qué videojuego te gusta más?',
    impostorQuestion: '¿A qué juego has dedicado más horas?',
  },
  {
    id: 'culture-5',
    civilQuestion: '¿Qué youtuber o streamer sigues?',
    impostorQuestion: '¿Qué contenido consumes antes de dormir?',
  },

  // Sobre personas
  {
    id: 'people-1',
    civilQuestion: '¿Quién es tu mejor amigo?',
    impostorQuestion: '¿A quién llamarías en una emergencia?',
  },
  {
    id: 'people-2',
    civilQuestion: '¿Quién te inspira?',
    impostorQuestion: '¿A quién admiras secretamente?',
  },
  {
    id: 'people-3',
    civilQuestion: '¿Con quién pasas más tiempo?',
    impostorQuestion: '¿Con quién te gustaría pasar más tiempo?',
  },
  {
    id: 'people-4',
    civilQuestion: '¿Quién te conoce mejor?',
    impostorQuestion: '¿A quién le cuentas tus problemas?',
  },
  {
    id: 'people-5',
    civilQuestion: '¿Quién te hace reír más?',
    impostorQuestion: '¿Con quién te sientes más tú mismo?',
  },

  // Sobre el futuro
  {
    id: 'future-1',
    civilQuestion: '¿Cómo te imaginas en 5 años?',
    impostorQuestion: '¿Qué esperas lograr este año?',
  },
  {
    id: 'future-2',
    civilQuestion: '¿Qué objetivo tienes pendiente?',
    impostorQuestion: '¿Qué propósito de año nuevo cumpliste?',
  },
  {
    id: 'future-3',
    civilQuestion: '¿Dónde te gustaría jubilarte?',
    impostorQuestion: '¿Dónde te gustaría vivir algún día?',
  },
  {
    id: 'future-4',
    civilQuestion: '¿Qué legado quieres dejar?',
    impostorQuestion: '¿Por qué te gustaría ser recordado?',
  },
  {
    id: 'future-5',
    civilQuestion: '¿Qué te gustaría que dijera tu lápida?',
    impostorQuestion: '¿Cuál sería tu epitafio ideal?',
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
