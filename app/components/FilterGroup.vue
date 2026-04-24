<script setup lang="ts">
interface FilterItem {
	label: string
	value: string
}

defineProps<{
	title: string
	icon: string
	items: FilterItem[]
	selectedValue: string
	isUppercase?: boolean // 是否将按钮文字转为大写
	scrollable?: boolean // 是否支持移动端横向滚动
}>()

defineEmits(["update:value"])
</script>

<template>
	<div>
		<div class="flex items-center gap-2 mb-4">
			<div class="p-1.5 rounded-lg bg-primary-500/10">
				<Icon :name="icon" class="w-3.5 h-3.5 text-primary-500" />
			</div>
			<span class="text-slate-900 dark:text-white font-black uppercase tracking-widest text-[12px]">
				{{ title }}
			</span>
		</div>

		<div class="flex gap-2 pt-2 filter drop-shadow-md" :class="[scrollable ? 'overflow-x-auto pb-4 lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap' : 'flex-wrap']">
			<button
				v-for="item in items"
				:key="item.value"
				@click="$emit('update:value', item.value)"
				class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border relative overflow-hidden group/btn"
				:class="[
					selectedValue === item.value
						? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/25 -translate-y-0.5'
						: 'bg-brand-surface border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-500/50 hover:text-primary-500 hover:-translate-y-0.5 hover:shadow-md',
					isUppercase ? 'uppercase' : '',
				]"
			>
				{{ item.label }}
				<div v-if="selectedValue === item.value" class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
			</button>
		</div>
	</div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
