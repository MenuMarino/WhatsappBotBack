import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import { Role } from 'src/routes/users/models/user.model';
import { Method } from 'src/types/methods';
import CategoryModel, { ICategory } from '../models/category.model';

const logger = Logger.create('dashboard:router:get-categories');

class GetCategories {
  readonly method = Method.GET;
  readonly route = '/api/category';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    logger.info(`Finding all categories`);
    const { user } = req;

    let categories: ICategory[] = [];

    if (user.role == Role.ADMIN) {
      categories = await CategoryModel.find({});
    } else {
      categories = await CategoryModel.find({ name: user.categories });
    }

    return {
      categories: categories.map((category) => category.name),
    };
  }
}

export default new GetCategories();
