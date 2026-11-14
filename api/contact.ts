// Vercel function: POST /api/contact sends the contact form to the company inbox.
// The logic lives in src/server/contactHandler.ts so it can be tested and also
// served by the Vite dev server.
import { handleContactRequest } from '../src/server/contactHandler.js'

export default {
  fetch(request: Request): Promise<Response> {
    return handleContactRequest(request, process.env)
  },
}
