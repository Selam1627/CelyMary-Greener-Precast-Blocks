/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Company inbox, shown as the direct contact address. Public: bundled into the site. */
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
