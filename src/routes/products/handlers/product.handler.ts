import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import { Method } from 'src/types/methods';
import ProductModel from '../models/product.model';

const logger = Logger.create('dashboard:router:product');

class Product {
  readonly method = Method.POST;
  readonly route = '/api/product';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { product_tag, ...values } = req.body;

    logger.info(`Saving product: ${product_tag}`);

    const product = new ProductModel({ product_tag, ...values });
    await product.save();

    return {
      product: omit(product.toJSON(), '_id __v updatedAt'),
    };
  }
}

export default new Product();
