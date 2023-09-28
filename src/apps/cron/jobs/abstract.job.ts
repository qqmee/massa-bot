export abstract class AbstractJob {
  timeout: number = 0; // ms

  abstract doWork(signal: AbortSignal): Promise<void>;

  getName() {
    return this.constructor.name;
  }

  getTimeout() {
    return this.timeout;
  }
}
