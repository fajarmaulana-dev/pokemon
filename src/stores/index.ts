import { ref, computed } from '@vue/reactivity';
import { defineStore } from 'pinia';
import type { PokemonCard, Favourite, MyPokemon } from '../types';

export const useMainStore = defineStore('main', () => {
  const pokemons = ref<PokemonCard[]>([]);

  const favourites = ref<Favourite[]>([]);

  const myPokemon = ref<MyPokemon[]>([]);

  // filter for regions using static images, that is why we must define the list for regions manually
  // if any update for regions, just change this array and static image for the added region
  const regions = ref<string[]>([
    'kanto',
    'johto',
    'hoenn',
    'sinnoh',
    'unova',
    'kalos',
    'alola',
    'galar',
    'hisui',
    'paldea',
  ]);

  // same argument as above
  const types = ref<string[]>([
    'grass',
    'poison',
    'fire',
    'flying',
    'water',
    'bug',
    'electric',
    'fairy',
    'ground',
    'rock',
    'normal',
    'psychic',
    'steel',
    'dragon',
    'fighting',
    'dark',
    'ghost',
    'ice',
  ]);

  const justFavourite = computed(() =>
    favourites.value.filter((data) => data.state).map((data) => data.id),
  );

  const favouriteData = computed(() =>
    pokemons.value.filter((data) => justFavourite.value.includes(data.id)),
  );

  const pokedexData = computed(() =>
    pokemons.value.filter((data) => myPokemon.value.map((d) => d.id).includes(data.id)),
  );

  const page = ref<{ name: string; index: number }>({ name: 'beranda', index: 0 });

  return {
    pokemons,
    favourites,
    regions,
    page,
    types,
    myPokemon,
    justFavourite,
    favouriteData,
    pokedexData,
  };
});
