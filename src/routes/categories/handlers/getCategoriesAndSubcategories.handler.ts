import { Request } from 'express';
import Logger from 'src/helpers/logger';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import CategoryModel from '../models/category.model';

const logger = Logger.create('dashboard:router:get-categories-subcategories');

class GetCategoriesAndSubcategories {
  readonly method = Method.GET;
  readonly route = '/api/data';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    logger.info(`Finding all categories and subcategories`);

    const categories = await CategoryModel.find({}).populate('subcategories');

    return {
      categories: categories.map((category) => {
        let subcategories = category.subcategories.map((sub) => sub.name);
        return {
          category: category.name,
          subcategories,
        };
      }),
    };
  }
}

export default new GetCategoriesAndSubcategories();
