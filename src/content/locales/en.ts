// English: the default language and the reference for the other languages.
import type { SiteContent } from '../types.js'

export const en: SiteContent = {
  navigation: {
    skipLink: 'Skip to main content',
    menuLabel: 'Main menu',
    menuButton: 'Menu',
    logoLabel: 'CelyMary logo',
    pages: {
      home: 'Home',
      products: 'Products',
      about: 'About us',
      contact: 'Contact',
    },
  },

  footer: {
    label: 'Footer',
    emailLabel: 'Email:',
    privacyLink: 'Privacy notice',
    copyright: '© 2026 CelyMary Greener Precast Blocks',
  },

  // DRAFT – legal review. The privacy notice must describe only what the
  // site really does; check the code before changing it.
  privacy: {
    heading: 'Privacy notice',
    intro:
      'This notice explains, in plain words, what happens to your personal data when you use this website.',
    emailFallback: 'the company email address',
    sections: [
      {
        id: 'responsible',
        heading: 'Who is responsible',
        paragraphs: [
          'Selam Berhe Beyene, founder of CelyMary Greener Precast Blocks, is responsible for your personal data. You can contact us at {email}.',
        ],
      },
      {
        id: 'data',
        heading: 'What we collect',
        paragraphs: [
          'When you send the contact form, we receive your name, your email address, who you are (for example architect or investor), the product you are interested in if you choose one, your message, and the language you were reading the site in.',
          'The form also runs two automatic spam checks: a hidden field that people leave empty, and the time taken to fill in the form. They are used only to stop spam, and they are not stored or emailed.',
          'This website does not use cookies, analytics or advertising trackers.',
        ],
      },
      {
        id: 'purpose',
        heading: 'Why we use it',
        paragraphs: [
          'We use your details only to read your message and reply to you. We do not use them for marketing, and we do not sell them or pass them on to anyone other than the services listed below.',
        ],
      },
      {
        id: 'legal-basis',
        heading: 'Legal basis',
        paragraphs: [
          'By sending the form, you ask us to reply to you. We use your data on the basis of your consent, given when you send the form (Article 6(1)(a) of the General Data Protection Regulation, GDPR). You can withdraw it at any time by writing to {email}. This does not affect anything we did before.',
        ],
      },
      {
        id: 'processors',
        heading: 'Who processes your data',
        paragraphs: [
          'Vercel hosts this website and runs the small program that sends the contact form. Like any web host, it receives technical data such as your IP address when your browser loads a page. If a message cannot be sent, the program records a technical error report so that we can fix the problem.',
          'Resend delivers the contact form to our inbox as an email.',
          'Google (Gmail) hosts our company inbox, where your message arrives and is kept.',
          'These providers may process data outside the European Union.',
        ],
      },
      {
        id: 'retention',
        heading: 'How long we keep it',
        paragraphs: [
          'We delete your message from our inbox 12 months after our conversation ends. The website itself does not store your message. Resend may keep a record of the email for a limited time, under its own policy.',
        ],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        paragraphs: [
          'You have the right to: see the personal data we hold about you (access); have it corrected (correction); have it deleted (deletion); object to our use of it (objection); ask us to limit how we use it (restriction); and receive it in a common format so you can reuse it (portability).',
          'To use any of these rights, write to {email}. We will answer you by email.',
        ],
      },
      {
        id: 'complaint',
        heading: 'Complaints',
        paragraphs: [
          'If you think we have not handled your data properly, you have the right to complain to the Spanish Data Protection Agency (Agencia Española de Protección de Datos, AEPD): {aepd}.',
        ],
      },
      {
        id: 'language-choice',
        heading: 'Your language choice',
        paragraphs: [
          "When you choose a language, your browser saves that choice on your own device, so the site can show it again next time. It is not sent to us, except that the contact form tells us which language you were reading in. You can remove it by clearing this site's data in your browser.",
        ],
      },
    ],
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
        bio: 'PhD researcher in cement-sector decarbonization at the University of Cantabria.',
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
    privacyNote: 'We use your details only to reply to you. Read our {link}.',
    privacyNoteLink: 'privacy notice',
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
