// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', href: '/img/favicon_hum.png' }],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'Softlab',
      meta: [
        { name: 'description', content: 'Softlab' }
      ],
      htmlAttrs: {
        lang: 'ko'
      }
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '@/assets/css/setup.css',
    '@/assets/css/layout.css',
    '@/assets/css/style.css',
    'vuetify/lib/styles/main.sass', 
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  devServer: {
    port: 5000
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate']
      }
    ]
  ],
  imports: {
    dirs: ['stores']
  },
  nitro: {
    preset: 'node'
  },
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
