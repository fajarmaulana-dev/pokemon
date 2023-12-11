import type { PokemonCard, Pokemon, Favourite, Filter, MyPokemon, Names, Spread } from '@/types';
import Local from '@/api/local';

// func to back to top of desired page
const toTop = (id: string) => {
  const el = document.getElementById(id) as HTMLElement;
  if (el) el.scrollTop = 0;
};

// func to change filter and its label value when one item in filter pane has been clicked
const filterFunc = (
  is: string,
  item: string,
  filter: Filter,
  label: Record<string, string>,
  load: boolean,
) => {
  let filterRes = filter;
  let labelRes = label;
  let loadRes = load;
  if (is == 'type') {
    if (item !== labelRes.type) {
      filterRes.type = item;
      labelRes.type = item;
      loadRes = true;
    }
  }
  if (is == 'sort') {
    if (item !== labelRes.sort) {
      filterRes.sort.by = item.startsWith('Nomor') ? 'id' : 'name';
      filterRes.sort.mode = item.includes('1 -') || item.includes('A -') ? 'asc' : 'desc';
      labelRes.sort = item;
      loadRes = true;
    }
  }
  return { filterRes, labelRes, loadRes };
};

// func to transform types item label by its type
const typesLabel = (idx: number, type: string) =>
  idx == 0 ? 'Semua Tipe' : `Tipe ${type[0].toUpperCase() + type.slice(1, type.length)}`;

// func to return color by its type
const getTypesColor = (type: string, idx: number, paneFor: string) => {
  if (idx == 0 || paneFor == 'sort')
    return 'bg-slate-300/80 hover:bg-slate-300/90 active:bg-slate-300';
  else return `bg-${type}-1/50 hover:bg-${type}-1/60 active:bg-${type}-1/70`;
};

// func to set some data to local storage on refresh
const setLocalData = (
  fav: Favourite[],
  mine: MyPokemon[],
  favType: Record<string, number>,
  mineType: Record<string, number>,
) => {
  Local.setData('poke-love', fav);
  Local.setData('poke-dex', mine);
  Local.setData('type-love', favType);
  Local.setData('type-dex', mineType);
};

// func to get types of each region
const getTypes = (types: Spread, regions: Spread, name: string) => {
  const getType = (pokemon: string) => {
    let tempType: string[] = [];
    Object.keys(types).forEach((type) => {
      if (types[type].includes(pokemon)) tempType.push(type);
    });
    return tempType;
  };
  const tempType: string[] = [];
  regions[name].forEach((pokemon) => {
    const result = getType(pokemon);
    if (tempType.length < 18 && !result.every((r) => tempType.includes(r))) {
      result.forEach((r) => {
        if (!tempType.includes(r)) tempType.push(r);
      });
    }
  });
  return tempType;
};

// func to handle change of favourites data
const favHelper = (data: { toHandle: Favourite; all: Favourite[] }) => {
  const { toHandle, all } = data;
  let favourite = toHandle;
  favourite.state = !favourite.state;
  favourite.date = favourite.state ? new Date().toLocaleDateString() : '';
  return all.map((d) => {
    let beforeChange = d;
    if (beforeChange.id == favourite.id) beforeChange = favourite;
    return beforeChange;
  });
};

// func to help on handle favourite
const doHeart = (
  types: Record<string, number>,
  favourites: Favourite[],
  favourite: Favourite[],
  pokemon: PokemonCard[],
  index: number,
) => {
  let updatedType = types;
  if (favourites[index].state) {
    pokemon[index].types.forEach((t) => updatedType[t]--);
  } else {
    pokemon[index].types.forEach((t) => updatedType[t]++);
  }
  return {
    favourites: favHelper({ toHandle: favourite[index], all: favourites }),
    favouriteType: updatedType,
  };
};

// func to help on handle catch
const doCatch = (myTypes: Record<string, number>, selectedPokemon: PokemonCard) => {
  const id = selectedPokemon.id;
  const types = selectedPokemon.types;

  let updatedType = myTypes;
  types.forEach((t) => updatedType[t]++);
  const temp = { id, date: new Date().toLocaleDateString() };

  return { temp, updatedType };
};

export { toTop, filterFunc, typesLabel, getTypesColor, setLocalData, getTypes, doHeart, doCatch };
