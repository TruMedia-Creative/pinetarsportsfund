import { getVerifiedAdminUser } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin')
  const isAuthLoginApi = path === '/api/admin/auth'

  if (isAdminPage || (isAdminApi && !isAuthLoginApi)) {
    const user = getVerifiedAdminUser(event)
    if (!user) {
      if (isAdminApi) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Not authenticated',
        })
      }

      return sendRedirect(event, '/login')
    }
  }
})
