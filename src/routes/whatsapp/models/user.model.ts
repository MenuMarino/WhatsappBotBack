import { Document, Schema } from 'mongoose';
import datasource from '../../../helpers/datasource';

export enum State {
  NEW = 'new',
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  state: string;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: String,
  phone: Number,
  state: { type: String, default: State.NEW },
});

export default datasource.connection.model<IUser>('user', UserSchema);
