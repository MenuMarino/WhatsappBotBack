import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import { omit } from 'src/helpers/helpers';
import UserModel from '../models/user.model';

const logger = Logger.create('webhook:data');

class GetData {
  readonly method = Method.GET;
  readonly route = '/data';
  readonly middlewares = [];

  async on(req: Request, res: Response): Promise<any> {
    const data = await UserModel.find({});
    const dataCleaned = data.map((d) => ({
      d: omit(d.toJSON(), '_id __v'),
    }));
    return { data: dataCleaned };
  }
}

export default new GetData();
