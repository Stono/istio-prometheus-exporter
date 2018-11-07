import { Logger, ILogger } from "lib/utils/logger";
import { IDebugFactory } from "lib/utils/logger/debugFactory";
import * as should from 'should';

describe('Utils: Logger', () => {
  let logger: ILogger, mockDebugFactory: IDebugFactory, mockDebug: any, calledWith: any;
  beforeEach(() => {
    mockDebug = function(...args) {
      calledWith = args;
    }
    mockDebugFactory = {
      forNamespace(namespace) {
        should(namespace).eql('testing');
        return mockDebug;
      }
    }
    logger = new Logger('testing', mockDebugFactory);
  });

  it('should write debug messages', () => {
    logger.debug('testing testing 1 2 3');
    should(calledWith[0]).eql('[debug]');
    should(calledWith[1]).eql('testing testing 1 2 3')
  });

  it('should write info messages', () => {
    logger.info('testing testing 1 2 3');
    should(calledWith[0]).eql('[info]');
    should(calledWith[1]).eql('testing testing 1 2 3')
  });

  it('should write warn messages', () => {
    logger.warn('testing testing 1 2 3');
    should(calledWith[0]).eql('[warn]');
    should(calledWith[1]).eql('testing testing 1 2 3')
  });

  it('should write error messages', () => {
    logger.error('testing testing 1 2 3');
    should(calledWith[0]).eql('[error]');
    should(calledWith[1]).eql('testing testing 1 2 3')
  });

  it('should handle multiple arguments', () => {
    logger.error('arg1', 'arg2');
    should(calledWith[1]).eql('arg1')
    should(calledWith[2]).eql('arg2')
  });
});
