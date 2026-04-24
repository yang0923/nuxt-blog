<script setup lang="ts">
const props = defineProps<{ post: any }>()
const appConfig = useAppConfig()
const url = useRequestURL()
const pageUrl = url.href

const showToast = ref(false)
let timer: NodeJS.Timeout | null = null

const copyLink = () => {
	if (!import.meta.client) return
	navigator.clipboard.writeText(pageUrl).then(() => {
		showToast.value = true
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			showToast.value = false
		}, 2200)
	})
}
</script>

<template>
	<div class="group p-5 rounded-[1.8rem] bg-brand-card border border-primary-500/10 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
		<div class="absolute -right-6 -bottom-6 opacity-[0.05] dark:opacity-[0.08] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 pointer-events-none">
			<Icon name="lucide:shield-check" class="w-32 h-32 text-primary-500" />
		</div>

		<div class="relative space-y-5">
			<div class="flex items-center gap-3">
				<div class="relative">
					<div class="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
						<Icon name="lucide:user-check" class="w-5 h-5" />
					</div>
					<div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-brand-card rounded-full animate-pulse"></div>
				</div>
				<div>
					<div class="text-[9px] font-black text-primary-700/50 dark:text-primary-100/30 uppercase tracking-[0.2em] mb-0.5">Terminal_User</div>
					<div class="text-sm font-black text-primary-900 dark:text-primary-50 uppercase italic tracking-tighter">{{ appConfig.author.name }}</div>
				</div>
			</div>

			<div @click="copyLink" class="cursor-pointer group/link relative">
				<div class="flex justify-between items-center mb-1.5 px-1">
					<span class="text-[9px] font-black text-primary-700/40 dark:text-primary-100/30 uppercase tracking-widest">Post_Entry_Point</span>
					<Icon name="lucide:copy" class="w-3 h-3 text-primary-500/40 group-hover/link:text-primary-500 transition-colors" />
				</div>
				<div
					class="text-[10px] font-bold text-primary-900/60 dark:text-primary-100/50 break-all p-3 rounded-2xl bg-brand-surface border border-dashed border-primary-500/20 group-hover/link:border-primary-500/50 transition-all group-hover/link:bg-primary-500/5"
				>
					{{ pageUrl }}
				</div>
			</div>

			<div v-if="post.source" class="flex items-center justify-between">
				<span class="text-[9px] font-black text-primary-700/40 dark:text-primary-100/30 uppercase tracking-widest">Source_Origin</span>
				<a
					:href="post.sourceUrl"
					target="_blank"
					class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
				>
					<Icon name="lucide:share-2" class="w-3 h-3" />
					{{ post.source }}
				</a>
			</div>

			<div class="pt-4 border-t border-primary-500/10">
				<div class="flex items-start gap-2.5">
					<Icon name="lucide:info" class="w-3.5 h-3.5 text-primary-500/40 mt-0.5" />
					<p class="text-[10px] leading-relaxed font-bold text-primary-700/50 dark:text-primary-100/40 uppercase">
						Licensed under <span class="text-primary-900 dark:text-primary-100 decoration-primary-500/50 underline underline-offset-2">CC BY-NC-SA 4.0</span>. <br />
						Please specify the source when reprinting.
					</p>
				</div>
			</div>
		</div>

		<Transition name="toast">
			<div v-if="showToast" class="absolute inset-0 bg-primary-600/90 dark:bg-primary-600/20 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-4">
				<Icon name="lucide:check-circle" class="w-8 h-8 mb-2 animate-bounce" />
				<span class="text-[11px] font-black uppercase tracking-[0.3em] drop-shadow-md">Copy_Successful</span>
				<span class="text-[8px] opacity-80 mt-1 uppercase italic tracking-tighter text-white font-bold">Protocol_Link_Synchronized</span>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
/* 保持丝滑的缓动曲线 */
.toast-enter-active,
.toast-leave-active {
	transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.toast-enter-from,
.toast-leave-to {
	transform: translateY(100%);
	opacity: 0;
}
</style>
