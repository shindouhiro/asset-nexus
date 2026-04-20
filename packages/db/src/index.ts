import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { desc, eq } from 'drizzle-orm'
import * as schema from './schema.js'

export { desc, eq }

export * from './schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.resolve(__dirname, '../sqlite.db')


const client = createClient({ url: `file:${dbPath}` })
export const db = drizzle(client, { schema })

