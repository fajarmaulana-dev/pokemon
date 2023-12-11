<script setup lang="ts">
import { ref, computed, toRefs } from "@vue/reactivity";
import PokemonCards from "./PokemonCards.vue";
import { useMainStore } from "@/stores";
import DesktopLayout from "./DesktopLayout.vue";
import { storeToRefs } from 'pinia';
import { ArrowLeft, Pokeball, Heart } from "@iconoir/vue";
import { toTop } from "./Func/method"
import type { PropType, SVGAttributes } from "vue";
import type { Favourite, Filter, PokemonCard, PokemonCardAction } from "@/types";

const emit = defineEmits(['update:pokedex', 'desktopRegion', 'mobileRegion', 'allRegion', 'openFilter', 'handleFavourite', 'cardConfirm', 'openCard', 'chooseFilter', 'unCatch', 'unFavourite', 'sign', 'refresh'])
const props = defineProps({
    filterLoad: {
        type: Object as PropType<Record<string, Record<string, boolean>>>,
        default: {}
    },
    filter: {
        type: Object as PropType<Record<string, Filter>>,
        default: {}
    },
    search: {
        type: Object as PropType<Record<string, string>>,
        default: {}
    },
    filterLabel: {
        type: Object as PropType<Record<string, Record<string, string>>>,
        default: {}
    },
    filteredPokemon: {
        type: Object as PropType<Record<string, PokemonCard[]>>,
        default: {}
    },
    filteredFavourite: {
        type: Object as PropType<Record<string, Favourite[]>>,
        default: {}
    },
    onBottom: {
        type: Object as PropType<Record<string, boolean>>,
        default: {}
    },
    error: {
        type: Object as PropType<Record<string, boolean>>,
        default: {}
    },
    availableType: {
        type: Object as PropType<Record<string, string[]>>,
        default: {}
    },
    cardSlideState: {
        type: Object as PropType<Record<string, boolean[]>>,
        default: {}
    },
    pokedex: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    forPokedex: {
        type: String as PropType<string>,
        default: 'beranda'
    },
    disableFilter: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    allCatched: {
        type: Array as PropType<string[]>,
        default: []
    },
    confirmData: {
        type: Object as PropType<Record<string, { text: string, confirm: { state: boolean, index: number } }>>,
        default: {}
    },
    cardActions: {
        type: Array as PropType<PokemonCardAction[]>,
        default: []
    },
    user: {
        type: Object as PropType<{ name: string, email: string, image: string }>,
        default: { name: 'Fajar Maulana', email: 'm.fajars.net@gmail.com', image: '' }
    },
    isLogin: {
        type: Boolean as PropType<boolean>,
        default: true
    },
    refreshLoad: {
        type: Object as PropType<Record<string, boolean>>,
        default: {}
    },
    subPage: {
        type: Number as PropType<number>,
        default: 0
    },
    subName: {
        type: Object as PropType<{ text: string, back?: boolean, icon: (props: SVGAttributes) => any }>,
        default: {}
    },
})

const { filterLoad, filter, search, filterLabel, filteredPokemon, filteredFavourite, onBottom, error, availableType, cardSlideState, pokedex, forPokedex, disableFilter, allCatched, confirmData, cardActions, user, isLogin } = toRefs(props)

const store = useMainStore()
const { page, regions } = storeToRefs(store)

const deskOpenRegion = async (name: string) => {
    toTop('beranda')
    emit('desktopRegion', name)
}

const deskRegionData = computed(() => {
    return { data: Object.keys(regions.value), selected: forPokedex.value == 'beranda' ? '' : filter.value['wilayah'].region }
})

const layerStyle = {
    wrapper: 'bg-white rounded-2xl shadow-[0_0_10px_2px] shadow-gray-200/40 overflow-hidden z-0 relative',
    content: 'absolute left-0 h-20 w-full bg-rose-200 hover:bg-rose-300 active:bg-red-200 transition duration-300 rounded-2xl shadow-[0_0_10px_2px] shadow-gray-200/40 px-4 flex items-center justify-between gap-2 cursor-pointer'
}

const pokedexIsOpen = ref(false)
const dexIndex = (i: number) => pokedexIsOpen.value ? i == 0 ? 0 : 1 : i == 0 ? 1 : 0;
const deskHome = computed(() => {
    if (['beranda', 'wilayah'].includes(page.value.name)) {
        return page.value.name == 'beranda' ? 'beranda' : 'wilayah'
    } else {
        const p = deskRegionData.value.selected == '';
        return p ? 'beranda' : 'wilayah'
    }
})
const handleDeskDex = (name: string) => {
    if (forPokedex.value !== name) {
        if (name == 'pokedex' && !pokedex.value) emit('update:pokedex', true);
        else {
            emit('update:pokedex', false);
            if (name == 'favorit') store.$patch({ page: { name, index: 2 } })
            else {
                const p = deskRegionData.value.selected == ''
                store.$patch({ page: { name: p ? 'beranda' : 'wilayah', index: p ? 0 : 1 } })
            }
        }
    }
}

const models = computed(() => {
    return {
        filter: filter.value,
        search: search.value,
        confirmData: confirmData.value,
        onBottom: onBottom.value,
        cardSlideState: cardSlideState.value,
        availableType: availableType.value
    }
})
const types = computed(() => ['', ...models.value.availableType[forPokedex.value]])
</script>

<template>
    <DesktopLayout :is-login="isLogin" :data="user" @sign="emit('sign')">
        <template #0>
            <div class="flex gap-5">
                <div
                    class="filter bg-white rounded-2xl h-full w-full shadow-[0_0_10px_2px] shadow-gray-200/40 overflow-y-auto">
                    <PokemonCards :id="deskHome" v-model:text="models.search[deskHome]" name="home-desktop-filter"
                        :label="filterLabel[deskHome]" :load="filterLoad[deskHome]" :disable-filter="disableFilter"
                        @open-filter="val => emit('openFilter', val)" @heart="val => emit('handleFavourite', val)"
                        :catched="allCatched" :regions="deskRegionData" :data="filteredPokemon[deskHome]"
                        :heart="filteredFavourite[deskHome]" :types="types" @hover="handleDeskDex('beranda')"
                        @confirm="({ index }) => emit('cardConfirm', { index, name: deskHome })" is-main
                        :error="error[deskHome]" v-model:confirm="models.confirmData[deskHome].confirm"
                        @open-card="val => emit('openCard', val)" v-model:loadmore="models.filter[deskHome].next"
                        v-model:on-bottom="models.onBottom[deskHome]" @choose-region="deskOpenRegion"
                        @all-region="toTop('wilayah'); emit('allRegion')" :refresh-load="refreshLoad[deskHome]"
                        @refresh="emit('refresh')"
                        @choose-filter="({ filter, item }) => emit('chooseFilter', { is: filter, item })" />
                </div>
                <div class="h-full min-w-[20rem] w-[65%] xl:w-[50%] flex flex-col gap-3.5">
                    <div v-for="name, i in ['pokedex', 'favorit']" :class="['h-full', 'min-h-[5rem] h-20'][dexIndex(i)]"
                        class="rounded-2xl w-full overflow-hidden relative" style="transition: .5s;">
                        <div :class="[layerStyle.wrapper, ['h-full', 'min-h-[5rem] h-20'][dexIndex(i)]]"
                            style="transition: .5s;">
                            <PokemonCards :id="name" v-model:text="models.search[name]" :name="`${name}-desktop-filter`"
                                :page-name="{ text: name[0].toUpperCase() + name.slice(1, name.length), icon: ArrowLeft }"
                                @open-filter="val => emit('openFilter', val)" :label="filterLabel[name]"
                                @hover="handleDeskDex(name)" :disable-filter="disableFilter" :load="filterLoad[name]"
                                :data="filteredPokemon[name]" @open-card="val => emit('openCard', val)" :error="error[name]"
                                v-model:loadmore="models.filter[name].next" :actions="cardActions" :types="types"
                                @action="val => { i == 0 ? emit('unCatch', val) : emit('unFavourite', val) }"
                                v-model:on-bottom="models.onBottom[name]" v-model:slide="models.cardSlideState[name]"
                                @choose-filter="({ filter, item }) => emit('chooseFilter', { is: filter, item })"
                                :refresh-load="refreshLoad[name]" @refresh="emit('refresh')" />
                        </div>
                        <div @click="pokedexIsOpen = i == 0 ? true : false" class="z-[1]" style="transition: .5s;"
                            :class="[layerStyle.content, pokedexIsOpen ? i == 0 ? '-top-20' : 'bottom-0' : i == 0 ? 'top-0' : '-bottom-20']">
                            <span class="text-xl font-bold text-slate-800 capitalize">{{ name }}</span>
                            <component :is="i == 0 ? Pokeball : Heart" color="rgb(30,41,59)" width="32" height="32"
                                stroke-width="3"></component>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #1>
            <div class="w-full h-full bg-orange-500"></div>
        </template>
        <template #2>
            <div class="w-full h-full bg-amber-500"></div>
        </template>
        <template #3>
            <div class="w-full h-full bg-green-500"></div>
        </template>
        <template #4>
            <div class="w-full h-full bg-blue-500"></div>
        </template>
        <template #5>
            <div class="w-full h-full bg-fuchsia-500"></div>
        </template>
    </DesktopLayout>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}
</style>