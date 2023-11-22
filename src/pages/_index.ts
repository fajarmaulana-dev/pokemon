import type { Favourite, Images, PokemonCard, Filter } from '@/types';
import get from '../api';

const getMoreImage = async (ids: string[]) => {
  const images: Images[] = [];
  ids.forEach(async (i) => {
    const detail = await get('/pokemon/' + Number(i));
    images.push({ id: i, image: detail.sprites.front_default });
  });
  return images;
};

const doFilter = async (data: {
  filter: Filter;
  all: PokemonCard[];
  heart: string[];
  catch: string[];
}) => {
  let dataToShow = data.all;
  let next: boolean;
  // filter for favourite page, catched page, or other page
  if (data.filter.mode == 'favourite') {
    dataToShow = dataToShow.filter((d) => data.heart.includes(d.id));
  }
  if (data.filter.mode == 'catched') {
    dataToShow = dataToShow.filter((d) => data.catch.includes(d.id));
  }
  // filter by search name
  if (data.filter.search !== '') {
    dataToShow = data.all.filter((d) => d.name.includes(data.filter.search));
  }
  // filter by type
  if (data.filter.type !== '') {
    dataToShow = dataToShow.filter((d) => d.types.includes(data.filter.type));
  }
  // filter by region
  if (data.filter.region !== '') {
    dataToShow = dataToShow.filter((d) => d.spread.includes(data.filter.region));
  }
  // sort data
  dataToShow = dataToShow.sort((a: Record<string, any>, b: Record<string, any>) => {
    const param = data.filter.sort;
    if (param.mode == 'asc') return a[param.by].localeCompare(b[param.by]);
    else return b[param.by].localeCompare(a[param.by]);
  });

  // filter id of data with no image and then request the image for each data
  let noImage = dataToShow.filter((d) => d.image == '').map((d) => d.id);
  if (noImage.length > 0) {
    // just get new images no more than 20
    next = true;
    if (noImage.length > 20) {
      noImage = noImage.slice(0, 20);
      dataToShow = dataToShow.filter((d) => d.image !== '' || noImage.includes(d.id));
    }
    const retrievedImage = await getMoreImage(noImage);
    console.log(retrievedImage);
    dataToShow.forEach((d, idx) => {
      retrievedImage.forEach((image) => {
        if (d.id == image.id) dataToShow[idx].image = image.image;
      });
    });
  } else {
    next = false;
  }

  return { data: dataToShow, next };
};

const doHeart = (data: { toHandle: Favourite[]; index: number; all: Favourite[] }) => {
  let toHandle = data.toHandle[data.index];
  toHandle.state = !toHandle.state;
  toHandle.date = toHandle.state ? new Date().toLocaleDateString() : '';
  return data.all.map((d) => {
    let beforeChange = d;
    if (beforeChange.id == toHandle.id) beforeChange = toHandle;
    return beforeChange;
  });
};

// init data on first mounted
type ShortResult = { name: string; url: string };

const initData = async (regions: string[], types: string[]) => {
  const idGetter = (url: string) => url.split('/').slice(-2, -1)[0];

  let spread: Record<string, string[]> = {};
  let err_network = false;
  try {
    spread = Object.fromEntries(regions.map((r: string) => [r, []]));
    regions.forEach(async (name, i) => {
      const getPokedex = await get(`/region/${i + 1}`);
      let inRegion: string[] = [];
      const updateNames: string[] = getPokedex.pokedexes.map((data: ShortResult) => data.name);
      const merge = async (index: number) => {
        const getPokemon = await get('/pokedex/' + idGetter(getPokedex.pokedexes[index].url));
        getPokemon.pokemon_entries.forEach((data: { pokemon_species: ShortResult }) => {
          if (!inRegion.includes(data.pokemon_species.name)) {
            inRegion.push(data.pokemon_species.name);
          }
        });
      };
      if (updateNames.some((name) => name.startsWith('updated') || name.startsWith('extended'))) {
        getPokedex.pokedexes.forEach(async (p: ShortResult, idx: number) => {
          if (p.name.startsWith('updated') || p.name.startsWith('extended')) await merge(idx);
        });
      } else {
        getPokedex.pokedexes.forEach(async (p: ShortResult, idx: number) => await merge(idx));
      }
      spread[name] = inRegion;
    });
  } catch (error) {
    err_network = true;
  }

  const pokemons: PokemonCard[] = [];
  try {
    const get_pokemon = await get('/pokemon?limit=1300');
    get_pokemon.results.forEach(async (data: ShortResult) => {
      const id = idGetter(data.url);
      const detail = await get('/pokemon/' + data.name);
      const image = detail.sprites.front_default;
      const poketypes = detail.types.map((d: Record<string, any>) => d.type.name);

      const spreads: string[] = [];
      Object.keys(spread).forEach((s) => {
        if (spread[s].includes(data.name)) spreads.push(s);
      });

      let retrieved_data = {
        id: id.length < 4 ? '0'.repeat(4 - id.length) + id : id,
        name: data.name,
        image: '',
        types: poketypes,
        spread: spreads,
      };

      if (image && poketypes.every((p: string) => types.includes(p))) {
        if (pokemons.length < 20) retrieved_data.image = image;
        pokemons.push(retrieved_data);
      }
    });
  } catch (error) {
    err_network = true;
  }

  return { data: pokemons, error: err_network };
};

export { doFilter, doHeart, initData };
