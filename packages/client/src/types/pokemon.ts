export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  stats: PokemonStats;
  height: number;
  weight: number;
  spriteUrl: string | null;
  artworkUrl: string | null;
  abilities: string[];
  baseExperience: number | null;
  generation: string | null;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}
