// DRAFT – awaiting review. Spanish translation of en.ts; it must say exactly
// the same as the English. Remove this note and set draft to false for "es"
// in src/content/languages.ts once the translation has been reviewed.
import type { SiteContent } from '../types.js'

export const es: SiteContent = {
  navigation: {
    skipLink: 'Saltar al contenido principal',
    menuLabel: 'Menú principal',
    menuButton: 'Menú',
    pages: {
      home: 'Inicio',
      products: 'Productos',
      about: 'Sobre nosotros',
      contact: 'Contacto',
    },
  },

  notFound: {
    heading: 'Página no encontrada',
    message: 'Lo sentimos, no hemos encontrado la página que buscabas.',
    homeLink: 'Ir a la página de inicio',
  },

  languageSwitcher: {
    label: 'Idioma',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyShortName: 'CelyMary',
    tagline: 'Bloques prefabricados bajos en carbono para edificios sostenibles.',
    actions: [
      { label: 'Trabaja con nosotros', href: '/about' },
      { label: 'Contacto', href: '/contact' },
    ],
  },

  solution: {
    heading: 'Nuestra solución',
    benefits: [
      {
        title: 'Menos carbono',
        description:
          'Diseñados para tener una huella de carbono mucho menor que los bloques de hormigón convencionales.',
      },
      {
        title: 'Materiales industriales reciclados',
        description:
          'Fabricados con materiales industriales reciclados, que dan una segunda vida a los restos industriales.',
      },
      {
        title: 'Producción local',
        description: 'Diseñados para producirse localmente, cerca de donde se utilizan.',
      },
    ],
  },

  products: {
    heading: 'Nuestros productos previstos',
    statusLabel: 'En desarrollo',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'Bloques de construcción estándar',
        description: 'Para levantar muros en proyectos residenciales y comerciales.',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'Bloques de lastre para paneles solares',
        description:
          'Para sujetar las estructuras de paneles solares en cubiertas planas y terreno abierto, sin perforar la cubierta.',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'Adoquines',
        description: 'Para caminos peatonales, patios, accesos de vehículos y espacios públicos.',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'Bloques para muros de contención y paisajismo',
        description:
          'Para contener la tierra en pendientes y dar forma a jardines, terrazas y jardineras.',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'Bordillos y remates',
        description: 'Para rematar los bordes de calzadas, caminos, céspedes y parterres.',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'Trabaja con nosotros',
    items: [
      {
        id: 'customers',
        title: 'Para clientes',
        description:
          'Arquitectos, ingenieros, constructores y promotores: hablemos de cómo nuestros futuros bloques con menos carbono podrían encajar en tus proyectos.',
      },
      {
        id: 'investors',
        title: 'Para inversores',
        description:
          'Somos una empresa en fase inicial que desarrolla bloques prefabricados con menos carbono, y buscamos financiación para iniciar la investigación y el desarrollo en laboratorio. Ponte en contacto con nosotros para empezar a hablar.',
      },
      {
        id: 'partners',
        title: 'Para socios',
        description:
          'Nos encantará hablar con empresas industriales, centros de investigación y otras organizaciones interesadas en colaborar en productos de construcción con menos carbono.',
      },
    ],
  },

  roadmap: {
    heading: 'Fase y hoja de ruta',
    statement: 'Somos una empresa en fase inicial, actualmente en la fase de concepto.',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'Concepto y planificación',
        statusLabel: 'Fase actual',
      },
      {
        id: 'research-and-lab-development',
        title: 'Investigación y desarrollo en laboratorio',
        note: 'Buscamos financiación para iniciar esta fase.',
      },
      {
        id: 'pilot-production',
        title: 'Producción piloto',
      },
    ],
  },

  team: {
    heading: 'Equipo',
    members: [
      {
        name: 'Selam Berhe Beyene',
        // REVIEW: Spanish job titles are gendered. "Fundador" / "Cofundador"
        // are placeholders; use "Fundadora" / "Cofundadora" where it applies.
        role: 'Fundador',
        bio: 'Investigación doctoral sobre la descarbonización del sector del cemento en la Universidad de Cantabria, desarrollando materiales de construcción bajos en carbono.',
      },
      {
        name: 'Meron Gebreselassie Tadesse',
        role: 'Cofundador',
        bio: 'Aporta experiencia en gestión de proyectos.',
      },
    ],
  },

  contact: {
    heading: 'Contáctanos',
    labels: {
      name: 'Nombre',
      email: 'Correo electrónico',
      visitorType: 'Soy...',
      product: 'Producto de interés (opcional)',
      message: 'Mensaje',
    },
    visitorTypes: [
      { id: 'architect', label: 'Arquitecto/a' },
      { id: 'engineer', label: 'Ingeniero/a' },
      { id: 'builder', label: 'Constructor/a' },
      { id: 'real-estate-developer', label: 'Promotor/a inmobiliario/a' },
      { id: 'investor', label: 'Inversor/a' },
      { id: 'partner', label: 'Socio/a' },
      { id: 'other', label: 'Otro' },
    ],
    visitorTypePrompt: 'Selecciona una opción',
    productPrompt: 'Ningún producto en concreto',
    submitLabel: 'Enviar mensaje',
    sendingLabel: 'Enviando…',
    successMessage: 'Gracias, tu mensaje se ha enviado. Te responderemos por correo electrónico.',
    failureMessage:
      'Lo sentimos, no se ha podido enviar tu mensaje. Vuelve a intentarlo en unos minutos o escríbenos directamente por correo electrónico.',
    directContactPrefix: 'O escríbenos directamente a',
    spamTrapLabel: 'Deja este campo vacío',
    errors: {
      nameRequired: 'Introduce tu nombre.',
      nameTooLong: 'Escribe un nombre de 100 caracteres como máximo.',
      emailRequired: 'Introduce tu dirección de correo electrónico.',
      emailInvalid:
        'Introduce una dirección de correo electrónico válida, por ejemplo nombre@example.com.',
      visitorTypeRequired: 'Indica quién eres.',
      messageRequired: 'Escribe un mensaje.',
      messageTooLong: 'Escribe un mensaje de 5000 caracteres como máximo.',
    },
  },
}
