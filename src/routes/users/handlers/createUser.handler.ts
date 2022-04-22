import { Request } from 'express';
import { omit } from '../../../helpers/omit';
import { Method } from '../../../types/methods';
import UserModel from '../models/user.model';
import Logger from '../../../helpers/logger';
import TokenModel from '../models/token.model';

const logger = Logger.create('dashboard:create-user');

class CreateUser {
  readonly method = Method.POST;
  readonly route = '/api/create/user';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { name, email, password, ...values } = req.body;

    logger.info(`Creating user ${name}<${email}>`);

    const userInDB = await UserModel.findOne({ email });

    if (userInDB) {
      throw new Error('User already exists');
    }

    const user = new UserModel({ name, email, password, ...values });
    await user.save();
    return {
      user: omit(user.toJSON(), '_id password createdAt updatedAt __v'),
    };
  }
}

export default new CreateUser();