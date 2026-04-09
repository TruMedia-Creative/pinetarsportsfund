import { randomUUID } from 'crypto'
import { z } from 'zod'
import { createAuthToken, getServerAuthConfig, isValidAdminCredentials, setAuthCookie } from '~/server/utils/auth'

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = loginSchema.parse(body)

    if (!isValidAdminCredentials(username, password, event)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    const { adminEmail } = getServerAuthConfig(event)
    const { token, maxAge } = createAuthToken(event, {
      username,
      email: adminEmail,
    })
    setAuthCookie(event, token, maxAge)

    return {
      success: true,
      user: {
        id: randomUUID(),
        username,
        email: adminEmail,
      },
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid login payload',
        data: (error as { flatten: () => unknown }).flatten(),
      })
    }

    if ((error as { statusCode?: number }).statusCode === 401) throw error

    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed',
    })
  }
})
