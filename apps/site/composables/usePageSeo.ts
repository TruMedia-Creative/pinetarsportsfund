type SeoValue = string | null | undefined | (() => string | null | undefined)

type PageSeoOptions = {
  title: SeoValue
  description: SeoValue
  path?: SeoValue
  image?: SeoValue
  type?: 'website' | 'article'
  noindex?: boolean
}

const SITE_NAME = 'Pine Tar Sports Fund'
const DEFAULT_DESCRIPTION =
  'Structured deck workflows for investor raises, sponsorship campaigns, lender packages, and municipality partnerships.'
const DEFAULT_IMAGE = '/pine-tar-og.svg'

const resolveValue = (value: SeoValue) => {
  if (typeof value === 'function') {
    return value() ?? undefined
  }

  return value ?? undefined
}

const toAbsoluteUrl = (siteUrl: string, value: string) => {
  if (/^https?:\/\//.test(value)) {
    return value
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`
  return `${siteUrl}${normalizedPath}`
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

  const title = () => resolveValue(options.title) || SITE_NAME
  const fullTitle = () => {
    const resolvedTitle = title()
    return resolvedTitle === SITE_NAME ? SITE_NAME : `${resolvedTitle} | ${SITE_NAME}`
  }
  const description = () => resolveValue(options.description) || DEFAULT_DESCRIPTION
  const path = () => resolveValue(options.path) || route.path
  const image = () => toAbsoluteUrl(siteUrl, resolveValue(options.image) || DEFAULT_IMAGE)
  const canonicalUrl = () => toAbsoluteUrl(siteUrl, path())

  useSeoMeta({
    title: fullTitle,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: image,
    ogSiteName: SITE_NAME,
    ogType: options.type || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead(() => ({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl(),
      },
    ],
  }))
}
