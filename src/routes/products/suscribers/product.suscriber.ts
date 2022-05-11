import Logger from 'src/helpers/logger';
import CategoryModel from 'src/routes/categories/models/category.model';
import SubcategoryModel from 'src/routes/subcategories/models/subcategory.model';
import ProductModel from '../models/product.model';

const logger = Logger.create('dashboard:events:product');

class ProductSuscriber {
  async onSubmit(body: any) {
    const { product_tag, category, subcategory, store, share, ...values } =
      body;

    logger.info(`Saving product: ${product_tag}`);

    try {
      // Check if subcategory exists
      let subcategoryInDB = await SubcategoryModel.findOne({
        name: subcategory,
      });
      if (!subcategoryInDB) {
        subcategoryInDB = new SubcategoryModel({
          name: subcategory,
        });
        await subcategoryInDB.save();
      }
      // Check if category exists
      let categoryInDB = await CategoryModel.findOne({
        name: category,
      }).populate('subcategories');
      if (!categoryInDB) {
        const newCategory = new CategoryModel({
          name: category,
          subcategories: [subcategoryInDB._id],
        });
        await newCategory.save();
      } else if (
        !categoryInDB.subcategories.some((e) => e.name === subcategory)
      ) {
        await CategoryModel.findOneAndUpdate(
          { name: category },
          {
            $push: { subcategories: subcategoryInDB._id },
          }
        );
      }
      // Check if product exists
      let productInDB = await ProductModel.findOne({
        product_tag,
        category,
        subcategory,
      });
      if (productInDB) {
        productInDB.body.tracked += 1;
        productInDB.body.store += Number(store);
        productInDB.body.share += Number(share);
        productInDB.body = { ...productInDB.body, ...values };
        productInDB.markModified('body');
        await productInDB.save();
      } else {
        const product = new ProductModel({
          product_tag,
          category,
          subcategory,
          body: {
            tracked: 1,
            store: Number(store),
            share: Number(share),
            ...values,
          },
        });
        await product.save();
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

export default new ProductSuscriber();
