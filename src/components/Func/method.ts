import type {
  PokemonCard,
  Favourite,
  Filter,
  MyPokemon,
  Spread,
  PokemonCardAction,
  Preference,
} from '@/types';
import Local from '@/api/local';
import type { PropType, SVGAttributes } from 'vue';

const toTop = (id: string) => {
  const el = document.getElementById(id) as HTMLElement;
  if (el) el.scrollTop = 0;
};

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

const typesLabel = (idx: number, type: string) =>
  idx == 0 ? 'Semua Tipe' : `Tipe ${type[0].toUpperCase() + type.slice(1, type.length)}`;

const getTypesColor = (type: string, idx: number, paneFor: string) => {
  if (idx == 0 || paneFor == 'sort')
    return 'bg-slate-300/80 hover:bg-slate-300/90 active:bg-slate-300';
  else return `bg-${type}-1/50 hover:bg-${type}-1/60 active:bg-${type}-1/70`;
};

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

const doCatch = (myTypes: Record<string, number>, selectedPokemon: PokemonCard) => {
  const id = selectedPokemon.id;
  const types = selectedPokemon.types;

  let updatedType = myTypes;
  types.forEach((t) => updatedType[t]++);
  const temp = { id, date: new Date().toLocaleDateString() };

  return { temp, updatedType };
};

const mainProps = {
  filterLoad: {
    type: Object as PropType<Record<string, Record<string, boolean>>>,
    default: {},
  },
  filter: {
    type: Object as PropType<Record<string, Filter>>,
    default: {},
  },
  search: {
    type: Object as PropType<Record<string, string>>,
    default: {},
  },
  filterLabel: {
    type: Object as PropType<Record<string, Record<string, string>>>,
    default: {},
  },
  filteredPokemon: {
    type: Object as PropType<Record<string, PokemonCard[]>>,
    default: {},
  },
  filteredFavourite: {
    type: Object as PropType<Record<string, Favourite[]>>,
    default: {},
  },
  onBottom: {
    type: Object as PropType<Record<string, boolean>>,
    default: {},
  },
  error: {
    type: Object as PropType<Record<string, boolean>>,
    default: {},
  },
  cardSlideState: {
    type: Object as PropType<Record<string, boolean[]>>,
    default: {},
  },
  pokedex: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disableFilter: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  allCatched: {
    type: Array as PropType<string[]>,
    default: [],
  },
  confirmData: {
    type: Object as PropType<
      Record<string, { text: string; confirm: { state: boolean; index: number } }>
    >,
    default: {},
  },
  cardActions: {
    type: Array as PropType<PokemonCardAction[]>,
    default: [],
  },
  profilePage: {
    type: Number as PropType<number>,
    default: 0,
  },
  subPage: {
    type: Number as PropType<number>,
    default: 0,
  },
  subName: {
    type: Object as PropType<{ text: string; back?: boolean; icon: (props: SVGAttributes) => any }>,
    default: {},
  },
  user: {
    type: Object as PropType<{ name: string; email: string; image: string }>,
    default: { name: 'Fajar Maulana', email: 'm.fajars.net@gmail.com', image: '' },
  },
  isLogin: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  refreshLoad: {
    type: Object as PropType<Record<string, boolean>>,
    default: {},
  },
  availableType: {
    type: Object as PropType<Record<string, string[]>>,
    default: {},
  },
  forPokedex: {
    type: String as PropType<string>,
    default: 'beranda',
  },
  noDetail: {
    type: Object as PropType<Record<string, { state: boolean; index: number }>>,
    default: {},
  },
  errorMore: {
    type: Object as PropType<Record<string, boolean>>,
    default: {},
  },
  profileError: {
    type: Object as PropType<Record<string, boolean>>,
    default: false,
  },
  profileLoad: {
    type: Object as PropType<Record<string, boolean>>,
    default: false,
  },
  prefer: {
    type: Object as PropType<Preference>,
    default: {
      image: '',
      name: '',
      useIndonesia: true,
      notification: { world: true, update: true },
      auth: { oauth: true, bio: false, otp: false },
    },
  },
  preferTemp: {
    type: Object as PropType<{ image: string; data: Preference }>,
    default: { image: '', data: {} },
  },
  password: {
    type: Object as PropType<{
      password: Record<string, string>;
      hide: Record<string, boolean>;
      error: Record<string, string | undefined>;
    }>,
    default: {
      password: { current: '', new: '', confirm: '' },
      hide: { current: true, new: true, confirm: true },
      error: { current: undefined, new: undefined, confirm: undefined },
    },
  },
  passwordPage: {
    type: Number as PropType<number>,
    default: 0,
  },
  passwordWrong: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

export {
  toTop,
  filterFunc,
  typesLabel,
  getTypesColor,
  setLocalData,
  getTypes,
  doHeart,
  doCatch,
  mainProps,
};
