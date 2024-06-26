<script setup lang="ts">
import { toRefs, ref } from '@vue/reactivity';
import type { PropType } from 'vue';
import type { PokemonCard } from "../../types"
import TypeIcon from "../TypeIcon.vue";
import Ripples from '../Ripple.vue';
import { Ripple } from "..";
import Spinner from '../Spinner.vue';

const emit = defineEmits(['open'])
const props = defineProps({
    data: {
        type: Object as PropType<PokemonCard>,
        default: {}
    },
    openload: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    isMain: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    noDetail: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { data, openload, isMain, noDetail } = toRefs(props)

const ripple = ref<any>()
const ripples = ref<any[]>([])

const animateRipple = (e: any, mobile: boolean = false) => ripples.value = new Ripple(ripple.value, ripples.value).animate(e, mobile)
const rippleEnd = (index: number) => ripples.value = new Ripple(ripple.value, ripples.value).end(index);
</script>

<template>
    <div ref="ripple" @click="animateRipple($event); emit('open')" class="w-[calc(100%-8rem)] p-4
    text-slate-800 cursor-pointer overflow-hidden relative [&>*:not(section)]:relative [&>*:not(section)]:z-[10]">
        <div class="flex items-center gap-2">
            <b class="text-sm xx:text-base font-semibold md:text-sm lg:text-base">No. {{ data.id }}</b>
            <Spinner v-if="openload" is="lazy-ring" :width="16" stroke="stroke-slate-800" />
        </div>
        <h4 class="font-bold !text-base xx:!text-lg xs:!text-xl md:!text-base lg:!text-lg xl:!text-xl mb-3 capitalize
            whitespace-nowrap overflow-hidden text-ellipsis" :class="{ '!text-fill-1': noDetail }">
            {{ noDetail ? 'Detail belum tersedia!' : data.name }}</h4>
        <div class="flex gap-2 items-center">
            <div v-for="poketype in data.types" :class="[`bg-${poketype}-1`, isMain ? 'lg:pr-[.6rem]' : '2xl:pr-[.6rem]']"
                class="h-8 w-fit flex items-center gap-[.3rem] p-1 xs:pr-[.6rem] md:pr-1 rounded-[1rem]">
                <div class="h-6 w-6 bg-white rounded-full grid place-items-center">
                    <TypeIcon :is="poketype" :height="15" />
                </div>
                <span :class="isMain ? 'lg:block' : '2xl:block'"
                    class="hidden xs:block md:hidden text-white text-xs font-semibold drop-shadow capitalize">
                    {{ poketype }}</span>
            </div>
        </div>
        <Ripples v-model="ripples" @ripple-end="k => rippleEnd(k)" color="slate-200/60" />
    </div>
</template>