import type { GQLContext } from "../context/index.js";

const ABSURD_FACTS = [
  (p: string, c: string) =>
    `${p}'s combined stats could theoretically power ${c}'s electrical grid for 0.003 seconds.`,
  (p: string, c: string) =>
    `If every citizen of ${c} had a ${p}, they'd collectively weigh more than the moon. Probably.`,
  (p: string, c: string) =>
    `${p} has never been elected president of ${c}. Yet.`,
  (p: string, c: string) =>
    `Scientists estimate ${p} could defeat ${c}'s entire army in a staring contest.`,
  (p: string, c: string) =>
    `The GDP of ${c} could buy approximately 4.2 billion ${p} plushies.`,
  (p: string, c: string) =>
    `If ${p} ran across ${c} at full speed, it would arrive before this API responds.`,
  (p: string, c: string) =>
    `${c}'s national anthem, when played backwards, sounds like ${p}'s cry. (Citation needed)`,
  (p: string, c: string) =>
    `${p}'s attack stat is higher than the average IQ of people who compare Pokemon to countries.`,
];

const FUN_FACTS = [
  "If you stacked all Pokemon on top of each other, they'd reach the ISS. We think.",
  "The combined population of all countries is still less than the number of Pokemon cards printed.",
  "SpaceX has launched more rockets than most people have launched careers.",
  "There are more Pokemon types than UN-recognized climate zones.",
  "Pikachu's electric output could power Monaco for approximately never.",
  "The total weight of all Pokemon is roughly equal to 3 aircraft carriers.",
  "More people have caught Mewtwo than have visited Liechtenstein.",
  "SpaceX's Falcon 9 has a better success rate than most New Year's resolutions.",
];

export const analyticsResolvers = {
  Query: {
    faunaVsNations: async (
      _: unknown,
      args: { limit?: number },
      { dataSources }: GQLContext
    ) => {
      const limit = Math.min(Math.max(1, args.limit ?? 10), 20);
      const [countries, pokemon] = await Promise.all([
        dataSources.countriesAPI.getAllCountries(),
        dataSources.pokemonAPI.getList(limit, 0),
      ]);

      const shuffled = [...countries].sort(() => Math.random() - 0.5);
      const selectedCountries = shuffled.slice(0, pokemon.length);

      return pokemon.map((p, i) => {
        const country = selectedCountries[i];
        const powerRatio = p.stats.total / Math.log10(Math.max(country.population, 1));
        const factFn = ABSURD_FACTS[i % ABSURD_FACTS.length];

        return {
          country,
          pokemon: p,
          powerRatio: Math.round(powerRatio * 100) / 100,
          absurdFact: factFn(p.name, country.name),
        };
      });
    },

    dashboardSummary: async (
      _: unknown,
      __: unknown,
      { dataSources }: GQLContext
    ) => {
      const [countries, launches] = await Promise.all([
        dataSources.countriesAPI.getAllCountries(),
        dataSources.spacexAPI.getAllLaunches(),
      ]);

      const totalPopulation = countries.reduce((sum, c) => sum + c.population, 0);

      return {
        totalCountries: countries.length,
        totalPopulation,
        totalLaunches: launches.length,
        totalPokemon: 1025,
        funFact: FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)],
      };
    },
  },
};
