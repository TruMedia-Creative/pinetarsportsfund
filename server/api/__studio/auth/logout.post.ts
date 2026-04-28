export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event) as Record<string, unknown> & {
    studio?: { auth?: { sessionSecret?: string } }
  }

  const session = await useSession(event, {
    name: 'studio-session',
    password: config.studio?.auth?.sessionSecret ?? '',
    cookie: { path: '/' }
  })

  await session.clear()

  return { ok: true }
})
