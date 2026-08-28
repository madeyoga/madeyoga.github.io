/**
 * Serve a noindex robots.txt on the Cloudflare Workers copy only.
 * GitHub Pages does not run this file; github.io stays indexable.
 */
export default {
  async fetch() {
    const body = [
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n')

    return new Response(body, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  },
}
