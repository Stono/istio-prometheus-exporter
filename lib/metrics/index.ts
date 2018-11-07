export interface IMetrics {
  getClient(): any
  toString()
}

export class Metrics implements IMetrics {
  private client = require('prom-client');

  constructor() {
    this.client.register.clear();
  }

  getClient(): any {
    return this.client;
  }

  toString() {
    return this.client.register.metrics();
  }
}
