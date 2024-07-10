import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { BaseContext } from '@apollo/server';
import IUser from '../../models/User.type';
import IAuthorizedUser from './AuthorizedUser.interface';

export interface Context extends BaseContext {
  user?: IAuthorizedUser;
  dataLoaders: {
    userDataLoader: DataLoader<Types.ObjectId, IUser, Types.ObjectId>;
  };
}

export default Context;
