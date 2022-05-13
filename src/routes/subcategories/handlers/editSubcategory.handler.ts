import { Request } from 'express';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/omit';
import admin from 'src/middlewares/admin';
import auth from 'src/middlewares/auth';
import { Method } from 'src/types/methods';
import SubcategoryModel from '../models/subcategory.model';

const logger = Logger.create('dashboard:router:edit-subcategory');

class EditSubcategory {
  readonly method = Method.POST;
  readonly route = '/api/edit/subcategory';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    const { activo, newSubcategory, currentSubcategory } = req.body;
    const subcategory = await SubcategoryModel.findOneAndUpdate(
      { name: currentSubcategory },
      { name: newSubcategory, show: activo },
      { new: true }
    );
    if (!subcategory) {
      throw new Error('Subcategory does not exist.');
    }

    return {
      subcategory: omit(subcategory.toJSON(), '_id, __v updatedAt'),
    };
  }
}

export default new EditSubcategory();
