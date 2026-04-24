---
description: "Use when building or editing Nuxt UI frontend files for this project. Covers the repo's brand language, visual system, semantic color usage, typography, motion, spacing, and component styling."
applyTo:
  - "app/**/*.vue"
  - "app/**/*.ts"
  - "app/assets/css/**"
  - "app.config.ts"
---
# Sippd Frontend Style System

- Treat the visual style as clean product design with a light-first presentation, restrained chrome, and deliberate contrast rather than generic SaaS defaults.
- Preserve the existing typography system: Instrument Sans for interface copy and IBM Plex Mono for labels, eyebrow text, compact metadata, and technical accents.
- Favor semantic Nuxt UI tokens such as `bg-default`, `bg-elevated`, `text-dimmed`, `text-muted`, and `border-default` over raw Tailwind palette classes.
- Keep the primary energy in the blue family and reuse subtle glow, shimmer, or translucent highlight effects sparingly for hero moments and primary actions.
- Use zinc and neutral surfaces for structure; avoid introducing unrelated accent palettes that compete with the current blue-forward brand language.
- Keep rounded corners soft but substantial, typically in the `rounded-xl` to `rounded-2xl` range for major cards, sections, and containers.
- Prefer clear spacing and strong hierarchy over dense layouts. Major sections should feel calm, breathable, and intentionally framed.
- Motion should be purposeful and low-friction: short fades, slight vertical travel, staggered reveals, and shimmer only where it reinforces emphasis.
- Forms, headers, and navigation should feel polished but understated. Avoid heavy borders, noisy shadows, or overly playful styling.
- When customizing `@nuxt/ui` components, prefer semantic theme overrides and `ui` slot overrides that match the existing project tone.
- Preserve responsive behavior explicitly. Mobile layouts should remain clean and readable without cramming controls into tight rows.
- If a new screen needs stronger visual interest, build it with composition, spacing, gradients, and typography before reaching for extra colors.