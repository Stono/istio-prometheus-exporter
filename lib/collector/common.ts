import { IMetrics } from "lib/metrics";

export interface ICollector {
  gather(): void
}

export interface ISimpleGauge {
  increment(...args): void
  reset(): void
}

export default class SimpleGauge implements ISimpleGauge {

  private gauge: any;

  constructor(metrics: IMetrics, name: string, description: string, labels: string[] = []) {
    const client = metrics.getClient();

    this.gauge = new client.Gauge({
      'help': description,
      'labelNames': labels,
      name
    });
  }

  increment(...args): void {
    this.gauge.labels(...args).inc(1, new Date());
  }

  reset(): void {
    this.gauge.reset();
  }
}
