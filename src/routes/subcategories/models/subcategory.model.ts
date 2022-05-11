import { Document, ObjectId, Schema } from 'mongoose';
import datasource from '../../../helpers/datasource';

export interface ISubcategory extends Document {
  _id: ObjectId;
  name: string;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: String,
  },
  { timestamps: true }
);

export default datasource.connection.model<ISubcategory>(
  'subcategory',
  SubcategorySchema
);
