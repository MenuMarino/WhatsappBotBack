import { Document, ObjectId, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export interface IProduct extends Document {
  _id: ObjectId;
  body: any;
  product_tag: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    product_tag: String,
    body: {},
  },
  { timestamps: true }
);

export default datasource.connection.model<IProduct>('product', ProductSchema);
