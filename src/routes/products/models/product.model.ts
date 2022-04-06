import { Document, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export interface IProduct extends Document {
  product_tag: string;
  tracked: number;
  store: number;
  share: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    product_tag: {
      type: String,
      required: true,
      trim: true,
    },
    tracked: Number,
    store: Number,
    share: Number,
  },
  { timestamps: true }
);

export default datasource.connection.model<IProduct>('product', ProductSchema);
