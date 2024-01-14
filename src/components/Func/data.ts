import type { Favourite, PokemonCard, Filter, Spread, Names, MyPokemon } from '@/types';
import get from '@/api';

const getMoreData = async (spread: Spread, types: string[], ids: string[]) => {
  const pokemons: PokemonCard[] = [];
  for (const id of ids) {
    const detail = await get(`/pokemon/${id}`);
    const name = detail.name;
    const image = detail.sprites.front_default;
    const poketypes = detail.types.map((d: Record<string, any>) => d.type.name);

    const spreads: string[] = [];
    Object.keys(spread).forEach((s) => {
      if (spread[s].includes(name)) spreads.push(s);
    });

    let retrieved_data = {
      id: id.length < 4 ? '0'.repeat(4 - id.length) + id : id,
      name,
      image,
      types: poketypes,
      spread: spreads,
    };

    if (image && poketypes.every((p: string) => types.includes(p))) {
      pokemons.push(retrieved_data);
    }
  }
  return pokemons;
};

type ShortResult = { name: string; url: string };
const idGetter = (url: string) => url.split('/').slice(-2, -1)[0];

const initData = async (data: {
  regions: string[];
  types: string[];
  favourite: Favourite[];
  catched: MyPokemon[];
}) => {
  const { regions, types, favourite, catched } = data;

  let spread: Record<string, string[]> = Object.fromEntries(regions.map((r: string) => [r, []]));
  regions.forEach(async (name, i) => {
    const { pokedexes } = await get(`/region/${i + 1}`);
    let inRegion: string[] = [];
    const updateNames: string[] = pokedexes.map((data: ShortResult) => data.name);
    const merge = async (index: number) => {
      const { pokemon_entries } = await get('/pokedex/' + idGetter(pokedexes[index].url));
      pokemon_entries.forEach((data: { pokemon_species: ShortResult }) => {
        if (!inRegion.includes(data.pokemon_species.name)) {
          inRegion.push(data.pokemon_species.name);
        }
      });
    };
    if (updateNames.some((name) => name.startsWith('updated') || name.startsWith('extended'))) {
      pokedexes.forEach(async (p: ShortResult, idx: number) => {
        if (p.name.startsWith('updated') || p.name.startsWith('extended')) await merge(idx);
      });
    } else {
      pokedexes.forEach(async (p: ShortResult, idx: number) => await merge(idx));
    }
    spread[name] = inRegion;
  });

  const { results } = await get('/pokemon?limit=1300');
  const dataNames: Names[] = results.map((data: ShortResult) => {
    const id = idGetter(data.url);
    return {
      name: data.name,
      id: id.length < 4 ? '0'.repeat(4 - id.length) + id : id,
    };
  });

  let pokeType: Record<string, string[]> = Object.fromEntries(types.map((d) => [d, []]));
  for (const type of types) {
    const { pokemon } = await get('/type/' + type);
    pokeType[type] = pokemon.map((data: { pokemon: { name: string } }) => data.pokemon.name);
  }

  const gender_female = await get('/gender/1');
  let genders = gender_female.pokemon_species_details.map(
    (data: { pokemon_species: ShortResult; rate: number }) => {
      return { name: data.pokemon_species.name, possibility: data.rate };
    },
  ) as { name: string; possibility: number }[];

  for (let i = 2; i <= 3; i++) {
    const gender = await get('/gender/' + i);
    gender.pokemon_species_details.forEach(
      (data: { pokemon_species: ShortResult; rate: number }) => {
        if (!genders.map((g) => g.name).includes(data.pokemon_species.name)) {
          genders.push({
            name: data.pokemon_species.name,
            possibility: i == 2 ? 8 - data.rate : data.rate,
          });
        }
      },
    );
  }

  const unknownGender: { name: string; possibility: number }[] = [];
  genders = genders.filter((d) => dataNames.map((d) => d.name).includes(d.name));
  dataNames.forEach((data) => {
    const names = genders.map((d) => d.name);
    if (!names.includes(data.name)) unknownGender.push({ name: data.name, possibility: -2 });
  });
  genders = [...genders, ...unknownGender];

  const initIds = [...Array(10)].map((_, i) => (i + 1).toString());
  const pokemons = await getMoreData(spread, types, initIds);
  let favourites: PokemonCard[] = [];
  let catches: PokemonCard[] = [];
  if (favourite.length > 0) {
    const favIds = favourite
      .filter((data) => data.state)
      .map((data) => Number(data.id).toString())
      .slice(0, 10);
    favourites = await getMoreData(spread, types, favIds);
  }
  if (catched.length > 0) {
    const catchIds = catched.map((data) => Number(data.id).toString()).slice(0, 10);
    catches = await getMoreData(spread, types, catchIds);
  }
  return {
    data: pokemons,
    names: dataNames,
    spreads: spread,
    variants: pokeType,
    favouriteData: favourites,
    mineData: catches,
    genders,
  };
};

const doFilter = async (data: {
  filter: Filter;
  init: PokemonCard[];
  heart: string[];
  catches: string[];
  names: Names[];
  types: Spread;
  regions: Spread;
  mode: string;
}) => {
  const { filter, init, heart, catches, names, types, regions, mode } = data;
  let next: boolean;

  let initData: PokemonCard[] = [];
  const initId = init.map((data) => data.id);
  const initNames = names.sort((a: Record<string, any>, b: Record<string, any>) => {
    const param = filter.sort;
    if (param.mode == 'asc') return a[param.by].localeCompare(b[param.by]);
    else return b[param.by].localeCompare(a[param.by]);
  });
  let ids = initNames.map((data) => data.id);
  if (mode == 'getmore') {
    initData = init;
    ids = ids.filter((id) => !initId.includes(id));
  }

  if (filter.mode == 'favorit') {
    ids = ids.filter((d) => heart.includes(d));
  }
  if (filter.mode == 'pokedex') {
    ids = ids.filter((d) => catches.includes(d));
  }

  if (filter.search !== '') {
    initData = initData.filter((d) => d.name.includes(data.filter.search));
    const idTemp = names.filter((d) => d.name.includes(filter.search)).map((d) => d.id);
    ids = ids.filter((d) => idTemp.includes(d));
  }

  if (filter.type !== '') {
    initData = initData.filter((d) => d.types.includes(data.filter.type));
    const idTemp = types[filter.type].map((d) => names.find((n) => n.name == d)?.id);
    ids = ids.filter((d) => idTemp.includes(d));
  }

  if (filter.region !== '') {
    initData = initData.filter((d) => d.spread.includes(data.filter.region));
    const idTemp = regions[filter.region].map((d) => names.find((n) => n.name == d)?.id);
    ids = ids.filter((d) => idTemp.includes(d));
  }

  if (ids.length > 0) {
    if (ids.length > 10) {
      ids = ids.slice(0, 10);
      next = true;
    } else next = false;
  } else {
    next = false;
  }

  ids = ids.map((id) => Number(id).toString());
  let dataToShow = await getMoreData(regions, Object.keys(types), ids);

  dataToShow = [...initData, ...dataToShow];

  dataToShow = dataToShow.sort((a: Record<string, any>, b: Record<string, any>) => {
    const param = filter.sort;
    if (param.mode == 'asc') return a[param.by].localeCompare(b[param.by]);
    else return b[param.by].localeCompare(a[param.by]);
  });

  return { data: dataToShow, next };
};

const getPokeDetail = async (data: {
  id: string;
  name: string;
  types: string[];
  image: string;
  spread: string[];
  gender: number;
  spreads: Spread;
  allTypes: string[];
}) => {
  const { id, types, image, gender, spreads, allTypes } = data;
  const pokeUrl = '/pokemon/' + Number(id);
  const { abilities, height, weight, sprites, name, base_experience } = await get(pokeUrl);

  let weakness: string[] = [];
  for (const type of types) {
    const { damage_relations } = await get('/type/' + type);
    weakness = [
      ...weakness,
      damage_relations.double_damage_from.map((data: ShortResult) => data.name),
    ];
  }

  let description = 'Description Not Found.';
  let chainId = '0';
  const { flavor_text_entries, evolution_chain } = await get('/pokemon-species/' + Number(id));
  let result = flavor_text_entries[0];
  if (result) {
    const texts: string[] = [];
    flavor_text_entries.forEach((i: any) => {
      if (i.version.name == result.version.name && i.language.name == 'en') {
        texts.push(i.flavor_text);
      }
    });
    const intro = `Description for the ${result.version.name} variant.`;
    description = [intro, ...texts].join(' ').trim().replace('', ' ');
    chainId = idGetter(evolution_chain.url);
  }

  const evolution: (Omit<PokemonCard, 'spread'> & { minLevel: number })[] = [];
  if (chainId !== '0') {
    const { chain } = await get('/evolution-chain/' + chainId);
    let evs = chain;
    while (evs) {
      const id = idGetter(evs.species.url);
      const data = await getMoreData(spreads, allTypes, [id]);
      evolution.push({
        id: data[0].id,
        name: data[0].name,
        image: data[0].image,
        types: data[0].types,
        minLevel: evs.evolution_details[0] ? evs.evolution_details[0].min_level : 0,
      });
      evs = evs.evolves_to[0];
    }
  }

  return {
    id,
    name,
    gif: sprites.versions['generation-v']['black-white'].animated.front_default || image,
    types,
    description,
    detail: {
      weight: `${weight / 10} kg`,
      height: `${height / 10} m`,
      experience: base_experience.toString(),
      abilities: abilities.map((data: { ability: ShortResult }) => data.ability.name),
    },
    femalePossibility: gender > 0 ? gender / 8 : gender,
    weakness: [...new Set(weakness.flat())],
    evolution,
  };
};

export { doFilter, initData, getPokeDetail };
