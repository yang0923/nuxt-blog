<script setup lang="ts">
const appConfig = useAppConfig()
const isMobileMenuOpen = ref(false)

useHead({
	titleTemplate: (titleChunk) => {
		const baseTitle = appConfig.site?.title || "技术博客"
		return titleChunk ? `${titleChunk} - ${baseTitle}` : baseTitle
	},
})

// 路由改变时自动关闭手机端菜单
const route = useRoute()
watch(
	() => route.fullPath,
	() => {
		isMobileMenuOpen.value = false
	},
)

// 自动获取所有路由，并根据 order 排序
const router = useRouter()
const navItems = computed(() => {
	return router
		.getRoutes()
		.filter((route) => route.meta.showInNavbar)
		.map((route) => ({
			path: route.path,
			title: route.meta.navTitle || route.name,
			icon: (route.meta.navIcon as string) || "carbon:document",
			order: (route.meta.order as number) || 100,
		}))
		.sort((a, b) => a.order - b.order)
})
</script>

<template>
	<div class="flex flex-col min-h-screen bg-brand-surface transition-colors duration-500 font-sans selection:bg-primary-500/30">
		<header class="sticky top-0 z-[60] w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-brand-card/80 backdrop-blur-xl">
			<div class="max-w-7xl mx-auto h-14 md:h-16 px-4 flex items-center justify-between">
				<NuxtLink to="/" class="group flex items-center gap-3">
					<div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-300">
						<Icon :name="appConfig.site.logoIcon" class="w-5 h-5" />
					</div>
					<div class="hidden sm:flex flex-col leading-none">
						<span class="text-base font-black tracking-tighter text-slate-900 dark:text-white uppercase">
							{{ appConfig.site?.title || "CORE" }}
						</span>
						<span class="text-[8px] text-primary-500 font-bold tracking-widest">
							{{ appConfig.site?.description || "A blog" }}
						</span>
					</div>
				</NuxtLink>

				<nav class="hidden md:flex items-center bg-slate-500/5 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
					<NuxtLink v-for="nav in navItems" :key="nav.path" :to="nav.path" class="nav-link" active-class="nav-active">
						<Icon :name="nav.icon" />
						<span>{{ nav.title }}</span>
					</NuxtLink>
				</nav>

				<div class="flex items-center gap-1 md:gap-2">
					<div class="hidden sm:flex items-center gap-1 mr-2 pr-2 border-r border-slate-200 dark:border-slate-800">
						<a :href="appConfig.author?.github" target="_blank" class="icon-btn" title="GitHub">
							<Icon name="mdi:github" class="w-5 h-5" />
						</a>
						<a :href="`mailto:${appConfig.author?.email}`" class="icon-btn" title="Email">
							<Icon name="lucide:mail" class="w-5 h-5" />
						</a>
					</div>

					<ThemeControl />

					<button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex md:!hidden icon-btn ml-1 relative z-[70]" aria-label="Toggle Menu">
						<div class="relative w-5 h-5">
							<Icon
								name="lucide:menu"
								class="absolute inset-0 w-5 h-5 transition-all duration-300"
								:class="isMobileMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'"
							/>
							<Icon
								name="lucide:x"
								class="absolute inset-0 w-5 h-5 transition-all duration-300"
								:class="isMobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'"
							/>
						</div>
					</button>
				</div>
			</div>
		</header>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0 -translate-y-4"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-4"
		>
			<div v-if="isMobileMenuOpen" class="fixed inset-0 z-[55] md:hidden bg-brand-surface/75 backdrop-blur-2xl pt-20 px-6" @click.self="isMobileMenuOpen = false">
				<div class="flex flex-col gap-4 text-center">
					<NuxtLink v-for="nav in navItems" :key="nav.path" :to="nav.path" class="mobile-nav-link">
						<Icon :name="nav.icon" />
						<span>{{ nav.title }}</span>
					</NuxtLink>

					<div class="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
					<div class="flex justify-center gap-6">
						<a :href="appConfig.author?.github" target="_blank" class="flex items-center gap-2 text-slate-500">
							<Icon name="mdi:github" class="w-6 h-6" />
							<span class="font-bold">GitHub</span>
						</a>
						<a :href="`mailto:${appConfig.author?.email}`" class="flex items-center gap-2 text-slate-500">
							<Icon name="lucide:mail" class="w-6 h-6" />
							<span class="font-bold">Email</span>
						</a>
					</div>
				</div>
			</div>
		</Transition>

		<main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
			<slot />
		</main>

		<footer class="w-full border-t border-slate-200 dark:border-slate-800/60 py-8 bg-brand-card/30">
			<div class="max-w-5xl mx-auto px-4 flex flex-col items-center gap-2 text-slate-400 text-xs">
				<p>© 2026 {{ appConfig.author?.name }} · Designed for Performance</p>
			</div>
		</footer>
	</div>
</template>

<style scoped lang="postcss">
/* 大屏导航链接 */
.nav-link {
	@apply px-4 py-1.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-all duration-300 flex items-center gap-2;
}
.nav-active {
	@apply bg-white dark:bg-slate-800 text-primary-500 shadow-sm ring-1 ring-slate-200/50 dark:ring-white/10;
}

/* 移动端导航链接 */
.mobile-nav-link {
	@apply py-3 text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-2;
}

/* 图标按钮通用样式 */
.icon-btn {
	@apply w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-primary-500/10 hover:text-primary-500 transition-all duration-300;
}
</style>
