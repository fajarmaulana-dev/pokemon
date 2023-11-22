<script setup lang="ts">
import type { PokemonCard, PokemonCardAction, Favourite } from "@/types";
import type { PropType, SVGAttributes } from "vue";
import PokeCard from "./PokemonCard.vue"
import PokemonFilter from "./PokemonFilter.vue";
import { toRefs, computed } from "@vue/reactivity";
import { ArrowLeft } from "@iconoir/vue";

const emit = defineEmits(['openCard', 'heart', 'update:slide', 'action', 'openFilter', 'update:text', 'back', 'update:onBottom', 'update:loadmore', 'confirm', 'update:confirm'])
const props = defineProps({
    slide: {
        type: Array as PropType<boolean[]>,
        default: []
    },
    heart: {
        type: Array as PropType<Favourite[]>,
        default: []
    },
    data: {
        type: Array as PropType<PokemonCard[]>,
        default: []
    },
    actions: {
        type: Array as PropType<PokemonCardAction[]>,
        default: []
    },
    loadmore: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    catched: {
        type: Array as PropType<string[]>,
        default: []
    },
    confirm: {
        type: Object as PropType<{ state: boolean, index: number }>,
        default: { state: false, index: 0 }
    },
    text: {
        type: String as PropType<string>,
        default: ''
    },
    label: {
        type: Object as PropType<Record<string, string>>,
        default: { type: '', sort: 'Nomor 1 - N' }
    },
    load: {
        type: Object as PropType<Record<string, boolean>>,
        default: { type: false, sort: false }
    },
    name: {
        type: String as PropType<string>,
        default: ''
    },
    pageName: {
        type: Object as PropType<{ text: string, back?: boolean, icon: (props: SVGAttributes) => any }>,
        default: { text: '', back: false, icon: ArrowLeft }
    },
    subpage: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    onBottom: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    id: String as PropType<string>,
})

const { slide, heart, data, actions, text, label, load, confirm, name, pageName, subpage, loadmore, onBottom, id, catched } = toRefs(props)
const headerHeight = computed(() => {
    if (subpage.value) return 'mt-[208px] h-[calc(100vh-264px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)]'
    else {
        if (pageName.value.text == '' || pageName.value.back) return 'mt-[178px] h-[calc(100vh-234px)] xx:mt-[128px] xx:h-[calc(100vh-188px)] xs:mt-[76px] xs:h-[calc(100vh-136px)]'
        else return 'mt-[208px] h-[calc(100vh-264px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)]'
    }
})

const onScroll = ({ target }: any) => {
    const { scrollTop, offsetHeight, scrollHeight } = target
    if (scrollTop + offsetHeight >= (scrollHeight - 20)) emit('update:onBottom', true);
}

const loadMore = computed(() => loadmore.value && onBottom.value)
</script>

<template>
    <PokemonFilter :text="text" @update:text="val => emit('update:text', val)" :name="name" :page-name="pageName"
        :label="label" :load="load" @open-filter="filter => emit('openFilter', filter)" @back="emit('back')" />
    <main class="overflow-y-hidden" :class="headerHeight">
        <div v-if="data.length > 0" :id="id" class="p-6 pt-6 pb-12 h-full overflow-y-auto" @scroll="onScroll">
            <PokeCard :slide="slide" @update:slide="val => emit('update:slide', val)" :heart="heart" :loadmore="loadMore"
                :data="data" :actions="actions" @open="idx => emit('openCard', idx)" :catched="catched"
                @heart="val => emit('heart', val)" @confirm="val => emit('confirm', val)" :confirm="confirm"
                @update:confirm="val => emit('update:confirm', val)" @action="val => emit('action', val)" />
        </div>
        <div v-else class="h-full w-full flex justify-center items-center flex-col gap-6">
            <img src="@/assets/notfound.avif" width="240" class="w-[180px] sm:w-[240px]" alt="not found image" />
            <div class="flex flex-col text-center">
                <b class="text-2xl text-fill-1 mb-1">404 Not Found</b>
                <span class="text-slate-800 leading-[1.4rem] max-w-[75vw]">
                    Oopss... Pokemon yang kamu cari tidak tersedia disini</span>
            </div>
        </div>
    </main>
</template>