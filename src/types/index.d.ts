interface Pokemon {
  id: string;
  name: string;
  image: string;
  gif: string;
  types: string[];
  evolution: string[];
  abilities: string[];
  height: number;
  weight: number;
  femalePossibility: number;
  weakness: string[];
}

type PokemonCard = Omit<Pokemon, 'evolution' | 'femalePossibility' | 'weakness'>;

interface PokemonCardAction {
  label: string;
  icon: (props: SVGAttributes) => any;
  color: { init: string; hover: string };
  async: boolean;
  load?: boolean[];
}

export type { Pokemon, PokemonCard, PokemonCardAction };
