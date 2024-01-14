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
    experience: string;
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

type Spread = Record<string, string[]>;

interface Names {
  id: string;
  name: string;
}

interface Genders {
  name: string;
  possibility: number;
}

interface Preference {
  image: string;
  name: string;
  useIndonesia: boolean;
  notification: { world: boolean; update: boolean };
  auth: { oauth: boolean; bio: boolean; otp: boolean };
}

export type {
  Pokemons,
  PokemonCard,
  Pokemon,
  Filter,
  Favourite,
  MyPokemon,
  PokemonCardAction,
  Spread,
  Names,
  Genders,
  Preference,
};
