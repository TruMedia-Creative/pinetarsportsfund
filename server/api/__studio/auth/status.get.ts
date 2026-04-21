export default defineEventHandler(async (event) => {
  try {
    const session = await getStudioUserSession(event)

    return {
      authenticated: Boolean(session)
    }
  } catch {
    return {
      authenticated: false
    }
  }
})
