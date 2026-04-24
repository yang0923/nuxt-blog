import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    // 核心：添加这个插件
    plugins: [
        require('@tailwindcss/typography')
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // 这里定义的 'primary' 之后可以全局用 text-primary, bg-primary
                primary: {
                    50: 'rgb(var(--primary-50) / <alpha-value>)',   // 主色调 (Teal-50)
                    100: 'rgb(var(--primary-100) / <alpha-value>)', // 主色调 (Teal-100)
                    500: 'rgb(var(--primary-500) / <alpha-value>)', // 主色调 (Teal-500)
                    600: 'rgb(var(--primary-600) / <alpha-value>)', // 悬停色
                    700: 'rgb(var(--primary-700) / <alpha-value>)', // 深色文字用
                    900: 'rgb(var(--primary-900) / <alpha-value>)', // 深色文字用
                },
                // 2. 品牌背景语义化 (不再写死黑白)
                brand: {
                    surface: 'rgb(var(--brand-surface) / <alpha-value>)', // 基础背景
                    card: 'rgb(var(--brand-card) / <alpha-value>)',       // 容器/卡片背景
                }
            },
            // 3. Markdown 渲染深度定制
            typography: (theme: any) => ({
                DEFAULT: {
                    css: {
                        // 基础联动
                        '--tw-prose-links': 'rgb(var(--primary-500))',
                        '--tw-prose-bullets': 'rgb(var(--primary-500))',
                        '--tw-prose-quote-borders': 'rgb(var(--primary-500))',

                        // 代码块优化：强制使用变量
                        '--tw-prose-pre-bg': 'rgb(var(--code-bg))',
                        '--tw-prose-pre-code': 'rgb(var(--code-text))',
                        // 这里的 primary-600 在白色背景下对比度才够
                        '--tw-prose-code': 'rgb(var(--primary-600))',

                        a: {
                            textDecoration: 'none',
                            fontWeight: '700',
                            borderBottom: '2px solid transparent',
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: 'rgb(var(--primary-600))',
                                borderBottomColor: 'rgb(var(--primary-500))',
                            },
                        },
                        pre: {
                            backgroundColor: 'rgb(var(--code-bg)) !important', // 强行锁定背景
                            color: 'rgb(var(--code-text)) !important',
                            borderRadius: '1rem', // 稍微圆润一点，更有工业设计感
                            padding: '1.5rem',
                            border: '1px solid rgb(var(--primary-500) / 0.2)', // 提高边框可见度
                            // 亮色模式下的关键：增加一个深色的外阴影，让黑色的代码块从白底中“浮”起来
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)',
                            lineHeight: '1.7',
                            fontSize: '0.9rem',

                            code: {
                                backgroundColor: 'transparent !important',
                                padding: '0 !important',
                                borderWidth: '0',
                                color: 'inherit',
                                fontFamily: 'inherit',
                            }
                        },
                        // 行内代码优化
                        ':not(pre) > code': {
                            backgroundColor: 'rgb(var(--primary-500) / 0.08)', // 降低透明度，让底色更轻盈
                            padding: '0.2rem 0.4rem',
                            borderRadius: '0.4rem',
                            color: 'rgb(var(--primary-600))', // 使用加深的 600 号色
                            fontWeight: '600',
                            letterSpacing: '-0.02em',
                            border: '1px solid rgb(var(--primary-500) / 0.1)', // 给行内代码也加个微边框
                        },
                        'code::before': { content: '""' },
                        'code::after': { content: '""' },
                    },
                },
                // 暗色模式下的微调
                invert: {
                    css: {
                        '--tw-prose-headings': theme('colors.slate.100'),
                        '--tw-prose-body': theme('colors.slate.300'),
                        pre: {
                            // 暗色模式下取消阴影，或者改用主色调阴影
                            boxShadow: '0 0 20px rgb(var(--primary-500) / 0.1)',
                            border: '1px solid rgb(var(--primary-500) / 0.1)',
                        },
                        ':not(pre) > code': {
                            backgroundColor: 'rgb(var(--primary-500) / 0.15)',
                            color: 'rgb(var(--primary-400))', // 暗色模式下 400 更亮，可读性更好
                        },
                    }
                }
            }),
        }
    },
}