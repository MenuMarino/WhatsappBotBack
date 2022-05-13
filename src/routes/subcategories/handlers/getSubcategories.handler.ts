import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import CategoryModel from '../../categories/models/category.model';
import { Method } from 'src/types/methods';

const logger = Logger.create('dashboard:router:get-subcategories');

class GetSubcategories {
  readonly method = Method.GET;
  readonly route = '/api/subcategory/:category/:getAll?';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { category, getAll } = req.params;
    logger.info(`Finding all subcategories for ${category}`);

    const categoryInDB = await CategoryModel.findOne({
      name: category,
    }).populate('subcategories');
    if (!categoryInDB) {
      throw new Error('Category does not exist');
    }

    const subcategories = categoryInDB.subcategories.map((sub) => {
      if (sub.show || getAll) return sub.name;
      else return null;
    });
    const filtered = subcategories.filter((element) => {
      return element != null;
    }) as any[];
    return {
      subcategories: filtered,
    };
  }
}

export default new GetSubcategories();
