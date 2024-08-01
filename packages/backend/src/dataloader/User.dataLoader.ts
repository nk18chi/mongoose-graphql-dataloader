import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import IUser from '../models/User.type';
import User from '../models/User.schema';

const userDataLoader = new DataLoader<Types.ObjectId, IUser>(async (keys) => {
  const uniqueKeys = Array.from(new Set(keys.map((key: Types.ObjectId) => key.toString())));
  const users = await User.find({ _id: { $in: uniqueKeys } }).lean();
  const userMap: { [key: string]: IUser } = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = user;
  });
  return keys.map((key) => userMap[key.toString()]);
});

export default userDataLoader;
