<script setup lang="ts">
/**
 * 链接分组展示组件 - 纯展示版
 */

type LinkStatus = "Active" | "Offline" | "Archived" | "Pending" | "Blocked"
interface LinkItem {
	title: string
	desc: string
	url: string
	tags?: string[]
	icon?: string
	avatar?: string
	status?: LinkStatus
}

// 接收来自父组件 processedGroups 的每一项
const props = defineProps<{
	title: string
	desc: string
	order?: number // 对应 Schema 中的 order
	items: LinkItem[]
}>()

const getStatusTheme = (status?: LinkStatus) => {
	const themes: Record<LinkStatus, { dot: string; text: string; bg: string; border: string }> = {
		Active: {
			dot: "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]",
			text: "text-emerald-700 dark:text-emerald-400",
			bg: "bg-emerald-50 dark:bg-emerald-500/10",
			border: "border-emerald-200/50 dark:border-emerald-500/20",
		},
		Offline: {
			dot: "bg-rose-500",
			text: "text-rose-700 dark:text-rose-400",
			bg: "bg-rose-50 dark:bg-rose-500/10",
			border: "border-rose-200/50 dark:border-rose-500/20",
		},
		Archived: {
			dot: "bg-slate-400",
			text: "text-slate-600 dark:text-slate-400",
			bg: "bg-slate-100 dark:bg-slate-800/40",
			border: "border-slate-200 dark:border-slate-700/50",
		},
		Pending: {
			dot: "bg-amber-500 animate-pulse",
			text: "text-amber-700 dark:text-amber-400",
			bg: "bg-amber-50 dark:bg-amber-500/10",
			border: "border-amber-200/50 dark:border-amber-500/20",
		},
		Blocked: {
			dot: "bg-red-700",
			text: "text-red-800 dark:text-red-400",
			bg: "bg-red-50 dark:bg-red-900/20",
			border: "border-red-200 dark:border-red-500/20",
		},
	}

	return status ? themes[status] : themes.Active
}
</script>

<template>
	<section class="link-sector-container flex flex-col mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
		<div class="mb-8 flex flex-col gap-3">
			<div class="flex items-center gap-4">
				<h2 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.3em] whitespace-nowrap italic">
					{{ title }}
				</h2>
				<div class="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/50"></div>
			</div>
			<div class="pl-1 border-l-2 border-primary-500/30">
				<p class="text-[12px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider ml-3 italic">// {{ desc }}</p>
			</div>
		</div>

		<div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<a
				v-for="(item, index) in items"
				:key="`${item.url}-${index}`"
				:href="item.url"
				target="_blank"
				class="group p-5 rounded-3xl bg-brand-card border border-slate-200/50 dark:border-slate-800/50 hover:border-primary-500/50 transition-all duration-500 flex items-start gap-4 hover:shadow-xl hover:shadow-primary-500/5"
			>
				<div class="flex-shrink-0">
					<div v-if="item.avatar" class="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-transform duration-500 group-hover:rotate-6">
						<img :src="item.avatar" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
					</div>
					<div
						v-else
						class="w-12 h-12 rounded-2xl bg-primary-50/30 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-500"
					>
						<Icon :name="item.icon || 'lucide:link-2'" class="w-6 h-6" />
					</div>
				</div>

				<div class="min-w-0 flex-1">
					<div class="flex items-center justify-between mb-1 gap-2">
						<h3 class="font-black text-sm pr-2 text-slate-800 dark:text-slate-200 truncate group-hover:text-primary-500 transition-colors uppercase italic">
							{{ item.title }}
						</h3>
						<span
							:class="[
								'text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1.5 border transition-colors duration-300',
								getStatusTheme(item.status).bg,
								getStatusTheme(item.status).text,
								getStatusTheme(item.status).border,
							]"
						>
							<span :class="['w-1.5 h-1.5 rounded-full', getStatusTheme(item.status).dot]" />

							<span class="tracking-tighter"> {{ item.status || "Active" }} </span>
						</span>
					</div>
					<p class="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug font-medium mb-3">
						{{ item.desc }}
					</p>
					<div class="flex flex-wrap gap-2">
						<span v-for="tag in item?.tags" :key="tag" class="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase"> #{{ tag }} </span>
					</div>
				</div>
			</a>
		</div>

		<div v-else class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800/40 rounded-[2rem] bg-slate-50/30 dark:bg-slate-900/10">
			<Icon name="lucide:layers-2" class="w-8 h-8 text-slate-200 dark:text-slate-800 mb-3" />
			<span class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]"> Node_Sector_Offline </span>
		</div>
	</section>
</template>

<style scoped lang="postcss">
.group {
	@apply transform-gpu;
}
.group:hover {
	@apply -translate-y-1;
}
.link-sector-container {
	/* 告诉浏览器这个元素的高度大概是多少，优化滚动时的性能 */
	content-visibility: auto;
	contain-intrinsic-size: 1px 400px;
}
</style>
