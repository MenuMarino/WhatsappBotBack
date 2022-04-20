import { Request } from 'express';
import { emitter } from 'src/helpers/emitter';
import { Events } from 'src/helpers/events';
import Logger from 'src/helpers/logger';
import { Method } from 'src/types/methods';

const logger = Logger.create('dashboard:router:product');

class Product {
  readonly method = Method.POST;
  readonly route = '/api/product/';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    emitter.emit(Events.PRODUCT_SUBMITTED, req.body);
    logger.info('Product saved');
  }
}

export default new Product();
