import { nanoid } from 'nanoid';
import http from 'http';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import createRoutes from './routes';
import Logger from './helpers/logger';

require('dotenv').config();

const logger = Logger.create('dashboard:app');

export default class App {
  readonly #id: string = nanoid();
  readonly #app: Application;

  constructor() {
    logger.info('Configuring express application');

    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.json({ limit: '50mb' }));

    createRoutes(app);
    this.#app = app;
  }

  static create() {
    return new App();
  }

  async start() {
    try {
      logger.info(`Booting ${this.#id}`);
      await this.#listen();
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  #listen(): Promise<void> {
    const port = 3000;
    const server = http.createServer(this.instance);

    return new Promise((resolve, reject) =>
      server
        .listen(port)
        .once('listening', () => {
          logger.info(`Server running on port ${port}`);
          resolve();
        })
        .once('error', reject)
    );
  }

  get instance() {
    return this.#app;
  }
}
