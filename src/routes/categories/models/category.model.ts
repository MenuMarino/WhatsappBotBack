import { Document, ObjectId, Schema } from 'mongoose';
import { ISubcategory } from 'src/routes/subcategories/models/subcategory.model';
import datasource from '../../../helpers/datasource';

export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  subcategories: ISubcategory[];
  show: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: String,
    subcategories: [{ type: Schema.Types.ObjectId, ref: 'subcategory' }],
    show: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default datasource.connection.model<ICategory>(
  'category',
  CategorySchema
);
