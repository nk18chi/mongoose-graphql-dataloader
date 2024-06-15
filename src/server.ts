import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import connectMongoDB from './mongo/connect';
import logger from './config/logger';
import 'dotenv/config';
import User from './models/User.schema';
import IUser from './models/User.type';

const userLoader = new DataLoader<Types.ObjectId, IUser>(async (keys) => {
  const uniqueKeys = Array.from(new Set(keys.map((key: Types.ObjectId) => key.toString())));
  const users = await User.find({ _id: { $in: uniqueKeys } });
  const userMap: { [key: string]: IUser } = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = user;
  });
  return keys.map((key) => userMap[key.toString()]);
});

// The GraphQL schema
const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type OptimizedUser {
  id: ID!
  name: String!
  followers: [OptimizedUser]
  following: [OptimizedUser]
}

type Query {
  getUsers: [User]
  optimizedGetUsers: [OptimizedUser]
}
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    // call User.find method 53 times
    // (1 time for getUsers + 26 times for 26 user's followers + 26 times for 26 user's following)
    getUsers: async () => User.find(),

    // call User.find method 2 time (1 time for getUsers + 1 time for 26 user's followers and 26 user's following)
    optimizedGetUsers: async () => User.find(),
  },
  User: {
    followers: async (parent: IUser) => User.find({ _id: { $in: parent.followers } }),
    following: async (parent: IUser) => User.find({ _id: { $in: parent.following } }),
  },

  OptimizedUser: {
    followers: async (parent: IUser) => userLoader.loadMany(parent.followers as unknown as ArrayLike<Types.ObjectId>),
    following: async (parent: IUser) => userLoader.loadMany(parent.followers as unknown as ArrayLike<Types.ObjectId>),
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
})();
