import mongoose, { Connection } from 'mongoose';

import Logger from './logger';

require('dotenv').config();

const logger = Logger.create('webhook:datasource');

export class Datasource {
  readonly connection: Connection;

  private constructor() {
    const dbname = process.env.DBNAME;
    const uri = process.env.URI!;

    const connectOptions: mongoose.ConnectOptions = {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      keepAlive: true,
      keepAliveInitialDelay: 5000,
      sslValidate: false,
    };

    logger.info('connecting/mongoose: %s', dbname);
    this.connection = mongoose.createConnection(uri, connectOptions);
    logger.info('connected/mongoose: %s', dbname);
  }

  static create() {
    return new Datasource();
  }
}

export default Datasource.create();
