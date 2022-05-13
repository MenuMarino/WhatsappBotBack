import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import CategoryModel from '../../categories/models/category.model';
import { Method } from 'src/types/methods';
import { Role } from 'src/routes/users/models/user.model';

const logger = Logger.create('dashboard:router:get-subcategories');

class GetSubcategories {
  readonly method = Method.GET;
  readonly route = '/api/subcategory/:category/:getAll?';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { category, getAll } = req.params;
    const { user } = req;
    logger.info(`Finding all subcategories for ${category}`);

    const categoryInDB = await CategoryModel.findOne({
      name: category,
    }).populate('subcategories');
    if (!categoryInDB) {
      throw new Error('Category does not exist');
    }

    const subcategories = categoryInDB.subcategories.map((sub) => {
      if (
        (sub.show || getAll) &&
        (user.subcategories.includes(sub.name) || user.role == Role.ADMIN)
      )
        return sub.name;
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
