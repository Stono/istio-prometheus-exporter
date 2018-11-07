export interface IDebugFactory {
  forNamespace(namespace: string): any
}

export class DebugFactory implements IDebugFactory {
  private debugs = {}

  forNamespace(namespace: string) {
    if (typeof this.debugs[namespace] === 'undefined') {
      this.debugs[namespace] = require('debug')(namespace);
    }

    return this.debugs[namespace];
  }
}
