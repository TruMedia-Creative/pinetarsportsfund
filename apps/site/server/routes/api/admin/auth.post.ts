import { randomUUID } from 'crypto'
import { executeInsert, runQueryOne } from '~/server/utils/db'

// TODO: Use proper password hashing (bcrypt)
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // Simple authentication (in production, query database and hash password)
    if (username === 'admin' && password === 'password') {
      // Set auth cookie
      setCookie(event, 'auth_token', randomUUID(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return {
        success: true,
        user: {
          id: randomUUID(),
          username: 'admin',
          email: 'admin@pinetarsportsfund.com',
        },
      }
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  } catch (error: any) {
    if (error.statusCode === 401) throw error

    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed',
    })
  }
})
