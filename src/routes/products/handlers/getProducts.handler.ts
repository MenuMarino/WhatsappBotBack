import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import ProductModel from '../models/product.model';

const logger = Logger.create('dashboard:router:get-products');

class GetProducts {
  readonly method = Method.GET;
  readonly route = '/api/product';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    logger.info('Finding all products');
    const products = await ProductModel.find({});

    return products.map((product) => ({
      product: omit(product.toJSON(), '_id __v updatedAt createdAt'),
    }));
  }
}

export default new GetProducts();
