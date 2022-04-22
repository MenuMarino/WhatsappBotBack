import { Document, ObjectId, Schema } from 'mongoose';
import datasource from '../../../helpers/datasource';

export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  subcategories: string[];
}

const CategorySchema = new Schema<ICategory>(
  {
    name: String,
    subcategories: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default datasource.connection.model<ICategory>(
  'category',
  CategorySchema
);
