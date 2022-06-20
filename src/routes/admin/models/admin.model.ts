import { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import datasource from '../../../helpers/datasource';

export interface IAdmin extends Document {
  username: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

AdminSchema.pre<IAdmin>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

AdminSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export default datasource.connection.model<IAdmin>('admin', AdminSchema);
