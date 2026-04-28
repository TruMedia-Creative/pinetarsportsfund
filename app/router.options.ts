import type { RouterConfig } from '@nuxt/schema'

function getScrollBehavior(): ScrollBehavior {
  if (!import.meta.client) {
    return 'auto'
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function waitForHashTarget(hash: string, attempt: number = 0): Promise<{ el: string, behavior: ScrollBehavior } | { top: number }> {
  if (!import.meta.client) {
    return Promise.resolve({ top: 0 })
  }

  const target = document.querySelector(hash)

  if (target) {
    return Promise.resolve({ el: hash, behavior: getScrollBehavior() })
  }

  if (attempt >= 20) {
    return Promise.resolve({ top: 0 })
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(waitForHashTarget(hash, attempt + 1))
    })
  })
}

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return waitForHashTarget(to.hash)
    }

    return { top: 0 }
  }
}
