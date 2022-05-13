import { Document, ObjectId, Schema } from 'mongoose';
import datasource from '../../../helpers/datasource';

export interface ISubcategory extends Document {
  _id: ObjectId;
  name: string;
  show: boolean;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: String,
    show: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default datasource.connection.model<ISubcategory>(
  'subcategory',
  SubcategorySchema
);
