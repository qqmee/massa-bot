import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';

import { Environment } from '@env';
import { BotCoreModule } from '@bot/bot-core.module';
import { ExceptionHandlerModule } from '@shared/exception-handler/exception-handler.module';
import { QUEUE_MESSAGES } from './constants/queue.const';
import { MessageService } from './services/message.service';
import { MessageProcessor } from './processors/message.processor';

@Global()
@Module({
  imports: [
    BotCoreModule,
    ExceptionHandlerModule,
    BullModule.forRoot({
      redis: {
        host: Environment.REDIS_HOST,
        port: Environment.REDIS_PORT,
        password: Environment.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({ name: QUEUE_MESSAGES }),
  ],
  providers: [MessageProcessor, MessageService],
  exports: [MessageService],
})
export class QueueModule {}
