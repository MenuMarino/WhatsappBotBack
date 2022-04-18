import { Document, ObjectId, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  subcategories: ObjectId[];
}

const CategorySchema = new Schema<ICategory>(
  {
    name: String,
  },
  { timestamps: true }
);

export default datasource.connection.model<ICategory>(
  'category',
  CategorySchema
);
