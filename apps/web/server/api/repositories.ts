import { db, desc, eq, repositories } from '@platform/db'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    return await db.select().from(repositories).orderBy(desc(repositories.createdAt))
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (body.id) {
      await db.update(repositories)
        .set({
          name: body.name,
          url: body.url,
          type: body.type,
          description: body.description,
        })
        .where(eq(repositories.id, body.id))
    }
    else {
      await db.insert(repositories).values({
        name: body.name,
        url: body.url,
        type: body.type,
        description: body.description,
      })
    }
    return { success: true }
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    if (query.id) {
      await db.delete(repositories).where(eq(repositories.id, Number(query.id)))
      return { success: true }
    }
  }
})
