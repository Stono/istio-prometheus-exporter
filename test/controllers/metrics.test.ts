import { IMetrics } from "lib/metrics";
import * as should from 'should';
import MetricsController, { IMetricsController } from "lib/controllers/metrics";

'use strict';
class MockMetrics implements IMetrics {
  getClient(): void { }
  toString() {
    return 'metrics';
  }
}

describe('Controller: Metrics', () => {
  let controller: IMetricsController;

  beforeEach(async () => {
    controller = new MetricsController(new MockMetrics());
  });

  describe('metrics', () => {
    it('should return some prometheus metrics', done => {
      const res = {
        end: function(value) {
          should(value).eql('metrics');
          done();
        }
      }
      controller.index({}, res);
    });
  });
});
