<script setup lang="ts">
definePageMeta({
	showInNavbar: true,
	navTitle: "首页",
	order: 1,
	navIcon: "lucide:home",
})
useHead({ title: "首页" })

const appConfig = useAppConfig()

// 获取最近的 3 篇文章进行展示 - 加上 server: false 和 loading 状态
const { data: recentPosts, status } = await useAsyncData("recent-posts", () => {
	return queryCollection("content").order("date", "DESC").limit(3).all()
}, { 
	server: false,  // 👈 确保数据在客户端获取
})

const isLoading = computed(() => status.value === 'pending')
</script>

<template>
	<div class="space-y-16 md:space-y-24">
		<!-- Hero Section -->
		<section class="relative py-12 md:py-20 overflow-hidden">
			<div class="relative z-10 text-center space-y-6">
				<div
					class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase animate-pulse"
				>
					<Icon name="lucide:terminal" class="w-4 h-4" />
					<span>Ready to Compile</span>
				</div>

				<h1 class="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
					{{ appConfig.site?.title }}
				</h1>

				<p class="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
					{{ appConfig.site?.description }}
				</p>

				<div class="flex items-center justify-center gap-4 pt-4">
					<NuxtLink to="/archive" class="px-8 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/25 hover:scale-105 transition-transform">
						开始阅读
					</NuxtLink>
					<a
						:href="appConfig.author?.github"
						target="_blank"
						class="px-8 py-3 rounded-xl bg-brand-card border border-primary-500/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-primary-500/5 transition-colors"
					>
						GITHUB
					</a>
				</div>
			</div>

			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-content-primary-500)_0%,transparent_70%)] blur-[120px]"></div>
			</div>
		</section>

		<!-- 最新发布 Section -->
		<section class="space-y-8">
			<div class="flex items-end justify-between border-b border-primary-500/10 pb-4">
				<div>
					<h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">最新发布</h2>
					<p class="text-xs text-primary-500 font-bold uppercase tracking-[0.2em]">Recent Posts</p>
				</div>
				<NuxtLink to="/archive" class="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors">
					查看全部
					<Icon name="lucide:arrow-right" class="group-hover:translate-x-1 transition-transform" />
				</NuxtLink>
			</div>

			<!-- 加载状态 -->
			<div v-if="isLoading" class="grid gap-6 md:grid-cols-3">
				<div v-for="i in 3" :key="i" class="animate-pulse">
					<div class="bg-brand-card border border-primary-500/5 rounded-2xl p-6 space-y-4">
						<div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
						<div class="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
						<div class="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
						<div class="flex gap-2 pt-2">
							<div class="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
							<div class="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- 正常内容 -->
			<div v-else-if="recentPosts && recentPosts.length > 0" class="grid gap-6 md:grid-cols-3">
				<NuxtLink
					v-for="post in recentPosts"
					:key="post.path"
					:to="post.path"
					class="group relative bg-brand-card border border-primary-500/5 rounded-2xl p-6 hover:border-primary-500/20 hover:shadow-lg transition-all duration-300"
				>
					<div class="space-y-4">
						<span class="text-[10px] font-mono text-primary-500/60 uppercase tracking-widest">{{ post.date }}</span>
						<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors line-clamp-2">
							{{ post.title }}
						</h3>
						<p class="text-sm text-slate-500 line-clamp-2 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
							{{ post.description }}
						</p>
						<div class="flex flex-wrap gap-2 pt-2">
							<span v-for="tag in post.tags?.slice(0, 2)" :key="tag" class="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-bold">
								#{{ tag }}
							</span>
						</div>
					</div>
				</NuxtLink>
			</div>

			<!-- 空状态 -->
			<div v-else class="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
				<Icon name="lucide:file-text" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
				<p class="text-slate-400 text-sm font-medium">暂无文章</p>
				<p class="text-xs text-slate-300 mt-1">文章都跑到火星去了😵‍💫</p>
			</div>
		</section>
	</div>
</template>