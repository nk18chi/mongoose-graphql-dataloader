import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';
import { OperationDefinitionNode as OperationNode } from 'graphql';
import connectMongoDB from './mongo/connect';
import logger from './config/logger';
import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import 'dotenv/config';
import userDataLoader from './dataloader/User.dataLoader';
import Context from './graphql/interface/Context.interface';
import permissions from './graphql/authorizations/permissions';

const runServer = async () => {
  console.log('MONGO_URI', process.env.MONGO_URI.slice(0, 15));
  console.log('a');
  const app = express();
  const httpServer = http.createServer(app);
  console.log('b');

  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    permissions,
  );

  const MAX_COMPLEXITY = process.env.GRAPHQL_QUERY_MAX_COMPLEXITY;
  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        requestDidStart: async () => ({
          async didResolveOperation({ request, document }) {
            const operationName = request.operationName ?? (document.definitions[0] as OperationNode).name?.value;
            if (operationName === 'IntrospectionQuery') return;
            const complexity = getComplexity({
              schema,
              operationName,
              query: document,
              variables: request.variables,
              estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
            });

            if (complexity > MAX_COMPLEXITY) {
              // eslint-disable-next-line max-len
              const errorMessage = `Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY} by ${operationName}`;
              const error = new Error(errorMessage);
              logger.error(errorMessage, error);
              throw error;
            }
            logger.info(`Used query complexity points: ${complexity} by ${operationName}`);
          },
        }),
      },
    ],
  });
  console.log('c');
  await server.start();
  console.log('d');

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
  console.log('e');
  await new Promise((resolve) => {
    if (process.env.NODE_ENV === 'test') {
      resolve(null);
      return;
    }
    httpServer.listen({ port: process.env.LOCALHOST_PORT }, () => resolve(null));
  });
  console.log('f');
  await connectMongoDB();
  console.log('g');
  logger.info('🚀 Server ready at http://localhost:4000');

  return app;
};

export default runServer;
