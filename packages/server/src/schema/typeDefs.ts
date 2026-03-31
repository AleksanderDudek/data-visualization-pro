import gql from "graphql-tag";

export const typeDefs = gql`
  """
  A planetary civilization (country) in the galactic database
  """
  type Country {
    code: String!
    name: String!
    officialName: String!
    capital: String
    region: String!
    subregion: String
    population: Int!
    area: Float
    languages: [String!]!
    currencies: [Currency!]!
    flagUrl: String!
    flagEmoji: String!
    lat: Float
    lng: Float
    borders: [String!]!
    timezones: [String!]!
    weather: Weather
  }

  type Currency {
    code: String!
    name: String!
    symbol: String
  }

  """
  Atmospheric data from the monitoring system
  """
  type Weather {
    temperature: Float!
    windSpeed: Float!
    weatherCode: Int!
    description: String!
    humidity: Float
    precipitation: Float
  }

  """
  A galactic transport mission (SpaceX launch)
  """
  type Launch {
    id: String!
    name: String!
    dateUtc: String!
    dateUnix: Int!
    success: Boolean
    details: String
    rocket: Rocket
    launchpad: String
    upcoming: Boolean!
    flightNumber: Int!
    links: LaunchLinks
  }

  type Rocket {
    id: String!
    name: String!
    type: String!
    description: String
    firstFlight: String
    successRate: Float
    costPerLaunch: Float
    height: Float
    diameter: Float
    mass: Float
  }

  type LaunchLinks {
    patch: String
    webcast: String
    wikipedia: String
    article: String
  }

  """
  A known fauna specimen (Pokemon) in the galactic registry
  """
  type Pokemon {
    id: Int!
    name: String!
    types: [String!]!
    stats: PokemonStats!
    height: Float!
    weight: Float!
    spriteUrl: String
    artworkUrl: String
    abilities: [String!]!
    baseExperience: Int
    generation: String
  }

  type PokemonStats {
    hp: Int!
    attack: Int!
    defense: Int!
    specialAttack: Int!
    specialDefense: Int!
    speed: Int!
    total: Int!
  }

  """
  Aggregate comparison data for the absurd "Fauna vs Nations" chart
  """
  type FaunaVsNation {
    country: Country!
    pokemon: Pokemon!
    powerRatio: Float!
    absurdFact: String!
  }

  type LaunchStats {
    total: Int!
    successful: Int!
    failed: Int!
    upcoming: Int!
    successRate: Float!
    byYear: [YearCount!]!
  }

  type YearCount {
    year: Int!
    count: Int!
    successes: Int!
    failures: Int!
  }

  type RegionStats {
    region: String!
    countryCount: Int!
    totalPopulation: Float!
    avgPopulation: Float!
    totalArea: Float!
  }

  type DashboardSummary {
    totalCountries: Int!
    totalPopulation: Float!
    totalLaunches: Int!
    totalPokemon: Int!
    funFact: String!
  }

  type Query {
    """
    Planetary Civilizations Database
    """
    countries(region: String, search: String, limit: Int): [Country!]!
    country(code: String!): Country
    regionStats: [RegionStats!]!

    """
    Galactic Transport Division
    """
    launches(limit: Int, offset: Int, upcoming: Boolean): [Launch!]!
    launch(id: String!): Launch
    launchStats: LaunchStats!
    rockets: [Rocket!]!

    """
    Known Fauna Registry
    """
    pokemon(limit: Int, offset: Int): [Pokemon!]!
    pokemonById(id: Int!): Pokemon
    pokemonByName(name: String!): Pokemon

    """
    Cross-database analytics
    """
    faunaVsNations(limit: Int): [FaunaVsNation!]!
    dashboardSummary: DashboardSummary!
  }
`;
