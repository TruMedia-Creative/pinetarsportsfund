export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  // Return user info (in production, validate token and fetch user)
  return {
    user: {
      id: 'admin-id',
      username: 'admin',
      email: 'admin@pinetarsportsfund.com',
    },
  }
})
