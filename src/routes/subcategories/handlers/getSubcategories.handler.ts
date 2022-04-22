import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import CategoryModel from '../../categories/models/category.model';
import { Method } from 'src/types/methods';

const logger = Logger.create('dashboard:router:get-subcategories');

class GetSubcategories {
  readonly method = Method.GET;
  readonly route = '/api/subcategory/:category';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { category } = req.params;

    logger.info(`Finding all subcategories for ${category}`);

    const categoryInDB = await CategoryModel.findOne({ name: category });
    if (!categoryInDB) {
      throw new Error('Category does not exist');
    }

    return {
      subcategories: categoryInDB.subcategories,
    };
  }
}

export default new GetSubcategories();
