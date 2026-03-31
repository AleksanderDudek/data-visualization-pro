import { gql } from "@apollo/client";

export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary {
    dashboardSummary {
      totalCountries
      totalPopulation
      totalLaunches
      totalPokemon
      funFact
    }
    regionStats {
      region
      countryCount
      totalPopulation
      avgPopulation
      totalArea
    }
    launchStats {
      total
      successful
      failed
      upcoming
      successRate
      byYear {
        year
        count
        successes
        failures
      }
    }
  }
`;
