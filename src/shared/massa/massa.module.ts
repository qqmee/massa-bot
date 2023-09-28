import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

import { RpcService } from './services/rpc.service';
import { MassaService } from './services/massa.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 30 * 1000, // 30s
      maxRedirects: 0,
    }),
  ],
  providers: [RpcService, MassaService],
  exports: [MassaService],
})
export class MassaModule {}
