import { categories } from './categories';
import Logger from '../src/helpers/logger';
import CategoryModel, {
  ICategory,
} from '../src/routes/categories/models/category.model';
import SubcategoryModel, {
  ISubcategory,
} from '../src/routes/subcategories/models/subcategory.model';

const logger = Logger.create('dashboard:seed:categories');

const createCategories = async () => {
  try {
    await CategoryModel.deleteMany({});
    await SubcategoryModel.deleteMany({});

    let categoriesDocuments: Promise<ICategory>[] = [];
    let subcategoriesDocument: Promise<ISubcategory>[] = [];

    Object.entries(categories).forEach(([key, values]) => {
      const category = new CategoryModel({ name: key }).save();
      categoriesDocuments.push(category);

      values.forEach(async (element) => {
        const subcategory = new SubcategoryModel({
          name: element,
          category: key,
        }).save();
        subcategoriesDocument.push(subcategory);
      });
    });

    const savedCategories = await Promise.all(categoriesDocuments);
    const savedSubcategories = await Promise.all(subcategoriesDocument);
    savedCategories.forEach((category) =>
      logger.info(`Category created: ${category.name}`)
    );
    savedSubcategories.forEach((subcategory) =>
      logger.info(`Subcategory created: ${subcategory.name}`)
    );
  } catch (err) {
    logger.error(err);
  }
};

const seeder = async () => {
  setTimeout(async () => {
    await createCategories();
    process.exit();
  }, 1000);
};

seeder();
