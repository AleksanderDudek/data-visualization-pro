import { RESTDataSource } from "@apollo/datasource-rest";

interface SpaceXLaunchRaw {
  id: string;
  name: string;
  date_utc: string;
  date_unix: number;
  success: boolean | null;
  details: string | null;
  rocket: string;
  launchpad: string;
  upcoming: boolean;
  flight_number: number;
  links: {
    patch: { small: string | null; large: string | null };
    webcast: string | null;
    wikipedia: string | null;
    article: string | null;
  };
}

interface SpaceXRocketRaw {
  id: string;
  name: string;
  type: string;
  description: string;
  first_flight: string;
  success_rate_pct: number;
  cost_per_launch: number;
  height: { meters: number | null };
  diameter: { meters: number | null };
  mass: { kg: number | null };
}

export interface LaunchData {
  id: string;
  name: string;
  dateUtc: string;
  dateUnix: number;
  success: boolean | null;
  details: string | null;
  rocketId: string;
  launchpad: string;
  upcoming: boolean;
  flightNumber: number;
  links: {
    patch: string | null;
    webcast: string | null;
    wikipedia: string | null;
    article: string | null;
  };
}

export interface RocketData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  firstFlight: string | null;
  successRate: number | null;
  costPerLaunch: number | null;
  height: number | null;
  diameter: number | null;
  mass: number | null;
}

export class SpaceXAPI extends RESTDataSource {
  override baseURL = "https://api.spacexdata.com/v4/";

  private transformLaunch(raw: SpaceXLaunchRaw): LaunchData {
    return {
      id: raw.id,
      name: raw.name,
      dateUtc: raw.date_utc,
      dateUnix: raw.date_unix,
      success: raw.success,
      details: raw.details,
      rocketId: raw.rocket,
      launchpad: raw.launchpad,
      upcoming: raw.upcoming,
      flightNumber: raw.flight_number,
      links: {
        patch: raw.links.patch.small,
        webcast: raw.links.webcast,
        wikipedia: raw.links.wikipedia,
        article: raw.links.article,
      },
    };
  }

  private transformRocket(raw: SpaceXRocketRaw): RocketData {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type,
      description: raw.description,
      firstFlight: raw.first_flight,
      successRate: raw.success_rate_pct,
      costPerLaunch: raw.cost_per_launch,
      height: raw.height.meters,
      diameter: raw.diameter.meters,
      mass: raw.mass.kg,
    };
  }

  async getAllLaunches(): Promise<LaunchData[]> {
    const data = await this.get<SpaceXLaunchRaw[]>("launches");
    return data.map((l) => this.transformLaunch(l));
  }

  async getLaunch(id: string): Promise<LaunchData | null> {
    try {
      const data = await this.get<SpaceXLaunchRaw>(`launches/${encodeURIComponent(id)}`);
      return this.transformLaunch(data);
    } catch {
      return null;
    }
  }

  async getAllRockets(): Promise<RocketData[]> {
    const data = await this.get<SpaceXRocketRaw[]>("rockets");
    return data.map((r) => this.transformRocket(r));
  }

  async getRocket(id: string): Promise<RocketData | null> {
    try {
      const data = await this.get<SpaceXRocketRaw>(`rockets/${encodeURIComponent(id)}`);
      return this.transformRocket(data);
    } catch {
      return null;
    }
  }
}
