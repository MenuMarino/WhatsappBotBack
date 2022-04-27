import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import auth from 'src/middlewares/auth';
import admin from 'src/middlewares/admin';
import { omit } from 'src/helpers/omit';
import UserModel from '../models/user.model';

const logger = Logger.create('dashboard:router:users:get-users');

class GetUsers {
  readonly method = Method.GET;
  readonly route = '/api/users';
  readonly middlewares = [auth, admin];

  async on(req: Request): Promise<any> {
    logger.info(`Finding all users`);

    const users = await UserModel.find({});
    // Borrar data de MongoDB
    const usersData = users.map((user) => ({
      user: omit(
        user.toJSON(),
        '_id __v updatedAt createdAt subcategories password activationToken'
      ),
    }));

    const parsedUsers = usersData.map((user) => ({
      ...user.user,
    }));

    // Obtener los headers de la tabla
    const headers = parsedUsers
      .map((user) => Object.keys(user))
      .reduce((acc: Record<string, unknown>, value: any) => {
        value.forEach((s: string) => {
          acc[s] = true;
        });
        return acc;
      }, {});
    const parsedHeaders = Object.keys(headers).map((key) => [
      String(key),
      (String(key).charAt(0).toUpperCase() + String(key).slice(1)).replace(
        '_',
        ' '
      ),
    ]);

    return {
      users: parsedUsers,
      headers: parsedHeaders.map((header) => ({
        Header: header[1],
        accessor: header[0],
      })),
    };
  }
}

export default new GetUsers();
