import { coupons, db, desc, eq } from '@platform/db'

export default defineEventHandler(async (event) => {
  try {
    const method = event.method

    if (method === 'GET') {
      const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt))
      // Map numerical ID to string ID to match the expected interface in frontend
      return allCoupons.map(c => ({
        ...c,
        id: c.id.toString(),
      }))
    }

    if (method === 'POST') {
      const body = await readBody(event)
      if (body.id && !Number.isNaN(Number(body.id))) {
        // Update
        await db.update(coupons)
          .set({
            title: body.title,
            image: body.image,
            description: body.description,
            link: body.link,
          })
          .where(eq(coupons.id, Number(body.id)))
      }
      else {
        // Create
        await db.insert(coupons).values({
          title: body.title,
          image: body.image,
          description: body.description,
          link: body.link,
        })
      }
      return { success: true }
    }
  }
  catch (error: any) {
    console.error('[API Error] /api/coupons:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal Server Error',
      stack: error.stack,
    })
  }
})
