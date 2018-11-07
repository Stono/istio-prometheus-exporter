import MetricsController from '../controllers/metrics';
import { IRoutes } from '.';

export default class MetricsRoutes implements IRoutes {
  applyRoutes(app, controller: MetricsController): void {
    app.get('/metrics', (req, res) => {
      controller.index.bind(controller)(req, res);
    });
  }
}
