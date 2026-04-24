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
    // 高亮配置现在在这里
    database: {
      type: 'sqlite',
      // 💡 Nuxt 4 下的正确姿势：
      // 生产环境（Cloudflare）使用内存数据库，绕过文件系统写入和 C++ 编译权限
      // 本地环境则在项目根目录生成一个持久化的 sqlite 文件
      filename: process.env.NODE_ENV === 'production'
        ? ':memory:'
        : './.nuxt/content.cache.sqlite'
    },
    build: {
      markdown: {
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
    // preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false
    }
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
