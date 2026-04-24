import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        // 1. 原有的文章集合 (Markdown)
        content: defineCollection({
            type: 'page',
            source: 'posts/**/*.md',
            // 关键：在这里定义你的 Front-matter 结构
            schema: z.object({
                title: z.string(),
                description: z.string(),
                date: z.string(), // 如果你 MD 里写的是 "2026-04-23"
                draft: z.boolean().default(false), // 默认不是草稿
                tags: z.array(z.string()).default([]), // 默认没有标签
                image: z.string().optional(), // 可选的封面图
                source: z.string().optional(),  // 文章转载来源
                sourceUrl: z.string().optional(), // 文章转载链接
            })
        }),
        // 2. 新增：连接页集合 (JSON Data)
        links: defineCollection({
            type: 'data',
            source: 'links/**/*.json',
            // 1. 这里的 Schema 定义的是数据库【最终】每一行的结构
            schema: z.object({
                title: z.string(), // 分组标题
                desc: z.string(),  // 分组描述
                order: z.number().default(0), // 分组排序
                items: z.array(z.object({
                    title: z.string(),
                    desc: z.string(),
                    url: z.string(),
                    icon: z.string().optional(),
                    avatar: z.string().optional(),
                    tags: z.array(z.string()).default([]),
                    status: z.enum(['Active', 'Offline', 'Archived', 'Pending', 'Blocked'])
                        .default('Active') // 没写的时候默认 Active
                }))
            }),
        })
    },
})