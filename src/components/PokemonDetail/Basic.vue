<script setup lang="ts">
import { toRefs, computed } from "@vue/reactivity";
import type { PropType, SVGAttributes } from "vue";
import type { Pokemon, Favourite, MyPokemon } from "../../types";
import TypeIcon from "../TypeIcon.vue";
import { Gym, ExpandLines, PineTree, Archery, Female, Male, InfoCircle } from "@iconoir/vue";

const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: {}
    },
    favourite: {
        type: Object as PropType<Favourite>,
        default: { id: '0002', state: true, date: '11/21/2023' }
    },
    catched: {
        type: Object as PropType<{ state: boolean, date: string }>,
        default: { state: true, date: '11/21/2023' }
    }
})

const { data, favourite, catched } = toRefs(props)

const iconHeight = (type: string) => type == 'ground' ? 14 : type == 'rock' || type == 'flying' ? 15 : 18;

const transformedDetail = computed(() => {
    const icons = [Gym, ExpandLines, PineTree, Archery]
    const labels = ['berat', 'tinggi', 'sebaran', 'kemampuan']
    const temp = data.value.detail as Record<string, any>
    return Object.fromEntries(Object.keys(temp).map((d, idx) => {
        let value: string;
        if (typeof temp[d] == 'string') value = temp[d];
        else value = temp[d].join(', ');
        return [labels[idx], { value, icon: icons[idx] }]
    }))
})

const transformedGender = computed((): Record<string, { value: number, icon: (props: SVGAttributes) => any }> => {
    return {
        female: { value: data.value.femalePossibility * 100, icon: Female },
        male: { value: 100 - (data.value.femalePossibility * 100), icon: Male }
    }
})
</script>

<template>
    <div class="z-[10]">
        <div v-if="catched.state" class="text-sm leading-[1.2rem] xs:text-base xs:leading-[1.4rem] p-3 bg-sky-500/20 rounded-xl
                font-medium flex items-center gap-2.5 mb-2.5 text-slate-800">
            <i class="w-7">
                <InfoCircle color="rgb(30,41,59)" width="28" height="28" stroke-width="2px" />
            </i>
            <span>Pokemon ini telah berhasil ditangkap pada {{ catched.date }}</span>
        </div>
        <h1 class="text-xl font-bold text-slate-800 capitalize">{{ data.name }}</h1>
        <span class="font-medium text-slate-800">Terindeks ke-{{ data.id }}</span>
        <p v-if="favourite.state" class="text-sm text-dragon-1 font-medium">Difavoritkan pada {{ favourite.date }}</p>
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
            <div class="absolute h-full bg-fairy-1" :style="{ width: `${transformedGender['female'].value}%` }">
            </div>
        </div>
        <div class="flex mt-1 items-center justify-between w-full">
            <span v-for="gender in Object.keys(transformedGender)"
                class="flex items-center gap-1 first:flex-row last:flex-row-reverse">
                <component :is="transformedGender[gender].icon" color="rgb(51,65,85)" width="18" height="18"
                    stroke-width="2"></component>
                <span class="text-slate-700 text-sm">{{ transformedGender[gender].value }}%</span>
            </span>
        </div>
    </div>
</template>