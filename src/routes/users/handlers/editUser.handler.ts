import { Request } from 'express';
import Joi from 'joi';
import Logger from 'src/helpers/logger';
import { Method } from 'src/types/methods';
import UserModel from '../models/user.model';
import TokenModel from '../models/token.model';
import { omit } from '../../../helpers/omit';
import auth from 'src/middlewares/auth';
import admin from 'src/middlewares/admin';

const logger = Logger.create('dashboard:router:edit-user');

class EditUser {
  readonly method = Method.POST;
  readonly route = '/api/edit/user';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    const { categories, password, userId } = req.body;

    logger.info(`Updating user with id: ${userId}`);

    const user = await UserModel.findOne({ userId });

    if (!user) {
      throw new Error('User does not exist');
    }

    if (password) user.password = password;
    user.categories = categories;
    await user.save();

    return {
      user: omit(user.toJSON(), '_id password createdAt updatedAt __v'),
    };
  }
}

export default new EditUser();
