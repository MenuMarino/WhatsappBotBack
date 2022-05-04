import { Application, Request, Response } from 'express';
import glob from 'glob';
import { StatusCodes } from 'http-status-codes';
import { Method } from './types/methods';
import Logger from './helpers/logger';
import { COOKIE_OPTIONS } from './routes/users/models/token.model';

const logger = Logger.create('dashboard:routes');

export default (app: Application) => {
  logger.info('Configuring router table');

  const h = glob.sync(__dirname + '/routes/**/*.handler.*');
  const handlers = h.map((handler) => require(handler).default);

  handlers.forEach((handler) => {
    logger.info(`adding route [${handler.method}] ${handler.route}`);

    const wrapper = async (req: Request, res: Response) => {
      logger.info(`Requesting [${handler.method}] ${handler.route}`);
      try {
        if (handler.schema) {
          const { error } = handler.schema.validate(req.body);

          if (error) {
            logger.debug(error);
            throw new Error(error.message);
          }
        }

        logger.debug('Request: %O', req.body);
        const { token, clearCookie, ...data } = await handler.on(req, res);
        logger.debug('Response: %O', data);
        if (clearCookie) {
          return res
            .status(StatusCodes.OK)
            .clearCookie('jwt', COOKIE_OPTIONS)
            .json({ status: 'success' });
        }
        if (token) {
          return res
            .status(StatusCodes.OK)
            .cookie('jwt', token, COOKIE_OPTIONS)
            .json({ status: 'success', data });
        }
        return res.status(StatusCodes.OK).json({ status: 'success', data });
      } catch (error: any) {
        logger.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json(error);
      }
    };

    if (handler.method === Method.POST) {
      app.post(handler.route, handler.middlewares, wrapper);
    } else {
      app.get(handler.route, handler.middlewares, wrapper);
    }
  });
};
