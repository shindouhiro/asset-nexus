import { db, users } from '@platform/db'

export default defineEventHandler(async () => {
  const allUsers = await db.select().from(users).all()
  return {
    users: allUsers,
  }
})
