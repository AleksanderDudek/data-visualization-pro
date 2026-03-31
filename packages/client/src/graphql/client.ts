import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;
if (import.meta.env.PROD && !graphqlUrl) {
  throw new Error("[dataviz-pro] VITE_GRAPHQL_URL must be set for production builds.");
}

export const apolloClient = new ApolloClient({
  uri: graphqlUrl ?? "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          countries: { merge: false },
          launches: { merge: false },
          pokemon: { merge: false },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
