import { Document, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export interface IMessage extends Document {
  _id: string;
}

const MessageSchema = new Schema<IMessage>({
  _id: String,
});

export default datasource.connection.model<IMessage>('message', MessageSchema);
