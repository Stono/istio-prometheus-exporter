import WebServer from "lib/server";
import { Metrics } from "lib/metrics";
import * as request from 'request-promise';
import * as should from 'should';

describe('End to End', () => {
  let server;
  before(async () => {
    const webServerOptions = {
      metrics: new Metrics(),
      port: 1234
    };
    server = new WebServer(webServerOptions);
    await server.start();
  });

  after(() => {
    server.stop();
  });

  function url(path = ''): string {
    return `http://127.0.0.1:1234/${path}`;
  }

  it('should expose metrics!', async () => {
    function validateResult(result) {
      should(result.statusCode).eql(200);
      should(result.body).eql('');
    }
    await request({
      uri: url('metrics'),
      resolveWithFullResponse: true
    })
    .then(validateResult);
  });
});
