import { constants } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

/**
 * Serves a built Storybook from `staticDir` on 127.0.0.1:`port` and resolves
 * with the server once it listens.
 */
export function startServer({ staticDir, port }) {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      // req.url is optional in Node's IncomingMessage; a malformed request
      // would make URL parsing throw.
      if (!req.url) {
        res.writeHead(400)
        res.end('Bad request')
        return
      }
      const url = new URL(req.url, `http://127.0.0.1:${port}`)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(staticDir, pathname)

      // Keep every request inside staticDir: compare against the directory
      // with a trailing separator, not just a string prefix.
      const dir = staticDir + sep
      if (!filePath.startsWith(dir) && filePath !== staticDir) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      try {
        await access(filePath, constants.R_OK)
        const data = await readFile(filePath)
        const ext = extname(filePath).toLowerCase()
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        })
        res.end(data)
      } catch {
        // Fall back to index.html only for routes without a known file
        // extension, so a missing JS, CSS or font asset is a 404 and a broken
        // build is not masked.
        const ext = extname(filePath).toLowerCase()
        if (ext && MIME_TYPES[ext]) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        try {
          const data = await readFile(resolve(staticDir, 'index.html'))
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(data)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })

    server.listen(port, '127.0.0.1', () => resolvePromise(server))
    server.on('error', reject)
  })
}
