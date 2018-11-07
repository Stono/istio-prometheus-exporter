import * as path from 'path';
import * as tsConfigPaths from 'tsconfig-paths/lib';
const baseUrl = path.join(__dirname, '..');

tsConfigPaths.register({
  baseUrl,
  'paths': {}
});

import WebServer from 'lib/server';
import { Metrics } from 'lib/metrics';
import CollectorRunner from './collector/runner';
import PilotCollector from './collector/pilot';

const metrics = new Metrics()
const runner = new CollectorRunner();
const webServer = new WebServer({
  metrics,
  'port': 8080
});

const pilotAddress = process.env.ISTIO_PILOT_ADDRESS || 'http://istio-pilot.istio-system:8080';

runner.addCollector(new PilotCollector(metrics, pilotAddress));
runner.start();
webServer.start();

function shutdown() {
  runner.stop();
  webServer.stop();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection!');
  console.error(error);
  process.exit(1);
});
