import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongoDB from './mongo/connect';
import logger from './config/logger';
import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import 'dotenv/config';
import userDataLoader from './dataloader/User.dataLoader';
import Context from './graphql/interface/Context.interface';

const runServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => ({
        dataLoaders: {
          userDataLoader,
        },
      }),
    }),
  );

  await new Promise((resolve) => {
    httpServer.listen({ port: 4000 }, () => resolve(null));
  });

  await connectMongoDB();

  logger.info('🚀 Server ready at http://localhost:4000');

  return server;
};

export default runServer;
