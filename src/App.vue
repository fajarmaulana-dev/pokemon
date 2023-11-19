<script setup lang="ts">
import { overflowHandler } from "./components";
import { ref } from "@vue/reactivity";
import { onMounted } from '@vue/runtime-core';
import get from "./api";
import { useMainStore } from "./stores";
import type { PokemonCard } from "@/types"
import Local from "./api/local"

type ShortResult = { name: string, url: string }

const store = useMainStore()
const hideSplash = ref(false)
onMounted(async () => {
  document.getElementById("splash")?.remove()
  overflowHandler('hidden')

  const idGetter = (url: string) => url.split('/').slice(-2, -1)[0]

  let spread: Record<string, string[]> = {}
  try {
    const region = await get('/region')
    spread = Object.fromEntries(region.results.map((r: ShortResult) => [r.name, []]))
    region.results.forEach(async (r: ShortResult) => {
      const getPokedex = await get('/region/' + idGetter(r.url));
      let inRegion: string[] = [];
      const updateNames: string[] = getPokedex.pokedexes.map((data: ShortResult) => data.name)
      const merge = async (index: number) => {
        const getPokemon = await get('/pokedex/' + idGetter(getPokedex.pokedexes[index].url))
        getPokemon.pokemon_entries.forEach((data: { pokemon_species: ShortResult }) => {
          if (!inRegion.includes(data.pokemon_species.name)) {
            inRegion.push(data.pokemon_species.name)
          }
        })
      }
      if (updateNames.some((name) => name.startsWith('updated') || name.startsWith('extended'))) {
        getPokedex.pokedexes.forEach(async (p: ShortResult, idx: number) => {
          if (p.name.startsWith('updated') || p.name.startsWith('extended')) await merge(idx)
        })
      } else {
        getPokedex.pokedexes.forEach(async (p: ShortResult, idx: number) => await merge(idx))
      }
      spread[r.name] = inRegion
    })
    console.log(spread)
  } catch (error) {
    console.log(error)
  }

  const pokemons: PokemonCard[] = []
  try {
    const get_pokemon = await get('/pokemon?limit=1300')
    get_pokemon.results.forEach(async (data: ShortResult) => {
      const id = idGetter(data.url)
      const getDesc = await get('/pokemon-species/' + data.name)
      const variantChoosen = desc.flavor_text_entries[0].version.name
      const descArr: string[] = []
      desc.flavor_text_entries.forEach((i) => {
        if (i.version.name == variantChoosen && i.language.name == 'en') {
          descArr.push(i.flavor_text)
        }
      })

      const detail = await get('/pokemon/' + data.name)
      const abilities = detail.abilities.map((data: { ability: ShortResult }) => data.ability.name)
      const gifExist = detail.sprites.versions['generation-v']['black-white'].animated.front_default
      const gif = gifExist ? gifExist : detail.sprites.front_default
      const image = detail.sprites.front_default
      const types = detail.types.map((d: Record<string, any>) => d.type.name)
      const spreads: string[] = []
      Object.keys(spread).forEach((s) => {
        if (spread[s].includes(data.name)) spreads.push(s)
      })

      const retrieved_data = {
        id,
        name: data.name,
        gif,
        image,
        types,
        description: [`Description for the ${variantChoosen} variant.`, ...descArr].join(' '),
        detail: {
          abilities,
          height: detail.height / 10,
          weight: detail.weight / 10,
          spread: spreads
        },
      }

      if (image && (!types.includes('shadow') && !types.includes('unknown'))) {
        pokemons.push(retrieved_data)
      }
    })
  } catch (error) {
    console.log(error)
  }

  store.$patch({ pokemons, spread })
  let favourite = Local.getData('poke-love')
  if (!favourite) favourite = pokemons.map((p) => { return { id: p.id, state: false } })
  store.$patch({ favourite })
  overflowHandler('auto')
  setTimeout(() => {
    hideSplash.value = true
  }, 2000);
})
</script>

<template>
  <div id="domsplash" :style="{ transform: `translateX(${hideSplash ? 100 : 0}%)` }"
    class="w-screen min-h-screen flex justify-center items-center fixed bg-white text-[calc(3rem+5vw)] text-fill-1 transition duration-500 z-[2]">
    <span class="text-fire-1">PoKé</span>DeX
  </div>
  <div class="max-w-screen min-h-screen overflow-hidden bg-white">
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-tap-highlight-color: transparent;
}

:root {
  color-scheme: only light;
}

@font-face {
  font-family: pokemon;
  src: url("./assets/PocketMonk-15ze.ttf");
  font-display: block;
}

#domsplash {
  font-family: pokemon, sans-serif !important;
}

#domsplash>span {
  font-family: pokemon, sans-serif !important;
}

html {
  height: 100%;
  overflow: auto;
}

body {
  height: 100%;
}

button,
a {
  user-select: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type=text],
textarea {
  caret-color: rgb(30, 41, 59) !important;
  -webkit-box-shadow: 0 0 0 30px #FFFFFF inset !important;
  -webkit-text-fill-color: rgb(30, 41, 59) !important;
  -webkit-background-clip: text;
  background-clip: text;
  box-shadow: 0 0 0 30px #FFFFFF inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

input[type=text]::placeholder,
textarea {
  color: rgb(30, 41, 59);
  opacity: .75;
}

.clip {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}

.check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
}

.ellips {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
</style>