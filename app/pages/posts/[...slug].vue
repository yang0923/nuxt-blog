<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// 1. 获取文章数据
const { data: post, status } = await useAsyncData(`post-${route.path}`, () => {
	return queryCollection("content").path(route.path).first()
}, { server: false })

// 2. 核心逻辑：记忆来源路径，解决筛选状态丢失问题
const backPath = ref("/archive")
if (import.meta.client) {
	const prevRoute = router.options.history.state.back
	if (typeof prevRoute === "string" && prevRoute.includes("/archive")) {
		backPath.value = prevRoute
	}
}

// 3. 滚动状态
const scrollY = ref(0)

if (import.meta.client) {
	const handleScroll = () => {
		scrollY.value = window.scrollY
	}
	window.addEventListener("scroll", handleScroll)
}

// 4. SEO
useSeoMeta({
	title: () => post.value?.title || "载入中...",
	description: () => post.value?.description,
})

// 5. 获取相邻文章
const { data: surround } = await useAsyncData(`surround-${route.path}`, () => {
	return queryCollectionItemSurroundings("content", route.path, {
		fields: ["title", "path", "image", "description"],
	})
}, { server: false })

const isLoading = computed(() => status.value === 'pending')

// 平滑滚动到标题
const scrollToHeading = (id: string) => {
	if (!import.meta.client) return
	const element = document.getElementById(id)
	if (element) {
		const offset = 140
		const elementPosition = element.getBoundingClientRect().top
		const offsetPosition = elementPosition + window.scrollY - offset
		
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		})
	}
}
</script>

<template>
	<div class="max-w-6xl mx-auto px-4">
		<!-- 加载状态 -->
		<div v-if="isLoading" class="py-12">
			<div class="sticky top-16 z-40 -mx-4 px-4 py-3 bg-brand-card border-b border-slate-200/60 dark:border-slate-800/60">
				<div class="flex items-center justify-between max-w-6xl mx-auto">
					<div class="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
					<div class="w-48 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse hidden md:block"></div>
				</div>
			</div>

			<div class="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-12 mt-8 pb-20">
				<article class="min-w-0 space-y-6">
					<header class="mb-10 space-y-4">
						<div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4 animate-pulse"></div>
						<div class="flex gap-6">
							<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
							<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
						</div>
					</header>
					<div class="h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse"></div>
					<div class="space-y-3">
						<div v-for="i in 12" :key="i" class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" :class="i % 3 === 0 ? 'w-3/4' : 'w-full'"></div>
					</div>
				</article>
				<aside class="hidden lg:block space-y-8">
					<div class="space-y-3">
						<div class="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
						<div class="space-y-2">
							<div v-for="i in 5" :key="i" class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
						</div>
					</div>
					<div class="h-px bg-slate-200 dark:bg-slate-800"></div>
					<div class="space-y-3">
						<div class="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
						<div class="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
					</div>
				</aside>
			</div>
		</div>

		<!-- 空状态 -->
		<div v-else-if="status === 'success' && !post" class="py-32 text-center">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500/60 text-xs font-bold tracking-widest uppercase mb-6">
				<Icon name="lucide:terminal" class="w-3 h-3" />
				<span>404 Not Found</span>
			</div>
			<h1 class="text-5xl md:text-7xl font-black text-slate-800 dark:text-white italic tracking-tighter mb-4">
				Article_<span class="text-primary-500">Missing</span>
			</h1>
			<p class="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-md mx-auto">
				您访问的文章节点未找到，可能已被移动或删除。
			</p>
			<NuxtLink 
				to="/archive" 
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/25 hover:scale-105 transition-transform"
			>
				<Icon name="lucide:arrow-left" class="w-4 h-4" />
				返回归档
			</NuxtLink>
		</div>

		<!-- 正常内容 -->
		<template v-else-if="status === 'success' && post">
			<!-- 顶部导航栏 -->
			<div
				class="sticky top-16 z-40 -mx-4 px-4 py-3 transition-all duration-300"
				:class="scrollY > 20 ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-transparent border-b border-transparent'"
			>
				<div class="flex items-center justify-between max-w-6xl mx-auto">
					<NuxtLink :to="backPath" class="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-colors font-bold text-[12px] uppercase tracking-widest group">
						<Icon name="lucide:arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
						Back to Archives
					</NuxtLink>

					<div class="flex items-center gap-3">
						<span class="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] hidden md:block truncate max-w-[300px]">
							{{ post.title }}
						</span>
						<div class="h-[1px] w-6 bg-slate-200 dark:border-slate-800"></div>
					</div>
				</div>
			</div>

			<!-- 主内容区 -->
			<div class="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-12 mt-8 pb-20">
				<article class="min-w-0">
					<header class="mb-10">
						<h1 class="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-6 tracking-tight italic">
							{{ post.title }}
						</h1>

						<div class="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							<span class="flex items-center gap-1.5">
								<Icon name="lucide:calendar" class="w-3 h-3 text-primary-500" />
								{{ post.date }}
							</span>
							<span class="flex items-center gap-1.5">
								<Icon name="lucide:hash" class="w-3 h-3 text-primary-500" />
								{{ post.tags?.[0] }}
							</span>
						</div>
					</header>

					<div v-if="post.image" class="mb-12 rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
						<AppImage :src="post.image" :alt="post.title" />
					</div>

					<ContentRenderer
						:value="post"
						class="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-pre:bg-slate-900/95 prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/5 prose-img:rounded-2xl prose-p:leading-loose prose-p:text-slate-600 dark:prose-p:text-slate-300"
					/>
					
					<div class="mt-16 lg:hidden space-y-8">
						<PostCopyright :post="post" />
						<PostNavigation :surround="surround" />
					</div>
				</article>

				<!-- 右侧 TOC 侧边栏 -->
				<aside class="hidden lg:block">
					<div class="sticky top-32 space-y-10">
						<section>
							<div class="mb-4 flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">
								<Icon name="lucide:list-tree" class="w-3.5 h-3.5" />
								<span>Contents_Map</span>
							</div>

							<nav class="space-y-0.5 border-l border-slate-100 dark:border-slate-800 max-h-[600px] overflow-y-auto">
								<!-- TOC 组件 - 无需传递 activeId -->
								<TOCItem
									v-for="link in post.body?.toc?.links"
									:key="link.id"
									:link="link"
									@click="scrollToHeading"
								/>
								
								<div v-if="!post.body?.toc?.links?.length" class="py-8 text-center">
									<p class="text-[10px] text-slate-400 uppercase tracking-wider">No_Headings_Detected</p>
								</div>
							</nav>
						</section>

						<div class="h-px bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent"></div>

						<section class="space-y-6">
							<PostCopyright :post="post" />
							<PostNavigation :surround="surround" />
						</section>
					</div>
				</aside>
			</div>
		</template>
	</div>
</template>

<style scoped lang="postcss">
:deep(.prose h2) {
	@apply text-2xl font-black mt-14 mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3;
}

:deep(.prose h2::before) {
	content: "";
	@apply w-1 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--color-primary-500),0.4)];
}

/* 锚点偏移 */
:deep(h2),
:deep(h3),
:deep(h4) {
	scroll-margin-top: 140px;
}
</style>