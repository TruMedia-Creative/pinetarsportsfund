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

// ─── Deck section sub-schemas ────────────────────────────────────────────────

const coverSchema = z.object({
  tagline: z.string().optional(),
  heroImageUrl: z.string().optional().editor({ input: 'media' }),
  contactName: z.string().optional(),
  contactTitle: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional()
})

const sectionBase = z.object({
  enabled: z.boolean().default(true)
})

const executiveSummarySchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  tableOfContents: z.array(z.object({
    number: z.number(),
    label: z.string()
  })).optional(),
  returnsTableTitle: z.string().optional(),
  returnsTableRows: z.array(z.object({
    label: z.string(),
    value: z.string(),
    highlight: z.boolean().optional()
  })).optional()
})

const investmentThesisSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  bullets: z.array(z.string()).optional()
})

const opportunitySchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  bullets: z.array(z.string()).optional(),
  imageUrl: z.string().optional().editor({ input: 'media' })
})

const marketSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  metrics: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
})

const projectOverviewSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  images: z.array(z.object({
    url: z.string().editor({ input: 'media' }),
    alt: z.string().optional()
  })).optional()
})

const teamSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  members: z.array(z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string().optional().editor({ input: 'textarea' }),
    imageUrl: z.string().optional().editor({ input: 'media' })
  })).optional()
})

const useOfFundsSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  allocationRows: z.array(z.object({
    category: z.string(),
    amount: z.string()
  })).optional(),
  totalLabel: z.string().optional(),
  totalAmount: z.string().optional(),
  highlights: z.array(z.object({
    title: z.string(),
    body: z.string().editor({ input: 'textarea' })
  })).optional()
})

const returnsSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  timelineItems: z.array(z.object({
    period: z.string(),
    phase: z.string(),
    description: z.string()
  })).optional(),
  keyMetrics: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  exitStrategyTitle: z.string().optional(),
  exitStrategyBody: z.string().optional().editor({ input: 'textarea' })
})

const projectionsSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  rows: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  metrics: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
})

const risksDisclaimerSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  bullets: z.array(z.string()).optional()
})

const closingCtaSchema = sectionBase.extend({
  body: z.string().optional().editor({ input: 'textarea' }),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  contactName: z.string().optional(),
  contactTitle: z.string().optional(),
  contactEmail: z.string().optional()
})

// ─── Collections ─────────────────────────────────────────────────────────────

export const collections = {
  content: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        headline: z.string().optional(),
        links: z.array(createLinkSchema())
      }),
      terminal: z.object({
        lines: z.array(z.object({
          segments: z.array(z.object({
            text: z.string(),
            style: z.string()
          }))
        }))
      }),
      logos: z.object({
        title: z.string().nonempty(),
        items: z.array(z.string())
      }),
      features: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(z.object({
          icon: z.string(),
          title: z.string().nonempty(),
          description: z.string().nonempty()
        }))
      }),
      metrics: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(z.object({
          value: z.string().nonempty(),
          label: z.string().nonempty(),
          class: z.string().nonempty()
        }))
      }),
      cta: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        command: z.string().nonempty(),
        links: z.array(createLinkSchema())
      })
    })
  }),

  decks: defineCollection({
    source: 'decks/*.yml',
    type: 'data',
    schema: z.object({
      // ── Top-level metadata ──
      title: z.string().nonempty(),
      subtitle: z.string().optional(),
      projectName: z.string().nonempty(),
      audienceType: createEnum(['investor', 'lender', 'sponsor', 'municipality', 'internal']),
      published: z.boolean().default(false),
      // ── Sections (named keys, fixed narrative order) ──
      cover: coverSchema.optional(),
      executiveSummary: executiveSummarySchema.optional(),
      investmentThesis: investmentThesisSchema.optional(),
      opportunity: opportunitySchema.optional(),
      market: marketSchema.optional(),
      projectOverview: projectOverviewSchema.optional(),
      team: teamSchema.optional(),
      useOfFunds: useOfFundsSchema.optional(),
      returns: returnsSchema.optional(),
      projections: projectionsSchema.optional(),
      risksDisclaimer: risksDisclaimerSchema.optional(),
      closingCta: closingCtaSchema.optional()
    })
  })
}
