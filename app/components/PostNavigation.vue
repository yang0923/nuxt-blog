<script setup lang="ts">
const props = defineProps<{ surround: any }>()
</script>

<template>
	<div class="flex flex-col gap-4">
		<template v-for="(item, index) in [surround?.[0], surround?.[1]]" :key="index">
			<NuxtLink
				v-if="item"
				:to="item.path"
				class="group/nav relative p-5 rounded-[1.8rem] bg-brand-card border border-primary-500/10 transition-all duration-500 hover:border-primary-500/0 hover:shadow-2xl hover:shadow-primary-500/20 overflow-hidden min-h-[100px] flex items-center"
			>
				<div
					v-if="item.image"
					class="absolute inset-0 z-0 opacity-0 group-hover/nav:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] scale-110 group-hover/nav:scale-100 pointer-events-none"
				>
					<AppImage :src="item.image" :auto-group="false" loading="lazy" class="w-full h-full object-cover object-center" alt="Background Cover" />
					<div class="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-[1px]"></div>
				</div>

				<div class="relative z-10 w-full">
					<div class="flex flex-col gap-2 group-hover/nav:opacity-0 group-hover/nav:-translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
						<div class="flex items-center gap-1 text-[9px] font-black text-primary-700/40 dark:text-primary-100/30 uppercase tracking-[0.2em]">
							<Icon
								:name="index === 0 ? 'lucide:chevrons-left' : 'lucide:chevrons-right'"
								:class="index === 0 ? 'animate-bounce-x' : 'animate-bounce-x-reverse'"
								class="w-3.5 h-3.5 text-primary-500/60"
							/>
							<span>{{ index === 0 ? "Prev_Node" : "Next_Node" }}</span>
						</div>
						<div class="text-[12px] font-black text-primary-900 dark:text-primary-50 uppercase italic leading-tight line-clamp-1">
							{{ item.title }}
						</div>
					</div>

					<div
						class="absolute inset-0 flex flex-col justify-center items-center text-center opacity-0 group-hover/nav:opacity-100 translate-y-4 group-hover/nav:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
					>
						<div class="text-[9px] font-black text-primary-500 dark:text-primary-400 uppercase tracking-[0.3em] mb-2 drop-shadow-sm">Description</div>
						<p v-if="item.description" class="text-[11px] leading-relaxed text-white dark:text-primary-50 font-bold italic line-clamp-2 px-4 drop-shadow-md">
							{{ item.description }}
						</p>
						<p v-else class="text-[10px] text-white/70 italic uppercase tracking-widest font-black">Link_Synchronizing...</p>
					</div>
				</div>
			</NuxtLink>

			<div v-else class="p-5 rounded-[1.8rem] border border-dashed border-primary-500/10 flex items-center justify-center opacity-30 bg-brand-surface/50 min-h-[100px]">
				<span class="text-[9px] font-black uppercase text-primary-500/50 italic tracking-widest px-1">
					{{ index === 0 ? "PROTOCOL_END" : "PROTOCOL_TOP" }}
				</span>
			</div>
		</template>
	</div>
</template>

<style scoped>
/* 消除顿感：使用更顺滑的贝塞尔曲线和 GPU 加速 */
.group\/nav {
	backface-visibility: hidden;
	transform: translateZ(0);
}

@keyframes bounce-x {
	0%,
	100% {
		transform: translateX(0);
	}
	50% {
		transform: translateX(-4px);
	}
}
@keyframes bounce-x-reverse {
	0%,
	100% {
		transform: translateX(0);
	}
	50% {
		transform: translateX(4px);
	}
}
.animate-bounce-x {
	animation: bounce-x 1.5s infinite;
}
.animate-bounce-x-reverse {
	animation: bounce-x-reverse 1.5s infinite;
}

.line-clamp-1 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	overflow: hidden;
}
.line-clamp-2 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	overflow: hidden;
}
</style>
