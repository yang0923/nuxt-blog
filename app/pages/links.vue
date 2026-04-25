<script setup lang="ts">
/**
 * 链接页面 - 路由驱动 + 数据库级筛选版
 */

definePageMeta({
	showInNavbar: true,
	navTitle: "链接",
	order: 3,
	navIcon: "mdi-link-variant",
})

useHead({ title: "链接 / Connect Nodes" })


const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()

// 1. 将筛选状态同步到 URL
const selectedTag = computed({
	get: () => (route.query.tag as string) || "",
	set: (val) => router.push({ query: { ...route.query, tag: val || undefined } }),
})

const searchQuery = computed({
	get: () => (route.query.q as string) || "",
	set: (val) => router.push({ query: { ...route.query, q: val || undefined } }),
})

// 2. 数据库级查询
const { data: processedGroups, status } = await useAsyncData(
	"links-data",
	async () => {
		const sectors = await queryCollection("links")
			.order("order", "ASC") 
			.all()

		const q = searchQuery.value.toLowerCase().trim()
		const tag = selectedTag.value

		return sectors
			.map((sector) => {
				const filteredItems = (sector.items || []).filter((item) => {
					const matchTag = !tag || item.tags?.includes(tag)
					const matchSearch = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tags?.some((t) => t.toLowerCase().includes(q))
					return matchTag && matchSearch
				})

				return {
					...sector,
					items: filteredItems,
				}
			})
			.filter((sector) => {
				return q || tag ? sector.items.length > 0 : true
			})
	},
	{
    server: false,
		watch: [() => route.query.tag, () => route.query.q],
	},
)

// 3. 标签聚合
const { data: allTags } = await useAsyncData("links-tags", async () => {
	const allData = await queryCollection("links").all()
	const tags = new Set<string>()
	allData.forEach((s) => s.items?.forEach((i) => i.tags?.forEach((t) => tags.add(t))))
	return Array.from(tags).sort()
}, { server: false })

const totalNodes = computed(() => {
	return processedGroups.value?.reduce((acc, g) => acc + g.items.length, 0) || 0
})

const resetFilters = () => {
	router.push({ query: {} })
}
</script>

<template>
	<div class="max-w-6xl mx-auto px-4 py-8 lg:py-16">
		<header class="mb-12 border-b border-slate-200/60 dark:border-slate-800/60 pb-8">
			<div class="relative">
				<h1 class="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-3">Connect_<span class="text-primary-500">Nodes</span></h1>
				<p class="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
					<span class="w-2 h-2 bg-primary-500 rounded-full" :class="{ 'animate-pulse': status === 'pending' || status === 'idle' }"></span>
					Active_Nodes: <span class="text-slate-800 dark:text-slate-200 font-black">{{ status === 'pending' ? '...' : totalNodes }}</span>
				</p>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
			<div class="lg:col-span-8 order-2 lg:order-1 flex flex-col">
				
				<div v-if="status === 'pending'" class="flex flex-col gap-12">
					<div v-for="i in 2" :key="i" class="animate-pulse">
						<div class="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6"></div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div v-for="j in 4" :key="j" class="h-24 bg-brand-card border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex gap-4">
								<div class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl shrink-0"></div>
								<div class="flex-1 flex flex-col gap-2">
									<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
									<div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] text-[10px] py-10">
						SYNCING_REMOTE_PROTOCOLS...
					</div>
				</div>

				<template v-else-if="processedGroups && processedGroups.length > 0">
					<LinkSector v-for="group in processedGroups" :key="group.id" v-bind="group" :title="group.title" :desc="group.desc" :items="group.items" />
				</template>

				<div v-else class="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
					<Icon name="lucide:unplug" class="w-16 h-16 text-slate-300 mx-auto mb-6" />
					<h3 class="font-black text-slate-800 dark:text-slate-200 uppercase italic">Zero_Signal_Detected</h3>
					<button @click="resetFilters" class="mt-6 px-6 py-2 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Reboot_Filter</button>
				</div>
			</div>

			<aside class="lg:col-span-4 order-1 lg:order-2">
				<div class="lg:sticky lg:top-24 flex flex-col gap-8">
					<ArchiveFilter
						:all-tags="allTags || []"
						:all-years="[]"
						:selected-tag="selectedTag"
						:selected-year="''"
						:search-query="searchQuery"
						@update:tag="(t) => (selectedTag = t)"
						@update:search="(s) => (searchQuery = s)"
					/>
					
					<div
						class="hidden lg:block p-8 rounded-[2rem] bg-brand-surface border border-slate-200/60 shadow-sm dark:bg-slate-950 dark:border-white/5 dark:shadow-2xl transition-all duration-500 overflow-hidden relative"
					>
						<div class="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/10 blur-3xl rounded-full"></div>

						<h4 class="font-black mb-5 flex items-center gap-2.5 text-xs uppercase tracking-widest italic text-slate-800 dark:text-white">
							<div class="relative flex items-center justify-center">
								<Icon name="lucide:radio" class="w-4 h-4 text-primary-500 animate-pulse z-10" />
								<span class="absolute w-full h-full bg-primary-500/20 rounded-full animate-ping"></span>
							</div>
							SYNC_PROTOCOL
						</h4>

						<p class="text-[12px] leading-relaxed font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
							欢迎提交友链请求。系统通过 <span class="text-primary-600 dark:text-primary-400">自动化脚本</span> 定期检测链路存活。
						</p>

						<a
							:href="`mailto:${appConfig.author.email}?subject=申请友链&body=描述你的站点信息`"
							class="mt-8 flex items-center justify-center gap-3 py-3.5 bg-primary-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-500/25"
						>
							<Icon name="lucide:plus" class="w-4 h-4" />
							Apply_Node
						</a>
					</div>
				</div>
			</aside>
		</div>
	</div>
</template>