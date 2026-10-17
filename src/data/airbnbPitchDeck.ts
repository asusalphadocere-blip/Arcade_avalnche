export interface AirbnbSlide {
  slideNumber: number;
  category: string; // e.g., '1. Cover', '2. Problem', '3. Solution', etc.
  title: string;
  tagline: string;
  airbnbComparison: string; // e.g. "Equivalente al slide 'Problem' de Airbnb (Price, Hotels, Culture)"
  keyMetricOrQuote?: {
    value: string;
    label: string;
  };
  bullets: string[];
  cards?: {
    title: string;
    subtitle: string;
    highlight?: string;
  }[];
  callout?: string;
}

export const AIRBNB_PITCH_DECK: AirbnbSlide[] = [
  {
    slideNumber: 1,
    category: '1. Cover / Portada',
    title: 'Arcade Studio',
    tagline: 'Bookable Brand Arcades & Gamified Operations for Live Events',
    airbnbComparison: 'Airbnb: "Book rooms with locals, rather than hotels."',
    keyMetricOrQuote: {
      value: '2 Min',
      label: 'Tiempo promedio para publicar un arcade de marca con QR',
    },
    bullets: [
      'Plataforma B2B para que organizadores de eventos y marcas creen arcades interactivos personalizados en minutos.',
      'El mismo juego se ejecuta en los teléfonos de los asistentes mediante código QR o en tótems/pantallas físicas de kiosko.',
      'Integra la operación completa del evento: Check-in en puerta con tickets correlativos, leaderboards en vivo y tómbola digital.',
    ],
    callout: 'Canva para la identidad visual + Plantillas de minijuegos + Herramientas de operación en vivo',
  },
  {
    slideNumber: 2,
    category: '2. Problem / El Problema',
    title: 'Los Juegos para Eventos son Caros, Lentos y Desconectados',
    tagline: 'Las agencias cobran miles de dólares por juegos desechables que nadie reutiliza.',
    airbnbComparison: 'Airbnb: "Price is an important concern for travelers. Hotels leave you disconnected from the city."',
    keyMetricOrQuote: {
      value: '$8K - $20K',
      label: 'Costo promedio de desarrollar un minijuego publicitario a medida',
    },
    bullets: [
      'Costos prohibitivos: Crear un juego desde cero para una conferencia o stand toma 3 a 6 semanas de desarrollo a medida.',
      'Baja retención & fricción: El merchandising impreso se bota a la basura; los asistentes ignoran stands sin experiencias lúdicas inmediatas.',
      'Operaciones fragmentadas: El check-in de llegada, el juego promocional y el sorteo de premios ocurren en tres herramientas desconectadas (papel, Google Forms y hojas de cálculo).',
    ],
    cards: [
      {
        title: 'Costo Excesivo',
        subtitle: 'Presupuestos de 5 cifras por juegos que se usan 1 día y se desechan.',
        highlight: '$10,000+',
      },
      {
        title: 'Cero Reutilización',
        subtitle: 'Código espagueti que no permite cambiar logos ni reglas fácilmente.',
        highlight: '1 solo uso',
      },
      {
        title: 'Sorteos Caóticos',
        subtitle: 'Tómbolas manuales sin trazabilidad ni conexión con el juego.',
        highlight: 'Sin datos',
      },
    ],
  },
  {
    slideNumber: 3,
    category: '3. Solution / La Solución',
    title: 'Arcade Studio: El Canva de los Videojuegos de Marca',
    tagline: 'Un motor modular desacoplado que convierte marcas en experiencias jugables al instante.',
    airbnbComparison: 'Airbnb: "A web platform where users can rent out their space to host travelers."',
    keyMetricOrQuote: {
      value: '95%',
      label: 'Reducción en tiempo y costos de despliegue frente a agencias tradicionales',
    },
    bullets: [
      'Selecciona una plantilla probada: Motores 2D optimizados (Catch & Collect, Brand Quiz, Reaction Test, Speed Run).',
      'Personaliza tu identidad de marca: Inyecta colores, tipografías, logos, sprites y preguntas de trivia en un clic.',
      'Opera el evento de punta a punta: Check-in de llegada con asignación de ticket, partida en móvil o kiosko, marcador en pantalla gigante y tómbola digital.',
    ],
    cards: [
      {
        title: 'Editor Visual B2B',
        subtitle: 'Crea variantes de marca sin programar una sola línea de código.',
        highlight: 'Visual & Rápido',
      },
      {
        title: 'Runtime Compartido',
        subtitle: 'Funciona en iPhone, Android, tablets y pantallas de escenario.',
        highlight: 'Multi-dispositivo',
      },
      {
        title: 'Check-in + Sorteo',
        subtitle: 'Genera tickets correlativos y rifa premios por puntos o asistencia.',
        highlight: 'Llave en mano',
      },
    ],
  },
  {
    slideNumber: 4,
    category: '4. Market Validation / Validación de Mercado',
    title: 'Validación en Terreno con 3 Eventos Reales en Luma',
    tagline: 'Comprobado con comunidades tecnológicas, hackathons universitarias y charlas de IA.',
    airbnbComparison: 'Airbnb: "Couchsurfing (660,000 users), Craigslist (17,000 temporary housing listings)."',
    keyMetricOrQuote: {
      value: '3 Pilotos',
      label: 'Eventos activos configurados en producción con registro en Luma',
    },
    bullets: [
      'Ruta a la Hackathon Dev3pack x ChileDAO (luma.com/fg52mshy): Arcade de programación y tokens Web3 con premios para builders.',
      'Focus Group + Ideatón Mujeres en Ingeniería UDP (luma.com/4pw96ycv): Desafío de reflejos STEAM y asignación de tickets de asistencia.',
      'UDP TECH TALKS Vol. 1: Mujeres en Tecnología & IA (luma.com/ovbwi0fj): Trivia interactiva de gobernanza de IA con sorteo automatizado.',
    ],
    cards: [
      {
        title: 'Dev3pack x ChileDAO',
        subtitle: 'Comunidad Web3 estudiantil · Hackathons nacionales',
        highlight: 'luma.com/fg52mshy',
      },
      {
        title: 'CMEI UDP Ideatón',
        subtitle: 'Facultad de Ingeniería UDP · Reto de innovación STEAM',
        highlight: 'luma.com/4pw96ycv',
      },
      {
        title: 'UDP Tech Talks IA',
        subtitle: 'Gobernanza, ética y liderazgo tecnológico',
        highlight: 'luma.com/ovbwi0fj',
      },
    ],
  },
  {
    slideNumber: 5,
    category: '5. Market Size / Tamaño de Mercado',
    title: 'Un Mercado de $32B en Software para Eventos & Experiencias',
    tagline: 'Oportunidad masiva impulsada por el regreso de los eventos presenciales y el marketing interactivo.',
    airbnbComparison: 'Airbnb: "1.9B Trips Booked (TAM), 560M Budget & Online (SAM), 10.6M Market Share (SOM)."',
    keyMetricOrQuote: {
      value: '$32.4B',
      label: 'TAM Global: Software de gestión y marketing experiencial para eventos',
    },
    bullets: [
      'TAM ($32.4B): Mercado global de software para gestión de eventos, ferias, exposiciones y activaciones de patrocinadores.',
      'SAM ($6.8B): Presupuestos destinados a gamificación, interacción de asistentes y herramientas de retención en stands.',
      'SOM ($340M): Cuota inicial accesible: Hackathons, conferencias tecnológicas, festivales universitarios y marcas Web3 en LATAM y US.',
    ],
    cards: [
      {
        title: 'TAM (Global)',
        subtitle: 'Mercado global de Event Tech & Experiential Marketing',
        highlight: '$32.4B',
      },
      {
        title: 'SAM (Gamification)',
        subtitle: 'Activaciones lúdicas y software interactivo para stands',
        highlight: '$6.8B',
      },
      {
        title: 'SOM (Nicho Inicial)',
        subtitle: 'Conferencias Tech, Web3, Hackathons y Universidades',
        highlight: '$340M',
      },
    ],
  },
  {
    slideNumber: 6,
    category: '6. Product Architecture / El Producto',
    title: '4 Pilares Integrados en una Sola Plataforma',
    tagline: 'Del registro en la puerta hasta la entrega del trofeo en el escenario.',
    airbnbComparison: 'Airbnb: "Search by City, Review Listings, Book It!"',
    keyMetricOrQuote: {
      value: '4 en 1',
      label: 'Editor de Marca + Runtime 2D + Check-in Tickets + Tómbola en Vivo',
    },
    bullets: [
      '1. Brand & Game Config Editor: Previsualiza en tiempo real logos, paletas de colores, tiempos y reglas.',
      '2. Shared Arcade Runtime: Renderizado en Canvas 60 FPS sin descargas de app (acceso instantáneo vía QR móvil o pantalla kiosko).',
      '3. Módulo de Check-in & Tickets: Registro en 5 segundos con nombre y correo; emite ticket correlativo (#001, #002...) y exporta a CSV/JSON.',
      '4. Tómbola Digital con Criterios: Sorteos en vivo con ruleta animada, confeti y filtros por asistencia, puntaje mínimo o leaderboard.',
    ],
    callout: 'Arquitectura desacoplada: El motor no conoce la marca; la configuración vive en un JSON estructurado y versionado.',
  },
  {
    slideNumber: 7,
    category: '7. Business Model / Modelo de Negocio',
    title: 'Suscripción SaaS + Licencias por Evento',
    tagline: 'Monetización flexible adaptada tanto a organizadores de meetups como a grandes cumbres corporativas.',
    airbnbComparison: 'Airbnb: "We take a 10% commission on each transaction."',
    keyMetricOrQuote: {
      value: '$199 - $799',
      label: 'Ticket promedio por evento corporativo o suscripción mensual de agencia',
    },
    bullets: [
      'Plan Free / Community ($0): 1 evento activo, hasta 50 asistentes, plantillas base con marca de agua (ideal para meetups comunitarios).',
      'Plan Event Pro ($199 / evento): Asistentes ilimitados, marca blanca completa, tómbola digital avanzada, exportación de historial JSON y soporte.',
      'Plan Enterprise & Agencias ($799 / mes o $2,499 / cumbre): Múltiples kioskos sincronizados, sprites de juegos 100% personalizados, insignias Avalanche PoAP y SLA prioritario.',
    ],
    cards: [
      {
        title: 'Community',
        subtitle: 'Meetups universitarios y eventos pequeños',
        highlight: 'Gratis',
      },
      {
        title: 'Pro Event Pass',
        subtitle: 'Hackathons y conferencias de 1 a 3 días',
        highlight: '$199 / evento',
      },
      {
        title: 'Agency & Summit',
        subtitle: 'Agencias de eventos, cumbres y festivales masivos',
        highlight: '$799 / mes',
      },
    ],
  },
  {
    slideNumber: 8,
    category: '8. Go-To-Market / Estrategia de Crecimiento',
    title: 'Efecto Red & Volante Viral desde el Propio Evento',
    tagline: 'Cada asistente que juega es un organizador potencial para su propia marca.',
    airbnbComparison: 'Airbnb: "Events (Targeting high profile events), Partnerships (Kayak), Craigslist integration."',
    keyMetricOrQuote: {
      value: 'Viral Loop',
      label: 'El 18% de los asistentes a conferencias organizan sus propios eventos o meetups',
    },
    bullets: [
      'Watermark & CTA en el juego: Cada pantalla final de puntaje incluye "Crea tu propio arcade en 2 minutos con Arcade Studio".',
      'Integración con plataformas de registro: Conexión nativa con Luma, Eventbrite y Ticketmaster para sincronizar listas de acreditación.',
      'Alianzas con comunidades clave: Partnerships con hubs universitarios (CMEI UDP, Dev3pack), aceleradoras y DAOs de desarrolladores.',
    ],
    cards: [
      {
        title: 'En el Escenario',
        subtitle: 'Proyección en pantalla gigante con logo de la plataforma.',
        highlight: 'Alta Visibilidad',
      },
      {
        title: 'Integración Luma',
        subtitle: 'Importación de asistentes y enlace directo en el evento.',
        highlight: '1-Clic Sync',
      },
      {
        title: 'Boca a Boca B2B',
        subtitle: 'Patrocinadores que ven el stand piden el servicio para su propia marca.',
        highlight: 'Inbound Orgánico',
      },
    ],
  },
  {
    slideNumber: 9,
    category: '9. Competition / Ventaja Competitiva',
    title: 'Por Qué Arcade Studio Gana Frente a las Alternativas',
    tagline: 'Ni el desarrollo a medida de $15K ni las encuestas aburridas resuelven la experiencia completa.',
    airbnbComparison: 'Airbnb vs Hotels, Craigslist, Hostels (Comparison Matrix based on affordability and ease of use).',
    keyMetricOrQuote: {
      value: '10x Más Rápido',
      label: 'Despliegue en 2 minutos vs 4 semanas de agencia tradicional',
    },
    bullets: [
      'Frente a Agencias de Software: Cobran $10K-$25K y tardan 4 semanas. Arcade Studio cuesta $199 y se configura en 2 minutos.',
      'Frente a Herramientas de Trivia (Kahoot / Mentimeter): Son solo texto aburrido con pantalla estática, sin marca envolvente ni tótems kiosko.',
      'Frente a Formularios de Check-in (Typeform / Google Sheets): Solo capturan datos fríos sin emoción, sin números de sorteo ni juegos interactivos.',
    ],
    cards: [
      {
        title: 'Agencias Tradicionales',
        subtitle: 'Costo: $15,000 | Tiempo: 4 semanas | Rigidez alta',
        highlight: 'Lento y Caro',
      },
      {
        title: 'Herramientas de Trivia',
        subtitle: 'Costo: $50/mes | Experiencia: Solo texto | Sin kiosko',
        highlight: 'Genérico',
      },
      {
        title: 'Arcade Studio',
        subtitle: 'Costo: $199 | Tiempo: 2 min | Check-in + Sorteo + Web3',
        highlight: 'Líder en Valor',
      },
    ],
  },
  {
    slideNumber: 10,
    category: '10. Secret Sauce / Ventaja Tecnológica (Moat)',
    title: 'Desacoplamiento Modular & Arquitectura Avalanche-Ready',
    tagline: 'El motor no cambia; los eventos se configuran con un archivo JSON inmutable y auditable.',
    airbnbComparison: 'Airbnb: "Ease of use, Profiles, Reviews, Verified Photos, Secret Sauce."',
    keyMetricOrQuote: {
      value: '< 800ms',
      label: 'Finalidad de Avalanche para badges digitales e insignias PoAP sin gas',
    },
    bullets: [
      'Versioned Game Config JSON: El estado completo de marca, reglas, preguntas y premios se serializa en un único archivo JSON portable.',
      'Leaderboards & PoAP con Avalanche: Módulo opcional para emitir insignias digitales de asistencia en Fuji/Subnet sin costos de gas (ERC-4337).',
      'Historial Multi-Evento en JSON: Copia de seguridad completa con asistentes, marcas de tiempo de llegada y actas de sorteo exportables en 1 clic.',
    ],
    callout: 'Arquitectura testeada para soportar miles de partidas concurrentes sin saturar servidores.',
  },
  {
    slideNumber: 11,
    category: '11. Team & Execution / Equipo Fundador',
    title: 'Constructores de Eventos, Gaming Web3 & Comunidad',
    tagline: 'La combinación precisa de experiencia en organización de eventos masivos, arquitectura de software y gamificación.',
    airbnbComparison: 'Airbnb: "Joe Gebbia, Brian Chesky, Nathan Blecharczyk."',
    keyMetricOrQuote: {
      value: '100% Nativo',
      label: 'Diseñado por y para la comunidad de desarrolladores y organizadores de eventos',
    },
    bullets: [
      'Ingeniería & Gaming Runtime: Especialistas en motores 2D web livianos (Canvas/Phaser) y arquitecturas resilientes para conferencias.',
      'Liderazgo Comunitario: Experiencia directa organizando ideatones STEAM, hackathons universitarias y cumbres tecnológicas.',
      'Web3 & Avalanche Skills: Dominio de contratos inteligentes, insignias PoAP y mecánicas descentralizadas basadas en el catálogo de avaxskills.com.',
    ],
  },
  {
    slideNumber: 12,
    category: '12. Vision & Next Milestones / La Visión',
    title: 'El Sistema Operativo de Gamificación para Todos los Eventos',
    tagline: 'Hacia un catálogo de 20+ motores arcade, gabinetes físicos plug-and-play y expansión regional.',
    airbnbComparison: 'Airbnb: "We are raising $500,000 for 12 months of operations to reach 80,000 trips."',
    keyMetricOrQuote: {
      value: '20+ Motores',
      label: 'Meta de catálogo para el próximo trimestre con soporte físico y móvil',
    },
    bullets: [
      'Hito Actual (Completado): MVP funcional con 3 pilotos en Luma, 3 motores 2D jugables, módulo de check-in con tickets y tómbola digital.',
      'Próximo Hito (Q1): Lanzamiento de gabinetes físicos arcade en kits prearmados (Raspberry Pi + botón arcade) para arriendo a stands.',
      'Expansión de Ecosistema: Integración con Avalanche L1 dedicada para torneos multi-evento con micropagos en sub-segundos.',
    ],
    callout: 'Transformando conferencias pasivas en estadios interactivos de marca.',
  },
];
