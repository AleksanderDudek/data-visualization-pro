# 🌌 Galactic Data Dashboard

> *"Connecting the Unconnectable"* — A senior-level data visualization showcase

A full-stack TypeScript application that treats data from multiple free APIs as one unified galactic database. Because why just look at country populations when you can compare them to Pikachu's attack stat?

## 🛸 Overview and links

<img width="1912" height="787" alt="Screenshot 2026-04-01 at 09 09 31" src="https://github.com/user-attachments/assets/ec50b61e-5ce7-4359-ade7-bf6fb1f2a57a" />

The project uses several technologies (all mentioned below). For showcasing some of them you can access:
- the app: https://aleksanderdudek.github.io/data-visualization-pro/
- storybook: https://69cbc9e847376109cb5f127b-umvchfloib.chromatic.com/
- graphQL endpoint: https://data-visualization-pro.onrender.com/graphql

## 🛸 The Concept

The Galactic Data Dashboard is a tongue-in-cheek analytics platform that unifies disparate data sources through a single GraphQL API:

| API | Galactic Division |
|-----|-------------------|
| [REST Countries](https://restcountries.com) | Planetary Civilizations Database |
| [SpaceX API](https://api.spacexdata.com) | Galactic Transport Division |
| [PokeAPI](https://pokeapi.co) | Known Fauna Registry |
| [Open-Meteo](https://open-meteo.com) | Atmospheric Monitoring System |

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit + RTK Query
- **Data Visualization**: D3.js, AG Grid
- **API Layer**: GraphQL (Apollo Server + Apollo Client)
- **Component Library**: Storybook
- **Backend**: Node.js, Apollo Server

## 📦 Project Structure

```
dataviz-pro/
├── packages/
│   ├── server/           # Apollo Server + GraphQL API
│   │   ├── src/
│   │   │   ├── schema/       # GraphQL type definitions
│   │   │   ├── resolvers/    # Query resolvers
│   │   │   └── datasources/  # REST API data sources
│   │   └── package.json
│   └── client/           # React + D3 + AG Grid
│       ├── src/
│       │   ├── components/   # UI components
│       │   ├── store/        # Redux slices
│       │   ├── graphql/      # Queries & client setup
│       │   ├── hooks/        # Custom React hooks
│       │   └── types/        # Shared TypeScript types
│       ├── .storybook/       # Storybook config
│       └── package.json
├── tsconfig.base.json
└── package.json
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start both server and client
npm run dev

# Or run individually
npm run dev:server   # GraphQL server on :4000
npm run dev:client   # React app on :5173

# Storybook
npm run storybook
```

## ✨ Senior-Level Patterns Demonstrated

- **Monorepo architecture** with npm workspaces
- **GraphQL federation** of multiple REST APIs (data source aggregation)
- **TypeScript generics** and discriminated unions
- **Custom D3.js visualizations** with React integration (useRef + useEffect pattern)
- **AG Grid** with custom cell renderers, virtual scrolling
- **Redux Toolkit** with entity adapters and memoized selectors
- **Storybook** with controls, decorators, and documentation
- **Responsive, animated** data visualizations
- **Performance patterns**: debounced search, lazy loading, memoization

## 📊 Dashboard Views

1. **Mission Control** — Overview dashboard with summary cards and key metrics
2. **World Explorer** — Interactive bubble chart of countries by population/area
3. **Launch Timeline** — D3 timeline of SpaceX rocket launches
4. **Fauna Registry** — Pokemon stats visualized as radar charts
5. **Data Grid** — AG Grid with all country data, filters, and sparklines
6. **Fauna vs Nations** — The absurd scatter plot: Pokemon power levels vs GDP
