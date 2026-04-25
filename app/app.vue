<script setup>
const router = useRouter()
const store = useImageStore()

router.beforeEach((to, from) => {
	if (to.path !== from.path) {
		store.clearPool()
	}
})
</script>

<template>
	<div>
		<NuxtLoadingIndicator color="#3b82f6" :height="3" />
		<NuxtLayout>
			<NuxtPage :keepalive="{ max: 10 }"/>
		</NuxtLayout>
	</div>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
