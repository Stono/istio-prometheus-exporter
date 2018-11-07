import PilotCollector from "lib/collector/pilot";
import { Metrics, IMetrics } from "lib/metrics";
import * as express from 'express';
import { Server } from 'http';
import { ICollector } from "lib/collector/common";
const fs = require('fs');
const should = require('should');

describe('Collector: Pilot', () => {
  let collector: ICollector, http: any, metrics: IMetrics;

  before(done => {
    const app = express();
    http = new Server(app);
    http.listen(1234, done);

    app.get('/debug/push_status', (req, res) => {
      res.send(fs.readFileSync(__dirname + '/../samples/push_status.json'));
    });
  });

  after(() => {
    http.close();
  });

  beforeEach(async () => {
    metrics = new Metrics();
    collector = new PilotCollector(metrics, 'http://127.0.0.1:1234');
  });

  describe('pilot_eds_no_instances', () => {
    let metric;
    beforeEach(async () => {
      await collector.gather();
      metric = metrics.getClient().register.getSingleMetric('pilot_eds_no_instances');
    });
    it('should have keys for each conflict', async () => {
      should(Object.keys(metric.hashMap)).eql([
        'cluster:outbound|49153||platform-thousandeyes-service.core-system.svc.cluster.local',
        'cluster:outbound|80||app.portal-dealer-settings.svc.cluster.local',
        'cluster:outbound|80||kafka-prom-exporter.kafka.svc.cluster.local',
        'cluster:outbound|9080||app.portal-dealer-settings.svc.cluster.local'
      ]);
    });
  });

  describe('pilot_conflict_outbound_listener_tcp_over_current_tcp', () => {
    let metric;
    beforeEach(async () => {
      await collector.gather();
      metric = metrics.getClient().register.getSingleMetric('pilot_conflict_outbound_listener_tcp_over_current_tcp');
    });
    it('should have keys for each conflict', async () => {
      should(Object.keys(metric.hashMap)).eql([
        'accepted:zookeeper-headless.kafka.svc.cluster.local,listener:0.0.0.0:2181,rejected:zookeeper-headless.search-solr.svc.cluster.local',
        'accepted:zookeeper-headless.kafka.svc.cluster.local,listener:0.0.0.0:2888,rejected:zookeeper-headless.search-solr.svc.cluster.local',
        'accepted:zookeeper-headless.kafka.svc.cluster.local,listener:0.0.0.0:3888,rejected:zookeeper-headless.search-solr.svc.cluster.local'
      ]);
    });
    it('should have a value of 1 for each conflict', () => {
      Object.keys(metric.hashMap).forEach(key => {
        should(metric.hashMap[key].value).eql(1);
      });
    });
    it('should have a value of 1 for each conflict even when they appear multiple times', async () => {
      await collector.gather();
      Object.keys(metric.hashMap).forEach(key => {
        should(metric.hashMap[key].value).eql(1);
      });
    });
  });
});
