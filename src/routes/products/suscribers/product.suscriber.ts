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
      // Check if category exists
      let categoryInDB = await CategoryModel.findOne({ name: category });

      if (!categoryInDB) {
        const newCategory = new CategoryModel({
          name: category,
          subcategories: [subcategory],
        });
        await newCategory.save();
      } else if (!categoryInDB.subcategories.some((e) => e === subcategory)) {
        categoryInDB.subcategories.push(subcategory);
        await categoryInDB.save();
      }
      // Check if subcategory exists
      await SubcategoryModel.findOneAndUpdate(
        { name: subcategory, category },
        { $setOnInsert: { name: subcategory, category } },
        { upsert: true }
      );
      // Check if product exists
      const productInDB = await ProductModel.findOne({
        product_tag,
        category,
        subcategory,
      });

      if (productInDB) {
        await ProductModel.findOneAndUpdate(
          { product_tag, category, subcategory },
          {
            product_tag,
            body: {
              tracked: productInDB.body.tracked + 1,
              store: Number(productInDB.body.store + store),
              share: Number(productInDB.body.share + share),
              ...values,
            },
          }
        );
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
