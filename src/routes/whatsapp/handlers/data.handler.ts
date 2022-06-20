import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/helpers';
import UserModel from '../models/user.model';
import auth from 'src/middlewares/auth';

const logger = Logger.create('webhook:data');

class GetData {
  readonly method = Method.GET;
  readonly route = '/data';
  readonly middlewares = [auth];

  async on(req: Request, res: Response): Promise<any> {
    const data = await UserModel.find({});
    const parsedData = data.map((d) => ({
      data: omit(d.toJSON(), '_id __v'),
    }));
    const cleanedData = parsedData.map((d) => ({
      ...d.data,
    }));
    // logger.info(parsedData);
    const parsedHeaders = [
      ['state', 'State'],
      ['name', 'Name'],
      ['phone', 'Phone'],
      ['email', 'Email'],
    ];

    return {
      data: cleanedData,
      headers: parsedHeaders.map((header) => ({
        Header: header[1],
        accessor: header[0],
      })),
    };
  }
}

export default new GetData();
