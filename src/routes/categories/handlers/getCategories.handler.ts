import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import CategoryModel from '../models/category.model';

const logger = Logger.create('dashboard:router:get-categories');

class GetCategories {
  readonly method = Method.GET;
  readonly route = '/api/category';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    logger.info(`Finding all categories`);

    const categories = await CategoryModel.find({});

    return {
      categories: categories.map((category) => category.name),
    };
  }
}

export default new GetCategories();
