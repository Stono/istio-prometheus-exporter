import { IDebugFactory, DebugFactory } from "./debugFactory";

export interface ILogger {
  debug(...args)
  info(...args)
  warn(...args)
  error(...args)
}

export class Logger implements ILogger {

  private logger;

  constructor(namespace: string, debugFactory: IDebugFactory = new DebugFactory()) {
    this.logger = debugFactory.forNamespace(namespace);
  }

  debug(...args) {
    this.logger('[debug]', ...args);
  }

  info(...args) {
    this.logger('[info]', ...args);
  }

  warn(...args) {
    this.logger('[warn]', ...args);
  }

  error(...args) {
    this.logger('[error]', ...args);
  }
}
