import tailwindcss from "@tailwindcss/vite";

console.log('Build timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log('Build locale:', Intl.DateTimeFormat().resolvedOptions().locale)
console.log('Node version:', process.version)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image'
  ],
  site: { 
    url: 'https://madeyoga.github.io', 
    name: 'Made Yoga Mahardika | Portofolio' 
  }, 
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  mdc: {
    highlight: {
      noApiRoute: false
    },
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
        '/'
      ]
    }
  },
  icon: {
    clientBundle: {
      icons: [
        'lucide:sun',
        'lucide:moon',
      ],
    }
  }
})
