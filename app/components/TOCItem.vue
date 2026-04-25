<!-- components/TOCItem.vue -->
<script setup lang="ts">
interface TOCLink {
	id: string
	text: string
	children?: TOCLink[]
}

const props = defineProps<{
	link: TOCLink
	depth?: number
}>()

const emit = defineEmits<{
	(e: "click", id: string): void
}>()

const isCollapsed = ref(false)
const hasChildren = computed(() => props.link.children && props.link.children.length > 0)

const handleClick = () => {
	emit("click", props.link.id)
}
</script>

<template>
	<div class="relative">
		<div class="flex items-center group">
			<a
				:href="`#${link.id}`"
				class="flex-1 block py-1.5 pl-4 pr-2 text-[12px] font-medium transition-all duration-200 border-l-2 -ml-[1px] whitespace-nowrap overflow-x-auto scrollbar-none text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 border-transparent hover:border-primary-500"
				@click.prevent="handleClick"
			>
				<span class="inline-block min-w-max">{{ link.text }}</span>
			</a>

			<button
				v-if="hasChildren"
				@click="isCollapsed = !isCollapsed"
				class="p-1 mr-2 rounded-md text-slate-400 hover:text-primary-500 transition-colors shrink-0"
				:title="isCollapsed ? '展开子目录' : '收起子目录'"
			>
				<Icon :name="isCollapsed ? 'lucide:chevron-right' : 'lucide:chevron-down'" class="w-3 h-3" />
			</button>
		</div>

		<Transition name="toc-children">
			<div v-if="hasChildren && !isCollapsed" class="mt-0.5 ml-3 space-y-0.5">
				<TOCItem v-for="child in link.children" :key="child.id" :link="child" :depth="(depth || 0) + 1" @click="handleClick" />
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.toc-children-enter-active,
.toc-children-leave-active {
	transition: all 0.2s ease;
}

.toc-children-enter-from,
.toc-children-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

.scrollbar-none {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
	display: none;
}
</style>
