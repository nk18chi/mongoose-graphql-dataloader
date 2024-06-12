import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongoDB from './mongo/connect';
import logger from './config/logger';
import 'dotenv/config';

// The GraphQL schema
const typeDefs = `#graphql
type Query {
  hello: String
}
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  await new Promise((resolve) => {
    httpServer.listen({ port: 4000 }, () => resolve(null));
  });

  await connectMongoDB();

  logger.info('🚀 Server ready at http://localhost:4000');
  logger.error('GET on /history', new Error('something goes wrong'));
})();
