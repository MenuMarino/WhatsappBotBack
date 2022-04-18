import { Document, ObjectId, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export interface ISubcategory extends Document {
  _id: ObjectId;
  name: string;
  category: string;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: String,
    category: String,
  },
  { timestamps: true }
);

export default datasource.connection.model<ISubcategory>(
  'subcategory',
  SubcategorySchema
);
