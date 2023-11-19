<script setup lang="ts">
import { ref, computed, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import PokemonCards from "~/PokemonCards.vue";
import Footer from "~/Footer.vue";
import Regions from "~/Regions.vue";
import TypeIcon from "~/TypeIcon.vue";
import { useMainStore } from "@/stores"
import SidePage from "~/SidePage.vue"
import { storeToRefs } from 'pinia';
import { TrashSolid, ArrowLeft, Heart } from "@iconoir/vue";
import { getAssets } from "~/.";

const store = useMainStore()
const { page, pokemons, favourite, spread, pokemon } = storeToRefs(store)

const regionSubPage = ref(0)
const regionPageName = reactive({ text: 'Kanto', back: true })
const search = ref('')
const hearts = ref(favourite.value)
const slideStates = ref(Array(pokemons.value.length).fill(false))

const cardActions = [
    { label: 'remove', icon: TrashSolid, color: { init: 'rose-500', hover: 'rose-500/80' }, async: false },
]

const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
    hearts.value[index].state = !hearts.value[index].state
    store.$patch({ favourite: hearts.value })
    setTimeout(() => { endload() }, 1000)
}

onMounted(() => {
    slideStates.value = Array(pokemons.value.length).fill(false)
})

const getEvolution = async () => {

}
</script>

<template>
    <div class="flex transition duration-500 [&>*]:h-[calc(100vh-60px)] [&>*]:min-w-full [&>*]:z-[1]
        [&>*]:overflow-x-hidden [&>*]:overflow-y-auto" :style="{ transform: `translateX(-${page * 100}%)` }">
        <section>
            <PokemonCards v-model:text="search" name="home-filter" @open-sorter="false" @open-types="false" :heart="hearts"
                @heart="handleFavourite" :data="pokemons" @open-card="false" />
        </section>
        <section>
            <div class="flex w-full h-full transition duration-500 [&>*]:min-w-full [&>*]:z-[1]"
                :style="{ transform: `translateX(-${regionSubPage * 100}%)` }">
                <div class="p-6 pb-12 overflow-y-auto text-slate-800">
                    <b class="text-lg xs:text-xl">Wilayah</b>
                    <p class="text-sm xs:text-base mt-1 mb-6">Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu
                        inginkan</p>
                    <Regions :data="Object.keys(spread)"
                        @open="name => { regionSubPage = 1; regionPageName.text = name }" />
                </div>
                <div class="overflow-hidden">
                    <PokemonCards v-model:text="search" name="region-filter" :page-name="regionPageName" subpage
                        @back="regionSubPage = 0" @open-sorter="false" @open-types="false" :heart="hearts"
                        @heart="handleFavourite" :data="pokemons" @open-card="false" />
                </div>
            </div>
        </section>
        <section>
            <PokemonCards v-model:text="search" name="favourite-filter" :page-name="{ text: 'Favourite' }"
                @open-sorter="false" @open-types="false" :data="pokemons" @open-card="false" :actions="cardActions"
                @action="false" />
        </section>
        <section class="bg-yellow-500"></section>
        <section class="bg-pink-500"></section>
    </div>
    <Footer />
    <SidePage :data="pokemon" />
</template>