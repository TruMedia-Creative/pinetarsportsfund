import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // Site-wide navigation links (Header)
    navigation: defineCollection({
      type: 'data',
      source: 'navigation.yml',
      schema: z.object({
        links: z.array(z.object({ label: z.string(), to: z.string() })),
      }),
    }),

    // Team members (one file per person)
    team: defineCollection({
      type: 'data',
      source: 'team/*.yml',
      schema: z.object({
        name: z.string(),
        role: z.string(),
      }),
    }),

    // Home page copy + data arrays
    homePage: defineCollection({
      type: 'data',
      source: 'pages/home.yml',
      schema: z.object({
        seo: z.object({ title: z.string(), description: z.string() }).optional(),
        title: z.string(),
        description: z.string(),
        hero: z.object({
          headline: z.string(),
          links: z.array(
            z.object({
              label: z.string(),
              to: z.string(),
              color: z.enum(['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']).optional(),
              size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
              variant: z.enum(['link', 'solid', 'outline', 'soft', 'subtle', 'ghost']).optional(),
            }),
          ),
        }),
        terminal: z.object({
          lines: z.array(
            z.object({
              segments: z.array(z.object({ text: z.string(), style: z.string() })),
            }),
          ),
        }),
        logos: z.object({
          title: z.string(),
          items: z.array(z.string()),
        }),
        features: z.object({
          headline: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(
            z.object({ icon: z.string(), title: z.string(), description: z.string() }),
          ),
        }),
        metrics: z.object({
          headline: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(
            z.object({ value: z.string(), label: z.string(), class: z.string().optional() }),
          ),
        }),
        cta: z.object({
          title: z.string(),
          description: z.string(),
          command: z.string(),
          links: z.array(
            z.object({
              label: z.string(),
              to: z.string(),
              color: z.enum(['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']).optional(),
            }),
          ),
        }),
      }),
    }),

    // About page copy
    aboutPage: defineCollection({
      type: 'data',
      source: 'pages/about.yml',
      schema: z.object({
        intro: z.object({
          kicker: z.string(),
          headline: z.string(),
          body: z.string(),
        }),
        pillars: z.array(z.object({ title: z.string(), copy: z.string() })),
        process: z.array(
          z.object({ step: z.number(), label: z.string(), body: z.string() }),
        ),
      }),
    }),

    // Contact page — sidebar channel list
    contactPage: defineCollection({
      type: 'data',
      source: 'pages/contact.yml',
      schema: z.object({
        channels: z.array(
          z.object({
            heading: z.string(),
            content: z.string(),
            isEmail: z.boolean().optional(),
          }),
        ),
      }),
    }),

    // Footer content
    footer: defineCollection({
      type: 'data',
      source: 'site/footer.yml',
      schema: z.object({
        brand: z.object({ name: z.string(), tagline: z.string() }),
        exploreLinks: z.array(z.object({ label: z.string(), to: z.string() })),
        investorRelations: z.object({
          email: z.string(),
          note: z.string(),
          responseTime: z.string(),
        }),
        legalLines: z.array(z.string()),
      }),
    }),
  },
})
