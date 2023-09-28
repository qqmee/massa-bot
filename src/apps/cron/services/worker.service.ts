import { performance } from 'node:perf_hooks';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { AbstractJob } from '@cron/jobs/abstract.job';
import { ReleaseJob } from '@cron/jobs/release.job';
import { Locker } from '@libs/locker';
import { RejectAfterException, rejectAfter } from '@libs/reject-after';
import {
  CRON_INTERVAL_NODES,
  CRON_INTERVAL_RELEASE,
  CRON_INTERVAL_STAKERS,
  CRON_INTERVAL_STUCK,
  LOCKER,
} from '@cron/constants/cron.const';
import { StuckJob } from '@cron/jobs/stuck.job';
import { StakersJob } from '@cron/jobs/stakers.job';
import { NodesJob } from '@cron/jobs/nodes.job';
import { GeoipJob } from '@cron/jobs/geoip.job';

@Injectable()
export class WorkerService {
  #logger = new Logger(WorkerService.name);

  public constructor(
    @Inject(LOCKER) private readonly locker: Locker,
    private readonly releaseJob: ReleaseJob,
    private readonly stuckJob: StuckJob,
    private readonly stakersJob: StakersJob,
    private readonly nodesJob: NodesJob,
    private readonly geoipJob: GeoipJob,
  ) {}

  // @Interval(10_000)
  // public test() {
  //   this.stakers();
  // }

  @Cron(CRON_INTERVAL_RELEASE)
  public release() {
    this.decorator(this.releaseJob);
  }

  @Cron(CRON_INTERVAL_STUCK)
  public stuck() {
    this.decorator(this.stuckJob);
  }

  @Cron(CRON_INTERVAL_STAKERS)
  public stakers() {
    this.decorator(this.stakersJob);
  }

  @Cron(CRON_INTERVAL_NODES)
  public nodes() {
    this.decorator(this.nodesJob);
  }

  @Cron(CRON_INTERVAL_NODES)
  public geoip() {
    this.decorator(this.geoipJob);
  }

  private async decorator(job: AbstractJob) {
    const jobName = job.getName();

    if (jobName !== StuckJob.name && this.locker.isLocked(jobName)) {
      this.#logger.warn(`${jobName} is locked`);
      return;
    }

    this.locker.lock(jobName, job.getTimeout());
    this.#logger.debug(`${jobName} has been started`);

    const ctrl = new AbortController();

    const start = performance.now();

    await Promise.race([rejectAfter(job.getTimeout()), job.doWork(ctrl.signal)])
      .then(() => {
        const elapsed = (performance.now() - start).toFixed(2);
        this.#logger.log(`${jobName} finished in time: ${elapsed}ms`);
      })
      .catch((error) => {
        ctrl.abort();

        if (error instanceof RejectAfterException) {
          this.#logger.warn(`${jobName} timed out`);
          return;
        }

        this.#logger.error(error, `job=${jobName}`);
      });

    this.locker.unlock(jobName);
  }
}
