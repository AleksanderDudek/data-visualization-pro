export interface Country {
  code: string;
  name: string;
  officialName: string;
  capital: string | null;
  region: string;
  subregion: string | null;
  population: number;
  area: number | null;
  languages: string[];
  currencies: Currency[];
  flagUrl: string;
  flagEmoji: string;
  lat: number | null;
  lng: number | null;
  borders: string[];
  timezones: string[];
  weather: Weather | null;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string | null;
}

export interface Weather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  humidity: number | null;
  precipitation: number | null;
}

export interface RegionStats {
  region: string;
  countryCount: number;
  totalPopulation: number;
  avgPopulation: number;
  totalArea: number;
}
