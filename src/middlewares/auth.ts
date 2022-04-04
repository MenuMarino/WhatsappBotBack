import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import TokenModel from '../routes/users/models/token.model';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authorization = req.header('Authorization');

    if (!authorization) {
      throw new Error('You are not authenticated');
    }

    authorization = authorization.replace('Bearer', '').trim();

    // En caso se envie el token vacio pero si el Bearer
    if (authorization.length === 0) {
      throw new Error('You are not authenticated');
    }

    const jwtData = jwt.verify(authorization, process.env.JWTSECRET);

    const tokenDB = await TokenModel.findOne({
      user: (jwtData as { _id: Schema.Types.ObjectId })._id,
      token: authorization,
    }).populate('user');

    if (!tokenDB) {
      throw new Error('You are not authenticated');
    }

    req.user = tokenDB.user;
    next();
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(Error('You are not authenticated'));
  }
};

export default auth;
