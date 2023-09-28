import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from '@shared/database/database.module';
import { QueueModule } from '@shared/queue/queue.module';
import { GithubModule } from '@shared/github/github.module';
import { BotCoreModule } from '@bot/bot-core.module';

import { WorkerService } from './services/worker.service';
import { ReleaseJob } from './jobs/release.job';
import { LockerProvider } from './providers/locker.provider';
import { StuckJob } from './jobs/stuck.job';
import { StakersJob } from './jobs/stakers.job';
import { NodesJob } from './jobs/nodes.job';
import { MassaModule } from '@shared/massa/massa.module';
import { GeoipJob } from './jobs/geoip.job';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BotCoreModule,
    DatabaseModule,
    GithubModule,
    MassaModule,
    QueueModule,
  ],
  providers: [
    LockerProvider,
    WorkerService,
    ReleaseJob,
    StuckJob,
    StakersJob,
    NodesJob,
    GeoipJob,
  ],
})
export class CronModule {}
