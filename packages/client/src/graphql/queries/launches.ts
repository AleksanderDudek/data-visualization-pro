import { gql } from "@apollo/client";

export const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int, $offset: Int, $upcoming: Boolean) {
    launches(limit: $limit, offset: $offset, upcoming: $upcoming) {
      id
      name
      dateUtc
      dateUnix
      success
      details
      upcoming
      flightNumber
      rocket {
        id
        name
        type
      }
      links {
        patch
        webcast
        wikipedia
      }
    }
  }
`;

export const GET_LAUNCH_STATS = gql`
  query GetLaunchStats {
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
