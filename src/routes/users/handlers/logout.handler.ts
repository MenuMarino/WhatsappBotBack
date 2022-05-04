import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';

const logger = Logger.create('dashboard:router:users:logout');

class LogOut {
  readonly method = Method.GET;
  readonly route = '/api/logout';
  readonly middlewares = [auth];

  async on(): Promise<any> {
    logger.info('User logout.');
    return {
      clearCookie: true,
    };
  }
}

export default new LogOut();
