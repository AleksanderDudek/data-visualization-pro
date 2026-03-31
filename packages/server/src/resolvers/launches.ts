import type { GQLContext } from "../context/index.js";

export const launchesResolvers = {
  Query: {
    launches: async (
      _: unknown,
      args: { limit?: number; offset?: number; upcoming?: boolean },
      { dataSources }: GQLContext
    ) => {
      let launches = await dataSources.spacexAPI.getAllLaunches();

      if (args.upcoming !== undefined) {
        launches = launches.filter((l) => l.upcoming === args.upcoming);
      }

      const offset = args.offset ?? 0;
      const limit = args.limit ?? launches.length;
      return launches.slice(offset, offset + limit);
    },

    launch: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: GQLContext
    ) => {
      return dataSources.spacexAPI.getLaunch(id);
    },

    launchStats: async (_: unknown, __: unknown, { dataSources }: GQLContext) => {
      const launches = await dataSources.spacexAPI.getAllLaunches();
      const pastLaunches = launches.filter((l) => !l.upcoming);

      const successful = pastLaunches.filter((l) => l.success === true).length;
      const failed = pastLaunches.filter((l) => l.success === false).length;
      const upcoming = launches.filter((l) => l.upcoming).length;

      const yearMap = new Map<
        number,
        { count: number; successes: number; failures: number }
      >();
      for (const launch of pastLaunches) {
        const year = new Date(launch.dateUtc).getFullYear();
        const existing = yearMap.get(year) ?? {
          count: 0,
          successes: 0,
          failures: 0,
        };
        yearMap.set(year, {
          count: existing.count + 1,
          successes: existing.successes + (launch.success ? 1 : 0),
          failures: existing.failures + (launch.success === false ? 1 : 0),
        });
      }

      return {
        total: launches.length,
        successful,
        failed,
        upcoming,
        successRate:
          pastLaunches.length > 0
            ? Math.round((successful / pastLaunches.length) * 10000) / 100
            : 0,
        byYear: Array.from(yearMap.entries())
          .map(([year, stats]) => ({ year, ...stats }))
          .sort((a, b) => a.year - b.year),
      };
    },

    rockets: async (_: unknown, __: unknown, { dataSources }: GQLContext) => {
      return dataSources.spacexAPI.getAllRockets();
    },
  },

  Launch: {
    rocket: async (
      parent: { rocketId: string },
      _: unknown,
      { loaders }: GQLContext
    ) => {
      return loaders.rocketLoader.load(parent.rocketId);
    },
  },
};
