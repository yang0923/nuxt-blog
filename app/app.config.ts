// app.config.ts
export default defineAppConfig({
    // 定义网站信息
    site: {
        title: '余烬拾语',
        description: '拾起代码的光，照亮思想的路。',
        logoIcon: 'lucide:terminal',
    },
    // 定义个人信息
    author: {
        name: '余烬',
        github: 'https://github.com/yang0923',
        email: 'yy1875737985@outlook.com'
    },
    // 定义主题
    themes: [
        { id: 'teal', label: '极客青', color: '#14baaa', icon: 'lucide:terminal' },
        { id: 'orange', label: '活力橙', color: '#f46623', icon: 'lucide:zap' },
        { id: 'purple', label: '暗影紫', color: '#a855f7', icon: 'lucide:cpu' },
        { id: 'blue', label: '赛博蓝', color: '#3b82f6', icon: 'lucide:waves' },
        { id: 'green', label: '森林绿', color: '#22c55e', icon: 'lucide:leaf' },
        { id: 'pink', label: '樱花粉', color: '#f43f5e', icon: 'lucide:flower-2' },
        { id: 'graphite', label: '石墨黑', color: '#334155', icon: 'lucide:pen-tool' },
    ]
})