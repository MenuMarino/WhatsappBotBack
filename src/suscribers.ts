import { EventEmitter } from 'events';
import { Application } from 'express';
import { Events } from './helpers/events';
import Logger from './helpers/logger';
import ProductSuscriber from './routes/products/suscribers/product.suscriber';
import UserSuscriber from './routes/users/suscribers/user.suscriber';

const logger = Logger.create('dashboard:events');

export default (app: Application) => {
  const emitter: EventEmitter = app.get('emitter');

  logger.info('registering listener for PRODUCT_SUBMITTED event');
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  emitter.on(Events.PRODUCT_SUBMITTED, ProductSuscriber.onSubmit);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  emitter.on(Events.USER_SIGNUP, UserSuscriber.onUserSignup);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  emitter.on(Events.FORGOT_PASSWORD, UserSuscriber.onForgotPassword);
};
