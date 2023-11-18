<script setup lang="ts">
import api from "@/api"
import { ref, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useMainStore } from "@/stores";
import { storeToRefs } from "pinia";

const store = useMainStore()
const { pokemons } = storeToRefs(store)

// let weakness
// const getWeakness = async () => {
//   try {
//     const type_detail = await get('/type/' + id)
//     weakness = type_detail.damage_relations.double_damage_from.map((data: ShortResult) => data.name)
//     console.log(id, weakness)
//   } catch (err) {
//     weakness = []
//   }
// }
// await getWeakness()
// const gender_female = await get('/gender/1')
// const genders = gender_female.pokemon_species_details.map((data: { pokemon_species: ShortResult, rate: number }) => {
//   return { name: data.pokemon_species.name, possibility: data.rate }
// }) as { name: string, possibility: number }[]

// for (let i = 2; i <= 3; i++) {
//   const gender = await get('/gender/' + i)
//   gender.pokemon_species_details.forEach((data: { pokemon_species: ShortResult, rate: number }) => {
//     if (!genders.map((g) => g.name).includes(data.pokemon_species.name)) {
//       genders.push({ name: data.pokemon_species.name, possibility: i == 2 ? 8 - data.rate : data.rate })
//     }
//   })
// }
// console.log(genders)
// const evolution: string[] = [data.name]

// const get_evolution = async () => {
//   try {
//     const evolve = await get('/evolution-chain/' + id)
//     if (evolve.chain.evolves_to.length > 0) {
//       let evolution_chain: Record<string, any> = evolve.chain.evolves_to[0]
//       while (Object.keys(evolution_chain).includes('evolves_to')) {
//         evolution.push(evolution_chain.species.name)
//         evolution_chain = evolution_chain.evolves_to[0]
//       }
//     }
//   } catch (err) { return }
// }

// await get_evolution()
</script>

<template>
    <div class="flex items-center flex-col gap-4 p-20">
        <div>
            <button class="h-40 px-8">Get All Pokemon</button>
            <p>{{ pokemons }}</p>
        </div>
    </div>
</template>