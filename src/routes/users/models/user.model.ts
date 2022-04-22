import bcrypt from 'bcryptjs';
import { Document, Schema } from 'mongoose';
import datasource from '../../../helpers/datasource';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  categories: string[];
  subcategories: string[];
  role: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
    },
    subcategories: {
      type: [String],
    },
    role: {
      type: String,
      default: Role.CLIENT,
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export default datasource.connection.model<IUser>('user', UserSchema);
