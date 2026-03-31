import type { GQLContext } from "../context/index.js";
import type { CountryData } from "../datasources/countriesAPI.js";

export const countriesResolvers = {
  Query: {
    countries: async (
      _: unknown,
      args: { region?: string; search?: string; limit?: number },
      { dataSources }: GQLContext
    ) => {
      let countries: CountryData[];

      if (args.search) {
        countries = await dataSources.countriesAPI.searchByName(args.search);
      } else if (args.region) {
        countries = await dataSources.countriesAPI.getByRegion(args.region);
      } else {
        countries = await dataSources.countriesAPI.getAllCountries();
      }

      if (args.limit && args.limit > 0) {
        countries = countries.slice(0, args.limit);
      }

      return countries;
    },

    country: async (
      _: unknown,
      { code }: { code: string },
      { dataSources }: GQLContext
    ) => {
      return dataSources.countriesAPI.getByCode(code);
    },

    regionStats: async (_: unknown, __: unknown, { dataSources }: GQLContext) => {
      const allCountries = await dataSources.countriesAPI.getAllCountries();
      const regionMap = new Map<
        string,
        { count: number; population: number; area: number }
      >();

      for (const country of allCountries) {
        const existing = regionMap.get(country.region) ?? {
          count: 0,
          population: 0,
          area: 0,
        };
        regionMap.set(country.region, {
          count: existing.count + 1,
          population: existing.population + country.population,
          area: existing.area + (country.area ?? 0),
        });
      }

      return Array.from(regionMap.entries()).map(([region, stats]) => ({
        region,
        countryCount: stats.count,
        totalPopulation: stats.population,
        avgPopulation: Math.round(stats.population / stats.count),
        totalArea: stats.area,
      }));
    },
  },

  Country: {
    weather: async (
      parent: CountryData,
      _: unknown,
      { dataSources }: GQLContext
    ) => {
      if (parent.lat == null || parent.lng == null) return null;
      return dataSources.weatherAPI.getWeather(parent.lat, parent.lng);
    },
  },
};
