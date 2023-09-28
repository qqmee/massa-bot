import { Global, Module } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Environment } from '@env';

import { DatabaseModule } from '@shared/database/database.module';
import { TelegramModule } from '@shared/telegram/telegram.module';
import { MassaModule } from '@shared/massa/massa.module';
import { CachedModule } from '@shared/cached/cached.module';
import { GithubModule } from '@shared/github/github.module';
import { GeoipModule } from '@shared/geoip/geoip.module';
import { ExceptionHandlerModule } from '@shared/exception-handler/exception-handler.module';

import { SessionEntity } from '@shared/database/entity/session.entity';

import { RefsComponent } from './components/refs.component';
import { GithubComponent } from './components/github.component';
import { StatsComponent } from './components/stats/stats.component';
import { StatsFormatFactory } from './components/stats/format/format.factory';
import { StakerComponent } from './components/staker.component';

import { sessionMiddleware } from './middleware/session.middleware';
import { componentsMiddleware } from './middleware/components.middleware';
import { menuMiddleware } from './middleware/menu.middleware';
import { i18n } from './middleware/i18n.middleware';
import { createMenuCommandDescriptions } from './helpers/create-menu-commands.helper';
import { NodeComponent } from './components/node.component';

@Global()
@Module({
  imports: [
    ExceptionHandlerModule,
    CachedModule,
    GeoipModule,
    TelegramModule.forRootAsync({
      bots: Environment.BOTS,
      locales: Environment.LOCALES,
      commands: createMenuCommandDescriptions(),
      imports: [DatabaseModule, BotCoreModule],
      inject: [EntityManager, RefsComponent, GithubComponent, StatsComponent],
      useFactory: async (
        em,
        refsComponent,
        githubComponent,
        statsComponent,
      ) => {
        return [
          sessionMiddleware(em.getRepository(SessionEntity)),
          i18n.middleware(),
          componentsMiddleware({
            refsComponent,
            githubComponent,
            statsComponent,
          }),
          await menuMiddleware(),
        ];
      },
    }),
    DatabaseModule,
    MassaModule,
    GithubModule,
  ],
  providers: [
    // Components
    NodeComponent,
    RefsComponent,
    GithubComponent,
    StatsComponent,
    StakerComponent,
    // Factories
    StatsFormatFactory,
  ],
  exports: [
    NodeComponent,
    RefsComponent,
    GithubComponent,
    StatsComponent,
    StakerComponent,
  ],
})
export class BotCoreModule {}
