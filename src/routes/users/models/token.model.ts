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
  user: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

interface ITokenModel extends Model<ITokenDocument> {
  generateToken(user: Schema.Types.ObjectId): Promise<any>;
}

const TokenSchema = new Schema<ITokenDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
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
  user: Schema.Types.ObjectId
) {
  const token = jwt.sign({ _id: user }, process.env.JWTSECRET, {
    expiresIn: '60m',
  });

  const newToken = new this({ user, token });
  const r = await newToken.save();
  return r.token;
};

export default datasource.connection.model<ITokenDocument, ITokenModel>(
  'token',
  TokenSchema
);
