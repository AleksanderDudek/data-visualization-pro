import { RESTDataSource } from "@apollo/datasource-rest";

interface RestCountry {
  cca2: string;
  name: { common: string; official: string };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol?: string }>;
  flags: { png: string; svg: string };
  flag: string;
  latlng?: [number, number];
  borders?: string[];
  timezones?: string[];
}

export interface CountryData {
  code: string;
  name: string;
  officialName: string;
  capital: string | null;
  region: string;
  subregion: string | null;
  population: number;
  area: number | null;
  languages: string[];
  currencies: { code: string; name: string; symbol: string | null }[];
  flagUrl: string;
  flagEmoji: string;
  lat: number | null;
  lng: number | null;
  borders: string[];
  timezones: string[];
}

export class CountriesAPI extends RESTDataSource {
  override baseURL = "https://restcountries.com/v3.1/";

  private transformCountry(raw: RestCountry): CountryData {
    return {
      code: raw.cca2,
      name: raw.name.common,
      officialName: raw.name.official,
      capital: raw.capital?.[0] ?? null,
      region: raw.region,
      subregion: raw.subregion ?? null,
      population: raw.population,
      area: raw.area ?? null,
      languages: raw.languages ? Object.values(raw.languages) : [],
      currencies: raw.currencies
        ? Object.entries(raw.currencies).map(([code, c]) => ({
            code,
            name: c.name,
            symbol: c.symbol ?? null,
          }))
        : [],
      flagUrl: raw.flags.svg,
      flagEmoji: raw.flag,
      lat: raw.latlng?.[0] ?? null,
      lng: raw.latlng?.[1] ?? null,
      borders: raw.borders ?? [],
      timezones: raw.timezones ?? [],
    };
  }

  // REST Countries API allows max 10 fields per query
  private static CORE_FIELDS = "cca2,name,capital,region,subregion,population,area,flags,flag,latlng";
  private static EXTRA_FIELDS = "languages,currencies,borders,timezones";

  private async fetchAndMerge(endpoint: string): Promise<CountryData[]> {
    const [coreData, extraData] = await Promise.all([
      this.get<RestCountry[]>(endpoint, { params: { fields: CountriesAPI.CORE_FIELDS } }),
      this.get<RestCountry[]>(endpoint, { params: { fields: `cca2,${CountriesAPI.EXTRA_FIELDS}` } }),
    ]);
    const extraMap = new Map(extraData.map((e) => [e.cca2, e]));
    return coreData.map((c) => {
      const extra = extraMap.get(c.cca2);
      return this.transformCountry({
        ...c,
        languages: extra?.languages,
        currencies: extra?.currencies,
        borders: extra?.borders,
        timezones: extra?.timezones,
      });
    });
  }

  async getAllCountries(): Promise<CountryData[]> {
    return this.fetchAndMerge("all");
  }

  async getByRegion(region: string): Promise<CountryData[]> {
    return this.fetchAndMerge(`region/${encodeURIComponent(region)}`);
  }

  async getByCode(code: string): Promise<CountryData | null> {
    try {
      const data = await this.get<RestCountry[]>(`alpha/${encodeURIComponent(code)}`, {
        params: { fields: CountriesAPI.CORE_FIELDS },
      });
      return data.length > 0 ? this.transformCountry(data[0]) : null;
    } catch {
      return null;
    }
  }

  async searchByName(name: string): Promise<CountryData[]> {
    try {
      const data = await this.get<RestCountry[]>(`name/${encodeURIComponent(name)}`, {
        params: { fields: CountriesAPI.CORE_FIELDS },
      });
      return data.map((c) => this.transformCountry(c));
    } catch {
      return [];
    }
  }
}
