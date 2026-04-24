<script setup lang="ts">
import { useImageStore } from "@/stores/useImageStore"
import type { CSSProperties } from "vue"

interface Props {
	src?: string
	alt?: string
	class?: string
	preview?: boolean
	imageGroup?: string[]
	autoGroup?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	alt: "Image",
	preview: true,
	imageGroup: () => [],
	autoGroup: true,
})

const store = useImageStore()

// 状态控制
const isError = ref(false)
const showModal = ref(false)
const failedImages = ref(new Set<string>())

// 切换与拖拽状态
const currentIndex = ref(0)
const touch = reactive({
	start: 0,
	current: 0,
	offsetX: 0,
	isDragging: false,
	hasMoved: false,
})

// 数据池
const effectiveGroup = computed(() => {
	if (props.imageGroup && props.imageGroup.length > 0) {
		return props.imageGroup.map((img) => ({ src: img, alt: props.alt }))
	}
	const pool = store?.imagePool || []
	return !props.autoGroup ? (props.src ? [{ src: props.src, alt: props.alt }] : []) : pool
})

const currentAlt = computed(() => {
	const current = effectiveGroup.value[currentIndex.value]
	return current?.alt || props.alt
})

// 样式算法
const getCardStyle = (index: number): CSSProperties => {
	const total = effectiveGroup.value.length
	if (total === 0) return {}

	let diff = index - currentIndex.value
	if (diff < 0) diff += total

	if (diff > 2 && diff < total - 1) {
		return { opacity: 0, pointerEvents: "none" as const, transform: "scale(0.8) translateY(0px)" }
	}

	const isTop = index === currentIndex.value
	const zIndex = 50 - diff
	const scale = 1 - diff * 0.07
	const translateY = diff * 20

	let translateX = 0
	if (isTop && touch.isDragging) {
		translateX = touch.offsetX
	}

	return {
		zIndex,
		opacity: 1 - diff * 0.3,
		pointerEvents: isTop ? "auto" : "none",
		transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
		transition: touch.isDragging && isTop ? "none" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
	}
}

// 交互逻辑
const getClientX = (e: TouchEvent | MouseEvent) => {
	return "touches" in e ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX
}

const handleTouchStart = (e: TouchEvent | MouseEvent) => {
	const x = getClientX(e)

	// 💡 修复：边缘安全检查，防止触发手机侧滑返回
	const edgeThreshold = 25
	if (x < edgeThreshold || x > window.innerWidth - edgeThreshold) return

	touch.isDragging = true
	touch.start = x
	touch.current = x
	touch.offsetX = 0
}

const handleTouchMove = (e: TouchEvent | MouseEvent) => {
	if (!touch.isDragging) return
	// 显式阻止默认滚动行为
	if ("touches" in e && e.cancelable) e.preventDefault()

	touch.current = getClientX(e)
	touch.offsetX = touch.current - touch.start
	if (Math.abs(touch.offsetX) > 5) touch.hasMoved = true
}

const handleTouchEnd = () => {
	if (!touch.isDragging) return
	const threshold = 100
	const total = effectiveGroup.value.length
	if (total > 1 && Math.abs(touch.offsetX) > threshold) {
		if (touch.offsetX > 0) currentIndex.value = (currentIndex.value - 1 + total) % total
		else currentIndex.value = (currentIndex.value + 1) % total
	}
	touch.isDragging = false
	touch.offsetX = 0
	setTimeout(() => {
		touch.hasMoved = false
	}, 50)
}

const onBackdropClick = () => {
	if (!touch.hasMoved) showModal.value = false
}

const togglePreview = () => {
	if (props.preview && props.src && !isError.value) {
		const idx = effectiveGroup.value.findIndex((item) => item.src === props.src)
		currentIndex.value = idx !== -1 ? idx : 0
		touch.isDragging = false
		touch.hasMoved = false
		showModal.value = true
	}
}

onMounted(() => {
	if (props.src && props.autoGroup) store.registerImage({ src: props.src, alt: props.alt })
})
onBeforeUnmount(() => {
	if (props.src && props.autoGroup) store.unregisterImage(props.src)
})
// 专门处理历史记录回退的函数
const popStateHandler = () => {
	showModal.value = false
}

watch(showModal, (val) => {
	if (!import.meta.client) return

	if (val) {
		// --- 开启预览 ---
		document.body.style.overflow = "hidden"

		// 只有当当前状态不是 preview 时才推入，防止重复触发
		if (window.history.state?.preview !== true) {
			window.history.pushState({ preview: true }, "")
		}

		window.addEventListener("popstate", popStateHandler)

		// 键盘监听（可选）
		const keyHandler = (e: KeyboardEvent) => {
			if (e.key === "Escape") showModal.value = false
			// ... 左右键逻辑保持不变
		}
		window.addEventListener("keydown", keyHandler)

		// 这里的清理逻辑我们放在 val 为 false 的分支处理，而不是再嵌套一个 watch
	} else {
		// --- 关闭预览 ---
		document.body.style.overflow = ""

		// 移除监听
		window.removeEventListener("popstate", popStateHandler)

		// 💡 关键修复：只有当是因为点击“X”或背景关闭（此时 history 还在 preview 状态）时，才回退历史
		if (window.history.state?.preview === true) {
			window.history.back()
		}
	}
})
</script>

<template>
	<div :class="['relative group/img w-full', props.class]">
		<div class="cursor-pointer relative overflow-hidden rounded-xl border border-primary-500/10 bg-brand-card shadow-sm transition-all hover:shadow-primary-500/10" @click="togglePreview">
			<NuxtImg
				v-if="src && !isError"
				:src="src"
				:alt="alt"
				loading="lazy"
				class="w-full h-auto block transition-all duration-700 group-hover/img:scale-110 group-hover/img:brightness-95"
				@error="isError = true"
			/>

			<div v-else class="w-full aspect-video p-6 flex flex-col items-center justify-center bg-brand-surface border border-dashed border-primary-500/20 rounded-xl">
				<Icon name="lucide:image-off" class="w-10 h-10 text-primary-500/20 mb-3" />
				<span class="text-primary-500/50 font-mono tracking-[0.2em] text-[10px] uppercase italic text-center">
					{{ alt || "IMAGE_NOT_FOUND" }}
				</span>
			</div>
		</div>

		<Teleport to="body">
			<Transition name="cyber-fade">
				<div
					v-if="showModal"
					class="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-brand-surface/60 backdrop-blur-2xl px-4 select-none touch-none overscroll-none"
					@click="onBackdropClick"
				>
					<div class="relative w-full h-[70vh] max-w-[1200px] flex items-center justify-center pointer-events-none">
						<div v-for="(item, index) in effectiveGroup" :key="item.src" class="absolute inset-0 flex items-center justify-center transition-all" :style="getCardStyle(index)">
							<div
								class="relative flex items-center justify-center pointer-events-auto"
								@mousedown.stop="handleTouchStart"
								@mousemove.stop="handleTouchMove"
								@mouseup.stop="handleTouchEnd"
								@mouseleave="handleTouchEnd"
								@touchstart.stop="handleTouchStart"
								@touchmove.stop="handleTouchMove"
								@touchend.stop="handleTouchEnd"
								@click.stop
							>
								<NuxtImg
									v-if="!failedImages.has(item.src)"
									:src="item.src"
									class="max-w-[95vw] max-h-[70vh] object-contain pointer-events-none drop-shadow-[0_0_30px_rgba(var(--primary-500),0.2)] rounded-lg"
									@error="failedImages.add(item.src)"
								/>

								<div v-else class="w-80 p-8 flex flex-col items-center justify-center bg-brand-card border-2 border-dashed border-primary-500/20 rounded-3xl backdrop-blur-md">
									<Icon name="lucide:image-off" class="w-16 h-16 text-primary-500/20 mb-4" />
									<p class="text-primary-500/50 font-mono tracking-widest text-xs italic">RESOURCE_NOT_FOUND</p>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-10 flex flex-col items-center gap-6 pointer-events-none">
						<div class="px-8 py-2 bg-brand-card/80 border border-primary-500/20 rounded-full backdrop-blur-xl shadow-2xl">
							<span class="text-[11px] font-black text-primary-700 dark:text-primary-500 uppercase tracking-[0.4em] italic">
								{{ currentAlt }}
								<span class="ml-4 text-primary-500/30 font-mono">[{{ currentIndex + 1 }} / {{ effectiveGroup.length }}]</span>
							</span>
						</div>
						<div class="w-40 h-[2px] bg-primary-500/10 rounded-full overflow-hidden">
							<div
								class="h-full bg-primary-500 transition-all duration-500 shadow-[0_0_15px_rgb(var(--primary-500))]"
								:style="{ width: `${effectiveGroup.length > 0 ? ((currentIndex + 1) / effectiveGroup.length) * 100 : 0}%` }"
							></div>
						</div>
					</div>

					<button class="absolute top-8 right-8 p-2 text-primary-500/30 hover:text-primary-500 hover:rotate-90 transition-all z-[1000]" @click.stop="showModal = false">
						<Icon name="lucide:x" class="w-10 h-10" />
					</button>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped lang="postcss">
.cyber-fade-enter-active,
.cyber-fade-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.cyber-fade-enter-from,
.cyber-fade-leave-to {
	opacity: 0;
	transform: scale(1.05);
	backdrop-filter: blur(0px);
}

/* 彻底禁用移动端默认行为 */
div {
	-webkit-tap-highlight-color: transparent;
}
.touch-none {
	touch-action: none !important;
	/* 某些浏览器在检测到滑动可能导致导航时会冻结页面，这个属性强制不进行导航手势预测 */
	user-select: none;
	-webkit-user-drag: none;
}
</style>
