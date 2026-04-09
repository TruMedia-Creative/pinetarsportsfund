import { listPublishedDecks } from '~/server/utils/mockStore'

const staticPaths = [
  '/',
  '/about',
  '/contact',
  '/investments',
]

const escapeXml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

  const investmentPaths = listPublishedDecks()
    .map((deck) => deck.slugForPublic || deck.slug)
    .filter(Boolean)
    .map((slug) => `/investments/${slug}`)

  const urls = [...staticPaths, ...investmentPaths]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'max-age=3600, public',
    },
  })
})