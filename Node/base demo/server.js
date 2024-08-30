import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./src/resolvers/index.js";
import { typeDefs } from "./src/schemas/index.js";

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 3000 } });

console.log(`Server is running at ${url}`);