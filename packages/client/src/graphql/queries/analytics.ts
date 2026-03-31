import { gql } from "@apollo/client";

export const GET_FAUNA_VS_NATIONS = gql`
  query GetFaunaVsNations($limit: Int) {
    faunaVsNations(limit: $limit) {
      country {
        code
        name
        population
        flagEmoji
        region
      }
      pokemon {
        id
        name
        spriteUrl
        stats {
          total
          attack
          defense
          speed
        }
      }
      powerRatio
      absurdFact
    }
  }
`;
