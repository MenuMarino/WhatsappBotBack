import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from 'src/routes/users/models/user.model';

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== Role.ADMIN) {
      throw new Error('You are not an administrator.');
    }
    next();
  } catch (err) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json(Error('You are not an administrator.'));
  }
};

export default admin;
