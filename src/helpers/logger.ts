import createDebug from 'debug';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export class Logger {
  private _logger;
  private _logLevel;

  static create(namespace) {
    return new Logger(namespace);
  }

  constructor(namespace) {
    this._logger = createDebug(namespace);
    this._logLevel = process.env.DEBUG_LEVEL;
  }

  error(msg, args?) {
    if (
      [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG].includes(
        this._logLevel
      )
    ) {
      args ? this._logger(msg, args) : this._logger(msg);
    }
  }

  warn(msg, args?) {
    if (
      [LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG].includes(this._logLevel)
    ) {
      args ? this._logger(msg, args) : this._logger(msg);
    }
  }

  info(msg, args?) {
    if ([LogLevel.INFO, LogLevel.DEBUG].includes(this._logLevel)) {
      args ? this._logger(msg, args) : this._logger(msg);
    }
  }

  debug(msg, args?) {
    if ([LogLevel.DEBUG].includes(this._logLevel)) {
      args ? this._logger(msg, args) : this._logger(msg);
    }
  }
}

export default Logger;
