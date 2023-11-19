<script setup lang="ts">
import type { PokemonCard, PokemonCardAction } from "@/types";
import type { PropType } from "vue";
import PokeCard from "./PokemonCard.vue"
import PokemonFilter from "./PokemonFilter.vue";
import { toRefs, computed } from "@vue/reactivity";

const emit = defineEmits(['openCard', 'heart', 'update:slide', 'action', 'openTypes', 'openSorter', 'update:text', 'back'])
const props = defineProps({
    slide: {
        type: Array as PropType<boolean[]>,
        default: []
    },
    heart: {
        type: Array as PropType<{ id: string, state: boolean }[]>,
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
    },
    subpage: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { slide, heart, data, actions, text, typeLabel, sortLabel, name, pageName, subpage } = toRefs(props)
const headerHeight = computed(() => {
    if (subpage.value) return 'mt-[208px] h-[calc(100vh-264px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)]'
    else {
        if (pageName.value.text == '' || pageName.value.back) return 'mt-[172px] h-[calc(100vh-228px)] xx:mt-[128px] xx:h-[calc(100vh-188px)] xs:mt-[76px] xs:h-[calc(100vh-136px)]'
        else return 'mt-[208px] h-[calc(100vh-264px)] xx:mt-[164px] xx:h-[calc(100vh-224px)] xs:mt-[112px] xs:h-[calc(100vh-172px)]'
    }
})
</script>

<template>
    <PokemonFilter :model-value="text" @update:text="val => emit('update:text', val)" :name="name" :page-name="pageName"
        :type-label="typeLabel" :sort-label="sortLabel" @open-types="emit('openTypes')" @open-sorter="emit('openSorter')"
        @back="emit('back')" />
    <main class="overflow-y-hidden" :class="headerHeight">
        <div class="p-6 pt-6 pb-12 h-full overflow-y-auto">
            <PokeCard :model-value="slide" @update:model-value="val => emit('update:slide', val)" :heart="heart"
                :data="data" :actions="actions" @open="idx => emit('openCard', idx)"
                @heart="({ index, endload }) => emit('heart', { index, endload })"
                @action="({ label, index }) => emit('action', { label, index })" />
        </div>
    </main>
</template>