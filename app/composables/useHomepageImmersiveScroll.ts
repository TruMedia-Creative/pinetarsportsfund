import type { Ref } from 'vue'

let scrollTriggerRegistered = false

export function useHomepageImmersiveScroll(stageRef: Ref<HTMLElement | null>) {
  if (import.meta.server) {
    return
  }

  let cleanup: (() => void) | undefined

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const stage = stageRef.value

    if (!stage) {
      return
    }

    const stageElement = stage

    if (!window.matchMedia('(min-width: 1024px)').matches) {
      return
    }

    let disposed = false
    let initialized = false
    const observer = new IntersectionObserver((entries) => {
      if (disposed || initialized || !entries.some(entry => entry.isIntersecting)) {
        return
      }

      initialized = true
      observer.disconnect()
      void initializeImmersiveScroll()
    }, {
      rootMargin: '320px 0px'
    })

    cleanup = () => {
      disposed = true
      observer.disconnect()
    }

    observer.observe(stageElement)

    async function initializeImmersiveScroll() {
      const [{ gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ])

      if (disposed) {
        return
      }

      const { ScrollTrigger } = scrollTriggerModule

      if (!scrollTriggerRegistered) {
        gsap.registerPlugin(ScrollTrigger)
        scrollTriggerRegistered = true
      }

      const scenes = Array.from(stageElement.querySelectorAll<HTMLElement>('[data-home-scene]'))

      if (!scenes.length) {
        return
      }

      const context = gsap.context(() => {
        const media = gsap.matchMedia()

        media.add('(min-width: 1024px)', () => {
          const atmosphere = stageElement.querySelector<HTMLElement>('.homepage-immersive-atmosphere')
          const orbits = Array.from(stageElement.querySelectorAll<HTMLElement>('[data-home-orbit]'))

          if (atmosphere) {
            gsap.fromTo(
              atmosphere,
              { yPercent: -2, opacity: 0.18 },
              {
                yPercent: 6,
                opacity: 0.28,
                ease: 'none',
                scrollTrigger: {
                  trigger: stageElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            )
          }

          orbits.forEach((orbit, index) => {
            gsap.fromTo(
              orbit,
              {
                yPercent: index % 2 === 0 ? -6 : 6,
                rotate: index % 2 === 0 ? -10 : 10,
                scale: 0.96,
                autoAlpha: 0.44
              },
              {
                yPercent: index % 2 === 0 ? 10 : -10,
                rotate: index % 2 === 0 ? 8 : -8,
                scale: 1.04,
                autoAlpha: 0.78,
                ease: 'none',
                scrollTrigger: {
                  trigger: stageElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            )
          })

          scenes.forEach((scene, index) => {
            const content = scene.querySelector<HTMLElement>('[data-home-scene-content]')
            const accent = scene.querySelector<HTMLElement>('[data-home-scene-accent]')
            const isLastScene = index === scenes.length - 1

            if (!content) {
              return
            }

            const timeline = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: scene,
                start: 'top top+=72',
                end: '+=118%',
                pin: true,
                scrub: 1.15,
                anticipatePin: 1,
                invalidateOnRefresh: true
              }
            })

            timeline.fromTo(
              content,
              { y: 96, autoAlpha: index === 0 ? 0.96 : 0.2, scale: 0.95 },
              { y: 0, autoAlpha: 1, scale: 1, duration: 0.58 },
              0
            )

            if (!isLastScene) {
              timeline.to(
                content,
                { y: -40, autoAlpha: 0.6, scale: 1.015, duration: 0.42 },
                0.58
              )
            }

            if (accent) {
              timeline.fromTo(
                accent,
                {
                  yPercent: 18,
                  autoAlpha: 0.28,
                  rotate: index % 2 === 0 ? -12 : 12,
                  scale: 0.92
                },
                {
                  yPercent: -14,
                  autoAlpha: 0.7,
                  rotate: index % 2 === 0 ? 6 : -6,
                  scale: 1.03,
                  duration: 1
                },
                0
              )
            }
          })
        })

        cleanup = () => {
          disposed = true
          observer.disconnect()
          media.revert()
        }
      }, stageElement)

      const previousCleanup = cleanup
      cleanup = () => {
        disposed = true
        observer.disconnect()
        previousCleanup?.()
        context.revert()
      }
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
