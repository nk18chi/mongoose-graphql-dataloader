import { model, Schema } from 'mongoose';
import IUser from './User.type';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const User = model<IUser>('User', userSchema);

export default User;
