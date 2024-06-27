import { Types } from 'mongoose';
import User from '../../models/User.schema';
import IUser from '../../models/User.type';
import Context from '../interface/Context.interface';

const userResolver = {
  Query: {
    // call User.find method 53 times
    // (1 time for getUsers + 26 times for 26 user's followers + 26 times for 26 user's following)
    getUsers: async () => User.find(),

    // call User.find method 2 time (1 time for getUsers + 1 time for 26 user's followers and 26 user's following)
    optimizedGetUsers: async () => User.find(),
  },
  User: {
    followers: async (user: IUser) => User.find({ _id: { $in: user.followers } }),
    following: async (user: IUser) => User.find({ _id: { $in: user.following } }),
  },

  OptimizedUser: {
    followers: async (user: IUser, _: any, context: Context) => {
      const {
        dataLoaders: { userDataLoader },
      } = context;
      return userDataLoader.loadMany(user.followers as unknown as ArrayLike<Types.ObjectId>);
    },
    following: async (user: IUser, _: any, context: Context) => {
      const {
        dataLoaders: { userDataLoader },
      } = context;
      return userDataLoader.loadMany(user.following as unknown as ArrayLike<Types.ObjectId>);
    },
  },
};

export default userResolver;
