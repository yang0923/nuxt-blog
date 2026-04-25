// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 3000       // 也可以根据需要修改端口
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    "@nuxt/image",
    "@pinia/nuxt"
  ],
  css: ['~/assets/css/main.css'], // 全局 CSS
  content: {
    build: {
      markdown: {
        toc: {
          depth: 4,
        },
        highlight: {
          langs: ['rust', 'python', 'js', 'ts', 'vue', 'bash'],
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
        }
      }
    }
  },
  nitro: {
    preset: 'cloudflare_pages',  // ✅ 关键：指定 Cloudflare Pages 预设
    prerender: {
      autoSubfolderIndex: false
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  future: {
    compatibilityVersion: 4 // 使用最新的兼容性版本
  },
})
