import { Request } from 'express';
import Joi from 'joi';
import { omit } from '../../../helpers/omit';
import { Method } from '../../../types/methods';
import UserModel from '../models/user.model';
import Logger from '../../../helpers/logger';
import TokenModel from '../models/token.model';
import { emitter } from 'src/helpers/emitter';
import { Events } from 'src/helpers/events';

const logger = Logger.create('dashboard:signup');

const SignupSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class Signup {
  readonly method = Method.POST;
  readonly route = '/api/users/signup';
  readonly schema = SignupSchema;
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { name, email, password } = req.body;

    logger.info(`Signup new user ${name}<${email}>`);

    const userInDB = await UserModel.findOne({ email });

    if (userInDB) {
      throw new Error('User already exists');
    }

    const user = new UserModel({ name, email, password });
    await user.save();

    const token = await TokenModel.generateToken(user._id);

    logger.info(`User ${name}<${email}> registered`);
    emitter.emit(Events.USER_SIGNUP, user);
    return {
      user: omit(user.toJSON(), '_id password createdAt updatedAt __v'),
      token,
    };
  }
}

export default new Signup();
