import { IMetrics } from '../metrics';

export interface IMetricsController {
  index(req, res): void
}

export default class MetricsController implements IMetricsController {
  private metrics: IMetrics;

  constructor(metrics: IMetrics) {
    this.metrics = metrics;
  }

  async index(req, res): Promise<void> {
    res.end(this.metrics.toString());
  }
}
