import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import { Method } from 'src/types/methods';
import ProductModel, { IProduct } from '../models/product.model';

const logger = Logger.create('dashboard:router:product');

class Product {
  readonly method = Method.POST;
  readonly route = '/api/product';
  readonly middlewares = [];

  async on(req: Request): Promise<any> {
    const { product_tag, ...values } = req.body;

    logger.info(`Saving product: ${product_tag}`);

    const productInDB = await ProductModel.findOne({ product_tag });
    let product = {} as IProduct;

    if (productInDB) {
      product = await ProductModel.findOneAndUpdate(
        { product_tag },
        {
          product_tag,
          body: { tracked: productInDB.body.tracked + 1, ...values },
        },
        { new: true }
      );
    } else {
      product = new ProductModel({
        product_tag,
        body: { tracked: 1, ...values },
      });
      await product.save();
    }

    return {
      product: omit(product.toJSON(), '_id __v updatedAt'),
    };
  }
}

export default new Product();
