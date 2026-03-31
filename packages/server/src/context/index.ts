import type { CountriesAPI } from "../datasources/countriesAPI.js";
import type { SpaceXAPI } from "../datasources/spacexAPI.js";
import type { PokemonAPI } from "../datasources/pokemonAPI.js";
import type { WeatherAPI } from "../datasources/weatherAPI.js";
import type DataLoader from "dataloader";
import type { RocketData } from "../datasources/spacexAPI.js";

export interface GQLContext {
  dataSources: {
    countriesAPI: CountriesAPI;
    spacexAPI: SpaceXAPI;
    pokemonAPI: PokemonAPI;
    weatherAPI: WeatherAPI;
  };
  loaders: {
    rocketLoader: DataLoader<string, RocketData | null>;
  };
}
