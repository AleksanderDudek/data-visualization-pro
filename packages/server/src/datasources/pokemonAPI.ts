import { RESTDataSource } from "@apollo/datasource-rest";

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

interface PokemonDetailRaw {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  base_experience: number | null;
}

interface PokemonSpeciesRaw {
  generation: { name: string };
}

export interface PokemonData {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    total: number;
  };
  height: number;
  weight: number;
  spriteUrl: string | null;
  artworkUrl: string | null;
  abilities: string[];
  baseExperience: number | null;
  generation: string | null;
}

export class PokemonAPI extends RESTDataSource {
  override baseURL = "https://pokeapi.co/api/v2/";

  private statNameMap: Record<string, string> = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special-attack": "specialAttack",
    "special-defense": "specialDefense",
    speed: "speed",
  };

  private transformPokemon(raw: PokemonDetailRaw, generation?: string): PokemonData {
    const statsMap: Record<string, number> = {};
    for (const s of raw.stats) {
      const key = this.statNameMap[s.stat.name];
      if (key) statsMap[key] = s.base_stat;
    }

    const hp = statsMap["hp"] ?? 0;
    const attack = statsMap["attack"] ?? 0;
    const defense = statsMap["defense"] ?? 0;
    const specialAttack = statsMap["specialAttack"] ?? 0;
    const specialDefense = statsMap["specialDefense"] ?? 0;
    const speed = statsMap["speed"] ?? 0;

    return {
      id: raw.id,
      name: raw.name,
      types: raw.types.map((t) => t.type.name),
      stats: {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        total: hp + attack + defense + specialAttack + specialDefense + speed,
      },
      height: raw.height / 10, // Convert to meters
      weight: raw.weight / 10, // Convert to kg
      spriteUrl: raw.sprites.front_default,
      artworkUrl: raw.sprites.other?.["official-artwork"]?.front_default ?? null,
      abilities: raw.abilities.map((a) => a.ability.name),
      baseExperience: raw.base_experience,
      generation: generation ?? null,
    };
  }

  async getList(limit: number = 20, offset: number = 0): Promise<PokemonData[]> {
    const list = await this.get<PokemonListResponse>("pokemon", {
      params: { limit: String(limit), offset: String(offset) },
    });

    const details = await Promise.all(
      list.results.map((p) =>
        this.get<PokemonDetailRaw>(`pokemon/${encodeURIComponent(p.name)}`)
      )
    );

    return details.map((d) => this.transformPokemon(d));
  }

  async getById(id: number): Promise<PokemonData | null> {
    try {
      const [detail, species] = await Promise.all([
        this.get<PokemonDetailRaw>(`pokemon/${id}`),
        this.get<PokemonSpeciesRaw>(`pokemon-species/${id}`).catch(() => null),
      ]);
      return this.transformPokemon(detail, species?.generation?.name);
    } catch {
      return null;
    }
  }

  async getByName(name: string): Promise<PokemonData | null> {
    try {
      const detail = await this.get<PokemonDetailRaw>(
        `pokemon/${encodeURIComponent(name.toLowerCase())}`
      );
      return this.transformPokemon(detail);
    } catch {
      return null;
    }
  }
}
