import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import SubcategoryModel from 'src/routes/subcategories/models/subcategory.model';
import { Method } from 'src/types/methods';
import CategoryModel from '../models/category.model';

const logger = Logger.create('dashboard:router:create-subcategory');

class CreateSubcategory {
  readonly method = Method.POST;
  readonly route = '/api/category/:category';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    const { name } = req.body;
    const { category } = req.params;

    logger.info(`Creating new subcategory: ${name}. Category: ${category}`);

    const subcategory = new SubcategoryModel({ name, category });
    await subcategory.save();

    await CategoryModel.findOneAndUpdate(
      { name: category },
      { $push: { subcategories: name } }
    );

    return {
      subcategory: omit(subcategory.toJSON(), '_id, __v updatedAt'),
    };
  }
}

export default new CreateSubcategory();
