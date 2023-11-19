<script setup lang="ts">
import { toRefs, ref, computed } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { getAssets, imageSource } from "~/.";
import TypeIcon from "~/TypeIcon.vue";
import { ArrowLeft, Heart, Gym, ExpandLines, PineTree, Archery, Male, Female } from "@iconoir/vue";
import type { SVGAttributes } from "vue"

type transformType = Record<string, { value: any, icon: (props: SVGAttributes) => any }>

const emit = defineEmits(['back', 'heart'])
const props = defineProps({
    data: {
        type: Object as PropType<{}>,
        default: {}
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
}

onMounted(() => {
    getTopSideImage()
    window.addEventListener('resize', () => {
        width.value = window.innerWidth
        getTopSideImage()
    })

})

const iconHeight = (type: string) => type == 'ground' ? 14 : type == 'rock' || type == 'flying' ? 15 : 18

const transformedDetail: transformType = computed(() => {
    const icons = [Gym, ExpandLines, PineTree, Archery]
    const labels = ['berat', 'tinggi', 'sebaran', 'kemampuan']
    return Object.fromEntries(Object.keys(data.value.detail).map((d, idx) => {
        let value;
        if (typeof data.value.detail[d] == 'number') value = data.value.detail[d]
        else value = data.value.detail[d].join(', ')
        return [labels[idx], { value, icon: icons[idx] }]
    }))
})

const transformGender: transformType = computed(() => {
    return {
        female: { value: data.value.femalePossibility * 100, icon: Female },
        male: { value: 100 - (data.value.femalePossibility * 100), icon: Male }
    }
})
</script>

<template>
    <aside class="fixed h-screen w-full bg-white top-0 left-0 overflow-x-hidden overflow-y-auto">
        <div class="relative h-[calc(80px+20vw)] w-full bg-white">
            <div class="relative h-full w-full bg-white flex justify-center">
                <div class="absolute h-[150vw] max-h-[680px] w-[150vw] max-w-[680px] -top-[calc(150px+35vw)] rounded-full
                bg-gradient-to-br from-grass-1/95 to-grass-1/50"></div>
            </div>
            <div class="absolute top-[calc(1rem+1vw)] h-full w-full flex justify-center">
                <img :src="getAssets(`${data.types[0]}.avif`)" height="260" alt="pokemon background">
            </div>
            <div ref="sideImage" class="relative h-full w-full flex justify-center">
                <img :src="imageSource(data.gif)" width="240" height="240"
                    class=" w-[calc(140px+20vw)] absolute bottom-[5vw]" alt="pokemon animation">
            </div>
            <div class="absolute top-0 h-[52px] w-full flex items-center px-4 justify-between">
                <i v-for="i in 2" @click="i == 1 ? emit('back') : emit('heart')" class="w-9 h-9 first:-translate-x-1
                last:translate-x-1 rounded-full grid place-items-center cursor-pointer bg-white/0 hover:bg-white/20
                active:bg-white/10 transition duration-[.4s]">
                    <component :is="i == 1 ? ArrowLeft : Heart" color="white" width="20" height="20" stroke-width="3">
                    </component>
                </i>
            </div>
        </div>
        <div :style="{ marginTop: `${topSideImage}px` }" class="p-5 flex flex-col [&>*]:w-full gap-5">
            <div>
                <h1 class="text-xl font-bold text-slate-800">{{ data.name }}</h1>
                <span class="font-medium text-slate-800">Terindeks ke-{{ data.id }}</span>
            </div>
            <div class="flex gap-2 items-center">
                <div v-for="poketype in data.types" :class="`bg-${poketype}-1`"
                    class="h-10 w-fit flex items-center gap-[.4rem] p-1 pr-[.8rem] rounded-[20px]">
                    <div class="h-8 w-8 bg-white rounded-full grid place-items-center">
                        <TypeIcon :is="poketype" :height="iconHeight(poketype)" />
                    </div>
                    <span class="text-white text-sm font-semibold drop-shadow capitalize">
                        {{ poketype }}</span>
                </div>
            </div>
            <p class="text-sm text-slate-700">{{ data.description }}</p>
            <div class="flex flex-wrap gap-y-3 gap-x-4">
                <div v-for="detail in Object.keys(transformedDetail)" class="flex flex-col gap-1 grow basis-28">
                    <div class="flex gap-2 items-center">
                        <component :is="transformedDetail[detail].icon" color="rgb(51,65,85)" width="16" height="16"
                            stroke-width="2"></component>
                        <span class="text-slate-700 font-medium text-sm uppercase">{{ detail }}</span>
                    </div>
                    <span
                        class="h-10 font-semibold rounded-lg grid place-items-center text-lg text-slate-800 border-2 border-slate-400 px-4 whitespace-nowrap">{{
                            transformedDetail[detail].value }}</span>
                </div>
            </div>
            <div class="flex flex-col items-center gap-1">
                <span class="text-slate-700 font-medium text-sm uppercase">Gender</span>
                <div class="h-2 w-full rounded-[.25rem] bg-dragon-1 relative overflow-hidden">
                    <div class="absolute h-full bg-fairy-1" :style="{ width: `${transformGender['female'].value}%` }"></div>
                </div>
                <div class="flex mt-1 items-center justify-between w-full">
                    <span v-for="gender in Object.keys(transformGender)"
                        class="flex items-center gap-1 first:flex-row last:flex-row-reverse">
                        <component :is="transformGender[gender].icon" color="rgb(51,65,85)" width="18" height="18"
                            stroke-width="2"></component>
                        <span class="text-slate-700 text-sm">{{ transformGender[gender].value }}%</span>
                    </span>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="text-lg font-semibold mb-2 text-center">Kelemahan</h3>
                <div class="flex flex-wrap gap-4 items-center justify-center">
                    <div v-for="poketype in data.weakness" :class="`bg-${poketype}-1`"
                        class="h-10 w-fit basis-28 flex items-center gap-[.4rem] p-1 pr-[.8rem] rounded-[20px]">
                        <div class="h-8 w-8 bg-white rounded-full grid place-items-center">
                            <TypeIcon :is="poketype" :height="iconHeight(poketype)" />
                        </div>
                        <span class="text-white text-sm font-semibold drop-shadow capitalize">
                            {{ poketype }}</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>