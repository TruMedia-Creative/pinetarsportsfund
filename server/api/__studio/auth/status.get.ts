export default defineEventHandler(async (event) => {
  try {
    // Read the nuxt-studio session using the same config the module uses internally
    const config = useRuntimeConfig(event) as Record<string, unknown> & {
      studio?: { auth?: { sessionSecret?: string } }
    }
    const session = await useSession(event, {
      name: 'studio-session',
      password: config.studio?.auth?.sessionSecret ?? '',
      cookie: { path: '/' }
    })

    return {
      authenticated: Boolean((session.data as Record<string, unknown>)?.user)
    }
  } catch {
    return {
      authenticated: false
    }
  }
})
