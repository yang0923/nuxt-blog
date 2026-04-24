<script setup lang="ts">
const props = defineProps<{
	allTags: string[]
	allYears: string[]
	selectedTag: string
	selectedYear: string
	searchQuery: string
}>()

const emit = defineEmits(["update:tag", "update:search", "update:year"])

// 格式化年份数据：加上“全部”项
const yearItems = computed(() => [{ label: "ALL", value: "" }, ...props.allYears.map((y) => ({ label: y, value: y }))])

// 格式化标签数据：加上“ALL”项
const tagItems = computed(() => [{ label: "ALL", value: "" }, ...props.allTags.map((t) => ({ label: `# ${t}`, value: t }))])

const handleSearch = (e: Event) => {
	emit("update:search", (e.target as HTMLInputElement).value)
}
</script>

<template>
	<div class="flex flex-col gap-8">
		<div class="relative group">
			<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
				<Icon name="lucide:search" class="w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-all" />
			</div>
			<input
				type="text"
				:value="searchQuery"
				@input="handleSearch"
				placeholder="搜索关键词..."
				class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-brand-surface border border-slate-200/60 dark:border-slate-800/60 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
			/>
		</div>

		<FilterGroup
			v-if="allYears?.length"
			title="发布年份"
			icon="lucide:calendar-range"
			:items="yearItems"
			:selected-value="selectedYear"
			is-uppercase
			:scrollable="true"
			@update:value="(val: string) => $emit('update:year', val)"
		/>

		<FilterGroup title="分类探索" icon="lucide:tags" :items="tagItems" :selected-value="selectedTag" :scrollable="true" is-uppercase @update:value="(val: string) => $emit('update:tag', val)" />
	</div>
</template>
