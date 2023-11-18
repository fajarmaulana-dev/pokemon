<script setup lang="ts">
import { ref, computed } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import PokemonFilter from "~/PokemonFilter.vue";
import Footer from "~/Footer.vue";
import PokemonCard from "~/PokemonCard.vue"
import { useMainStore } from "@/stores"
import { storeToRefs } from 'pinia';
import { TrashSolid } from "@iconoir/vue";

const store = useMainStore()
const { page, pokemons, favourite } = storeToRefs(store)

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
</script>

<template>
    <div class="flex transition duration-500 [&>*]:h-screen [&>*]:min-w-full [&>*]:z-[1] [&>*]:overflow-x-hidden
        [&>*]:overflow-y-auto" :style="{ transform: `translateX(-${page * 100}%)` }">
        <section class="">
            <PokemonFilter v-model="search" />
            <main
                class="mt-[172px] h-[calc(100vh-228px)] xx:mt-[128px] xx:h-[calc(100vh-188px)] xs:mt-[76px] xs:h-[calc(100vh-136px)] overflow-hidden">
                <div class="p-6 pb-12 h-full overflow-y-auto">
                    <PokemonCard v-model="slideStates" :heart="hearts" @heart="handleFavourite" :data="pokemons"
                        :actions="cardActions" />
                </div>
            </main>
        </section>
        <section class="bg-blue-500"></section>
        <section class="bg-green-500"></section>
        <section class="bg-yellow-500"></section>
        <section class="bg-pink-500"></section>
    </div>
    <Footer />
    <!-- <aside></aside> -->
</template>