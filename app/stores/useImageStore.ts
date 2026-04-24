import { defineStore } from 'pinia'

export const useImageStore = defineStore('image-gallery', () => {
    // 存储对象数组
    const imagePool = ref<{ src: string, alt: string }[]>([])

    const registerImage = (data: { src: string, alt: string }) => {
        if (!imagePool.value.find(item => item.src === data.src)) {
            imagePool.value.push(data)
        }
    }

    const unregisterImage = (src: string) => {
        imagePool.value = imagePool.value.filter(item => item.src !== src)
    }

    // 清空图片池：路由切换时使用
    const clearPool = () => {
        imagePool.value = []
    }

    return {
        imagePool,
        registerImage,
        unregisterImage,
        clearPool
    }
})