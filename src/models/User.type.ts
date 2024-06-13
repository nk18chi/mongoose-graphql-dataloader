import { Schema } from 'mongoose';

interface IUser {
  name: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

export default IUser;
