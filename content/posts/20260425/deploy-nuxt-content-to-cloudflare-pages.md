---
title: Nuxt Content 部署到 Cloudflare Pages 完整指南
description: 从零配置到上线，解决数据不同步问题
date: 2026-04-25
tags:
  - Nuxt
  - Cloudflare
  - D1
  - 部署
image: /images/20260425/deploy-nuxt-content-to-cloudflare-pages/core.jpg
---

## Nuxt Content 部署到 Cloudflare Pages 完整指南

本教程将带你一步步将 Nuxt Content 项目部署到 Cloudflare Pages，并解决刷新页面时数据丢失的问题。

### 前置条件

-   Node.js 20+
-   pnpm / npm / yarn
-   Cloudflare 账号（免费即可）
-   Git 仓库（GitHub / GitLab）

### 核心问题说明

在 Cloudflare 的无服务器环境中，传统的 SQLite 文件存储无法跨实例共享数据。直接部署会出现：

-   刷新页面时内容时有时无
-   不同用户看到的数据不一致

解决方案：使用 Cloudflare D1 数据库作为统一数据源。

### 第一步：本地项目配置

#### 1. 安装依赖

```bash
pnpm add @nuxt/content @nuxtjs/tailwindcss @nuxtjs/color-mode @nuxt/icon @nuxt/image @pinia/nuxt pinia
```

#### 2. 配置 nuxt.config.ts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    "@nuxt/image",
    "@pinia/nuxt"
  ],

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['rust', 'python', 'js', 'ts', 'vue', 'bash'],
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          }
        }
      }
    }
  },

  nitro: {
    preset: 'cloudflare_pages',
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
    compatibilityVersion: 4
  }
})

```

#### 3. 配置 package.json 构建脚本

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "postinstall": "nuxt prepare"
  }
}

```

#### 4. 处理 pnpm 原生模块（可选）

如果使用 pnpm 10+，在 package.json 中添加：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["better-sqlite3"]
  }
}

```

### 第二步：Cloudflare 配置

#### 1. 创建 D1 数据库

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages -> D1 SQL Database
3. 点击 Create Database
4. 输入名称（如 nuxt-content-db），点击创建

#### 2. 创建 Pages 项目

1. 进入 Workers & Pages -> Create application -> Pages -> Connect to Git
2. 选择你的仓库
3. 配置构建设置：

```base
Build command: pnpm run build
Output directory: .output/public
Root directory: /

```

1. 点击 Save and Deploy

#### 3. 绑定 D1 数据库

1. 进入 Pages 项目 -> Settings -> Functions
2. 找到 D1 database bindings -> Add binding
3. 填写：
   Variable name: DB（必须精确匹配）
   D1 Database: 选择刚才创建的数据库
4. 点击 Save

#### 4. 禁用冲突功能

在 Cloudflare Dashboard -> 域名 -> Speed -> Optimization：

-   Rocket Loader: 禁用
-   Mirage: 禁用

#### 5. 添加环境变量（可选但推荐）

在 Pages 项目 -> Settings -> Environment variables 添加：

```base
NITRO_PRESET = cloudflare_pages
NODE_VERSION = 24

```

### 第三步：部署验证

#### 1. 触发部署

推送代码到 Git 仓库，Cloudflare 会自动构建部署。

#### 2. 检查构建日志

成功日志应包含：

```base
[warn] [@nuxt/content] Deploying to Cloudflare requires using D1 database, switching to D1 database with binding DB.
[success] [@nuxt/content] Processed X collections and X files

```

#### 3. 访问网站

免费域名：<https://你的项目名.pages.dev>
多次刷新页面，确认数据稳定显示

### 后续维护

#### 添加新文章

```base
content/
  └── posts/
      └── new-post.md

```

推送代码 -> 自动部署 -> D1 自动同步

#### 修改已有文章

直接编辑 .md 文件 -> 推送即可

### 常见问题排查

| 问题 | 解决方案 |
| ----- | --------- |
| 刷新后数据丢失 | 检查 D1 binding 名称是否为 DB |
| 构建时 better-sqlite3 报错 | 添加 pnpm.onlyBuiltDependencies 配置 |
| 访问慢 | 添加 SWR 缓存 |
| 样式丢失 | 检查 CSS 路径，使用 ~/assets/ |

### 完成

你的 Nuxt Content 博客现已稳定运行在 Cloudflare Pages 上，享受全球 CDN 加速和免费的 HTTPS！

免费域名：<https://你的项目名.pages.dev>
