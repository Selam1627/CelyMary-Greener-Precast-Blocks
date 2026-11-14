import type { IncomingMessage } from 'node:http'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv, type Plugin } from 'vite'

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

export default defineConfig({
  plugins: [vue(), tailwindcss(), contactApiInDev()],
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
