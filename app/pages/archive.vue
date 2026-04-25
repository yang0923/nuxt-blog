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

// 2. 核心查询逻辑：解构出 status 用于判断加载状态
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
	{ watch: [() => route.query] },
)

// 获取全站所有不重复的标签
const { data: allTags } = await useAsyncData("all-tags", async () => {
	const items = await queryCollection("content").all()
	const tags = new Set<string>()
	items.forEach((item) => item.tags?.forEach((t) => tags.add(t)))
	return Array.from(tags)
})

// 获取全站所有不重复的年份
const { data: allYears } = await useAsyncData("all-years", async () => {
	const items = await queryCollection("content").all()
	const years = new Set<string>([])
	items.forEach((item) => {
		if (item.date) {
			const year = new Date(item.date).getFullYear().toString()
			years.add(year)
		}
	})
	return Array.from(years).sort((a, b) => Number(b) - Number(a))
})
</script>

<template>
	<div class="max-w-6xl mx-auto px-4 py-8 lg:py-16">
		<header class="mb-10">
			<div class="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6 gap-4">
				<div class="relative">
					<h1 class="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
						{{ selectedTag ? `# ${selectedTag}` : "文章归档" }}
					</h1>
					<p class="text-slate-400 text-sm font-medium">
						命中 <span class="text-primary-500 font-bold">{{ data?.total || 0 }}</span> 个技术节点
					</p>
				</div>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
			<aside class="lg:col-span-4 order-1 lg:order-2">
				<div class="lg:sticky lg:top-24 flex flex-col gap-8">
					<ArchiveFilter
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

					<div class="hidden lg:block p-6 rounded-3xl bg-primary-500 text-white shadow-xl shadow-primary-500/20">
						<h4 class="font-black mb-2 flex items-center gap-2 text-sm uppercase tracking-tight">
							<Icon name="lucide:zap" class="w-4 h-4" />
							大哥的性能准则
						</h4>
						<p class="text-[11px] text-primary-50/80 leading-relaxed font-medium">每一篇归档都是一次系统的解构。</p>
					</div>
				</div>
			</aside>

			<div class="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-8">
				<div v-if="status === 'pending'" class="flex flex-col gap-6">
					<div v-for="i in 3" :key="i" class="w-full h-48 rounded-3xl bg-brand-card animate-pulse border border-slate-100 dark:border-slate-800 flex flex-col p-6 gap-4">
						<div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
						<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
						<div class="mt-auto flex gap-2">
							<div class="h-6 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full"></div>
							<div class="h-6 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full"></div>
						</div>
					</div>
				</div>

				<div v-else-if="data?.posts.length" class="flex flex-col gap-2">
					<div v-for="(post, index) in data.posts" :key="post.path" class="animate-in fade-in slide-in-from-bottom-4 duration-500" :style="{ transitionDelay: `${index * 50}ms` }">
						<PostCard :post="post" />
					</div>

					<div class="pt-10">
						<Pagination :total="data.total" :page-size="pageSize" :current-page="currentPage" />
					</div>
				</div>

				<div v-else class="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
					<Icon name="lucide:frown" class="w-12 h-12 text-slate-300 mx-auto mb-4" />
					<p class="text-slate-400 font-bold uppercase text-xs tracking-widest">没搜到相关存货</p>
				</div>
			</div>
		</div>
	</div>
</template>