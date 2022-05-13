import { Request } from 'express';
import Logger from 'src/helpers/logger';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import { Role } from 'src/routes/users/models/user.model';
import { Method } from 'src/types/methods';
import CategoryModel, { ICategory } from '../models/category.model';

const logger = Logger.create('dashboard:router:get-categories');

class GetCategories {
  readonly method = Method.GET;
  readonly route = '/api/category/:getAll?';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    logger.info(`Finding all categories`);
    const { user } = req;
    const { getAll } = req.params;

    let categoriesInDB: ICategory[] = [];

    if (user.role == Role.ADMIN) {
      categoriesInDB = await CategoryModel.find({});
    } else {
      categoriesInDB = await CategoryModel.find({ name: user.categories });
    }
    const categories = categoriesInDB.map((category) => {
      if (category.show || getAll) return category.name;
      else return null;
    });
    const filtered = categories.filter((element) => {
      return element != null;
    }) as any[];

    return {
      categories: filtered,
    };
  }
}

export default new GetCategories();
