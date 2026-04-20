import { db, imageRegistries, desc, eq } from '@platform/db'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    return await db.select().from(imageRegistries).orderBy(desc(imageRegistries.createdAt))
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (body.id) {
      await db.update(imageRegistries)
        .set({
          name: body.name,
          url: body.url,
          username: body.username,
          password: body.password,
        })
        .where(eq(imageRegistries.id, body.id))
    }
    else {
      await db.insert(imageRegistries).values({
        name: body.name,
        url: body.url,
        username: body.username,
        password: body.password,
      })
    }
    return { success: true }
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    if (query.id) {
      await db.delete(imageRegistries).where(eq(imageRegistries.id, Number(query.id)))
      return { success: true }
    }
  }
})
