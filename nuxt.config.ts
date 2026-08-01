import tailwindcss from "@tailwindcss/vite";

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
    url: 'https://madeyoga.github.io', 
    name: 'Made Yoga Mahardika | Blog' 
  },
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-11-01',
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'id', name: 'Bahasa Indonesia', file: 'id.json' }
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
        '/robots.txt',
        '/sitemap.xml',
        '/blog',
      ],
      crawlLinks: true,
    }
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