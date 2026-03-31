import { RESTDataSource } from "@apollo/datasource-rest";

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly?: {
    relativehumidity_2m?: number[];
    precipitation?: number[];
  };
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  humidity: number | null;
  precipitation: number | null;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export class WeatherAPI extends RESTDataSource {
  override baseURL = "https://api.open-meteo.com/v1/";

  async getWeather(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      const data = await this.get<OpenMeteoResponse>("forecast", {
        params: {
          latitude: String(lat),
          longitude: String(lng),
          current_weather: "true",
          hourly: "relativehumidity_2m,precipitation",
        },
      });

      const current = data.current_weather;
      return {
        temperature: current.temperature,
        windSpeed: current.windspeed,
        weatherCode: current.weathercode,
        description: WEATHER_CODES[current.weathercode] ?? "Unknown",
        humidity: data.hourly?.relativehumidity_2m?.[0] ?? null,
        precipitation: data.hourly?.precipitation?.[0] ?? null,
      };
    } catch {
      return null;
    }
  }
}
