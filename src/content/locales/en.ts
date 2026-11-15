// English: the default language and the reference for the other languages.
import type { SiteContent } from '../types.js'

export const en: SiteContent = {
  navigation: {
    skipLink: 'Skip to main content',
    menuLabel: 'Main menu',
    menuButton: 'Menu',
    pages: {
      home: 'Home',
      products: 'Products',
      about: 'About us',
      contact: 'Contact',
    },
  },

  notFound: {
    heading: 'Page not found',
    message: "Sorry, we couldn't find the page you were looking for.",
    homeLink: 'Go to the home page',
  },

  languageSwitcher: {
    label: 'Language',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyShortName: 'CelyMary',
    tagline: 'Low-carbon precast blocks for sustainable buildings.',
    actions: [
      { label: 'Work with us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },

  solution: {
    heading: 'Our solution',
    benefits: [
      {
        title: 'Lower carbon',
        description:
          'Designed to have a much lower carbon footprint than conventional concrete blocks.',
      },
      {
        title: 'Recycled industrial materials',
        description:
          'Made with recycled industrial materials, giving industrial leftovers a second life.',
      },
      {
        title: 'Local production',
        description: 'Designed to be produced locally, close to where they are used.',
      },
    ],
  },

  products: {
    heading: 'Our planned products',
    statusLabel: 'In development',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'Standard building blocks',
        description: 'For building walls in residential and commercial projects.',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'Solar panel ballast blocks',
        description:
          'For holding solar panel mounting systems in place on flat roofs and open ground, without drilling into the roof.',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'Paving blocks',
        description: 'For footpaths, patios, driveways and public spaces.',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'Retaining wall and landscaping blocks',
        description: 'For holding back soil on slopes and shaping gardens, terraces and planters.',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'Kerbs and edging',
        description: 'For finishing the edges of roads, paths, lawns and flower beds.',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'Work with us',
    items: [
      {
        id: 'customers',
        title: 'For customers',
        description:
          'Architects, engineers, builders and developers: talk to us about how our planned lower-carbon blocks could fit your projects.',
      },
      {
        id: 'investors',
        title: 'For investors',
        description:
          'We are an early-stage company developing lower-carbon precast blocks, and we are seeking funding to start research and lab development. Get in touch to start a conversation.',
      },
      {
        id: 'partners',
        title: 'For partners',
        description:
          'We welcome conversations with industrial companies, research institutions and other organisations interested in collaborating on lower-carbon building products.',
      },
    ],
  },

  roadmap: {
    heading: 'Stage and roadmap',
    statement: 'We are an early-stage company, currently at the concept stage.',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'Concept and planning',
        statusLabel: 'Current stage',
      },
      {
        id: 'research-and-lab-development',
        title: 'Research and lab development',
        note: 'Seeking funding to start this phase.',
      },
      {
        id: 'pilot-production',
        title: 'Pilot production',
      },
    ],
  },

  team: {
    heading: 'Team',
    members: [
      {
        name: 'Selam Berhe Beyene',
        role: 'Founder',
        bio: 'PhD researcher in cement-sector decarbonisation at Universidad de Cantabria, developing low-carbon building materials.',
      },
      {
        name: 'Meron Gebreselassie Tadesse',
        role: 'Co-founder',
        bio: 'Brings expertise in project management.',
      },
    ],
  },

  contact: {
    heading: 'Contact us',
    labels: {
      name: 'Name',
      email: 'Email',
      visitorType: 'I am a...',
      product: 'Product of interest (optional)',
      message: 'Message',
    },
    visitorTypes: [
      { id: 'architect', label: 'Architect' },
      { id: 'engineer', label: 'Engineer' },
      { id: 'builder', label: 'Builder' },
      { id: 'real-estate-developer', label: 'Real estate developer' },
      { id: 'investor', label: 'Investor' },
      { id: 'partner', label: 'Partner' },
      { id: 'other', label: 'Other' },
    ],
    visitorTypePrompt: 'Select one',
    productPrompt: 'No specific product',
    submitLabel: 'Send message',
    sendingLabel: 'Sending…',
    successMessage: "Thank you, your message has been sent. We'll get back to you by email.",
    failureMessage:
      'Sorry, your message could not be sent. Please try again in a few minutes, or email us directly.',
    directContactPrefix: 'Or write to us directly at',
    spamTrapLabel: 'Leave this field empty',
    errors: {
      nameRequired: 'Please enter your name.',
      nameTooLong: 'Please keep your name to 100 characters or fewer.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address, for example name@example.com.',
      visitorTypeRequired: 'Please select who you are.',
      messageRequired: 'Please enter a message.',
      messageTooLong: 'Please keep your message to 5,000 characters or fewer.',
    },
  },
}
