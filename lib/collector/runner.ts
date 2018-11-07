import { ICollector } from "./common";
const debug = require('debug')('istio:runner');

export default class CollectorRunner {

  private timer;

  private collectors: ICollector[] = [];

  addCollector(collector: ICollector): void {
    this.collectors.push(collector);
  }

  start(): void {
    const runCollectors = () => {
      debug('Running collection...');
      this.collectors.forEach(async (collector) => {
        await collector.gather();
      });
      debug('Collection complete.');
    };

    this.timer = setTimeout(runCollectors, 10000);
  }

  stop(): void {
    clearTimeout(this.timer);
  }
}
