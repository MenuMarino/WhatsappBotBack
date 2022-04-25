import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import CategoryModel from '../models/category.model';

const logger = Logger.create('dashboard:router:category');

class Category {
  readonly method = Method.POST;
  readonly route = '/api/category';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    const { name } = req.body;
    logger.info(`Creating new category: ${name}`);

    const category = new CategoryModel({ name });
    await category.save();

    return {
      category: omit(category.toJSON(), '_id __v updatedAt'),
    };
  }
}

export default new Category();
