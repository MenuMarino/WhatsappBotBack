import { Request } from 'express';
import { nanoid } from 'nanoid';
import { emitter } from 'src/helpers/emitter';
import { Events } from 'src/helpers/events';
import Logger from 'src/helpers/logger';
import { Method } from 'src/types/methods';
import UserModel, { UserStatus } from '../models/user.model';

const logger = Logger.create('dashboard:router:user:forgot-password');

class ForgotPassword {
  readonly method = Method.POST;
  readonly route = '/api/users/forgotpassword';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { email } = req.body;
    logger.info('Generating recovery token for', email);

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User does not exist.');
    }
    if (user.status === UserStatus.NEED_VERIFICATION) {
      throw new Error('User needs verification.');
    }

    user.recoveryToken = nanoid();
    await user.save();

    emitter.emit(Events.FORGOT_PASSWORD, user);

    logger.info('Token generated');

    return {};
  }
}

export default new ForgotPassword();
