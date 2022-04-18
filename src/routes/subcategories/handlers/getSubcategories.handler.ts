import { Request } from 'express';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import SubcategoryModel from 'src/routes/subcategories/models/subcategory.model';
import { Method } from 'src/types/methods';

const logger = Logger.create('dashboard:router:get-subcategories');

class GetSubcategories {
  readonly method = Method.GET;
  readonly route = '/api/subcategory/:category';
  readonly middlewares = [auth];

  async on(req: Request): Promise<any> {
    const { category } = req.params;

    logger.info(`Finding all subcategories for ${category}`);

    const subcategories = await SubcategoryModel.find({ category });

    return {
      subcategories: subcategories.map((subcategory) => subcategory.name),
    };
  }
}

export default new GetSubcategories();
