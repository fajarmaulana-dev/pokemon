interface Pokemon {
  id: string;
  name: string;
  image: string;
  gif: string;
  types: string[];
  evolution: { id: string; image: string; name: string; minLevel: number; types: string[] }[];
  description: string;
  detail: {
    ability: string[];
    weight: string;
    height: string;
    spread: string[];
  };
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
