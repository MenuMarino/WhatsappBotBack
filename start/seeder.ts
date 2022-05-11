import { categories } from './categories';
import Logger from '../src/helpers/logger';
import CategoryModel, {
  ICategory,
} from '../src/routes/categories/models/category.model';
import SubcategoryModel, {
  ISubcategory,
} from '../src/routes/subcategories/models/subcategory.model';
import UserModel, { UserStatus } from '../src/routes/users/models/user.model';

const logger = Logger.create('dashboard:seed:categories');

const loadData = async () => {
  let categoriesDocuments: Promise<ICategory>[] = [];

  await Promise.all(
    Object.entries(categories).map(async ([key, values]) => {
      let subcategoriesDocument: Promise<ISubcategory>[] = [];

      values.forEach(async (element) => {
        const subcategory = new SubcategoryModel({
          name: element,
        }).save();
        subcategoriesDocument.push(subcategory);
      });
      const savedSubcategories = await Promise.all(subcategoriesDocument);
      const subcategoriesIds = savedSubcategories.map((sub) => sub._id);

      const category = new CategoryModel({
        name: key,
        subcategories: subcategoriesIds,
      }).save();
      categoriesDocuments.push(category);
    })
  );
  return categoriesDocuments;
};

const createCategories = async () => {
  try {
    let categoriesDocuments: Promise<ICategory>[] = await loadData();

    await Promise.all(categoriesDocuments);

    const admin = new UserModel({
      name: 'Admin',
      email: 'benjamin.diaz@utec.edu.pe',
      password: '$_4dm1n@',
      role: 'admin',
      activationToken: '',
      status: UserStatus.ACTIVE,
    }).save();
    await Promise.all([admin]);
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
