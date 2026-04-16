import { createError, readBody } from 'h3'

/**
 * POST /api/__studio/auth/login
 *
 * Validates admin credentials from the request body against env vars and sets
 * the Nuxt Studio session so the editor overlay activates on the next page load.
 *
 * Required env vars (set on Vercel):
 *   NUXT_ADMIN_USERNAME — e.g. "admin"
 *   NUXT_ADMIN_PASSWORD — plain-text password (use a strong, unique value)
 *   STUDIO_GITHUB_TOKEN — GitHub PAT with repo write access (used by Studio to push commits)
 */
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username: string, password: string }>(event)

  const config = useRuntimeConfig(event)
  // Nuxt auto-maps NUXT_ADMIN_USERNAME and NUXT_ADMIN_PASSWORD env vars
  // into runtimeConfig at runtime.
  const expectedUser = config.adminUsername as string | undefined
  const expectedPass = config.adminPassword as string | undefined

  if (!expectedUser || !expectedPass) {
    throw createError({
      statusCode: 500,
      message: 'Admin credentials are not configured on the server.'
    })
  }

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username and password are required.'
    })
  }

  // Simple constant-length comparison to mitigate basic timing attacks.
  // For a single-user admin form this is sufficient.
  const userMatch = constantTimeEqual(username, expectedUser)
  const passMatch = constantTimeEqual(password, expectedPass)

  if (!userMatch || !passMatch) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password.'
    })
  }

  // setStudioUserSession is auto-imported by the nuxt-studio module.
  // It reads the repository provider from runtimeConfig and the git access
  // token from STUDIO_GITHUB_TOKEN, then sets the signed session cookie.
  await setStudioUserSession(event, {
    name: expectedUser,
    email: `${expectedUser}@pinetarsportsfund.com`
  })

  return { ok: true }
})

/**
 * Constant-time string comparison (prevents basic timing side-channels).
 * Works without Node.js-specific APIs so Nitro can run this on any platform.
 * Always iterates over the longer string to avoid leaking length information.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length)
  let result = a.length ^ b.length // non-zero if lengths differ
  for (let i = 0; i < len; i++) {
    result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return result === 0
}
