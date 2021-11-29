import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./gql/schema";
import { resolvers } from "./gql/resolvers";
import { logger } from "./utils/logger";

const PORT = 4000;
const app = express();

app.use(cors());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen({ port: PORT }, () => {
    logger.info(`Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer();
