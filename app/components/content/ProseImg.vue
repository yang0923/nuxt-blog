<script setup lang="ts">
// Nuxt Content 会自动把 ![alt](src "title") 里的参数传给这些 props
defineProps({
	src: {
		type: String,
		default: "",
	},
	alt: {
		type: String,
		default: "",
	},
	title: {
		type: String,
		default: "",
	},
})
</script>

<template>
	<AppImage :src="src" :alt="alt" />
</template>

<style scoped lang="postcss">
/* 如果需要针对文章内的图片做额外调整，可以在这里写 */
.prose-img-custom {
	@apply block mx-auto max-w-full;
}
</style>
