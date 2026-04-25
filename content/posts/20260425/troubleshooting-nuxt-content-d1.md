---
title: 解决 Nuxt Content 部署 Cloudflare 的数据丢失问题
description: 页面能加载但内容时有时无？这里有你需要的答案
date: 2026-04-25
tags:
  - Nuxt
  - Troubleshooting
  - Cloudflare
  - D1
image: /images/20260425/troubleshooting-nuxt-content-d1/core.jpg
---

# 解决 Nuxt Content 部署 Cloudflare 的数据丢失问题

## 问题现象

-   页面能正常加载（HTML 结构完整）
-   博客/内容数据时有时无
-   连续刷新几次，数据随机出现或消失

## 根本原因

多个 Worker 实例 + 内存数据库 = 数据不同步

### 技术细节

1. Cloudflare Workers 是无服务器函数，会根据流量自动扩缩容
2. Nuxt Content 在 Cloudflare 上的默认行为是使用 :memory: 内存数据库
3. 不同 Worker 实例拥有各自独立的内存数据库
4. 请求被分发到不同实例时，可能读到空数据

-   请求 A -> Worker 实例 1（有数据）成功
-   请求 B -> Worker 实例 2（无数据）失败

## 解决方案

### 核心思路

使用 Cloudflare D1 作为所有 Worker 实例共享的持久化数据库。

### 步骤一：检查 nuxt.config.ts

错误配置（会导致问题）：

```ts
content: {
  database: {
    type: 'sqlite',
    filename: ':memory:'
  }
}
```

正确配置：

```ts
content: {
  // 删除 database 配置，让 Nuxt Content 自动处理
  build: {
    markdown: { ... }
  }
},

nitro: {
  preset: 'cloudflare_pages'
}
```

### 步骤二：在 Cloudflare 创建并绑定 D1

1. 创建 D1 数据库（Workers & Pages -> D1 -> Create Database）
2. 在 Pages 项目设置中添加绑定：
   Variable name: DB（必须精确）
   D1 Database: 选择刚创建的数据库

### 步骤三：重新部署

推送代码后等待自动构建。

### 验证成功的标志

构建日志中出现：

```bash
[warn] [@nuxt/content] Deploying to Cloudflare requires using D1 database, switching to D1 database with binding DB.
```

网站连续刷新 20 次以上，内容每次都正常显示。

## 补充：better-sqlite3 相关警告

构建时出现的错误/警告：

```base
Could not locate the bindings file for better-sqlite3
```

原因：pnpm 10+ 默认阻止了原生模块的安装脚本执行

解决方案：在 package.json 中添加：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["better-sqlite3"]
  }
}

```

注意：这只是本地依赖的警告，生产环境实际使用 D1，不影响运行。

## 为什么不用 SQLite 文件？

| 环境 | 是否可行 | 原因 |
| ------ | --------- | ------ |
| 本地开发 | 可行 | 单实例，文件可写 |
| Cloudflare 生产 | 不可行 | 无状态 + 只读文件系统 + 多实例 |

D1 是 Cloudflare 官方推荐的替代方案，专为无服务器环境设计。

## 检查清单

-   [ ] nitro.preset 设置为 'cloudflare_pages'
-   [ ] content.database 配置已删除
-   [ ] D1 数据库已创建
-   [ ] Pages 项目的 D1 binding 名称为 DB
-   [ ] 重新部署后日志显示成功切换到 D1
-   [ ] 连续刷新测试通过

## 参考链接

-   Nuxt Content D1 文档: <https://content.nuxt.com/docs/getting-started>
-   Cloudflare D1 文档: <https://developers.cloudflare.com/d1/>
-   Nuxt deployment to Cloudflare: <https://nuxt.com/deploy/cloudflare>
