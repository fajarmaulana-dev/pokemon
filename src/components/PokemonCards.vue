<script setup lang="ts">
import type { PokemonCard, PokemonCardAction, Favourite } from "@/types";
import type { PropType, SVGAttributes } from "vue";
import PokeCard from "./PokemonCard.vue"
import PokemonFilter from "./PokemonFilter.vue";
import { toRefs, computed } from "@vue/reactivity";
import { ArrowLeft } from "@iconoir/vue";
import NotFound from "~/NotFound.vue"

const emit = defineEmits(['openCard', 'heart', 'update:slide', 'action', 'openFilter', 'update:text', 'back', 'update:onBottom', 'update:loadmore', 'confirm', 'update:confirm', 'chooseRegion', 'hover', 'allRegion', 'chooseFilter', 'refresh'])
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
    subpage: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    onBottom: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    id: String as PropType<string>,
    disableFilter: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    types: {
        type: Array as PropType<string[]>,
        default: ['', 'grass', 'poison', 'fire', 'flying', 'water', 'bug']
    },
    isMain: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    regions: {
        type: Object as PropType<{ data: string[], selected: string }>,
        default: { data: ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'hisui', 'paldea'], selected: '' },
    },
    error: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    refreshLoad: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { slide, heart, data, actions, text, label, load, confirm, name, pageName, subpage, loadmore, onBottom, id, catched, disableFilter, types, isMain, regions, error, refreshLoad } = toRefs(props)
const headerHeight = computed(() => {
    if (subpage.value) return 'mt-[208px] h-[calc(100vh-268px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)] md:mt-0 md:h-[calc(100vh-340px)] xl:h-[calc(100vh-300px)] 2xl:h-[calc(100vh-248px)]'
    else {
        if (pageName.value.text == '' || pageName.value.back) return 'mt-[178px] h-[calc(100vh-238px)] xx:mt-[128px] xx:h-[calc(100vh-188px)] xs:mt-[76px] xs:h-[calc(100vh-136px)] md:mt-0 md:h-[calc(100vh-269px)] lg:h-[calc(100vh-218px)] xl:h-[calc(100vh-170px)]'
        else return 'mt-[208px] h-[calc(100vh-268px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)] md:mt-0 md:h-[calc(100vh-340px)] xl:h-[calc(100vh-300px)] 2xl:h-[calc(100vh-248px)]'
    }
})

const onScroll = ({ target }: any) => {
    const { scrollTop, offsetHeight, scrollHeight } = target
    if (scrollTop + offsetHeight >= (scrollHeight - 20)) emit('update:onBottom', true);
}

const loadMore = computed(() => loadmore.value && onBottom.value)
</script>

<template>
    <div @mouseover="emit('hover')">
        <PokemonFilter :text="text" @update:text="val => emit('update:text', val)" :name="name" :page-name="pageName"
            :label="label" :load="load" @open-filter="filter => emit('openFilter', filter)" @back="emit('back')"
            :disabled="disableFilter" :is-main="isMain" :regions="regions" @choose-region="r => emit('chooseRegion', r)"
            :types="types" @all-region="emit('allRegion')" @choose-filter="val => emit('chooseFilter', val)" />
        <main class="overflow-y-hidden" :class="headerHeight">
            <NotFound v-if="error" :error="error" :load="refreshLoad" @refresh="emit('refresh')" />
            <div v-else-if="data.length > 0" :id="id" class="p-6 pt-6 pb-12 md:pb-6 h-full overflow-y-auto"
                @scroll="onScroll">
                <PokeCard :slide="slide" @update:slide="val => emit('update:slide', val)" :heart="heart"
                    :loadmore="loadMore" :data="data" :actions="actions" @open="idx => emit('openCard', idx)"
                    :catched="catched" @heart="val => emit('heart', val)" @confirm="val => emit('confirm', val)"
                    :confirm="confirm" @update:confirm="val => emit('update:confirm', val)"
                    @action="val => emit('action', val)" :is-main="isMain" />
            </div>
            <NotFound v-else />
        </main>
    </div>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background-color: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgb(254, 205, 211);
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgb(253, 164, 175);
}
</style>