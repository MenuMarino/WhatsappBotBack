import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import TokenModel from 'src/routes/admin/models/token.model';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authorization = req.cookies.jwt;

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
      admin: (jwtData as { _id: Schema.Types.ObjectId })._id,
      token: authorization,
    }).populate('admin');

    if (!tokenDB) {
      throw new Error('You are not authenticated');
    }

    next();
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(Error('You are not authenticated'));
  }
};

export default auth;
