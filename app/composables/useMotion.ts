const FADE_IN_UP = {
  initial: { opacity: 0, y: 16 },
  transition: { duration: 0.6 },
} as const;

const REVEAL_IN_VIEW_OPTIONS = {
  once: true,
  amount: 0.2,
} as const;

export function useMotion() {
  const prefersReducedMotion = usePreferredReducedMotion();

  function enterMotion(delay: number = 0) {
    if (prefersReducedMotion.value === 'reduce') {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0, delay: 0 },
      };
    }

    return {
      initial: FADE_IN_UP.initial,
      animate: { opacity: 1, y: 0 },
      transition: { ...FADE_IN_UP.transition, delay },
    };
  }

  function scrollMotion(delay: number = 0) {
    if (prefersReducedMotion.value === 'reduce') {
      return {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        inViewOptions: REVEAL_IN_VIEW_OPTIONS,
        transition: { duration: 0, delay: 0 },
      };
    }

    return {
      initial: FADE_IN_UP.initial,
      whileInView: { opacity: 1, y: 0 },
      inViewOptions: REVEAL_IN_VIEW_OPTIONS,
      transition: { ...FADE_IN_UP.transition, delay },
    };
  }

  function staggerMotion(index: number = 0) {
    if (prefersReducedMotion.value === 'reduce') {
      return {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        inViewOptions: REVEAL_IN_VIEW_OPTIONS,
        transition: { duration: 0, delay: 0 },
      };
    }

    return {
      initial: FADE_IN_UP.initial,
      whileInView: { opacity: 1, y: 0 },
      inViewOptions: REVEAL_IN_VIEW_OPTIONS,
      transition: { ...FADE_IN_UP.transition, delay: index * 0.08 },
    };
  }

  return { enterMotion, scrollMotion, staggerMotion };
}
