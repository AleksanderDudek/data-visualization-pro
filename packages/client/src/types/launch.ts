export interface Launch {
  id: string;
  name: string;
  dateUtc: string;
  dateUnix: number;
  success: boolean | null;
  details: string | null;
  rocket: Rocket | null;
  launchpad: string | null;
  upcoming: boolean;
  flightNumber: number;
  links: LaunchLinks | null;
}

export interface Rocket {
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

export interface LaunchLinks {
  patch: string | null;
  webcast: string | null;
  wikipedia: string | null;
  article: string | null;
}

export interface LaunchStats {
  total: number;
  successful: number;
  failed: number;
  upcoming: number;
  successRate: number;
  byYear: YearCount[];
}

export interface YearCount {
  year: number;
  count: number;
  successes: number;
  failures: number;
}
