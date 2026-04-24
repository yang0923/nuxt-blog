<script setup lang="ts">
const props = defineProps<{
	total: number
	pageSize: number
	currentPage: number
}>()

const route = useRoute()
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 核心逻辑：生成带省略号的页码数组
const displayedPages = computed(() => {
	const current = props.currentPage
	const last = totalPages.value
	const delta = 2 // 当前页前后显示的页数
	const range = []
	const rangeWithDots = []
	let l

	for (let i = 1; i <= last; i++) {
		if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
			range.push(i)
		}
	}

	for (const i of range) {
		if (l) {
			if (i - l === 2) {
				rangeWithDots.push(l + 1)
			} else if (i - l !== 1) {
				rangeWithDots.push("...")
			}
		}
		rangeWithDots.push(i)
		l = i
	}
	return rangeWithDots
})
</script>

<template>
	<div v-if="totalPages > 1" class="flex flex-wrap items-center justify-center gap-2.5 mt-16 mb-8">
		<NuxtLink
			:to="{ query: { ...route.query, page: Math.max(1, currentPage - 1) } }"
			class="w-11 h-11 flex items-center justify-center rounded-2xl border transition-all duration-300 bg-brand-card shadow-sm"
			:class="[
				currentPage === 1
					? 'opacity-30 pointer-events-none border-slate-200/50 dark:border-slate-800/50 text-slate-400'
					: 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-500 hover:shadow-primary-500/10',
			]"
		>
			<Icon name="lucide:chevron-left" class="w-5 h-5" />
		</NuxtLink>

		<template v-for="(page, index) in displayedPages" :key="index">
			<NuxtLink
				v-if="typeof page === 'number'"
				:to="{ query: { ...route.query, page } }"
				class="w-11 h-11 flex items-center justify-center rounded-2xl border font-black text-sm transition-all duration-300"
				:class="[
					currentPage === page
						? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/25 scale-110 z-10'
						: 'bg-brand-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500/50 hover:text-primary-500',
				]"
			>
				{{ page }}
			</NuxtLink>

			<span v-else class="w-8 flex items-center justify-center text-slate-400">
				<Icon name="lucide:ellipsis" class="w-4 h-4 opacity-50" />
			</span>
		</template>

		<NuxtLink
			:to="{ query: { ...route.query, page: Math.min(totalPages, currentPage + 1) } }"
			class="w-11 h-11 flex items-center justify-center rounded-2xl border transition-all duration-300 bg-brand-card shadow-sm"
			:class="[
				currentPage === totalPages
					? 'opacity-30 pointer-events-none border-slate-200/50 dark:border-slate-800/50 text-slate-400'
					: 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-500 hover:shadow-primary-500/10',
			]"
		>
			<Icon name="lucide:chevron-right" class="w-5 h-5" />
		</NuxtLink>
	</div>
</template>
