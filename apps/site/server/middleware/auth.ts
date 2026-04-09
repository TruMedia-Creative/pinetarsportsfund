import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin') && path !== '/api/admin/auth'

  if (isAdminPage || isAdminApi) {
    const user = await serverSupabaseUser(event)
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
