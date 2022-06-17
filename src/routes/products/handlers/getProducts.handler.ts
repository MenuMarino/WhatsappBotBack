import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import auth from 'src/middlewares/auth';
import { Role } from 'src/routes/users/models/user.model';
import { Method } from 'src/types/methods';
import ProductModel, { IProduct } from '../models/product.model';

const logger = Logger.create('dashboard:router:get-products');

class GetProducts {
  readonly method = Method.GET;
  readonly route = '/api/product/:category/:subcategory';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { category, subcategory } = req.params;

    logger.info(
      `Finding all products. Category: ${category}. Subcategory: ${subcategory}`
    );

    if (
      req.user.role !== Role.ADMIN &&
      (!req.user.categories.includes(category) ||
        (subcategory !== 'all-data' &&
          !req.user.subcategories.includes(subcategory)))
    ) {
      throw new Error("You don't have permission to access this resource");
    }
    let productsDB = [] as IProduct[];

    if (subcategory === 'all-data') {
      productsDB = await ProductModel.find({ category });
    } else {
      productsDB = await ProductModel.find({ category, subcategory });
    }

    const products = productsDB.filter((product) => {
      return (
        req.user.subcategories.includes(product.subcategory) ||
        req.user.role == Role.ADMIN
      );
    });

    // Borrar data de MongoDB
    const productsData = products.map((product) => ({
      product: omit(
        product.toJSON(),
        '_id __v updatedAt createdAt category subcategory'
      ),
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
