// Texts of the email the company receives from the contact form. Always in
// English, whatever language the visitor used, so the inbox stays readable.
// Used only by the server (src/server/).

export const emailTemplate = {
  /** Followed by the visitor's name. */
  subjectPrefix: 'Website enquiry from',
  nameLabel: 'Name',
  emailLabel: 'Email',
  visitorTypeLabel: 'Visitor type',
  productLabel: 'Product of interest',
  languageLabel: 'Language',
} as const
