<script setup lang="ts">
import { toRefs, ref, computed } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { NavArrowDown, Search } from '@iconoir/vue';
import type { PropType } from 'vue';

const emit = defineEmits(['openTypes', 'openSorter', 'update:modelValue'])
const props = defineProps({
    modelValue: {
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
    }
})

const { modelValue, typeLabel, sortLabel } = toRefs(props)

const screenWidth = ref(window.innerWidth)
const searchFocus = ref(false)
onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth
    })
})

const fullPlaceholder = computed(() => screenWidth.value < 360 || screenWidth.value >= 640 || searchFocus.value)
const typeSelected = computed(() => {
    if (typeLabel.value == '') return 'first:bg-slate-300/80 hover:first:bg-slate-300/90 active:first:bg-slate-300'
    else return `first:bg-${typeLabel.value}-1/80 hover:first:bg-${typeLabel.value}-1/90 active:first:bg-${typeLabel.value}-1`
})
</script>

<template>
    <header class="w-full bg-white flex flex-col xs:flex-row items-center justify-between fixed top 0 z-[3] transition-shadow
        duration-[.4s] shadow-[1px_0_10px_1px] shadow-gray-200 overflow-hidden [&>*]:px-4 xs:[&>*]:p-4 select-none">
        <div class="flex item-center w-full pt-4 pb-2">
            <div class="relative w-full">
                <input type="text" @focus="searchFocus = true" @blur="searchFocus = false" :value="modelValue"
                    spellcheck="false" :placeholder="`Cari${fullPlaceholder ? ' pokemon disini' : ''} ...`"
                    @input="({ target }: any) => emit('update:modelValue', target.value)" class="h-[40px] w-full max-w-[480px]
                    xs:focus:w-80 sm:w-full sm:focus:w-full outline-none border-2 border-slate-500/80 hover:border-slate-500/90
                    focus:border-slate-600/90 transition duration-1000
                    pr-3 pl-9 rounded-full text-[15px] text-slate-800" />
                <i class="absolute left-3 top-[calc(50%-9px)] pointer-events-none text-slate-500/90">
                    <Search color="rgba(100,116,139,0.9)" height="18" width="18" stroke-width="3" />
                </i>
            </div>
        </div>
        <div class="flex items-center justify-center pb-4 pt-2 xs:justify-end flex-col xx:flex-row gap-x-4 gap-y-2 w-full">
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
    </header>
</template>