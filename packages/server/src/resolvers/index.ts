export type { GQLContext } from "../context/index.js";
import { countriesResolvers } from "./countries.js";
import { launchesResolvers } from "./launches.js";
import { pokemonResolvers } from "./pokemon.js";
import { analyticsResolvers } from "./analytics.js";

export const resolvers = {
  Query: {
    ...countriesResolvers.Query,
    ...launchesResolvers.Query,
    ...pokemonResolvers.Query,
    ...analyticsResolvers.Query,
  },
  Country: countriesResolvers.Country,
  Launch: launchesResolvers.Launch,
};
