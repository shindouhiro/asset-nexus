import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'
import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export { desc, eq }

export * from './schema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = process.env.DATABASE_URL || `file:${path.resolve(__dirname, '../sqlite.db')}`

console.log(`[DB] Using database at: ${dbPath}`)

const client = createClient({ url: dbPath })
export const db = drizzle(client, { schema })
