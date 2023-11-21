import { ref, computed } from '@vue/reactivity';
import { defineStore } from 'pinia';
import type { PokemonCard, Favourite, MyPokemon } from '../types';

export const useMainStore = defineStore('main', () => {
  const pokemons = ref<PokemonCard[]>([
    {
      id: '0001',
      name: 'bulbasaur',
      image: 'alola-01.avif',
      types: ['grass', 'poison'],
      spread: ['kanto', 'johto'],
    },
    {
      id: '0002',
      name: 'ivysaur',
      image: 'alola-02.avif',
      types: ['grass', 'fire'],
      spread: ['hoenn', 'johto'],
    },
    {
      id: '0003',
      name: 'venusaur',
      image: 'alola-03.avif',
      types: ['flying', 'poison'],
      spread: ['kanto', 'sinnoh'],
    },
    {
      id: '0004',
      name: 'bulbasaur',
      image: 'alola-01.avif',
      types: ['grass', 'water'],
      spread: ['unova', 'johto'],
    },
    {
      id: '0005',
      name: 'ivysaur',
      image: 'alola-02.avif',
      types: ['bug', 'poison'],
      spread: ['kanto', 'kalos'],
    },
    {
      id: '0006',
      name: 'venusaur',
      image: 'alola-03.avif',
      types: ['grass', 'electric'],
      spread: ['alola', 'johto'],
    },
    {
      id: '0007',
      name: 'bulbasaur',
      image: 'alola-01.avif',
      types: ['fairy', 'poison'],
      spread: ['kanto', 'galar'],
    },
    {
      id: '0008',
      name: 'ivysaur',
      image: 'alola-02.avif',
      types: ['grass', 'ground'],
      spread: ['hisui', 'johto'],
    },
    {
      id: '0009',
      name: 'venusaur',
      image: 'alola-03.avif',
      types: ['rock', 'poison'],
      spread: ['kanto', 'hoenn'],
    },
    {
      id: '0010',
      name: 'bulbasaur',
      image: 'alola-01.avif',
      types: ['grass', 'normal'],
      spread: ['sinnoh', 'johto'],
    },
    {
      id: '0011',
      name: 'bulbasaur',
      image: '',
      types: ['psychic', 'poison'],
      spread: ['kanto', 'unova'],
    },
    {
      id: '0012',
      name: 'ivysaur',
      image: '',
      types: ['grass', 'steel'],
      spread: ['kalos', 'johto'],
    },
    {
      id: '0013',
      name: 'venusaur',
      image: '',
      types: ['dragon', 'poison'],
      spread: ['kanto', 'alola'],
    },
    {
      id: '0014',
      name: 'bulbasaur',
      image: '',
      types: ['grass', 'fighting'],
      spread: ['galar', 'johto'],
    },
    {
      id: '0015',
      name: 'ivysaur',
      image: '',
      types: ['dark', 'poison'],
      spread: ['kanto', 'hisui'],
    },
    {
      id: '0016',
      name: 'venusaur',
      image: '',
      types: ['grass', 'ghost'],
      spread: ['paldea', 'johto'],
    },
    {
      id: '0017',
      name: 'bulbasaur',
      image: '',
      types: ['ice', 'poison'],
      spread: ['kanto', 'alola'],
    },
    {
      id: '0018',
      name: 'ivysaur',
      image: '',
      types: ['grass', 'fire'],
      spread: ['galar', 'johto'],
    },
    {
      id: '0019',
      name: 'venusaur',
      image: '',
      types: ['water', 'poison'],
      spread: ['kanto', 'hisui'],
    },
    {
      id: '0020',
      name: 'bulbasaur',
      image: '',
      types: ['grass', 'bug'],
      spread: ['paldea', 'johto'],
    },
  ]);

  const favourites = ref<Favourite[]>([
    { id: '0001', state: true, date: '11/21/2023' },
    { id: '0002', state: true, date: '11/21/2023' },
    { id: '0003', state: true, date: '11/21/2023' },
    { id: '0004', state: false, date: '' },
    { id: '0005', state: true, date: '11/21/2023' },
    { id: '0006', state: true, date: '11/21/2023' },
    { id: '0007', state: false, date: '' },
    { id: '0008', state: true, date: '11/21/2023' },
    { id: '0009', state: true, date: '11/21/2023' },
    { id: '0010', state: false, date: '' },
    { id: '0011', state: false, date: '' },
    { id: '0012', state: true, date: '11/21/2023' },
    { id: '0013', state: true, date: '11/21/2023' },
    { id: '0014', state: false, date: '' },
    { id: '0015', state: true, date: '11/21/2023' },
    { id: '0016', state: true, date: '11/21/2023' },
    { id: '0017', state: false, date: '' },
    { id: '0018', state: true, date: '11/21/2023' },
    { id: '0019', state: true, date: '11/21/2023' },
    { id: '0020', state: false, date: '' },
  ]);

  const myPokemon = ref<MyPokemon[]>([{ id: '0001', date: '11/21/2023' }]);

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

  const page = ref<{ name: string; index: number }>({ name: 'beranda', index: 0 });
  const sidePage = ref<boolean>(false);

  return {
    pokemons,
    favourites,
    regions,
    page,
    sidePage,
    types,
    myPokemon,
    justFavourite,
    favouriteData,
  };
});
