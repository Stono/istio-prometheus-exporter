import * as express from 'express';
import { Server } from 'http';

import MetricsRoutes from 'lib/routes/metrics';
import MetricsController from 'lib/controllers/metrics';
import { IMetrics } from 'lib/metrics';

const debug = require('debug')('istio:server:web');

export interface IWebServerOptions {

  /** The port that the server should listen on */
  port: number

  /** The metrics object */
  metrics: IMetrics
}

export interface IWebServer {
  start(): void
  stop(): void
}

export default class WebServer implements IWebServer {
  private http;

  private options: IWebServerOptions;

  private async applyRoutes(app): Promise<void> {
    const metricsController = new MetricsController(this.options.metrics);

    new MetricsRoutes().applyRoutes(app, metricsController);
  }

  constructor(options: IWebServerOptions) {
    this.options = options;
  }

  /* eslint max-statements: off */
  async start(): Promise<void> {
    debug(`starting server on port ${this.options.port}`);

    const app = express();

    app.set('etag', false);
    app.disable('x-powered-by');

    await this.applyRoutes(app);
    this.http = new Server(app);
    this.http.listen(this.options.port, () => {
      debug(`server started on port ${this.options.port}`);
      Promise.resolve();
    });
  }

  stop(): void {
    debug('stopping server');
    this.http.close();
  }
}
