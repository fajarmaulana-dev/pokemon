<script setup lang="ts">
import { toRefs, ref, computed } from '@vue/reactivity';
import { onMounted, watch } from '@vue/runtime-core';
import { NavArrowDown, Search, ArrowLeft } from 'iconoir-vue/regular';
import type { PropType, SVGAttributes } from 'vue';
import TextBox from './TextBox.vue';
import Spinner from './Spinner.vue';
import { useMainStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { getTypesColor, typesLabel } from "./Func/method";

const emit = defineEmits(['update:text', 'back', 'openFilter', 'chooseRegion', 'allRegion', 'chooseFilter'])
const props = defineProps({
    text: {
        type: String as PropType<string>,
        default: ''
    },
    types: {
        type: Array as PropType<string[]>,
        default: ['', 'grass', 'poison', 'fire', 'flying', 'water', 'bug']
    },
    label: {
        type: Object as PropType<Record<string, string>>,
        default: { type: '', sort: 'Nomor 1 - N' }
    },
    load: {
        type: Object as PropType<Record<string, boolean>>,
        default: { type: false, sort: false, search: false, region: false }
    },
    name: {
        type: String as PropType<string>,
        default: ''
    },
    pageName: {
        type: Object as PropType<{ text: string, back?: boolean, icon: (props: SVGAttributes) => any }>,
        default: { text: '', back: false, icon: ArrowLeft }
    },
    disabled: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    isMain: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    regions: {
        type: Object as PropType<{ data: string[], selected: string }>,
        default: { data: ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'hisui', 'paldea'], selected: '' },
    }
})

const { text, name, pageName, label, load, disabled, isMain, regions, types } = toRefs(props)
const store = useMainStore()
const { page } = storeToRefs(store)

const options = ref<any>({ type: undefined, sort: undefined })
const optionsHeight = ref<Record<string, number>>({ type: 0, sort: 0 })
const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

const getOptionsHeight = () => {
    const arr = Object.keys(optionsHeight.value).map((key) => {
        let top = 0
        if (options.value[key]) top = options.value[key].getBoundingClientRect().top + 20
        const result = window.innerHeight - top - 20
        return result >= 64 ? result > 280 ? 280 : result : 0
    })
    optionsHeight.value = Object.fromEntries(['type', 'sort'].map((i, idx) => [i, arr[idx]]))
}

onMounted(() => {
    if (window.innerWidth >= 768) {
        setTimeout(() => { getOptionsHeight() }, 0)
    }
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth
        screenHeight.value = window.innerHeight
    })
})

watch([screenWidth, screenHeight], () => {
    if (screenWidth.value >= 768) getOptionsHeight()
})

const fullPlaceholder = computed(() => {
    const searchIsActive = document.activeElement?.id == name.value
    return screenWidth.value < 360 || screenWidth.value >= 640 || searchIsActive
})

const typeSelected = computed(() => {
    if (label.value.type == '') return 'first:bg-slate-300/80 hover:first:bg-slate-300/90 active:first:bg-slate-300'
    else return `first:bg-${label.value.type}-1/50 hover:first:bg-${label.value.type}-1/60 active:first:bg-${label.value.type}-1/70`
})

const regionStye = 'relative h-8 text-[.825rem] min-w-fit w-full px-2.5 rounded-2xl grid place-items-center border-2 transition duration-300 overflow-hidden'
const unselectedRegion = 'border-slate-500/60 text-slate-500/60 bg-white font-medium hover:border-slate-500/80 hover:text-slate-500/80 active:border-slate-500 active:text-slate-500 cursor-pointer'
const selectedRegion = 'border-rose-200 text-slate-800 bg-rose-200 font-semibold hover:border-rose-200 hover:bg-rose-200 active:border-rose-200 active:bg-rose-200 cursor-default'

const onChooseRegion = (r: string) => {
    if (page.value.name !== 'wilayah') {
        store.$patch({ page: { name: 'wilayah', index: 1 } })
    }
    emit('chooseRegion', r)
}

const filters = computed<Record<string, string[]>>(() => {
    return {
        type: types.value,
        sort: ['Nomor 1 - N', 'Nomor N - 1', 'Nama A - Z', 'Nama Z - A']
    }
})

const optionsIsOpen = ref(false)
const closeOptions = (type: string) => {
    if (screenWidth.value >= 768) {
        optionsIsOpen.value = false;
        options.value[type].scrollTop = 0
    }
}
</script>

<template>
    <header class="w-full bg-white fixed md:sticky top-0 z-[3] transition-shadow duration-[.4s] shadow-[1px_0_10px_1px]
        shadow-gray-200 select-none">
        <div class="px-4 pt-2 flex items-center translate-y-1">
            <i v-if="pageName.back" @click="emit('back')" class="w-7 h-7 -translate-x-1 rounded-full grid place-items-center cursor-pointer
                bg-fill-0/0 hover:bg-fill-0/30 active:bg-fill-0/50 transition duration-[.4s]">
                <component :is="pageName.icon" class="h-[15px] w-[15px] [&>*]:stroke-slate-800 [&>*]:stroke-[4]">
                </component>
            </i>
            <h1 v-if="pageName.text !== ''" class="text-lg font-bold text-slate-800 capitalize">{{ pageName.text }}
            </h1>
        </div>
        <div :class="isMain ? 'xl:flex-row' : '2xl:flex-row'"
            class="w-full bg-white flex flex-col xs:flex-row md:flex-col items-center justify-between [&>*]:px-4 xs:[&>*]:p-4">
            <div :class="isMain ? 'xl:!pt-0' : '2xl:!pt-0'" class="flex items-center w-full pt-4 pb-2 md:!pt-3 md:!pb-0">
                <div class="relative w-full">
                    <TextBox :id="name" :name="name" :prepend-icon="Search" :model-value="text"
                        @update:model-value="val => emit('update:text', val)" :disabled="disabled"
                        :placeholder="`Cari${fullPlaceholder ? ' pokemon disini' : ''} ...`" />
                    <div v-if="load.search" class="w-[18px] bg-white absolute left-3 inset-y-1.5 grid place-items-center
                            pointer-events-none transition duration-300">
                        <Spinner is="lazy-ring" :width="18" stroke="stroke-slate-800" />
                    </div>
                </div>
            </div>
            <div :class="isMain ? 'lg:flex-row' : 'xl:flex-row'"
                class="flex items-center justify-center pb-4 pt-2 xs:justify-end flex-col xx:flex-row md:flex-col gap-x-4 gap-y-2 w-full">
                <div :class="[typeSelected, { 'pointer-events-none': disabled, 'group': optionsIsOpen }, isMain ? 'xl:w-fit' : '2xl:w-fit']"
                    v-for="filter in ['type', 'sort']" class="last:bg-slate-300/80 hover:last:bg-slate-300/90
                    active:last:bg-slate-300 flex items-center justify-between transition duration-300 cursor-pointer
                    h-10 rounded-full w-full xs:w-fit md:w-full relative" @mouseover="optionsIsOpen = true"
                    @mouseleave="closeOptions(filter)" @click="emit('openFilter', filter)">
                    <span :class="isMain ? 'xl:w-[120px]' : '2xl:w-[120px]'" class="font-semibold text-slate-800 w-full xs:w-[120px] md:w-full
                        text-center pl-5 whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                        {{ filter == 'type' ? label.type == '' ? 'semua tipe' : label.type : label.sort }}</span>
                    <Spinner v-if="load[filter]" class="pr-3 pl-2" is="lazy-ring" :width="20" stroke="stroke-slate-800" />
                    <i v-else class="pr-3 pl-2">
                        <NavArrowDown class="h-5 w-5 [&>*]:stroke-[3] [&>*]:stroke-slate-800" />
                    </i>
                    <div v-if="screenWidth >= 768" class="absolute w-full scale-y-0 group-hover:scale-y-100 origin-top transition
                        duration-500 top-10 cursor-default min-w-fit" :class="filter == 'type' ? 'z-[11]' : 'z-10'">
                        <div :ref="e => { options[filter] = e }" :style="{ maxHeight: `${optionsHeight[filter]}px` }"
                            class="bg-rose-50 rounded-[20px] flex flex-wrap gap-3 xl:gap-3 p-4 xl:p-3 mt-2 h-fit min-w-fit overflow-y-auto filter">
                            <span v-for="item, idx in filters[filter]" :class="getTypesColor(item, idx, filter)"
                                @click="closeOptions(filter); emit('chooseFilter', { filter, item })"
                                :style="`--i:${(idx + 1) / 15}s`" class="grow basis-[248px] min-h-[2.5rem] cursor-pointer px-4 xl:px-3
                                rounded-lg text-slate-800 font-semibold flex justify-center items-center w-full
                                whitespace-nowrap">{{ filter == 'type' ? `Tampilkan ${typesLabel(idx, item)}` : item }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isMain" class="relative">
            <div class="w-full pb-4 px-4 xl:pt-0.5 flex gap-2 overflow-x-auto filter">
                <button :disabled="regions.selected == '' || load.region"
                    @click="store.$patch({ page: { name: 'beranda', index: 0 } }); emit('allRegion')"
                    :class="[regionStye, regions.selected == '' ? selectedRegion : unselectedRegion]">Semua Wilayah</button>
                <button v-for="r in regions.data" :disabled="regions.selected == r || load.region"
                    @click="onChooseRegion(r)" class="relative"
                    :class="[regionStye, regions.selected == r ? selectedRegion : unselectedRegion, { '!cursor-wait': load.region }]">
                    <span>{{ r }}</span>
                    <div v-if="regions.selected == r && load.region"
                        class="absolute inset-0 bg-slate-100/50 grid place-items-center">
                        <Spinner is="lazy-ring" :width="15" stroke="stroke-fill-1" />
                    </div>
                </button>
            </div>
            <span v-for="i in 2" :class="i == 1 ? 'bg-gradient-to-r left-0' : 'bg-gradient-to-l right-0'"
                class="absolute w-4 -translate-y-2 from-white via-white to-transparent inset-y-0"></span>
        </div>
    </header>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}

.rounded-lg {
    transform: translateX(calc(-100% - 18px));
    transition: .3s;
}

.group:hover .rounded-lg {
    transform: translateX(0);
    transition: transform .3s linear var(--i), background-color .3s;
}
</style>