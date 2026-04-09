interface User {
  id: string
  username: string
  email?: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ user: User }>('/api/admin/auth', {
        method: 'POST',
        body: { username, password },
      })
      user.value = response.user
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await $fetch('/api/admin/auth/logout', {
        method: 'POST',
      })
      user.value = null
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const response = await $fetch<{ user: User }>('/api/admin/auth/me')
      user.value = response.user
    } catch (error) {
      user.value = null
    }
  }

  onMounted(() => {
    checkAuth()
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}
