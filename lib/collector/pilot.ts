import { IMetrics } from "lib/metrics";
import * as request from 'request-promise';
import SimpleGauge, { ICollector, ISimpleGauge } from "./common";

export interface ISimpleGaugeWithProxyStatus extends ISimpleGauge {
  fromProxyStatus(proxyStatus: any): void
}

class TcpOverTcp extends SimpleGauge implements ISimpleGaugeWithProxyStatus {
  constructor(metrics: IMetrics) {
    super(
      metrics,
      'pilot_conflict_outbound_listener_tcp_over_current_tcp',
      'Multiple TCP services requesting the same port',
      [
        'listener',
        'accepted',
        'rejected'
      ]
    )
  }

  fromProxyStatus(proxyStatus: any): void {
    const data = proxyStatus.pilot_conflict_outbound_listener_tcp_over_current_tcp;

    if (!data) {
      return;
    }

    Object.keys(data).forEach((listener) => {
      const message = data[listener].message.split(' ');
      const accepted = message[1].split('=')[1];
      const rejected = message[2].split('=')[1];

      this.increment(listener, accepted, rejected);
    });
  }
}

class EdsNoInstances extends SimpleGauge implements ISimpleGaugeWithProxyStatus {
  constructor(metrics: IMetrics) {
    super(
      metrics,
      'pilot_eds_no_instances',
      'Clusters with no instances',
      ['cluster']
    )
  }

  fromProxyStatus(proxyStatus: any): void {
    const data = proxyStatus.pilot_eds_no_instances;

    if (!data) {
      return;
    }

    Object.keys(data).forEach((cluster) => {
      this.increment(cluster);
    });
  }
}

export default class PilotCollector implements ICollector {

  private gauges: ISimpleGaugeWithProxyStatus[] = [];

  private pilotAddress: string;

  constructor(metrics: IMetrics, pilotAddress: string) {
    this.pilotAddress = pilotAddress;

    this.gauges.push(new TcpOverTcp(metrics));
    this.gauges.push(new EdsNoInstances(metrics));
  }

  async gather(): Promise<void> {
    const pilot = `${this.pilotAddress}/debug/push_status`;

    const parseResult = (response) => {
      this.gauges.forEach((gauge) => {
        gauge.reset();
        gauge.fromProxyStatus(response.body.ProxyStatus);
      });
    }

    await request({
      json: true,
      resolveWithFullResponse: true,
      uri: pilot
    })
    .then(parseResult);
  }
}
