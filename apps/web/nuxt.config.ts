import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'referrer', content: 'no-referrer' },
      ],
    },
  },
  experimental: {
    appManifest: false,
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
  },
  modules: [
    '@unocss/nuxt',
    'nuxt-auth-utils',
  ],
  css: [
    '@unocss/reset/tailwind.css',
  ],
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'replace_this_with_a_very_long_random_string_at_least_32_chars',
    },
    qiniu: {
      accessKey: '',
      secretKey: '',
      bucket: '',
      domain: '',
    },
    public: {
      qiniu: {
        bucket: '',
        domain: '',
        region: 'z2',
      },
    },
  },
})
