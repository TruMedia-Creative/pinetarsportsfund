export default defineAppConfig({
  ui: {
    colors: {
      primary: 'theme-primary',
      secondary: 'theme-secondary',
      info: 'theme-accent',
      success: 'dark-teal',
      warning: 'theme-primary',
      neutral: 'theme-neutral'
    },
    button: {
      slots: {
        base: 'font-semibold transition-all duration-200'
      },
      variants: {
        size: {
          xs: {
            base: 'px-3'
          },
          sm: {
            base: 'px-4'
          },
          md: {
            base: 'px-4'
          },
          lg: {
            base: 'px-5'
          },
          xl: {
            base: 'px-6'
          }
        }
      },
      compoundVariants: [{
        color: 'primary' as const,
        variant: 'solid' as const,
        class: 'hover:bg-primary active:bg-primary shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0'
      }]
    }
  }
})
