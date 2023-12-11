<script setup lang="ts">
import { toRefs, ref, computed } from '@vue/reactivity';
import { onMounted } from "@vue/runtime-core";
import type { PropType } from 'vue';
import { imageSource, getAssets } from "..";

const emit = defineEmits(['update:modelValue', 'catch'])
const props = defineProps({
    modelValue: {
        type: Number as PropType<number>,
        default: 0
    },
    gif: {
        type: String as PropType<string>,
        default: ''
    },
    type: {
        type: String as PropType<string>,
        default: ''
    }
})

const { gif, type } = toRefs(props)

const sideImage = ref()
const topSideImage = ref(0)
const width = ref(window.innerWidth)
const rect = computed(() => sideImage.value.getBoundingClientRect())
const getTopSideImage = () => {
    if (width.value < 380) {
        topSideImage.value = Math.ceil(rect.value.top) - Math.ceil(.1 * width.value)
    } else if (width.value > 500) {
        topSideImage.value = Math.ceil(rect.value.top) - Math.ceil(.075 * width.value)
    } else {
        topSideImage.value = Math.ceil(rect.value.top)
    }
    emit('update:modelValue', topSideImage.value)
}

onMounted(() => {
    getTopSideImage()
    window.addEventListener('resize', () => {
        width.value = window.innerWidth
        getTopSideImage()
    })
})
</script>

<template>
    <div class="relative h-full w-full bg-white flex justify-center">
        <div class="absolute h-[150vw] max-h-[680px] w-[150vw] max-w-[680px] -top-[calc(150px+35vw)] rounded-full
            bg-gradient-to-br" :class="`from-${type}-1/95 to-${type}-1/50`"></div>
    </div>
    <div class="absolute top-[calc(1rem+1vw)] h-full w-full flex justify-center">
        <img :src="getAssets(`${type}.avif`)" height="260" alt="pokemon background">
    </div>
    <div ref="sideImage" class="relative h-full w-full flex justify-center ">
        <img @click="emit('catch')" loading="eager" :src="imageSource(gif)" width="240" height="240" alt="pokemon animation"
            class="w-[calc(140px+20vw)] absolute bottom-[5vw] hover:scale-110 active:scale-90
            transition duration-500 cursor-pointer">
    </div>
</template>