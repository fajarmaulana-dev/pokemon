<script setup lang="ts">
import { toRefs, ref, computed } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { NavArrowDown, Search, ArrowLeft } from '@iconoir/vue';
import type { PropType } from 'vue';
import TextBox from './TextBox.vue';

const emit = defineEmits(['openTypes', 'openSorter', 'update:text', 'back'])
const props = defineProps({
    text: {
        type: String as PropType<string>,
        default: ''
    },
    typeLabel: {
        type: String as PropType<string>,
        default: ''
    },
    sortLabel: {
        type: String as PropType<string>,
        default: 'Nomor 1 - N'
    },
    name: {
        type: String as PropType<string>,
        default: ''
    },
    pageName: {
        type: Object as PropType<{ text: string, back?: boolean }>,
        default: { text: '', back: false }
    }
})

const { text, typeLabel, sortLabel, name, pageName } = toRefs(props)

const screenWidth = ref(window.innerWidth)
onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth
    })
})

const fullPlaceholder = computed(() => {
    const searchIsActive = document.activeElement?.id == name.value
    return screenWidth.value < 360 || screenWidth.value >= 640 || searchIsActive
})
const typeSelected = computed(() => {
    if (typeLabel.value == '') return 'first:bg-slate-300/80 hover:first:bg-slate-300/90 active:first:bg-slate-300'
    else return `first:bg-${typeLabel.value}-1/80 hover:first:bg-${typeLabel.value}-1/90 active:first:bg-${typeLabel.value}-1`
})
</script>

<template>
    <header class="w-full bg-white fixed top-0 z-[3] transition-shadow duration-[.4s] shadow-[1px_0_10px_1px]
        shadow-gray-200 overflow-hidden select-none">
        <div class="px-4 pt-2 flex items-center translate-y-1">
            <i v-if="pageName.back" @click="emit('back')" class="w-7 h-7 -translate-x-1 rounded-full grid place-items-center cursor-pointer
                bg-fill-0/0 hover:bg-fill-0/30 active:bg-fill-0/50 transition duration-[.4s]">
                <ArrowLeft color="rgb(30,41,59)" height="15" width="15" stroke-width="4" />
            </i>
            <h1 v-if="pageName.text !== ''" class="text-lg font-bold text-slate-800 capitalize">{{ pageName.text }}
            </h1>
        </div>
        <div class="w-full bg-white flex flex-col xs:flex-row items-center justify-between [&>*]:px-4 xs:[&>*]:p-4">
            <div class="flex item-center w-full pt-4 pb-2">
                <div class="relative w-full">
                    <TextBox :id="name" :name="name" :prepend-icon="Search" :model-value="text"
                        @update:model-value="val => emit('update:text', val)"
                        :placeholder="`Cari${fullPlaceholder ? ' pokemon disini' : ''} ...`" />
                </div>
            </div>
            <div
                class="flex items-center justify-center pb-4 pt-2 xs:justify-end flex-col xx:flex-row gap-x-4 gap-y-2 w-full">
                <div v-for="i in 2" @click="i == 2 ? emit('openTypes') : emit('openSorter')" class="last:bg-slate-300/80
                hover:last:bg-slate-300/90 active:last:bg-slate-300 flex items-center justify-between transition duration-300
                    cursor-pointer h-[40px] rounded-full w-full xs:w-fit" :class="typeSelected">
                    <span class="font-semibold text-slate-800 w-full xs:w-[110px] text-center xs:text-right pl-5 xs:pl-0
                    whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ i == 1 ? typeLabel == '' ? 'Semua Tipe' : typeLabel : sortLabel }}</span>
                    <i class="pr-3 pl-2">
                        <NavArrowDown color="rgb(30,41,59)" height="20" width="20" stroke-width="3" />
                    </i>
                </div>
            </div>
        </div>
    </header>
</template>