<script setup lang="ts">
/**
 * 主题控制组件 - 极致内聚修复版
 * 修复：SSR 水合不一致警告
 * 优化：响应式主题同步逻辑
 */

// 1. 配置与状态初始化
const appConfig = useAppConfig()
const colorMode = useColorMode()
const themes = appConfig.themes || []
const defaultThemeId = themes[0]?.id || "teal"

// 挂载状态锁：用于解决 SSR 与 客户端初始渲染不一致
const isMounted = ref(false)

// 使用 useState 确保 SSR 状态同步
const currentTheme = useState<string>("theme-preference", () => defaultThemeId)

// 2. 核心逻辑：设置主题 (仅更新状态)
const setTheme = (name: string) => {
	if (themes.find((t) => t.id === name)) {
		currentTheme.value = name
		if (import.meta.client) {
			localStorage.setItem("user-theme-pref", name)
		}
	}
}

// 3. 监听主题变化，自动同步到 DOM
watch(
	currentTheme,
	(newVal) => {
		if (import.meta.client) {
			document.documentElement.setAttribute("data-theme", newVal)
		}
	},
	{ immediate: true },
)

// 4. 明暗切换逻辑 (增加挂载保护)
const isDark = computed(() => {
	if (!isMounted.value) return false
	return colorMode.value === "dark"
})

const toggleDark = () => {
	colorMode.preference = isDark.value ? "light" : "dark"
}

// 5. UI 交互逻辑 (下拉菜单)
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
let closeTimer: any = null

const handleOutsideClick = (event: MouseEvent) => {
	if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
		isOpen.value = false
	}
}

const startClose = () => {
	if (!import.meta.client) return
	closeTimer = setTimeout(() => {
		isOpen.value = false
	}, 300)
}

const stopClose = () => {
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
}

// 6. 注入防闪烁脚本 (SSR 阶段执行)
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
				type: "text/javascript",
				tagPosition: "bodyClose",
				key: "theme-init",
			},
		],
	})
}

// 7. 挂载处理
onMounted(() => {
	if (import.meta.client) {
		const saved = localStorage.getItem("user-theme-pref")
		if (saved && saved !== currentTheme.value && themes.find((t) => t.id === saved)) {
			currentTheme.value = saved
		}
		// 激活挂载锁
		isMounted.value = true
	}
	window.addEventListener("click", handleOutsideClick)
})

onUnmounted(() => {
	if (import.meta.client) {
		window.removeEventListener("click", handleOutsideClick)
	}
	stopClose()
})
</script>

<template>
	<div class="flex items-center gap-2 relative" ref="containerRef">
		<button
			@click="toggleDark"
			class="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-surface border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500 hover:ring-4 hover:ring-primary-500/10 transition-all duration-300 active:scale-95 group"
		>
			<div class="relative w-5 h-5 flex items-center justify-center">
				<template v-if="isMounted">
					<Icon name="lucide:sun" class="w-4 h-4 text-amber-500 transition-all duration-500 absolute" :class="isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'" />
					<Icon name="lucide:moon" class="w-4 h-4 text-indigo-400 transition-all duration-500 absolute" :class="isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'" />
				</template>
				<Icon v-else name="lucide:sun" class="w-4 h-4 text-amber-500 opacity-20" />
			</div>
		</button>

		<div class="relative" @mouseenter="stopClose" @mouseleave="startClose">
			<button
				@click="isOpen = !isOpen"
				class="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-surface border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500 hover:ring-4 hover:ring-primary-500/10 transition-all duration-300 active:scale-95"
				:class="{ 'border-primary-500 ring-4 ring-primary-500/10': isOpen }"
				:style="{ color: isMounted ? 'rgb(var(--primary-500))' : 'inherit' }"
			>
				<Icon name="lucide:palette" class="w-4 h-4 transition-transform duration-500" :class="{ 'rotate-180': isMounted && isOpen }" />
			</button>

			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="transform scale-95 opacity-0 -translate-y-2"
				enter-to-class="transform scale-100 opacity-100 translate-y-0"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="transform scale-100 opacity-100 translate-y-0"
				leave-to-class="transform scale-95 opacity-0 -translate-y-2"
			>
				<div
					v-if="isOpen"
					class="absolute right-0 top-full mt-3 p-2 bg-brand-card/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl z-50 flex flex-col gap-1 min-w-[140px]"
				>
					<div class="px-2 py-1.5 mb-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200/50 dark:border-slate-800/50">
						Accent Color
					</div>

					<button
						v-for="t in themes"
						:key="t.id"
						@click="
							() => {
								setTheme(t.id)
								isOpen = false
							}
						"
						class="flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all duration-200 group relative"
						:class="currentTheme === t.id ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-500/10'"
					>
						<span
							class="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-125"
							:style="{ backgroundColor: t.color }"
						></span>
						<span class="text-xs font-bold">{{ t.label }}</span>
						<div v-if="currentTheme === t.id" class="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></div>
					</button>
				</div>
			</Transition>
		</div>
	</div>
</template>
