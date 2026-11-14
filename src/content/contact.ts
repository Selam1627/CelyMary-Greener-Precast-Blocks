export interface ContactContent {
  heading: string
  labels: {
    name: string
    email: string
    visitorType: string
    product: string
    message: string
  }
  visitorTypes: readonly string[]
  visitorTypePrompt: string
  productPrompt: string
  submitLabel: string
  /** Replaces the submit label while the message is being sent. */
  sendingLabel: string
  /** Shown after the message has been sent. */
  successMessage: string
  /** Shown when the message could not be sent. */
  failureMessage: string
  /** Followed by the contact address, as a link. */
  directContactPrefix: string
  /**
   * Label of the hidden spam-trap field. Visitors never see it; it only tells
   * anyone who somehow reaches it to leave it empty.
   */
  spamTrapLabel: string
  errors: {
    nameRequired: string
    nameTooLong: string
    emailRequired: string
    emailInvalid: string
    visitorTypeRequired: string
    messageRequired: string
    messageTooLong: string
  }
  email: {
    /** Followed by the visitor's name. */
    subjectPrefix: string
    nameLabel: string
    emailLabel: string
    visitorTypeLabel: string
    productLabel: string
  }
}

export const contact: ContactContent = {
  heading: 'Contact us',
  labels: {
    name: 'Name',
    email: 'Email',
    visitorType: 'I am a...',
    product: 'Product of interest (optional)',
    message: 'Message',
  },
  visitorTypes: [
    'Architect',
    'Engineer',
    'Builder',
    'Real estate developer',
    'Investor',
    'Partner',
    'Other',
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
  email: {
    subjectPrefix: 'Website enquiry from',
    nameLabel: 'Name',
    emailLabel: 'Email',
    visitorTypeLabel: 'Visitor type',
    productLabel: 'Product of interest',
  },
}
