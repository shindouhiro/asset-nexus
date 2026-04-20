import process from 'node:process'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    password: z.string(),
  }).parse)

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

  if (body.password === adminPassword) {
    await setUserSession(event, {
      user: {
        role: 'admin',
      },
      loggedInAt: new Date(),
    })
    return { success: true }
  }

  throw createError({
    statusCode: 401,
    message: '密码错误',
  })
})
