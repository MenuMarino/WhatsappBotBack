import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import { omit } from 'src/helpers/omit';

const logger = Logger.create('dashboard:router:users:me');

class Me {
  readonly method = Method.GET;
  readonly route = '/api/me';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { user } = req;

    logger.info('Getting user information for user', user.email);

    if (!user) {
      throw new Error('User does not exist');
    }

    logger.info('User loaded');

    return {
      user: omit(user.toJSON(), '_id __v password createdAt updatedAt'),
    };
  }
}

export default new Me();
