import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync, lstatSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const siteUrl = 'https://madeyoga.github.io'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/html-validator',
    '@nuxtjs/i18n'
  ],
  site: {
    url: siteUrl,
    name: 'Made Yoga Mahardika',
    indexable: true,
  },
  seo: {
    titleSeparator: '|',
  },
  schemaOrg: {
    // nuxt-schema-org's Unhead plugin does not register under the current unhead
    // override (empty <script type="application/ld+json">). JSON-LD is emitted
    // from app/plugins/json-ld.ts instead.
    enabled: false,
  },
  // GitHub Pages has no OG screenshot runtime; use the static 1200x630 file instead.
  ogImage: {
    enabled: false,
  },
  app: {
    head: {
      meta: [
        { property: 'og:image', content: `${siteUrl}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-11-01',
  i18n: {
    baseUrl: siteUrl,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'id', language: 'id', name: 'Bahasa Indonesia', file: 'id.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  sitemap: {
    xsl: false,
    discoverImages: false,
    // One real /sitemap.xml file (not an HTML meta-refresh to /sitemap_index.xml).
    sitemaps: false,
  },
  robots: {
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/AuthEndpoints/sitemap.xml`,
    ],
  },
  routeRules: {
    '/about': { redirect: { to: '/services', statusCode: 301 } },
    '/about/': { redirect: { to: '/services', statusCode: 301 } },
    '/id/about': { redirect: { to: '/id/services', statusCode: 301 } },
    '/id/about/': { redirect: { to: '/id/services', statusCode: 301 } },
  },
  experimental: {
    prerenderErrorPages: true,
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai',
          },
          langs: [
            'php',
            'python',
            'c',
            'cpp',
            'csharp',
            'java',
            'javascript',
          ]
        },
      }
    }
  },
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@unhead/schema-org/vue',
      ]
    }
  },
  mdc: {
    components: {
      prose: true,
      map: {
        h2: 'MyProseH2',
        h3: 'MyProseH3',
        p: 'MyProseP',
        li: 'MyProseLi',
        ul: 'MyProseUl',
        pre: 'MyProsePre',
      }
    }
  },
  ui: {
    prose: true
  },
  components: [
    '~/components',
    {
      path: '~/components/prose',
      global: true,
    },
  ],
  nitro: {
    prerender: {
      routes: [
        '/',
        '/id',
        '/robots.txt',
        '/sitemap.xml',
        '/blog',
        '/id/blog',
        '/blog/5-years-of-django-pros-and-cons',
        '/id/blog/5-years-of-django-pros-and-cons',
        '/projects/prima',
        '/id/projects/prima',
        '/about',
        '/id/about',
      ],
      crawlLinks: true,
    }
  },
  hooks: {
    close() {
      // If i18n still emitted a sitemap index, make /sitemap.xml a real XML file
      // instead of the HTML meta-refresh directory GitHub Pages would serve.
      const pub = join(process.cwd(), '.output/public')
      const sitemapPath = join(pub, 'sitemap.xml')
      const indexPath = join(pub, 'sitemap_index.xml')
      if (!existsSync(pub)) return
      if (existsSync(sitemapPath) && lstatSync(sitemapPath).isDirectory()) {
        rmSync(sitemapPath, { recursive: true, force: true })
      }
      if (existsSync(indexPath) && (!existsSync(sitemapPath) || lstatSync(sitemapPath).isDirectory())) {
        if (existsSync(sitemapPath) && lstatSync(sitemapPath).isDirectory()) {
          rmSync(sitemapPath, { recursive: true, force: true })
        }
        copyFileSync(indexPath, sitemapPath)
      }

      const notFoundPath = join(pub, '404.html')
      if (existsSync(notFoundPath)) {
        let html = readFileSync(notFoundPath, 'utf8')
        html = html.replace('<html>', '<html lang="en">')
        if (!/<title[\s>]/i.test(html)) {
          html = html.replace('</head>', '<title>Page not found · Made Yoga Mahardika</title></head>')
        }
        html = html.replace(
          '<div id="__nuxt" class="isolate"></div>',
          `<div id="__nuxt" class="isolate"><div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x"><div class="px-4 sm:px-6 pt-18"><main class="py-24 text-center"><p class="text-primary font-semibold text-sm tracking-widest uppercase mb-4">404</p><h1 class="text-3xl sm:text-4xl font-bold mb-4">Page not found</h1><p class="text-muted text-[15px] mb-8">That URL is not on this site.</p><p><a href="/" class="text-primary font-medium">Back to home</a></p></main></div></div></div>`
        )
        writeFileSync(notFoundPath, html)
      }
    },
  },
  icon: {
    clientBundle: {
      scan: true,
      icons: [
        'lucide:sun',
        'lucide:moon',
        'lucide:arrow-left',
        'lucide:arrow-right',
        'lucide:check',
        'lucide:external-link',
        'lucide:globe',
        'lucide:smartphone',
        'lucide:flame',
        'lucide:list',
        'lucide:chevron-down',
        'lucide:mail',
        'lucide:search',
        'lucide:settings',
        'lucide:palette',
        'lucide:lightbulb',
        'lucide:pencil',
        'lucide:code',
        'lucide:rocket',
        'lucide:wrench',
        'lucide:shield-check',
        'lucide:arrow-right',

        'simple-icons:github',
        'simple-icons:csharp',
        'simple-icons:vuedotjs',
        'simple-icons:nuxt',
        'simple-icons:tailwindcss',
        'simple-icons:django',
        'simple-icons:alpinedotjs',
        'simple-icons:youtube',
        'simple-icons:github',
        'simple-icons:linkedin',
        'simple-icons:tiktok',
        'simple-icons:dotnet',
        'simple-icons:nuget',
        'simple-icons:typescript',
        'simple-icons:postgresql',
        'lucide:book-open',


        'vscode-icons:file-type-django',
        'vscode-icons:file-type-python',
        'vscode-icons:file-type-vue',
        'vscode-icons:file-type-nuxt',
        'vscode-icons:file-type-html',
        'vscode-icons:file-type-css2',
        'vscode-icons:file-type-js-official',
        'vscode-icons:file-type-tailwind',
      ],
    }
  }
})
