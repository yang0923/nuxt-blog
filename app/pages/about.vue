<script setup lang="ts">
definePageMeta({
	showInNavbar: true,
	navTitle: "关于",
	order: 4,
	navIcon: "lucide:user",
})
useHead({ title: "关于" })
const appConfig = useAppConfig()
</script>

<template>
	<div class="max-w-3xl mx-auto space-y-12">
		<section class="relative p-8 md:p-12 rounded-[2rem] bg-brand-card border border-primary-500/10 overflow-hidden shadow-2xl">
			<div class="absolute -top-10 -right-10 text-[120px] font-black text-primary-500/5 select-none pointer-events-none italic uppercase">Info</div>

			<div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
				<div class="relative">
					<div class="w-32 h-32 rounded-3xl bg-primary-500 flex items-center justify-center text-white shadow-2xl rotate-3">
						<Icon :name="appConfig.site.logoIcon" class="w-16 h-16" />
					</div>
					<div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-brand-surface border-4 border-brand-card flex items-center justify-center">
						<div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
					</div>
				</div>

				<div class="text-center md:text-left space-y-2">
					<h1 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
						{{ appConfig.author?.name }}
					</h1>
					<p class="text-primary-500 font-mono text-sm tracking-widest uppercase">Full-Stack Developer / Geek</p>
					<div class="flex items-center justify-center md:justify-start gap-4 pt-4">
						<a :href="appConfig.author?.github" target="_blank" class="icon-link">
							<Icon name="mdi:github" class="w-6 h-6" />
						</a>
						<a :href="`mailto:${appConfig.author?.email}`" class="icon-link">
							<Icon name="lucide:mail" class="w-6 h-6" />
						</a>
					</div>
				</div>
			</div>
		</section>

		<section class="prose prose-slate dark:prose-invert max-w-none px-4">
			<h2 class="text-primary-500 italic uppercase tracking-[0.3em] text-sm font-black">About Me / 个人简介</h2>
			<p>
				你好，我是 <strong>{{ appConfig.author?.name }}</strong
				>。这里是我的数字花园，我在这里通过代码拾取思考的余烬。
			</p>
			<p>
				我热爱构建具有良好交互体验的 Web 应用，沉迷于各种极致的 CSS 动画和整洁的架构设计。在这个博客中，你会看到我关于
				<code>Vue/Nuxt</code>、<code>TypeScript</code> 以及 <code>赛博视觉设计</code> 的各种尝试。
			</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 not-prose">
				<div class="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 space-y-2">
					<h3 class="font-black text-slate-800 dark:text-slate-100 uppercase italic">技术栈</h3>
					<p class="text-xs text-slate-500 leading-relaxed font-medium">Vue3, Nuxt3, TypeScript, TailwindCSS, Node.js, PostgreSQL</p>
				</div>
				<div class="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 space-y-2">
					<h3 class="font-black text-slate-800 dark:text-slate-100 uppercase italic">当前状态</h3>
					<p class="text-xs text-slate-500 leading-relaxed font-medium">拾起代码的光，照亮思想的路。正在探索 AI 与 Web 结合的无限可能。</p>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped lang="postcss">
.icon-link {
	@apply w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-surface border border-primary-500/10 text-slate-500 hover:text-primary-500 hover:border-primary-500/40 transition-all;
}
</style>
