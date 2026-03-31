import type { GQLContext } from "../context/index.js";

const MAX_POKEMON_LIMIT = 50;
const MAX_OFFSET = 10_000;
const MAX_POKEMON_ID = 100_000;

export const pokemonResolvers = {
  Query: {
    pokemon: async (
      _: unknown,
      args: { limit?: number; offset?: number },
      { dataSources }: GQLContext
    ) => {
      const limit = Math.min(Math.max(1, args.limit ?? 20), MAX_POKEMON_LIMIT);
      const offset = Math.min(Math.max(0, args.offset ?? 0), MAX_OFFSET);
      return dataSources.pokemonAPI.getList(limit, offset);
    },

    pokemonById: async (
      _: unknown,
      { id }: { id: number },
      { dataSources }: GQLContext
    ) => {
      if (id < 1 || id > MAX_POKEMON_ID) return null;
      return dataSources.pokemonAPI.getById(id);
    },

    pokemonByName: async (
      _: unknown,
      { name }: { name: string },
      { dataSources }: GQLContext
    ) => {
      return dataSources.pokemonAPI.getByName(name);
    },
  },
};
