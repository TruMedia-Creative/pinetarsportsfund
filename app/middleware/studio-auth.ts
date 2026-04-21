export default defineNuxtRouteMiddleware(async () => {
  try {
    const response = import.meta.server
      ? await useRequestFetch()('/api/__studio/auth/status') as { authenticated: boolean }
      : await $fetch<{ authenticated: boolean }>('/api/__studio/auth/status')

    if (!response.authenticated) {
      return navigateTo('/admin')
    }
  } catch {
    return navigateTo('/admin')
  }
})
