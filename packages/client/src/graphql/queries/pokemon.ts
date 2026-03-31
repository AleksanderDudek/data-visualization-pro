import { gql } from "@apollo/client";

export const GET_POKEMON = gql`
  query GetPokemon($limit: Int, $offset: Int) {
    pokemon(limit: $limit, offset: $offset) {
      id
      name
      types
      stats {
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
        total
      }
      height
      weight
      spriteUrl
      artworkUrl
      abilities
      baseExperience
    }
  }
`;
