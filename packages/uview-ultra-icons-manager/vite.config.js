import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { IncomingForm } from 'formidable'
import { simpleGit } from 'simple-git'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const svgDir = path.resolve(rootDir, 'uview-ultra-icons', 'svg')

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'icon-manager-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/icons' && req.method === 'GET') {
            const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'))
            const icons = files.map(file => {
              const name = file.replace('.svg', '')
              const content = fs.readFileSync(path.join(svgDir, file), 'utf-8')
              return { name, content }
            })
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(icons))
          } 
          else if (req.url === '/api/upload' && req.method === 'POST') {
            const form = new IncomingForm()
            form.parse(req, (err, fields, files) => {
              if (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
                return
              }
              const file = files.file[0]
              const name = fields.name[0]
              const targetPath = path.join(svgDir, `${name}.svg`)
              
              fs.copyFileSync(file.filepath, targetPath)
              
              // Trigger build
              try {
                // Return to uview-ultra-icons to build
                execSync('npm run build', { cwd: path.resolve(rootDir, 'uview-ultra-icons') })
                res.end(JSON.stringify({ success: true }))
              } catch (buildErr) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Build failed: ' + buildErr.message }))
              }
            })
          }
          else if (req.url === '/api/sync' && req.method === 'POST') {
            try {
              const git = simpleGit(path.resolve(rootDir, '..')) // Repo root
              await git.pull()
              await git.add(path.join(rootDir, '*'))
              await git.commit('chore: update icons via manager')
              await git.push()
              res.end(JSON.stringify({ success: true }))
            } catch (gitErr) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Git sync failed: ' + gitErr.message }))
            }
          }
          else {
            next()
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
