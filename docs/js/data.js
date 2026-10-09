/**
 * DATOS INICIALES Y CONTENIDO TERRITORIAL
 * Magdalena Caldense · Reto El Niño · Olimpiadas UNAD
 */

const APP_DATA = {
  // MUNICIPIOS DEL MAGDALENA CALDENSE
  territorios: [
    { id: "dorada", nombre: "La Dorada", sub: "Foco Principal · Magdalena Caldense", coords: [5.4542, -74.6648] },
    { id: "norcasia", nombre: "Norcasia", sub: "Embalse Amaní · Cuenca Hidroeléctrica", coords: [5.5744, -74.8872] },
    { id: "samana", nombre: "Samaná", sub: "Bosques de Niebla · Zona Andina", coords: [5.4125, -74.9922] },
    { id: "victoria", nombre: "Victoria", sub: "Valle del Guarinó · Tradición Ganadera", coords: [5.3167, -74.9167] }
  ],

  // AVATARES DISPONIBLES PARA ADOPCIÓN
  avatares: [
    {
      id: "nutria",
      nombre: "Ima",
      titulo: "La Madre Tierra",
      especie: "Nutria de Río (Lontra longicaudis)",
      rol: "La Madre Tierra · Guardiana del Río Magdalena",
      img: "assets/avatars/nutria.webp",
      fallback: "assets/avatars/nutria.png",
      video: "avatar nutria.mp4",
      dialogoBienvenida: "¡Hola vecino! Soy Ima, represento a La Madre Tierra. Cuidaré contigo el agua y los bosques de La Dorada frente al calor extremo.",
      color: "#6F9E45"
    },
    {
      id: "pez",
      nombre: "Ta",
      titulo: "El Sol",
      especie: "Pez Dorado (Salminus affinis)",
      rol: "El Sol · Centinela del Caudal Hídrico",
      img: "assets/avatars/pez.webp",
      fallback: "assets/avatars/pez.png",
      video: "avatar pe.mp4",
      dialogoBienvenida: "¡Buenas aguas! Soy Ta, la fuerza del Sol y del agua viva. Monitorea conmigo los niveles del río y no desperdicies ni una sola gota.",
      color: "#E5A72F"
    },
    {
      id: "loro",
      nombre: "Chikchi",
      titulo: "El Viento",
      especie: "Loro Real Caldense (Amazona ochrocephala)",
      rol: "El Viento · Vigía de la Cobertura Vegetal",
      img: "assets/avatars/loro.webp",
      fallback: "assets/avatars/loro.png",
      video: "avatar pez.mp4",
      dialogoBienvenida: "¡Atento desde el aire! Soy Chikchi, el mensajero del Viento. Te avisaré rápido si veo columnas de humo o quemas de pastizales en las veredas.",
      color: "#356B3E"
    }
  ],

  // PUBLICACIONES DEL FEED COMUNITARIO
  publicaciones: [
    {
      id: "post-1",
      perfilId: "perfil-comite-unad",
      autorHandle: "@comite_ambiental_unad",
      categoria: "aprende",
      tipoBadge: "badge-aprende",
      tipoLabel: "Aprende & Gana",
      autor: "Comité Ambiental UNAD",
      autorRol: "Educación Territorial",
      autorImg: "assets/img/logo_unad.png",
      tiempo: "Hace 25m",
      texto: "💡 ¿Sabías que el estrés térmico en La Dorada puede superar los 41°C a mediodía? Proteger a los adultos mayores con paños frescos en cuello y muñecas previene desmayos y golpes de calor.",
      recompensa: 10,
      reclamado: false,
      likes: 42,
      comentarios: 3
    },
    {
      id: "post-2",
      perfilId: "perfil-defensa-civil",
      autorHandle: "@defensa_civil_dorada",
      categoria: "alerta",
      tipoBadge: "badge-alerta",
      tipoLabel: "Alerta El Niño",
      autor: "Defensa Civil La Dorada",
      autorRol: "Gestión del Riesgo",
      autorImg: "assets/img/logo_unad.png",
      tiempo: "Hace 1h",
      texto: "🚨 ALERTA ROJA POR SEQUÍA: Fuerte descenso en el caudal del Río Guarinó cerca a su desembocadura. Se restringe el uso de motobombas no autorizadas para riego masivo.",
      likes: 67,
      comentarios: 2
    },
    {
      id: "post-3",
      perfilId: "perfil-jovenes-bucamba",
      autorHandle: "@jovenes_bucamba",
      categoria: "accion",
      tipoBadge: "badge-accion",
      tipoLabel: "Acción Comunitaria",
      autor: "Jóvenes por Bucamba",
      autorRol: "Voluntariado Local",
      autorImg: "assets/avatars/pez.webp",
      tiempo: "Hace 3h",
      texto: "🌱 ¡Jornada de Reforestación Comunitaria este sábado 8:00 AM! Sembraremos 50 Caracolíes y Ceibas en la ribera del Malecón. Lleva tu termo de agua reutilizable. ¡Suma semillas a tu perfil!",
      recompensa: 25,
      reclamado: false,
      likes: 89,
      comentarios: 3
    },
    {
      id: "post-4",
      perfilId: "perfil-corpocaldas",
      autorHandle: "@corpocaldas_oficial",
      categoria: "noticia",
      tipoBadge: "badge-noticia",
      tipoLabel: "Institucional",
      autor: "Corpocaldas Oficial",
      autorRol: "Autoridad Ambiental",
      autorImg: "assets/img/logo_cimas.jpg",
      tiempo: "Ayer",
      texto: "📢 Boletín Determinantes Ambientales: Resolución No. 0825 de Corpocaldas prioriza el POMCA del Río Guarinó y declara vigilancia especial sobre acuíferos y microcuencas de La Dorada y Victoria.",
      likes: 31,
      comentarios: 2
    }
  ],

  // REELS TERRITORIALES (VIDEOS CORTOS)
  reels: [
    {
      id: "reel-v1",
      perfilId: "perfil-camila-unad",
      autorHandle: "@camila_unad_caldas",
      autor: "Camila Morales · UNAD",
      autorRol: "Educación Territorial",
      autorAvatar: "assets/img/logo_unad.png",
      videoSrc: "video1.mp4",
      titulo: "¿Qué hacer ante ola de calor, sequía o incendio?",
      descripcion: "¿Qué podemos hacer ante una ola de calor, sequía o incendio? Mantenernos hidratados, evitar el sol directo entre 11am y 3pm, priorizar el agua para consumo humano y reportar quemas a tiempo en esta plataforma. ¡Prevenir es responsabilidad de todos! ☀️🔥💧",
      tags: ["#OlaDeCalor", "#PrevencionElNiño", "#LaDoradaCaldas", "#CimasUNAD", "#RioMagdalena"],
      ubicacion: "Malecón Turístico · La Dorada",
      likes: 428,
      comentarios: 3,
      semillasRecompensa: 25,
      liked: false
    },
    {
      id: "reel-v2",
      perfilId: "perfil-camila-unad",
      autorHandle: "@camila_unad_caldas",
      autor: "Camila Morales · UNAD",
      autorRol: "Cuidado Comunitario",
      autorAvatar: "assets/img/logo_unad.png",
      videoSrc: "video2.mp4",
      titulo: "Cuidado de poblaciones vulnerables ante calor extremo",
      descripcion: "Cuidado de poblaciones vulnerables: cuando las temperaturas aumentan en La Dorada, debemos prestar especial atención a los niños y adultos mayores. Buena hidratación, lugares frescos, ropa clara y atentos a síntomas de golpe de calor (mareos, náuseas, debilidad). ¡Cuidar a quienes más lo necesitan también es prevenir! 👵👶❤️",
      tags: ["#PoblacionVulnerable", "#AdultosMayores", "#Niños", "#GolpeDeCalor", "#SaludComunitaria"],
      ubicacion: "Sector Bucamba · La Dorada",
      likes: 512,
      comentarios: 3,
      semillasRecompensa: 30,
      liked: false
    },
    {
      id: "reel-1",
      perfilId: "perfil-nutri",
      autorHandle: "@ima_madretierra",
      autor: "Ima · La Madre Tierra",
      videoSrc: "avatar nutria.mp4",
      descripcion: "¡Alerta en las veredas! Cuidado con las quemas de pasto seco. Frente a El Niño, cero fuego en La Dorada 🔥🚫",
      tags: ["#SinQuemasLaDorada", "#ElNiño", "#MagdalenaCaldense"],
      likes: 184,
      comentarios: 3,
      semillasRecompensa: 15,
      liked: false
    },
    {
      id: "reel-2",
      perfilId: "perfil-doradito",
      autorHandle: "@ta_elsol",
      autor: "Ta · El Sol",
      videoSrc: "avatar pe.mp4",
      descripcion: "El Río Magdalena nos da vida a todos. Así monitoreamos los bancos de arena en el Malecón Bucamba 🌊🐟",
      tags: ["#RioMagdalena", "#CuidadoDelAgua", "#LaDoradaCaldas"],
      likes: 243,
      comentarios: 3,
      semillasRecompensa: 15,
      liked: false
    }
  ],

  // RETOS Y MISIONES COMUNITARIAS FRENTE A «EL NIÑO» (CON VERIFICACIÓN DETALLADA)
  retos: [
    {
      id: "reto-1",
      titulo: "Cada Gota Cuenta",
      subtitulo: "Ahorro y almacenamiento seguro de agua en el hogar",
      categoria: "Seguridad Hídrica",
      icono: "💧",
      color: "#477FA8",
      progreso: 65,
      metaTexto: "65 / 100 litros ahorrados",
      semillas: 30,
      completado: false,
      descripcionDetallada: "Durante el fenómeno de El Niño, el caudal de los afluentes del Magdalena disminuye drásticamente. Almacenar agua sin medidas preventivas puede crear criaderos de Aedes aegypti (dengue). Esta misión exige adoptar prácticas reales de almacenamiento hermético y reúso.",
      pasos: [
        "Lavar tanques y albercas con cepillo cada 5 días.",
        "Tapar herméticamente canecas y recipientes limpios.",
        "Reutilizar el agua del último enjuague de la lavadora para pisos o sanitarios."
      ],
      preguntaValidacion: "¿Cuál es la medida más efectiva para almacenar agua durante la sequía sin generar riesgo de dengue?",
      opciones: [
        "Tapar herméticamente recipientes limpios y lavar tanques periódicamente.",
        "Dejar baldes y tanques abiertos en el patio bajo el sol.",
        "Almacenar agua en recipientes con hojas y sedimentos."
      ],
      respuestaCorrecta: 0,
      explicacionRespuesta: "¡Correcto! El zancudo del dengue se reproduce en aguas limpias estancadas. Tapar recipientes herméticamente protege el agua y la salud de tu familia."
    },
    {
      id: "reto-2",
      titulo: "Cuídate del Calor Extremo",
      subtitulo: "Visita y lleva agua a adultos mayores de tu barrio",
      categoria: "Salud y Vida",
      icono: "☀️",
      color: "#D96B35",
      progreso: 50,
      metaTexto: "1 de 2 vecinos asistidos",
      semillas: 40,
      completado: false,
      descripcionDetallada: "Las temperaturas en La Dorada superan los 41°C a mediodía durante El Niño. La deshidratación y el golpe de calor amenazan especialmente a niños y abuelos. La red comunitaria es la primera línea de respuesta.",
      pasos: [
        "Ubicar a dos adultos mayores vulnerables en tu cuadra.",
        "Llevarles agua potable fresca o suero oral casero.",
        "Verificar que sus viviendas tengan ventilación y sombra adecuada."
      ],
      preguntaValidacion: "Frente a un golpe de calor en un adulto mayor, ¿cuál es el primer paso de primeros auxilios antes de llevarlo al centro médico?",
      opciones: [
        "Trasladarlo a la sombra, aflojar ropa y aplicar paños de agua fresca en cuello y axilas.",
        "Darle bebidas azucaradas muy calientes y cubrirlo con mantas.",
        "Dejarlo expuesto al sol hasta que recupere el conocimiento."
      ],
      respuestaCorrecta: 0,
      explicacionRespuesta: "¡Excelente! La prioridad médica es bajar la temperatura corporal gradualmente a la sombra con compresas frescas para evitar daños neurológicos."
    },
    {
      id: "reto-3",
      titulo: "Veredas Sin Fuego",
      subtitulo: "Reporta o verifica que no haya quemas agrícolas en tu sector",
      categoria: "Prevención de Incendios",
      icono: "🔥",
      color: "#E63946",
      progreso: 80,
      metaTexto: "4 de 5 días sin quemas",
      semillas: 50,
      completado: false,
      descripcionDetallada: "El pasto seco y el viento en sectores rurales como Concordia y Japón convierten una pequeña chispa de rastrojo en un incendio forestal incontrolable. La comunidad vigila y reporta oportunamente al 119.",
      pasos: [
        "Vigilar perímetros secos de potreros o solares.",
        "Concientizar a vecinos ganaderos: cero quemas de rastrojo en temporada seca.",
        "Reportar cualquier columna de humo inmediata en el mapa o a Bomberos La Dorada."
      ],
      preguntaValidacion: "¿Por qué están prohibidas las quemas 'controladas' de rastrojo durante el fenómeno de El Niño?",
      opciones: [
        "Porque la sequía y ráfagas de viento propagan el fuego a copas de árboles y viviendas en minutos.",
        "Porque el humo ayuda a que llueva más rápido en el Magdalena.",
        "Porque el fuego enfría los pastizales."
      ],
      respuestaCorrecta: 0,
      explicacionRespuesta: "¡Exacto! Con temperaturas superiores a 40°C y baja humedad, ninguna quema es controlable. Cero fuego es la regla de oro."
    },
    {
      id: "reto-4",
      titulo: "Guardias del Magdalena",
      subtitulo: "Comparte alertas educativas con tu grupo de WhatsApp vecinal",
      categoria: "Comunidad Digital",
      icono: "🌱",
      color: "#356B3E",
      progreso: 100,
      metaTexto: "Completado",
      semillas: 25,
      completado: true,
      descripcionDetallada: "La información oportuna salva vidas. Difundir recomendaciones oficiales de Corpocaldas y Bomberos fortalece el tejido social de La Dorada frente al cambio climático.",
      pasos: [
        "Compartir infografía de prevención en WhatsApp de la Junta de Acción Comunal.",
        "Verificar fuentes antes de reenviar para evitar pánico.",
        "Invitar a 3 vecinos a unirse a la plataforma comunitaria IMA."
      ],
      preguntaValidacion: "¿Cuál es el canal oficial para emergencias de incendios y rescate en La Dorada?",
      opciones: [
        "Línea 119 de Bomberos La Dorada y la aplicación comunitaria IMA.",
        "Grupos anónimos de redes sociales sin confirmar.",
        "Esperar a la temporada de lluvias sin avisar."
      ],
      respuestaCorrecta: 0,
      explicacionRespuesta: "¡Perfecto! Los Bomberos de La Dorada (119) son el organismo oficial de respuesta inmediata ante conflagraciones."
    },
    {
      id: "reto-5",
      titulo: "Ronda Limpia, Río Seguro",
      subtitulo: "Evita incendios por 'efecto lupa' retirando vidrios y plásticos secos",
      categoria: "Limpieza Ribereña",
      icono: "🚯",
      color: "#C85A32",
      progreso: 40,
      metaTexto: "12 / 30 kg recolectados",
      semillas: 45,
      completado: false,
      descripcionDetallada: "Durante El Niño, las botellas de vidrio arrojadas en pastizales secos concentran los rayos del sol como lupas, encendiendo el pasto en segundos. Mantener limpias las rondas del Río Magdalena previene incendios y protege la fauna acuática.",
      pasos: [
        "No desechar botellas, latas ni bolsas plásticas en pastizales o solares.",
        "Participar en brigadas vecinales de recolección de residuos en la ribera de Bucamba.",
        "Separar envases de vidrio y entregarlos a recicladores de oficio en La Dorada."
      ],
      preguntaValidacion: "¿Por qué el desecho de botellas de vidrio en pastizales secos es un factor de alto riesgo durante El Niño?",
      opciones: [
        "Porque actúan como lentes convergentes (efecto lupa) que concentran el calor solar e inician incendios forestales.",
        "Porque las botellas atraen las lluvias torrenciales inmediatamente.",
        "Porque el vidrio hace que el pasto crezca más rápido."
      ],
      respuestaCorrecta: 0,
      explicacionRespuesta: "¡Totalmente cierto! Los vidrios expuestos al sol de más de 40°C en La Dorada son uno de los principales causantes de conflagraciones de rastrojo."
    }
  ],

  // ALERTAS Y ACCIONES DEL MAPA LEAFLET (GEORREFERENCIACIÓN REAL DE LA DORADA)
  mapaPuntos: [
    {
      id: "alert-1",
      layer: "alertas",
      category: "incendio",
      title: "Conflagración de pastizal activo",
      location: "Vereda Concordia (Sector Norte)",
      lat: 5.4740,
      lon: -74.6720,
      desc: "Foco de quema de rastrojo detectado por vecinos. Temperatura 39°C y ráfagas de viento amenazan pastizales ganaderos.",
      personasAfectadas: 6,
      poblacionVulnerable: ["Adultos mayores", "Niños"],
      severity: "urgente",
      severityLabel: "🔴 Alerta Crítica",
      confirmations: 9,
      timeAgo: "Hace 14m",
      status: "Bomberos en Camino",
      color: "#E63946",
      haloColor: "rgba(230, 57, 70, 0.45)",
      iconType: "flame"
    },
    {
      id: "alert-2",
      layer: "alertas",
      category: "calor",
      title: "Punto de Estrés Térmico: Adultos Mayores",
      location: "Barrio Alfonso López / Calle 10",
      lat: 5.4490,
      lon: -74.6620,
      desc: "Sensación térmica extrema de 41°C. Brigada comunitaria activó plan de hidratación y acompañamiento a 14 adultos mayores.",
      personasAfectadas: 14,
      poblacionVulnerable: ["Adultos mayores", "Movilidad reducida"],
      urgenciaMedica: true,
      severity: "moderada",
      severityLabel: "🟠 Calor Extremo",
      confirmations: 6,
      timeAgo: "Hace 32m",
      status: "Red Comunitaria",
      color: "#D96B35",
      haloColor: "rgba(217, 107, 53, 0.45)",
      iconType: "sun"
    },
    {
      id: "alert-3",
      layer: "alertas",
      category: "agua",
      title: "Bajante crítica del Río Magdalena",
      location: "Desembocadura Río Guarinó",
      lat: 5.4260,
      lon: -74.6740,
      desc: "Nivel hídrico 40% por debajo de la media estacional. Pescadores reportan bancos de arena y necesidad de monitoreo constante.",
      personasAfectadas: 0,
      poblacionVulnerable: [],
      severity: "moderada",
      severityLabel: "🔵 Escasez Hídrica",
      confirmations: 15,
      timeAgo: "Hace 1h",
      status: "En Inspección",
      color: "#477FA8",
      haloColor: "rgba(71, 127, 168, 0.45)",
      iconType: "water"
    },
    {
      id: "alert-4",
      layer: "alertas",
      category: "incendio",
      title: "Quema de cobertura vegetal sin control",
      location: "Vereda Japón / Vía Norcasia",
      lat: 5.4620,
      lon: -74.6980,
      desc: "Humo denso dificulta visibilidad sobre la vía. Familias rurales solicitan apoyo urgente de bomberos voluntarios.",
      personasAfectadas: 4,
      poblacionVulnerable: ["Niños", "Afecciones respiratorias"],
      severity: "urgente",
      severityLabel: "🔴 Alerta Crítica",
      confirmations: 5,
      timeAgo: "Hace 20m",
      status: "Validación Activa",
      color: "#E63946",
      haloColor: "rgba(230, 57, 70, 0.45)",
      iconType: "flame"
    },
    {
      id: "impact-1",
      layer: "impacto",
      category: "siembra",
      title: "Bosque Comunitario #4: 100 Árboles",
      location: "Riberas de Bucamba / Malecón",
      lat: 5.4595,
      lon: -74.6580,
      desc: "¡Meta cumplida! Con 10.000 semillas digitales acumuladas por jóvenes de colegios se plantaron especies nativas: Guayacán y Ceiba.",
      severity: "impacto",
      severityLabel: "🌱 Retorno al Territorio",
      confirmations: 38,
      timeAgo: "Ayer",
      status: "Siembra Exitosa",
      color: "#356B3E",
      haloColor: "rgba(53, 107, 62, 0.4)",
      iconType: "tree"
    },
    {
      id: "impact-2",
      layer: "impacto",
      category: "hidratacion",
      title: "Oasis Comunitario e Hidratación Animal",
      location: "Plaza de Mercado Central",
      lat: 5.4520,
      lon: -74.6670,
      desc: "Instalado por comerciantes para mitigar el golpe de calor en aves, animales comunitarios y adultos mayores de la plaza.",
      severity: "impacto",
      severityLabel: "🚰 Oasis de Agua",
      confirmations: 21,
      timeAgo: "Hace 4h",
      status: "Activo",
      color: "#8DC8C5",
      haloColor: "rgba(141, 200, 197, 0.45)",
      iconType: "water"
    },
    {
      id: "impact-3",
      layer: "impacto",
      category: "siembra",
      title: "Reforestación Ribereña: 50 Caracolíes",
      location: "Malecón Turístico / Bucamba",
      lat: 5.4560,
      lon: -74.6595,
      desc: "50 árboles nativos sembrados por pescadores y jóvenes UNAD para fijar la orilla del Río Magdalena y generar sombrío natural frente a 41°C.",
      severity: "impacto",
      severityLabel: "🌳 50 Árboles Sembrados",
      confirmations: 42,
      timeAgo: "Hace 2d",
      status: "En Crecimiento",
      color: "#2D6A4F",
      haloColor: "rgba(45, 106, 79, 0.45)",
      iconType: "tree"
    },
    {
      id: "impact-4",
      layer: "impacto",
      category: "siembra",
      title: "Bosque Protector: 30 Guayacanes Amarillos",
      location: "Barrio Alfonso López / Ronda Férrea",
      lat: 5.4475,
      lon: -74.6650,
      desc: "Siembra de 30 Guayacanes nativos como barrera de amortiguación térmica para viviendas expuestas a radiación solar intensa.",
      severity: "impacto",
      severityLabel: "🌳 30 Árboles Sembrados",
      confirmations: 29,
      timeAgo: "Hace 3d",
      status: "Riego Vecinal Activo",
      color: "#356B3E",
      haloColor: "rgba(53, 107, 62, 0.45)",
      iconType: "tree"
    },
    {
      id: "impact-5",
      layer: "impacto",
      category: "limpieza",
      title: "Jornada Ronda Limpia: 60 kg Retirados",
      location: "Ribera del Río Magdalena / La Horqueta",
      lat: 5.4640,
      lon: -74.6630,
      desc: "Brigada juvenil retiró botellas de vidrio y plásticos secos, neutralizando el riesgo de incendios forestales por efecto lupa ante El Niño.",
      severity: "impacto",
      severityLabel: "🧹 Rondas Limpias",
      confirmations: 33,
      timeAgo: "Ayer",
      status: "Ronda Segura",
      color: "#52B788",
      haloColor: "rgba(82, 183, 136, 0.45)",
      iconType: "waste"
    },
    {
      id: "alert-5",
      layer: "alertas",
      category: "residuos",
      title: "Disposición Inadecuada de Residuos",
      location: "Ronda Río Magdalena / Sector Bucamba",
      lat: 5.4605,
      lon: -74.6615,
      desc: "Depósito no autorizado de botellas de vidrio, plásticos secos y llantas en la ribera. Peligro de conflagración por 'efecto lupa' ante pico de 41°C y taponamiento del cauce.",
      severity: "moderada",
      severityLabel: "🚯 Residuos en Ronda",
      confirmations: 11,
      timeAgo: "Hace 40m",
      status: "Jornada Vecinal",
      color: "#C85A32",
      haloColor: "rgba(200, 90, 50, 0.45)",
      iconType: "waste"
    }
  ],

  // HITOS EMBLEMÁTICOS (DESACTIVADOS PARA MANTENER CARTOGRAFÍA LIMPIA)
  hitosGeograficos: [],

  // NOTIFICACIONES INICIALES DEL CENTRO DE ALERTAS
  notificacionesAlertas: [
    {
      id: "notif-1",
      tipo: "alerta",
      icono: "🚨",
      titulo: "Alerta Crítica: Conflagración",
      mensaje: "Foco de pastizal en Vereda Concordia. Bomberos despachó móvil #3.",
      tiempo: "Hace 14m",
      leida: false,
      pantallaDestino: "mapa"
    },
    {
      id: "notif-5",
      tipo: "alerta",
      icono: "🚯",
      titulo: "Residuos en Ronda Bucamba",
      mensaje: "Alerta por botellas de vidrio en pasto seco (efecto lupa). Jornada comunitaria este sábado.",
      tiempo: "Hace 25m",
      leida: false,
      pantallaDestino: "mapa"
    },
    {
      id: "notif-2",
      tipo: "calor",
      icono: "☀️",
      titulo: "Pico de Calor: 41°C",
      mensaje: "Alerta amarilla por estrés térmico en Barrio Alfonso López y Centro.",
      tiempo: "Hace 35m",
      leida: false,
      pantallaDestino: "mapa"
    },
    {
      id: "notif-3",
      tipo: "agua",
      icono: "💧",
      titulo: "Descenso de Caudal: Río Guarinó",
      mensaje: "Corpocaldas restringe extracción de agua con motobombas en la cuenca.",
      tiempo: "Hace 1h",
      leida: false,
      pantallaDestino: "inicio"
    },
    {
      id: "notif-4",
      tipo: "siembra",
      icono: "🌱",
      titulo: "¡Meta Colectiva Alcanzada!",
      mensaje: "La Dorada sumó 340 semillas. Ya se han sembrado 4 árboles en Bucamba.",
      tiempo: "Ayer",
      leida: true,
      pantallaDestino: "retos"
    }
  ],

  // COMENTARIOS REALES POR PUBLICACIÓN / REEL (COHERENCIA 100% GARANTIZADA)
  comentariosPorPost: {
    "post-1": [
      {
        id: "c-101",
        autor: "Luz Marina Gómez",
        rol: "Líder JAC Bucamba",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Hace 12m",
        texto: "En Bucamba estamos aplicando paños frescos y sombra a los abuelos en las tardes. ¡Cuidemos la vida con este calor!"
      },
      {
        id: "c-102",
        autor: "Dr. Carlos E. Mejía",
        rol: "Salud Pública La Dorada",
        avatar: "assets/avatars/pez.webp",
        tiempo: "Hace 18m",
        texto: "Recuerden que la hidratación debe ser constante antes de que aparezca la sed para prevenir síncopes por calor."
      },
      {
        id: "c-103",
        autor: "María Fernanda P.",
        rol: "Estudiante UNAD",
        avatar: "assets/img/logo_unad.png",
        tiempo: "Hace 22m",
        texto: "Excelente recomendación, ya le avisé a mis vecinos en el Barrio Alfonso López."
      }
    ],
    "post-2": [
      {
        id: "c-201",
        autor: "Sgto. Jorge Morales",
        rol: "Bomberos La Dorada",
        avatar: "assets/img/logo_unad.png",
        tiempo: "Hace 28m",
        texto: "Monitoreamos la cuenca del Guarinó cada 3 horas. Apelamos a la conciencia ciudadana para no extraer agua ilegalmente."
      },
      {
        id: "c-202",
        autor: "Alberto Rincón",
        rol: "Pescador Artesanal",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Hace 45m",
        texto: "El playón en la desembocadura está muy seco, apoyamos la restricción para cuidar los peces."
      }
    ],
    "post-3": [
      {
        id: "c-301",
        autor: "Camilo Torres",
        rol: "Estudiante UNAD La Dorada",
        avatar: "assets/avatars/pez.webp",
        tiempo: "Hace 1h",
        texto: "El sábado estaré presente con mi familia en el Malecón para sembrar los Caracolíes 🌱"
      },
      {
        id: "c-302",
        autor: "Elena Bedoya",
        rol: "Voluntaria Bucamba",
        avatar: "assets/avatars/loro.webp",
        tiempo: "Hace 2h",
        texto: "Llevaré herramientas de jardinería y bolsas de abono orgánico para los árboles."
      },
      {
        id: "c-303",
        autor: "Comité Ambiental",
        rol: "UNAD Territorial",
        avatar: "assets/img/logo_cimas.jpg",
        tiempo: "Hace 2h",
        texto: "¡Bienvenidos todos! La cita es a las 8:00 AM en el punto del monumento del pez."
      }
    ],
    "post-4": [
      {
        id: "c-401",
        autor: "Ing. Rodrigo Silva",
        rol: "Corpocaldas",
        avatar: "assets/img/logo_cimas.jpg",
        tiempo: "Ayer",
        texto: "La resolución garantiza el caudal ecológico mínimo en temporada de sequía extrema."
      },
      {
        id: "c-402",
        autor: "JAC Las Ferias",
        rol: "Comunidad Vecinal",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Ayer",
        texto: "Agradecemos la vigilancia sobre los acuíferos de nuestro sector."
      }
    ],
    "reel-1": [
      {
        id: "c-r1",
        autor: "Andrés Galeano",
        rol: "Vereda Concordia",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Hace 15m",
        texto: "Cero quemas por acá, ya hablamos con los mayordomos de las fincas ganaderas."
      },
      {
        id: "c-r2",
        autor: "Valentina Mora",
        rol: "Vereda Japón",
        avatar: "assets/avatars/pez.webp",
        tiempo: "Hace 30m",
        texto: "Muy importante el mensaje de Ima, el pasto está como paja seca."
      },
      {
        id: "c-r3",
        autor: "Bomberos La Dorada",
        rol: "Línea 119",
        avatar: "assets/img/logo_unad.png",
        tiempo: "Hace 1h",
        texto: "Ante cualquier humo visible, marcar de inmediato al 119."
      }
    ],
    "reel-2": [
      {
        id: "c-r4",
        autor: "Pescadores del Magdalena",
        rol: "Gremio Fluvial",
        avatar: "assets/avatars/pez.webp",
        tiempo: "Hace 20m",
        texto: "El río está en niveles históricos bajos. Muy claro el reporte de Ta."
      },
      {
        id: "c-r5",
        autor: "Sandra Milena",
        rol: "Líder Comunitaria",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Hace 40m",
        texto: "Cuidemos cada gota de agua en nuestras casas en La Dorada."
      },
      {
        id: "c-r6",
        autor: "UNAD Caldas",
        rol: "Comunidad Académica",
        avatar: "assets/img/logo_unad.png",
        tiempo: "Hace 1h",
        texto: "El Magdalena es nuestro eje de vida. Gran pedagogía territorial."
      }
    ],
    "reel-0": [
      {
        id: "c-r1-alt",
        autor: "Andrés Galeano",
        rol: "Vereda Concordia",
        avatar: "assets/avatars/nutria.webp",
        tiempo: "Hace 15m",
        texto: "Cero quemas por acá, ya hablamos con los mayordomos de las fincas ganaderas."
      }
    ]
  },

  // Fallback para compatibilidad global
  comentariosComunitarios: [
    {
      id: "c-1",
      autor: "Luz Marina Gómez",
      autorHandle: "@luzmarina_bucamba",
      rol: "Líder JAC Bucamba",
      avatar: "assets/avatars/nutria.webp",
      tiempo: "Hace 12m",
      texto: "Acabamos de instalar sombríos y recipientes de agua fresca para aves y vecinos en la plazoleta. ¡Cuidemos la vida con este calor!"
    },
    {
      id: "c-2",
      autor: "Sgto. Jorge Morales",
      autorHandle: "@bomberos_dorada_oficial",
      rol: "Bomberos La Dorada",
      avatar: "assets/img/logo_unad.png",
      tiempo: "Hace 28m",
      texto: "Recordamos a toda la comunidad rural que cualquier quema de rastrojo está terminantemente prohibida. Llamen de inmediato al 119 si divisan columnas de humo."
    },
    {
      id: "c-3",
      autor: "Camilo Torres",
      autorHandle: "@camilo_unad",
      rol: "Estudiante UNAD La Dorada",
      avatar: "assets/avatars/pez.webp",
      tiempo: "Hace 1h",
      texto: "Excelente la iniciativa de convertir semillas digitales en árboles reales en el Malecón. El sábado estaré en la jornada de Bucamba con mi familia 🌱"
    }
  ],

  // DIRECTORIO DE PERFILES DE AUTORES Y CUENTAS TERRITORIALES
  perfiles: [
    {
      id: "perfil-camila-unad",
      handle: "@camila_unad_caldas",
      nombre: "Camila Morales · UNAD Caldas",
      rol: "Promotora de Salud & Educación Ambiental",
      entidad: "Semillero CIMAS · CCAV La Dorada",
      municipio: "La Dorada, Caldas",
      avatar: "assets/img/logo_unad.png",
      portada: "#356B3E",
      bio: "Educación ambiental para la acción ciudadana. Comparto cápsulas sobre prevención ante El Niño, hidratación y cuidado prioritario de niños y adultos mayores frente al calor extremo.",
      verificado: true,
      seguidores: 2840,
      seguido: false,
      semillasAportadas: 1650,
      arbolesRespaldados: 28,
      alertasReportadas: 14,
      publicacionesIds: [],
      reelsIds: ["reel-v1", "reel-v2"]
    },
    {
      id: "perfil-nutri",
      handle: "@ima_madretierra",
      nombre: "Ima · La Madre Tierra",
      rol: "La Madre Tierra · Nutria de Río",
      entidad: "Red de Guardianes de la Tierra",
      municipio: "La Dorada, Caldas",
      avatar: "assets/avatars/nutria.webp",
      portada: "#356B3E",
      bio: "Soy Ima, represento a La Madre Tierra. Protejo la fauna del Río Magdalena y lidero la prevención comunitaria de quemas y golpes de calor frente a El Niño.",
      verificado: true,
      seguidores: 1420,
      seguido: false,
      semillasAportadas: 850,
      arbolesRespaldados: 24,
      alertasReportadas: 18,
      publicacionesIds: ["post-1"],
      reelsIds: ["reel-1"]
    },
    {
      id: "perfil-doradito",
      handle: "@ta_elsol",
      nombre: "Ta · El Sol",
      rol: "El Sol · Pez Dorado",
      entidad: "Veeduría Fluvial del Magdalena",
      municipio: "La Dorada · Malecón Bucamba",
      avatar: "assets/avatars/pez.webp",
      portada: "#477FA8",
      bio: "Soy Ta, represento la fuerza del Sol y la vitalidad del agua viva. Vigilo los niveles del Río Magdalena, Guarinó y La Miel frente a la sequía extrema.",
      verificado: true,
      seguidores: 980,
      seguido: false,
      semillasAportadas: 620,
      arbolesRespaldados: 16,
      alertasReportadas: 22,
      publicacionesIds: [],
      reelsIds: ["reel-2"]
    },
    {
      id: "perfil-chikchi",
      handle: "@chikchi_elviento",
      nombre: "Chikchi · El Viento",
      rol: "El Viento · Loro Real",
      entidad: "Vigías Aéreos del Magdalena",
      municipio: "La Dorada, Caldas",
      avatar: "assets/avatars/loro.webp",
      portada: "#356B3E",
      bio: "Soy Chikchi, mensajero del Viento. Vigilo desde el cielo y el dosel de los bosques la presencia de humo y quemas para alertar a tiempo.",
      verificado: true,
      seguidores: 1150,
      seguido: false,
      semillasAportadas: 720,
      arbolesRespaldados: 20,
      alertasReportadas: 16,
      publicacionesIds: [],
      reelsIds: []
    },
    {
      id: "perfil-comite-unad",
      handle: "@comite_ambiental_unad",
      nombre: "Comité Ambiental UNAD",
      rol: "Educación & Pedagogía Territorial",
      entidad: "Semillero CIMAS · CCAV La Dorada",
      municipio: "La Dorada, Caldas",
      avatar: "assets/img/logo_unad.png",
      portada: "#204B28",
      bio: "Innovación y acción social desde la academia. Formamos guardianes climáticos para mitigar los impactos del calentamiento global en Caldas.",
      verificado: true,
      seguidores: 3120,
      seguido: true,
      semillasAportadas: 2450,
      arbolesRespaldados: 45,
      alertasReportadas: 38,
      publicacionesIds: ["post-1"],
      reelsIds: []
    },
    {
      id: "perfil-defensa-civil",
      handle: "@defensa_civil_dorada",
      nombre: "Defensa Civil La Dorada",
      rol: "Gestión de Riesgo & Emergencias",
      entidad: "Junta de Defensa Civil Municipal",
      municipio: "La Dorada, Caldas",
      avatar: "assets/img/logo_unad.png",
      portada: "#D96B35",
      bio: "Voluntarios al servicio del territorio. Emitimos alertas de sequía, prevención de incendios y socorro inmediato ante olas de calor.",
      verificado: true,
      seguidores: 5240,
      seguido: true,
      semillasAportadas: 1980,
      arbolesRespaldados: 30,
      alertasReportadas: 64,
      publicacionesIds: ["post-2"],
      reelsIds: []
    },
    {
      id: "perfil-jovenes-bucamba",
      handle: "@jovenes_bucamba",
      nombre: "Jóvenes por Bucamba",
      rol: "Voluntariado Ribereño & Siembra",
      entidad: "Colectivo Comunitario Juvenil",
      municipio: "Sector Bucamba · La Dorada",
      avatar: "assets/avatars/pez.webp",
      portada: "#2D6A4F",
      bio: "Transformando semillas digitales en Caracolíes y Ceibas reales. Jornadas de reforestación todos los sábados en la ribera del Malecón.",
      verificado: true,
      seguidores: 1890,
      seguido: false,
      semillasAportadas: 1670,
      arbolesRespaldados: 58,
      alertasReportadas: 19,
      publicacionesIds: ["post-3"],
      reelsIds: []
    },
    {
      id: "perfil-corpocaldas",
      handle: "@corpocaldas_oficial",
      nombre: "Corpocaldas Oficial",
      rol: "Autoridad Ambiental Regional",
      entidad: "Corporación Autónoma de Caldas",
      municipio: "Departamento de Caldas",
      avatar: "assets/img/logo_cimas.jpg",
      portada: "#1E2A20",
      bio: "Máxima autoridad ambiental del departamento. Vigilancia de cuencas, POMCA del Río Guarinó y protección del recurso hídrico subterráneo.",
      verificado: true,
      seguidores: 8900,
      seguido: true,
      semillasAportadas: 3400,
      arbolesRespaldados: 120,
      alertasReportadas: 85,
      publicacionesIds: ["post-4"],
      reelsIds: []
    },
    {
      id: "perfil-luzmarina",
      handle: "@luzmarina_bucamba",
      nombre: "Luz Marina Gómez",
      rol: "Presidenta JAC Bucamba",
      entidad: "Junta de Acción Comunal",
      municipio: "Barrio Bucamba · La Dorada",
      avatar: "assets/avatars/nutria.webp",
      portada: "#6F9E45",
      bio: "Vocera vecinal. Impulsamos oasis de hidratación en la plaza y apoyo prioritario para adultos mayores con este calor extremo.",
      verificado: true,
      seguidores: 640,
      seguido: false,
      semillasAportadas: 510,
      arbolesRespaldados: 14,
      alertasReportadas: 12,
      publicacionesIds: [],
      reelsIds: []
    },
    {
      id: "perfil-bomberos",
      handle: "@bomberos_dorada_oficial",
      nombre: "Sgto. Jorge Morales",
      rol: "Cuerpo de Bomberos La Dorada",
      entidad: "Emergencias Línea 119",
      municipio: "La Dorada, Caldas",
      avatar: "assets/img/logo_unad.png",
      portada: "#805238",
      bio: "Comandante de guardia de Bomberos La Dorada. Cero quemas de rastrojo en temporada seca. Tu reporte a tiempo salva vidas.",
      verificado: true,
      seguidores: 4100,
      seguido: false,
      semillasAportadas: 1200,
      arbolesRespaldados: 25,
      alertasReportadas: 53,
      publicacionesIds: [],
      reelsIds: []
    },
    {
      id: "perfil-estudiante-unad",
      handle: "@estudiante_unad",
      nombre: "Estudiante UNAD",
      rol: "Guardián Territorial Activo",
      entidad: "Olimpiadas de Emprendimiento Social 2026",
      municipio: "La Dorada, Caldas",
      avatar: "assets/avatars/nutria.webp",
      portada: "#356B3E",
      bio: "Comprometido con la sostenibilidad del Magdalena Caldense. Sembrando árboles y validando alertas ciudadanas frente a El Niño.",
      verificado: true,
      seguidores: 185,
      seguido: false,
      semillasAportadas: 340,
      arbolesRespaldados: 4,
      alertasReportadas: 12,
      publicacionesIds: [],
      reelsIds: []
    }
  ],

  // CAMPAÑAS COMUNITARIAS DE DONACIÓN Y RETORNO (DOCUMENTO WORD SECCIÓN 5 Y PERFIL)
  campanasDonacion: [
    {
      id: "campana-reforestacion",
      titulo: "Reforestación Ribera Bucamba",
      tipo: "siembra",
      icon: "🌳",
      metaSemillas: 1000,
      semillasActuales: 680,
      arbolesFinanciados: 6,
      descripcion: "Financia la siembra de Caracolíes y Ceibas para restaurar la ronda hídrica del Río Magdalena y crear sombra frente a olas de 41°C.",
      ubicacion: "Sector Bucamba · La Dorada",
      aliado: "Alcaldía de La Dorada & Corpocaldas"
    },
    {
      id: "campana-limpieza",
      titulo: "Gran Limpieza Río Guarinó",
      tipo: "limpieza",
      icon: "🧹",
      metaSemillas: 600,
      semillasActuales: 390,
      arbolesFinanciados: 3,
      descripcion: "Activa brigadas juveniles para retirar residuos secos, plásticos y vidrios que aumentan el riesgo de incendios en temporada seca.",
      ubicacion: "Desembocadura Río Guarinó",
      aliado: "Defensa Civil & Juntas de Acción Comunal"
    },
    {
      id: "campana-oasis",
      titulo: "Oasis de Hidratación en Barrios Vulnerables",
      tipo: "hidratacion",
      icon: "🚰",
      metaSemillas: 500,
      semillasActuales: 420,
      arbolesFinanciados: 4,
      descripcion: "Instalación de puntos comunitarios de hidratación y monitoreo térmico en barrios vulnerables al calor (Alfonso López y Las Ferias).",
      ubicacion: "Barrio Alfonso López · La Dorada",
      aliado: "Comité de Salud Comunitaria & UNAD"
    }
  ]
};

window.APP_DATA = APP_DATA;


