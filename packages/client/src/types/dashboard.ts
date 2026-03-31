import type { Country } from "./country";
import type { Pokemon } from "./pokemon";

export interface FaunaVsNation {
  country: Country;
  pokemon: Pokemon;
  powerRatio: number;
  absurdFact: string;
}

export interface DashboardSummary {
  totalCountries: number;
  totalPopulation: number;
  totalLaunches: number;
  totalPokemon: number;
  funFact: string;
}

// View navigation
export type DashboardView =
  | "overview"
  | "world"
  | "launches"
  | "fauna"
  | "grid"
  | "fauna-vs-nations";
