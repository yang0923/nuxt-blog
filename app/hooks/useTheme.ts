import type { AppConfig } from "nuxt/schema"



export const useTheme = (appConfig: AppConfig) => {
    // 1. 从 app.config.ts 动态获取配置
    const themes = appConfig.themes || []

    // 2. 核心状态：SSR 友好的 useState
    // 默认值优先取配置里的第一个 ID，增强鲁棒性
    const defaultThemeId = themes[0]?.id || 'teal'
    const currentTheme = useState<string>('theme-preference', () => defaultThemeId)

    // 3. 切换逻辑
    const setTheme = (name: string) => {
        // 校验是否存在该主题
        if (!themes.find(t => t.id === name)) return

        currentTheme.value = name
        if (import.meta.client) {
            document.documentElement.setAttribute('data-theme', name)
            localStorage.setItem('user-theme-pref', name)
        }
    }

    // 4. SSR 注入脚本：解决首屏闪烁 (FOUC)
    // 这里脚本里的默认值也从 appConfig 拿
    if (import.meta.server) {
        useHead({
            script: [
                {
                    innerHTML: `(function() {
                        try {
                            var saved = localStorage.getItem('user-theme-pref');
                            var theme = saved || '${defaultThemeId}';
                            document.documentElement.setAttribute('data-theme', theme);
                        } catch (e) {}
                    })()`,
                    type: 'text/javascript'
                }
            ]
        })
    }

    // 5. 客户端初始化
    const initTheme = () => {
        if (import.meta.client) {
            const saved = localStorage.getItem('user-theme-pref') || defaultThemeId
            setTheme(saved)
        }
    }

    return {
        themes,         // 返回配置的主题数组供组件渲染
        currentTheme: readonly(currentTheme),
        setTheme,
        initTheme
    }
}