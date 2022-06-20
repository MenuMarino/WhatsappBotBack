import AdminModel from '../src/routes/admin/models/admin.model';
import Logger from '../src/helpers/logger';

const logger = Logger.create('webhook:seed');

const createAdmin = async () => {
  try {
    await AdminModel.deleteMany({});
    logger.info('Creating admin');
    const admin = new AdminModel({
      name: 'Admin',
      password: '$_4dm1n@',
    }).save();
    await Promise.all([admin]);
  } catch (e) {
    logger.error(e);
  }
};

const seeder = async () => {
  logger.info('Seeding');
  setTimeout(async () => {
    await createAdmin();
    process.exit();
  }, 10000);
};

seeder();
