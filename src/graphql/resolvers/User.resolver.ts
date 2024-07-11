import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User.schema';
import { Resolvers } from '../types';
import IUser from '../../models/User.type';

const userResolver: Resolvers = {
  Query: {
    // call User.find method 53 times
    // (1 time for getUsers + 26 times for 26 user's followers + 26 times for 26 user's following)
    getUsers: async () => User.find(),

    // call User.find method 2 time (1 time for getUsers + 1 time for 26 user's followers and 26 user's following)
    optimizedGetUsers: async () => User.find(),

    authorizedGetUsers: async () => User.find(),
    userToken: async () => {
      const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
      return jwt.sign({ _id: new Types.ObjectId() }, privateKey);
    },
  },
  User: {
    followers: async (user) => User.find({ _id: { $in: user.followers } }),
    following: async (user) => User.find({ _id: { $in: user.following } }),
  },

  OptimizedUser: {
    followers: async (user, _, context) => {
      const {
        dataLoaders: { userDataLoader },
      } = context;
      return (await userDataLoader.loadMany(user.followers as unknown as ArrayLike<Types.ObjectId>)) as IUser[];
    },
    following: async (user, _, context) => {
      const {
        dataLoaders: { userDataLoader },
      } = context;
      return (await userDataLoader.loadMany(user.following as unknown as ArrayLike<Types.ObjectId>)) as IUser[];
    },
  },
};

export default userResolver;
