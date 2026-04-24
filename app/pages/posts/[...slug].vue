<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// 1. 获取文章数据
const { data: post, status } = await useAsyncData(`post-${route.path}`, () => {
	return queryCollection("content").path(route.path).first()
})

// 2. 核心逻辑：记忆来源路径，解决筛选状态丢失问题
const backPath = ref("/archive")
if (import.meta.client) {
	// 获取浏览器历史记录中的来源，如果有 query 参数（筛选条件），直接记录全路径
	const prevRoute = router.options.history.state.back
	if (typeof prevRoute === "string" && prevRoute.includes("/archive")) {
		backPath.value = prevRoute
	}
}

// 3. 状态追踪：滚动与 TOC 高亮
const scrollY = ref(0)
const activeId = ref("")

if (import.meta.client) {
	window.addEventListener("scroll", () => {
		scrollY.value = window.scrollY
	})

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) activeId.value = entry.target.id
			})
		},
		{ rootMargin: "0px 0px -80% 0px" },
	)

	watch(
		post,
		(newPost) => {
			if (newPost) {
				nextTick(() => {
					document.querySelectorAll("h2, h3").forEach((el) => observer.observe(el))
				})
			}
		},
		{ immediate: true },
	)
}

// 4. SEO
useSeoMeta({
	title: () => post.value?.title || "载入中...",
	description: () => post.value?.description,
})

// --- 5. 获取相邻文章 (上一篇 & 下一篇) ---
const { data: surround } = await useAsyncData(`surround-${route.path}`, () => {
	return queryCollectionItemSurroundings("content", route.path, {
		fields: ["title", "path", "image", "description"],
	})
})
</script>

<template>
	<div class="max-w-6xl mx-auto px-4">
		<template v-if="status === 'success' && post">
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
						<div class="h-[1px] w-6 bg-slate-200 dark:bg-slate-800"></div>
					</div>
				</div>
			</div>

			<div class="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-12 mt-8 pb-20">
				<article class="min-w-0">
					<header class="mb-10">
						<h1 class="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-6 tracking-tight italic">
							{{ post.title }}
						</h1>

						<div class="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							<span class="flex items-center gap-1.5"><Icon name="lucide:calendar" class="w-3 h-3 text-primary-500" />{{ post.date }}</span>
							<span class="flex items-center gap-1.5"><Icon name="lucide:hash" class="w-3 h-3 text-primary-500" />{{ post.tags?.[0] }}</span>
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

				<aside class="hidden lg:block">
					<div class="sticky top-32 space-y-10">
						<section>
							<div class="mb-6 flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">
								<Icon name="lucide:list-tree" class="w-4 h-4" />
								<span>Contents_Map</span>
							</div>

							<nav class="space-y-1 border-l border-slate-100 dark:border-slate-800">
								<div v-for="link in post.body?.toc?.links" :key="link.id" class="relative">
									<a
										:href="`#${link.id}`"
										class="block py-2 pl-4 text-[13px] font-bold transition-all duration-300 border-l-2 -ml-[1px]"
										:class="
											activeId === link.id
												? 'text-primary-500 border-primary-500 bg-primary-500/5 shadow-[inset_4px_0_12px_-4px_rgba(var(--color-primary-500),0.1)]'
												: 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200'
										"
									>
										{{ link.text }}
									</a>
									<div v-if="link.children" class="mt-1 ml-4 space-y-1">
										<a
											v-for="sub in link.children"
											:key="sub.id"
											:href="`#${sub.id}`"
											class="block py-1.5 pl-4 text-[11px] font-medium transition-colors border-l border-transparent"
											:class="activeId === sub.id ? 'text-primary-500 border-primary-500' : 'text-slate-400 hover:text-slate-200'"
										>
											{{ sub.text }}
										</a>
									</div>
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
/* 锚点偏移：Header(64px) + BackBar(48px) + 间距(28px) = 140px */
:deep(h2),
:deep(h3) {
	scroll-margin-top: 140px;
}

:deep(.prose h2) {
	@apply text-2xl font-black mt-14 mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3;
}
:deep(.prose h2::before) {
	content: "";
	@apply w-1 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--color-primary-500),0.4)];
}
</style>
