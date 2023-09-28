import { addMilliseconds } from 'date-fns';

import { Data } from './data.type';

export class Locker {
  #map: Map<string, Data>;

  public constructor() {
    this.#map = new Map();
  }

  public lock(jobName: string, timeout?: number) {
    const started = new Date();
    const expire = timeout > 0 ? addMilliseconds(new Date(), timeout) : null;

    this.#map.set(jobName, {
      started,
      expire,
    });
  }

  public unlock(jobName: string) {
    return this.#map.delete(jobName);
  }

  public isLocked(jobName: string) {
    return this.#map.has(jobName);
  }

  public getEntries() {
    return this.#map.entries();
  }
}
