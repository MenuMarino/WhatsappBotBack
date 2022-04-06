import { Request } from 'express';
import Joi from 'joi';
import Logger from 'src/helpers/logger';
import { Method } from 'src/types/methods';
import UserModel from '../models/user.model';
import TokenModel from '../models/token.model';
import { omit } from '../../../helpers/omit';

const logger = Logger.create('dashboard:router:signin');

const SigninSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class Signin {
  readonly method = Method.POST;
  readonly route = '/api/users/signin';
  readonly schema = SigninSchema;
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { email, password } = req.body;

    logger.info('Authenticating email', email);

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = await TokenModel.generateToken(user._id);

    return {
      user: omit(user.toJSON(), '_id password createdAt updatedAt __v'),
      token,
    };
  }
}

export default new Signin();
