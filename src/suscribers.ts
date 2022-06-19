import { EventEmitter } from 'events';
import { Application } from 'express';
import Logger from './helpers/logger';

const logger = Logger.create('webhook:events');

export default (app: Application) => {
  const emitter: EventEmitter = app.get('emitter');
};
