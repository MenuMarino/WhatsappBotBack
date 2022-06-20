import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { Document, Model, Schema } from 'mongoose';
import datasource from 'src/helpers/datasource';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 1000,
  sameSite: 'strict',
  domain: 'localhost',
  path: '/',
};

export interface ITokenDocument extends Document {
  _id: string;
  admin: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

interface ITokenModel extends Model<ITokenDocument> {
  generateToken(admin: Schema.Types.ObjectId): Promise<any>;
}

const TokenSchema = new Schema<ITokenDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'admin',
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now()),
      index: {
        expires: '60m',
      },
    },
  },
  { timestamps: true }
);

TokenSchema.statics.generateToken = async function (
  admin: Schema.Types.ObjectId
) {
  const token = jwt.sign({ _id: admin }, process.env.JWTSECRET, {
    expiresIn: '60m',
  });

  const newToken = new this({ admin, token });
  const r = await newToken.save();
  return r.token;
};

export default datasource.connection.model<ITokenDocument, ITokenModel>(
  'token',
  TokenSchema
);
