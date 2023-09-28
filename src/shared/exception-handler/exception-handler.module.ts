import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/database.module';
import { HandlerProvider } from './providers/handler.provider';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [HandlerProvider],
  exports: [HandlerProvider],
})
export class ExceptionHandlerModule {}
