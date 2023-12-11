<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import PokemonCards from "./PokemonCards.vue";
import Regions from "./Regions.vue";
import Footer from "./Footer.vue";
import { useMainStore } from "@/stores";
import { storeToRefs } from 'pinia';
import { ArrowLeft, Xmark } from "@iconoir/vue";
import type { PropType, SVGAttributes } from "vue";
import type { Favourite, Filter, PokemonCard, PokemonCardAction } from "@/types";

const emit = defineEmits(['update:pokedex', 'update:subPage', 'mobileRegion', 'desktopRegion', 'openFilter', 'handleFavourite', 'cardConfirm', 'openCard', 'unCatch', 'unFavourite', 'allRegion', 'chooseFilter', 'sign', 'refresh'])
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
    cardSlideState: {
        type: Object as PropType<Record<string, boolean[]>>,
        default: {}
    },
    pokedex: {
        type: Boolean as PropType<boolean>,
        default: false
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
    subPage: {
        type: Number as PropType<number>,
        default: 0
    },
    subName: {
        type: Object as PropType<{ text: string, back?: boolean, icon: (props: SVGAttributes) => any }>,
        default: {}
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
    availableType: {
        type: Object as PropType<Record<string, string[]>>,
        default: {}
    },
    forPokedex: {
        type: String as PropType<string>,
        default: 'beranda'
    },
})

const { filterLoad, filter, search, filterLabel, filteredPokemon, filteredFavourite, onBottom, error, cardSlideState, pokedex, disableFilter, allCatched, confirmData, cardActions, subPage, subName, user, isLogin } = toRefs(props)

const store = useMainStore()
const { page, regions } = storeToRefs(store)

const models = computed(() => {
    return {
        filter: filter.value,
        search: search.value,
        confirmData: confirmData.value,
        onBottom: onBottom.value,
        cardSlideState: cardSlideState.value,
    }
})
</script>

<template>
    <div class="flex transition duration-500 [&>*]:min-w-full [&>*]:h-[calc(100vh-60px)] [&>*]:z-[1] [&>*]:overflow-x-hidden
        [&>*]:overflow-y-auto" :style="{ transform: `translateX(-${page.index * 100}%)` }">
        <!-- Beranda -->
        <section>
            <PokemonCards id="beranda" v-model:text="models.search['beranda']" name="home-mobile-filter"
                :label="filterLabel['beranda']" :load="filterLoad['beranda']" :disable-filter="disableFilter"
                @open-filter="val => emit('openFilter', val)" @heart="val => emit('handleFavourite', val)"
                :catched="allCatched" v-model:confirm="models.confirmData['beranda'].confirm"
                :data="filteredPokemon['beranda']" v-model:on-bottom="models.onBottom['beranda']"
                @open-card="val => emit('openCard', val)" :error="error['beranda']" :refresh-load="refreshLoad['beranda']"
                @refresh="emit('refresh')" @confirm="({ index }) => emit('cardConfirm', { index, name: 'beranda' })"
                :heart="filteredFavourite['beranda']" v-model:loadmore="models.filter['beranda'].next" />
        </section>
        <!-- Wilayah -->
        <section>
            <div class="flex w-full h-full transition duration-500 [&>*]:min-w-full [&>*]:z-[1]"
                :style="{ transform: `translateX(-${subPage * 100}%)` }">
                <div class="p-6 pb-12 overflow-y-auto text-slate-800">
                    <b class="text-lg xs:text-xl">Wilayah</b>
                    <p class="text-sm xs:text-base mt-1 mb-6">
                        Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu inginkan</p>
                    <Regions :data="Object.keys(regions)" @open="val => emit('mobileRegion', val)" />
                </div>
                <div class="overflow-hidden">
                    <PokemonCards id="wilayah" v-model:text="models.search['wilayah']" name="region-filter"
                        :page-name="subName" subpage @back="emit('update:subPage', 0)" :label="filterLabel['wilayah']"
                        :load="filterLoad['wilayah']" :disable-filter="disableFilter" :error="error['wilayah']"
                        @open-filter="val => emit('openFilter', val)" :heart="filteredFavourite['wilayah']"
                        v-model:confirm="models.confirmData['wilayah'].confirm" @heart="val => emit('handleFavourite', val)"
                        v-model:on-bottom="models.onBottom['wilayah']" @open-card="val => emit('openCard', val)"
                        @confirm="({ index }) => emit('cardConfirm', { index, name: 'wilayah' })"
                        :refresh-load="refreshLoad['wilayah']" @refresh="emit('refresh')" :data="filteredPokemon['wilayah']"
                        v-model:loadmore="models.filter['wilayah'].next" />
                </div>
            </div>
        </section>
        <!-- Favorit -->
        <section>
            <PokemonCards id="favorit" v-model:text="models.search['favorit']" name="favourite-mobile-filter"
                :page-name="{ text: 'Favorit', icon: ArrowLeft }" :label="filterLabel['favorit']"
                :load="filterLoad['favorit']" :disable-filter="disableFilter" @open-filter="val => emit('openFilter', val)"
                :data="filteredPokemon['favorit']" @open-card="val => emit('openCard', val)"
                :refresh-load="refreshLoad['favorit']" @refresh="emit('refresh')"
                v-model:loadmore="models.filter['favorit'].next" :actions="cardActions" :error="error['favorit']"
                @action="val => emit('unFavourite', val)" v-model:on-bottom="models.onBottom['favorit']"
                v-model:slide="models.cardSlideState['favorit']" />
        </section>
        <!-- Profil -->
        <section class="bg-yellow-500">

        </section>
    </div>
    <!-- Footer -->
    <Footer :is-login="isLogin" @pokedex="emit('update:pokedex', true)" @login="emit('sign')" />
    <!-- Pokedex -->
    <section class="pokedex fixed overflow-auto h-screen w-full top-0 bg-white transition duration-500"
        :style="{ transform: `translateY(${pokedex ? '0' : '100'}%)` }">
        <PokemonCards id="pokedex" v-model:text="models.search['pokedex']" name="pokedex-mobile-filter"
            :page-name="{ text: 'Pokedex', back: true, icon: Xmark }" @back="emit('update:pokedex', false)"
            :label="filterLabel['pokedex']" :disable-filter="disableFilter" :load="filterLoad['pokedex']"
            @open-filter="val => emit('openFilter', val)" :data="filteredPokemon['pokedex']" :actions="cardActions"
            @action="val => emit('unCatch', val)" @open-card="val => emit('openCard', val)" :error="error['pokedex']"
            v-model:loadmore="models.filter['pokedex'].next" v-model:on-bottom="models.onBottom['pokedex']"
            v-model:slide="models.cardSlideState['pokedex']" :refresh-load="refreshLoad['pokedex']"
            @refresh="emit('refresh')" />
    </section>
</template>

<style scoped>
.pokedex:deep(#pokedex) {
    padding-top: 3.5rem;
}</style>