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
    // Borrar data de MongoDB
    const productsData = products.map((product) => ({
      product: omit(product.toJSON(), '_id __v updatedAt createdAt'),
    }));
    // Hacer un array de objetos que tengan el product_tag y el body del producto (tracked, store, ...)
    const parsedProducts = productsData.map((prod) => ({
      product_tag: prod.product.product_tag,
      ...prod.product.body,
    }));

    // Obtener los headers de la tabla
    const headers = parsedProducts
      .map((prod) => Object.keys(prod))
      .reduce((acc: Record<string, unknown>, value: any) => {
        value.forEach((s: string) => {
          acc[s] = true;
        });
        return acc;
      }, {});
    const parsedHeaders = Object.keys(headers).map((key) => [
      String(key),
      (String(key).charAt(0).toUpperCase() + String(key).slice(1)).replace(
        '_',
        ' '
      ),
    ]);

    return {
      products: parsedProducts,
      headers: parsedHeaders.map((header) => ({
        Header: header[1],
        accessor: header[0],
      })),
    };
  }
}

export default new GetProducts();
