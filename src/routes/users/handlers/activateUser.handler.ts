import { Request } from 'express';
import Logger from 'src/helpers/logger';

import UserModel, { UserStatus } from '../models/user.model';
import { Method } from 'src/types/methods';

const logger = Logger.create('dashboard:router:user:activate');

class Activate {
  readonly method = Method.GET;
  readonly route = '/api/users/activate/:token';
  readonly middlewares = [];

  async on({ params: { token } }: Request): Promise<any> {
    logger.info('Activating user using token:', token);

    if (!token) {
      throw new Error('Invalid token.');
    }
    const user = await UserModel.findOne({ activationToken: token });

    if (!user) {
      throw new Error('Invalid token.');
    }

    user.status = UserStatus.ACTIVE;
    user.activationToken = ''; // Invalidate token
    await user.save();

    logger.info('User %s activated', user.email);

    return {};
  }
}

export default new Activate();
