// Spanish translation of en.ts, reviewed by the founder; it must say exactly
// the same as the English.
import type { SiteContent } from '../types.js'

export const es: SiteContent = {
  navigation: {
    skipLink: 'Saltar al contenido principal',
    menuLabel: 'Menú principal',
    menuButton: 'Menú',
    logoLabel: 'Logotipo de CelyMary',
    pages: {
      home: 'Inicio',
      products: 'Productos',
      about: 'Sobre nosotros',
      contact: 'Contacto',
    },
  },

  footer: {
    label: 'Pie de página',
    emailLabel: 'Correo electrónico:',
    privacyLink: 'Aviso de privacidad',
    copyright: '© 2026 CelyMary Greener Precast Blocks',
  },

  // DRAFT – legal review. The privacy notice must describe only what the
  // site really does; check the code before changing it.
  privacy: {
    heading: 'Aviso de privacidad',
    intro:
      'Este aviso explica, con palabras sencillas, qué ocurre con tus datos personales cuando usas este sitio web.',
    emailFallback: 'el correo electrónico de la empresa',
    sections: [
      {
        id: 'responsible',
        heading: 'Responsable del tratamiento',
        paragraphs: [
          'La responsable del tratamiento de tus datos personales es Selam Berhe Beyene, fundadora de CelyMary Greener Precast Blocks. Puedes contactar con nosotros en {email}.',
        ],
      },
      {
        id: 'data',
        heading: 'Qué datos recogemos',
        paragraphs: [
          'Cuando envías el formulario de contacto, recibimos tu nombre, tu dirección de correo electrónico, tu perfil (por ejemplo, arquitecto/a o inversor/a), el producto que te interesa si eliges uno, tu mensaje y el idioma en el que estabas leyendo el sitio.',
          'El formulario también hace dos comprobaciones automáticas contra el spam: un campo oculto que las personas dejan vacío y el tiempo que se tarda en rellenarlo. Solo sirven para frenar el spam; no se guardan ni se envían por correo.',
          'Este sitio web no usa cookies, herramientas de analítica ni rastreadores publicitarios.',
        ],
      },
      {
        id: 'purpose',
        heading: 'Para qué los usamos',
        paragraphs: [
          'Usamos tus datos solo para leer tu mensaje y responderte. No los usamos con fines de marketing, no los vendemos y no los cedemos a nadie, salvo a los servicios que se indican más abajo.',
        ],
      },
      {
        id: 'legal-basis',
        heading: 'Base legal',
        paragraphs: [
          'Al enviar el formulario, nos pides que te respondamos. La base legal es tu consentimiento, que nos das al enviar el formulario (artículo 6.1.a del Reglamento General de Protección de Datos, RGPD). Puedes retirarlo en cualquier momento escribiendo a {email}. Retirarlo no afecta a lo que hayamos hecho antes con tus datos.',
        ],
      },
      {
        id: 'processors',
        heading: 'Quién trata tus datos',
        paragraphs: [
          'Vercel aloja este sitio web y ejecuta el pequeño programa que envía el formulario de contacto. Como cualquier servicio de alojamiento, recibe datos técnicos, como tu dirección IP, cuando tu navegador carga una página. Si un mensaje no se puede enviar, el programa registra un informe técnico del error para que podamos solucionar el problema.',
          'Resend entrega el formulario de contacto en nuestra bandeja de entrada en forma de correo electrónico.',
          'Google (Gmail) aloja la bandeja de entrada de la empresa, donde llega y se guarda tu mensaje.',
          'Estos proveedores pueden tratar datos fuera de la Unión Europea.',
        ],
      },
      {
        id: 'retention',
        heading: 'Cuánto tiempo los guardamos',
        paragraphs: [
          'Eliminamos tu mensaje de nuestra bandeja de entrada 12 meses después de que termine nuestra conversación. El propio sitio web no guarda tu mensaje. Resend puede conservar un registro del correo durante un tiempo limitado, según su propia política.',
        ],
      },
      {
        id: 'rights',
        heading: 'Tus derechos',
        paragraphs: [
          'Tienes derecho a: ver los datos personales que tenemos sobre ti (acceso); pedir que los corrijamos (rectificación); pedir que los borremos (supresión); oponerte a que los usemos (oposición); pedirnos que limitemos su uso (limitación); y recibirlos en un formato de uso común para poder reutilizarlos (portabilidad).',
          'Para ejercer cualquiera de estos derechos, escribe a {email}. Te responderemos por correo electrónico.',
        ],
      },
      {
        id: 'complaint',
        heading: 'Reclamaciones',
        paragraphs: [
          'Si crees que no hemos tratado tus datos correctamente, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD): {aepd}.',
        ],
      },
      {
        id: 'language-choice',
        heading: 'Tu elección de idioma',
        paragraphs: [
          'Cuando eliges un idioma, tu navegador guarda esa elección en tu propio dispositivo, para que el sitio pueda mostrarte ese idioma la próxima vez. No se nos envía; solo el formulario de contacto nos indica en qué idioma estabas leyendo. Puedes borrarla eliminando los datos de este sitio en tu navegador.',
        ],
      },
    ],
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
      { label: 'Colabora con nosotros', href: '/about' },
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
          'Fabricados con materiales industriales reciclados, que dan una segunda vida a los residuos industriales.',
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
          'Para sujetar las estructuras de soporte de paneles solares en cubiertas planas y sobre el terreno, sin perforar la cubierta.',
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
    heading: 'Colabora con nosotros',
    items: [
      {
        id: 'customers',
        title: 'Para clientes',
        description:
          'Arquitectos, ingenieros, constructores y promotores: hablemos de cómo nuestros futuros bloques bajos en carbono podrían encajar en tus proyectos.',
      },
      {
        id: 'investors',
        title: 'Para inversores',
        description:
          'Somos una empresa en fase inicial que desarrolla bloques prefabricados bajos en carbono, y buscamos financiación para iniciar la investigación y el desarrollo en laboratorio. Escríbenos y empecemos a hablar.',
      },
      {
        id: 'partners',
        title: 'Para socios',
        description:
          'Nos encantaría hablar con empresas industriales, centros de investigación y otras organizaciones interesadas en colaborar en productos de construcción bajos en carbono.',
      },
    ],
  },

  roadmap: {
    heading: 'Fase y hoja de ruta',
    statement: 'Somos una empresa en sus inicios, actualmente en fase de concepto.',
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
        role: 'Fundadora',
        bio: 'Investigadora predoctoral en descarbonización del sector del cemento en la Universidad de Cantabria.',
      },
      {
        name: 'Meron Gebreselassie Tadesse',
        role: 'Cofundadora',
        bio: 'Aporta experiencia en gestión de proyectos.',
      },
    ],
  },

  contact: {
    heading: 'Contacta con nosotros',
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
      { id: 'other', label: 'Otro/a' },
    ],
    visitorTypePrompt: 'Selecciona una opción',
    productPrompt: 'Ningún producto en concreto',
    submitLabel: 'Enviar mensaje',
    sendingLabel: 'Enviando…',
    successMessage: 'Gracias. Tu mensaje se ha enviado. Te responderemos por correo electrónico.',
    failureMessage:
      'Lo sentimos, no se ha podido enviar tu mensaje. Vuelve a intentarlo en unos minutos o escríbenos directamente por correo electrónico.',
    directContactPrefix: 'O escríbenos directamente a',
    privacyNote: 'Solo usamos tus datos para responderte. Consulta nuestro {link}.',
    privacyNoteLink: 'aviso de privacidad',
    spamTrapLabel: 'Deja este campo vacío',
    errors: {
      nameRequired: 'Introduce tu nombre.',
      nameTooLong: 'El nombre puede tener 100 caracteres como máximo.',
      emailRequired: 'Introduce tu dirección de correo electrónico.',
      emailInvalid:
        'Introduce una dirección de correo electrónico válida, por ejemplo nombre@example.com.',
      visitorTypeRequired: 'Indica quién eres.',
      messageRequired: 'Escribe un mensaje.',
      messageTooLong: 'El mensaje puede tener 5000 caracteres como máximo.',
    },
  },
}
