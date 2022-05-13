import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import CategoryModel from '../models/category.model';

const logger = Logger.create('dashboard:router:edit-category');

class EditCategory {
  readonly method = Method.POST;
  readonly route = '/api/edit/category/';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    const { activo, currentCategory, newCategory } = req.body;
    const category = await CategoryModel.findOneAndUpdate(
      { name: currentCategory },
      { name: newCategory, show: activo },
      { new: true }
    );
    if (!category) {
      throw new Error('Category does not exist.');
    }

    return {
      category: omit(category.toJSON(), '_id, __v updatedAt subcategories'),
    };
  }
}

export default new EditCategory();
