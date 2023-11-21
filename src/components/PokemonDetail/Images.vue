<script setup lang="ts">
import { toRefs, ref } from '@vue/reactivity';
import { onMounted } from "@vue/runtime-core";
import type { PropType } from 'vue';
import type { Pokemon } from '../../types';
import { imageSource, getAssets } from "..";

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: {}
    },
    modelValue: {
        type: Number as PropType<number>,
        default: 0
    }
})

const { data } = toRefs(props)

const sideImage = ref()
const topSideImage = ref(0)
const width = ref(window.innerWidth)
const getTopSideImage = () => {
    const rect = sideImage.value.getBoundingClientRect()
    if (width.value < 380) {
        topSideImage.value = Math.ceil(rect.top) - Math.ceil(.1 * width.value)
    } else if (width.value > 500) {
        topSideImage.value = Math.ceil(rect.top) - Math.ceil(.075 * width.value)
    } else {
        topSideImage.value = Math.ceil(rect.top)
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
                bg-gradient-to-br from-grass-1/95 to-grass-1/50"></div>
    </div>
    <div class="absolute top-[calc(1rem+1vw)] h-full w-full flex justify-center">
        <img :src="getAssets(`${data.types[0]}.avif`)" height="260" alt="pokemon background">
    </div>
    <div ref="sideImage" class="relative h-full w-full flex justify-center">
        <img :src="imageSource(data.gif)" width="240" height="240" class=" w-[calc(140px+20vw)] absolute bottom-[5vw]"
            alt="pokemon animation">
    </div>
</template>