import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { BaseContext } from '@apollo/server';
import IUser from '../../models/User.type';

interface Context extends BaseContext {
  dataLoaders: {
    userDataLoader: DataLoader<Types.ObjectId, IUser, Types.ObjectId>;
  };
}

export default Context;
