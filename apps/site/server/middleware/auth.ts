export default defineEventHandler((event) => {
  const path = getRouterParams(event).path || ''

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    const token = getCookie(event, 'auth_token')

    if (!token) {
      return sendRedirect(event, '/login')
    }

    // Verify token (simple check for now, enhance later)
    // TODO: Implement JWT verification
  }
})
