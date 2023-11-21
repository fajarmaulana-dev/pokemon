interface Pokemons {
  id: string;
  name: string;
  image: string;
  gif: string;
  types: string[];
  evolution: { id: string; image: string; name: string; minLevel: number; types: string[] }[];
  description: string;
  detail: {
    abilities: string[];
    weight: string;
    height: string;
    spread: string[];
  };
  femalePossibility: number;
  weakness: string[];
}

type PokemonCard = Pick<Pokemons, 'id' | 'image' | 'name' | 'types'> & { spread: string[] };

type Pokemon = Omit<Pokemons, 'image'>;

interface Favourite {
  id: string;
  state: boolean;
  date: string;
}

type MyPokemon = Omit<Favourite, 'state'>;

type Images = Pick<Pokemons, 'id' | 'image'>;

interface Filter {
  search: string;
  type: string;
  sort: { by: string; mode: string };
  region: string;
  next: boolean;
  mode: string;
}

interface PokemonCardAction {
  label: string;
  icon: (props: SVGAttributes) => any;
  color: { init: string; hover: string };
  async: boolean;
  load?: boolean[];
}

export type {
  Pokemons,
  PokemonCard,
  Pokemon,
  Images,
  Filter,
  Favourite,
  MyPokemon,
  PokemonCardAction,
};
