import { defineCollection, z } from '@nuxt/content'

const createEnum = (options: [string, ...string[]]) => z.enum(options)

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  trailingIcon: z.string().optional().editor({ input: 'icon' }),
  size: createEnum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  trailing: z.boolean().optional(),
  target: createEnum(['_blank', '_self']).optional(),
  color: createEnum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']).optional(),
  variant: createEnum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional()
})

const createCardItemSchema = () => z.object({
  icon: z.string(),
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

export const collections = {
  content: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        eyebrow: z.string().optional(),
        links: z.array(createLinkSchema())
      }),
      marketDemand: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(createCardItemSchema())
      }),
      team: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(createCardItemSchema())
      }),
      faq: z.object({
        title: z.string().nonempty(),
        items: z.array(z.object({
          label: z.string().nonempty(),
          icon: z.string().optional(),
          content: z.string().nonempty()
        }))
      }),
      cta: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        links: z.array(createLinkSchema())
      })
    })
  })
}
