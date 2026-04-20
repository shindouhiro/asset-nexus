import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  link: text('link').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const repositories = sqliteTable('repositories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // 'github', 'gitlab', etc.
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const imageRegistries = sqliteTable('image_registries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  username: text('username'),
  password: text('password'), // In production, this should be encrypted
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
