import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { Method } from 'src/types/methods';
import UserModel from '../models/user.model';

const logger = Logger.create('dashboard:router:user:reset-password');

class ResetPassword {
  readonly method = Method.POST;
  readonly route = '/api/users/resetpassword';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { password, token } = req.body;
    const user = await UserModel.findOne({ recoveryToken: token });
    if (!user) {
      throw new Error('Invalid recovery token.');
    }

    logger.info(`Reseting password for ${user.email}`);
    user.password = password;
    user.recoveryToken = '';
    await user.save();
    logger.info('Password updated');

    return {};
  }
}

export default new ResetPassword();
