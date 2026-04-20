import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: path.resolve(__dirname, 'sqlite.db'),
  },
})


