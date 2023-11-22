<script setup lang="ts">
import api from "@/api"
import { ref, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useMainStore } from "@/stores";
import { storeToRefs } from "pinia";

const store = useMainStore()
const { pokemons } = storeToRefs(store)

// const weakness: { name: string, weak: string[] }[] = []
// try {
//   const types = await get('/type')
//   const allTypes = types.results.map((t: ShortResult) => t.name)
//   for (let i = 1; i <= 18; i++) {
//     const type_detail = await get('/type/' + allTypes[i])
//     const weakArr = type_detail.damage_relations.double_damage_from.map((data: ShortResult) => data.name)
//     weakness.push({ name: allTypes[i], weak: weakArr })
//   }
// } catch (error) {
//   console.log(error)
// }

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

// const descArr: { name: string, description: string }[] = []
// try {
//   const species = await get('/pokemon-species?limit=1020')
//   const allSpecies = species.results.map((t: ShortResult) => t.name)
//   for (const name of allSpecies) {
//     const getDesc = await get('/pokemon-species/' + name)
//     let variantChoosen = getDesc.flavor_text_entries[0]
//     if (variantChoosen) {
//       const texts: string[] = []
//       getDesc.flavor_text_entries.forEach((i: any) => {
//         if (i.version.name == variantChoosen.version.name && i.language.name == 'en') {
//           texts.push(i.flavor_text)
//         }
//       })
//       descArr.push({ name, description: [`Description for the ${variantChoosen.version.name} variant.`, ...texts].join(' ').trim() })
//     }
//   }
// } catch (error) {
//   console.log(error)
// }
// const weaks = weakness.filter((data) => types.includes(data.name)).map((w) => w.weak).flat()
// const desc = descArr.find((d) => d.name == data.name)
// const female = genders.find((d) => d.name == data.name)
</script>

<template>
    <div class="flex items-center flex-col gap-4 p-20">
        <div>
            <button class="h-40 px-8">Get All Pokemon</button>
            <p>{{ pokemons }}</p>
        </div>
    </div>
</template>