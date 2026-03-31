import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import depthLimit from "graphql-depth-limit";
import DataLoader from "dataloader";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers, type GQLContext } from "./resolvers/index.js";
import type { RocketData } from "./datasources/spacexAPI.js";
import { CountriesAPI } from "./datasources/countriesAPI.js";
import { SpaceXAPI } from "./datasources/spacexAPI.js";
import { PokemonAPI } from "./datasources/pokemonAPI.js";
import { WeatherAPI } from "./datasources/weatherAPI.js";

const isProd = process.env.NODE_ENV === "production";

// Absurd facts generator (for fun analytics)
// Parse comma-separated allowed origins from env (e.g. https://user.github.io)
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

// Security headers (API-only server — no HTML served)
// /graphql gets relaxed CSP so Apollo Sandbox can load from its CDN
const apolloCDNs = [
  "https://apollo-server-landing-page.cdn.apollographql.com",
  "https://embeddable-sandbox.cdn.apollographql.com",
];
app.use("/graphql", helmet({
  contentSecurityPolicy: isProd ? {
    directives: {
      defaultSrc: ["'self'", ...apolloCDNs],
      scriptSrc: ["'self'", "'unsafe-inline'", ...apolloCDNs],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", ...apolloCDNs],
      fontSrc: ["'self'", "https://fonts.gstatic.com", ...apolloCDNs],
      imgSrc: ["'self'", "data:", ...apolloCDNs],
      connectSrc: ["'self'", "https://studio.apollographql.com", ...apolloCDNs],
      manifestSrc: [...apolloCDNs],
      frameSrc: ["https://sandbox.embed.apollographql.com"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// CORS — locked to explicit allowlist in production, permissive in dev
app.use(
  cors({
    origin: isProd ? (allowedOrigins.length ? allowedOrigins : false) : true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

// Rate limit: 60 requests per IP per minute
app.use(
  "/graphql",
  rateLimit({
    windowMs: 60 * 1_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errors: [{ message: "Too many requests. Please try again later." }] },
  })
);

// Cap incoming JSON body size to prevent large payload attacks
app.use(express.json({ limit: "50kb" }));

const server = new ApolloServer<GQLContext>({
  typeDefs,
  resolvers,
  // Disable introspection in production to avoid schema leakage
  introspection: process.env.ENABLE_INTROSPECTION === "true" || !isProd,
  // Reject queries deeper than 5 levels
  validationRules: [depthLimit(5)],
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async (): Promise<GQLContext> => {
      const spacexAPI = new SpaceXAPI();
      return {
        dataSources: {
          countriesAPI: new CountriesAPI(),
          spacexAPI,
          pokemonAPI: new PokemonAPI(),
          weatherAPI: new WeatherAPI(),
        },
        loaders: {
          rocketLoader: new DataLoader<string, RocketData | null>(async (rocketIds) => {
            const rockets = await spacexAPI.getAllRockets();
            const rocketMap = new Map(rockets.map((r) => [r.id, r]));
            return rocketIds.map((id) => rocketMap.get(id) ?? null);
          }),
        },
      };
    },
  })
);

// Health check endpoint for Render uptime monitoring
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`🌌 Galactic Data Dashboard API ready at http://localhost:${port}/graphql`);
});
