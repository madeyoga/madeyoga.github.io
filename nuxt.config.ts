import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/html-validator'
  ],
  site: { 
    url: 'https://madeyoga.github.io', 
    name: 'Made Yoga Mahardika | Portofolio' 
  }, 
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-11-01',
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
    define: {
      "__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": true,
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
      }
    }
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
        '/blog/asian-cuisine',
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