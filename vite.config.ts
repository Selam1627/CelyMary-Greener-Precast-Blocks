import { existsSync, readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { htmlFiles, notFoundPage } from './src/pages.ts'

// File change events from a Windows host don't reach the container, so
// docker-compose.yml sets DEV_WATCH_POLLING=true to make Vite poll instead.
const usePolling = process.env.DEV_WATCH_POLLING === 'true'

/** Turns a Node.js request into a standard Request, like Vercel passes to functions. */
async function toWebRequest(req: IncomingMessage, url: string): Promise<Request> {
  const headers = new Headers()
  for (const [name, value] of Object.entries(req.headers)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) headers.append(name, item)
    }
  }

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

  return new Request(new URL(url, 'http://localhost'), {
    method: req.method,
    headers,
    body: hasBody ? new Uint8Array(Buffer.concat(chunks)) : undefined,
  })
}

/**
 * Development only: answers /api/contact with the same code as the Vercel
 * function (api/contact.ts), so the contact form can be tried locally.
 * Reads RESEND_API_KEY and the other variables from .env.
 */
function contactApiInDev(): Plugin {
  return {
    name: 'contact-api-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          const env = loadEnv(server.config.mode, server.config.root, '')
          const { handleContactRequest } = (await server.ssrLoadModule(
            '/src/server/contactHandler.ts',
          )) as typeof import('./src/server/contactHandler.ts')

          const request = await toWebRequest(req, req.originalUrl ?? '/api/contact')
          const response = await handleContactRequest(request, env)

          res.statusCode = response.status
          response.headers.forEach((value, name) => res.setHeader(name, value))
          res.end(await response.text())
        } catch (error) {
          server.config.logger.error(`/api/contact failed: ${String(error)}`)
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

/**
 * Decides whether a page request has no page to serve: an address with no
 * HTML file in `dir`. Vite has already turned "/products" into
 * "/products.html" when that file exists. Requests for other files (scripts,
 * images) and requests that aren't for a page are left alone.
 */
function isMissingPage(req: IncomingMessage, dir: string): boolean {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false
  if (!req.headers.accept?.includes('text/html')) return false

  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  const file = pathname.endsWith('/')
    ? `${pathname}index.html`
    : pathname.endsWith('.html')
      ? pathname
      : extname(pathname) === ''
        ? `${pathname}.html`
        : null

  return file !== null && !existsSync(join(dir, file))
}

function sendNotFound(res: ServerResponse, html: string) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(html)
}

/**
 * Development and preview only: answers addresses without a page with the
 * site's 404 page and a 404 status, as Vercel does with 404.html.
 */
function notFoundPageLocally(): Plugin {
  return {
    name: 'not-found-page-locally',
    configureServer(server) {
      // Runs after Vite's own page handling, so only unmatched requests get here.
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!isMissingPage(req, server.config.root)) return next()
          const source = readFileSync(join(server.config.root, notFoundPage.file), 'utf8')
          sendNotFound(res, await server.transformIndexHtml(req.url ?? '/', source))
        })
      }
    },
    configurePreviewServer(server) {
      const outDir = join(server.config.root, server.config.build.outDir)
      return () => {
        server.middlewares.use((req, res, next) => {
          if (!isMissingPage(req, outDir)) return next()
          sendNotFound(res, readFileSync(join(outDir, notFoundPage.file), 'utf8'))
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), contactApiInDev(), notFoundPageLocally()],
  // Several real pages, not a single-page app: no fallback to index.html, so
  // unknown addresses stay 404s, as on Vercel.
  appType: 'mpa',
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        htmlFiles.map((file) => [
          file.replace(/\.html$/, ''),
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Listen on all interfaces so the host can reach the container.
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})
