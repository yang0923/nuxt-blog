<script setup lang="ts">
import type { ContentCollectionItem } from "@nuxt/content"

// 接收 post 数据
defineProps<{ post: ContentCollectionItem }>()

// 内部不再需要维护 LightBox 状态，由 AppImage 组件内部处理
</script>

<template>
	<div
		class="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-start p-4 rounded-3xl transition-all duration-500 bg-transparent hover:bg-brand-card hover:shadow-2xl hover:shadow-primary-500/5 border border-transparent hover:border-primary-500/10"
	>
		<div class="relative sm:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-surface border border-primary-500/10 z-10">
			<AppImage :src="post.image" :alt="post.title" />
			<div class="absolute top-2 left-2 flex gap-1 sm:hidden">
				<span
					v-for="tag in post.tags?.slice(0, 3)"
					:key="tag"
					class="px-2 py-0.5 text-[9px] font-black bg-brand-card/90 text-primary-600 dark:text-primary-400 rounded-lg shadow-sm border border-primary-500/10"
				>
					# {{ tag }}
				</span>
			</div>
		</div>

		<div class="flex flex-1 flex-col gap-2 sm:gap-3 py-1">
			<div class="hidden sm:flex gap-2">
				<span
					v-for="tag in post.tags"
					:key="tag"
					class="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-primary-500/5 text-primary-600 dark:text-primary-400 rounded-lg border border-primary-500/10"
				>
					# {{ tag }}
				</span>
			</div>

			<NuxtLink :to="post.path" class="after:absolute after:inset-0 after:z-0">
				<h2 class="text-lg sm:text-xl font-black text-primary-900 dark:text-primary-50 group-hover:text-primary-500 transition-colors line-clamp-2 tracking-tight italic">
					{{ post.title }}
				</h2>
			</NuxtLink>

			<p class="text-sm text-primary-900/60 dark:text-primary-100/50 line-clamp-2 sm:line-clamp-3 leading-relaxed font-medium">
				{{ post.description }}
			</p>

			<div class="mt-4 sm:mt-auto flex items-center justify-between text-[11px] text-primary-700/40 dark:text-primary-100/30 font-bold uppercase tracking-wider">
				<div class="flex items-center gap-2">
					<Icon name="lucide:calendar" class="w-3.5 h-3.5 text-primary-500/40" />
					<time :datetime="post.date">{{ post.date }}</time>
				</div>

				<span class="opacity-0 sm:group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-primary-500 flex items-center gap-1 italic font-black">
					PROTOCOL_READ <Icon name="lucide:arrow-right" class="w-3 h-3" />
				</span>
			</div>
		</div>
	</div>
</template>
