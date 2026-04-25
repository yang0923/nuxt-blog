<script setup lang="ts">
definePageMeta({
	showInNavbar: true,
	navTitle: "归档",
	order: 2,
	navIcon: "mdi-archive",
})
useHead({
	title: "归档",
})
const route = useRoute()

// 1. 定义响应式的筛选参数
const currentPage = computed(() => Number(route.query.page) || 1)
const selectedTag = computed(() => (route.query.tag as string) || "")
const pageSize = 5 // 每页显示数量
const selectedYear = computed(() => (route.query.year as string) || "")
const searchQuery = ref((route.query.q as string) || "")

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
	return !!(selectedTag.value || selectedYear.value || searchQuery.value)
})

// 监听搜索和标签变化，重置页码并更新路由
const updateFilters = (newTag?: string, newSearch?: string, newYear?: string) => {
	const query: any = { page: 1 }
	const tag = newTag !== undefined ? newTag : selectedTag.value
	if (tag) query.tag = tag

	const q = newSearch !== undefined ? newSearch : searchQuery.value
	if (q) query.q = q

	const year = newYear !== undefined ? newYear : selectedYear.value
	if (year) query.year = year

	navigateTo({ path: route.path, query })
}

// 清除所有筛选条件
const clearAllFilters = () => {
	searchQuery.value = ""
	navigateTo({ path: route.path, query: { page: 1 } })
}

// 2. 核心查询逻辑
const { data, status } = await useAsyncData(
	`posts-${selectedTag.value}-${selectedYear.value}-${searchQuery.value}-${currentPage.value}`,
	async () => {
		let query = queryCollection("content")

		if (selectedTag.value) {
			query = query.where("tags", "LIKE", `%${selectedTag.value}%`)
		}

		if (selectedYear.value) {
			query = query.where("date", "LIKE", `${selectedYear.value}%`)
		}

		if (searchQuery.value) {
			query = query.where("title", "LIKE", `%${searchQuery.value}%`)
		}

		const allItems = await query.all()
		const total = allItems.length
		const posts = await query
			.order("date", "DESC")
			.skip((currentPage.value - 1) * pageSize)
			.limit(pageSize)
			.all()

		return { posts, total }
	},
	{ 
		watch: [() => route.query],
		server: false
	}, 
)

// 获取全站所有不重复的标签
const { data: allTags, status: tagsStatus } = await useAsyncData("all-tags", async () => {
	const items = await queryCollection("content").all()
	const tags = new Set<string>()
	items.forEach((item) => item.tags?.forEach((t) => tags.add(t)))
	return Array.from(tags).sort()
}, { server: false })

// 获取全站所有不重复的年份
const { data: allYears, status: yearsStatus } = await useAsyncData("all-years", async () => {
	const items = await queryCollection("content").all()
	const years = new Set<string>()
	items.forEach((item) => {
		if (item.date) {
			const year = new Date(item.date).getFullYear().toString()
			years.add(year)
		}
	})
	return Array.from(years).sort((a, b) => Number(b) - Number(a))
}, { server: false })

const isLoading = computed(() => status.value === 'pending')
const isSidebarLoading = computed(() => tagsStatus.value === 'pending' || yearsStatus.value === 'pending')
</script>

<template>
	<div class="max-w-6xl mx-auto px-4 py-8 lg:py-16">
		<header class="mb-10">
			<div class="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6 gap-4">
				<div class="relative">
					<h1 class="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
						{{ selectedTag ? `# ${selectedTag}` : selectedYear ? `${selectedYear} 年` : "文章归档" }}
					</h1>
					<p class="text-slate-400 text-sm font-medium">
						<span v-if="isLoading" class="inline-flex items-center gap-1">
							<Icon name="lucide:loader-2" class="w-3 h-3 animate-spin" />
							检索中...
						</span>
						<span v-else>
							命中 <span class="text-primary-500 font-bold">{{ data?.total || 0 }}</span> 个技术节点
						</span>
					</p>
				</div>
				
				<!-- 清除筛选按钮 -->
				<button
					v-if="hasActiveFilters"
					@click="clearAllFilters"
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
				>
					<Icon name="lucide:x" class="w-3 h-3" />
					清除筛选
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
			<!-- 侧边栏 - 筛选组件 -->
			<aside class="lg:col-span-4 order-1 lg:order-2">
				<div class="lg:sticky lg:top-24 flex flex-col gap-8">
					<!-- 筛选器加载状态 -->
					<div v-if="isSidebarLoading" class="bg-brand-surface border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 animate-pulse">
						<div class="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
						<div class="flex flex-wrap gap-2">
							<div v-for="i in 6" :key="i" class="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
						</div>
						<div class="h-px bg-slate-200 dark:bg-slate-800 my-6"></div>
						<div class="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
						<div class="flex flex-wrap gap-2">
							<div v-for="i in 4" :key="i" class="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
						</div>
					</div>

					<ArchiveFilter
						v-else
						:all-tags="allTags || []"
						:selected-tag="selectedTag"
						:all-years="allYears || []"
						:selected-year="selectedYear"
						:search-query="searchQuery"
						@update:tag="(t) => updateFilters(t, searchQuery)"
						@update:search="
							(s) => {
								searchQuery = s
								updateFilters(selectedTag, s)
							}
						"
						@update:year="
							(y) => {
								updateFilters(selectedTag, searchQuery, y)
							}
						"
					/>

					<!-- 优化后的性能准则卡片 -->
					<div class="hidden lg:block p-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/20">
						<div class="flex items-start gap-3">
							<div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
								<Icon name="lucide:zap" class="w-5 h-5" />
							</div>
							<div>
								<h4 class="font-black mb-1 text-sm uppercase tracking-tight">大哥的性能准则</h4>
								<p class="text-[11px] text-white/80 leading-relaxed">每一篇归档都是一次系统的解构。</p>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<!-- 主内容区 - 文章列表 -->
			<div class="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-8">
				<!-- 加载状态 - 骨架屏 -->
				<div v-if="isLoading" class="flex flex-col gap-6">
					<div v-for="i in 3" :key="i" class="w-full rounded-3xl bg-brand-card border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-pulse">
						<div class="flex items-center gap-2">
							<div class="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
							<div class="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
						</div>
						<div class="h-7 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
						<div class="space-y-2">
							<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
							<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
						</div>
						<div class="flex gap-2 pt-2">
							<div class="h-6 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full"></div>
							<div class="h-6 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full"></div>
						</div>
					</div>
				</div>

				<!-- 有数据 - 文章列表 -->
				<div v-else-if="data?.posts.length" class="flex flex-col gap-6">
					<div 
						v-for="(post, index) in data.posts" 
						:key="post.path" 
						class="animate-in fade-in slide-in-from-bottom-4 duration-500 opacity-0 [animation-fill-mode:forwards]"
						:style="{ animationDelay: `${index * 80}ms` }"
					>
						<PostCard :post="post" />
					</div>

					<!-- 分页组件 -->
					<div class="pt-8 pb-4">
						<Pagination 
							:total="data.total" 
							:page-size="pageSize" 
							:current-page="currentPage" 
						/>
					</div>
				</div>

				<!-- 空状态 - 增强版 -->
				<div v-else class="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
					<div class="flex flex-col items-center gap-3">
						<div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
							<Icon name="lucide:inbox" class="w-8 h-8 text-slate-400" />
						</div>
						<h3 class="font-bold text-slate-700 dark:text-slate-300 text-lg">没搜到相关存货</h3>
						<p class="text-slate-400 text-sm max-w-xs">
							{{ hasActiveFilters ? '试试调整筛选条件或清除所有筛选' : '还没有发布任何文章，快去写一篇吧！' }}
						</p>
						<button
							v-if="hasActiveFilters"
							@click="clearAllFilters"
							class="mt-4 px-5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
						>
							清除所有筛选
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 淡入动画 */
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-in {
	animation: fade-in 0.4s ease-out forwards;
}
</style>