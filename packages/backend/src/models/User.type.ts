import { Types, Schema } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

export default IUser;
