import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries($region: String, $search: String, $limit: Int) {
    countries(region: $region, search: $search, limit: $limit) {
      code
      name
      officialName
      capital
      region
      subregion
      population
      area
      languages
      currencies {
        code
        name
        symbol
      }
      flagUrl
      flagEmoji
      lat
      lng
    }
  }
`;

export const GET_COUNTRY_WITH_WEATHER = gql`
  query GetCountryWithWeather($code: String!) {
    country(code: $code) {
      code
      name
      officialName
      capital
      region
      subregion
      population
      area
      languages
      flagUrl
      flagEmoji
      lat
      lng
      weather {
        temperature
        windSpeed
        weatherCode
        description
        humidity
        precipitation
      }
    }
  }
`;
