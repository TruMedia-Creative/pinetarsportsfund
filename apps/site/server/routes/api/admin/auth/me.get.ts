import { requireVerifiedAdminUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireVerifiedAdminUser(event)

  return {
    user: {
      id: user.sub,
      username: user.username,
      email: user.email,
    },
  }
})
