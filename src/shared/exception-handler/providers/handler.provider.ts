import { Logger, Provider } from '@nestjs/common';

import { Environment } from '@env';
import { EXCEPTION_HANDLER } from '../constants/exception-handler.const';
import { DevelopmentHandler } from '../handlers/development.handler';
import { ProductionHandler } from '../handlers/production.handler';

import { SessionService } from '@shared/database/services/session.service';
import { MessengerService } from '@shared/telegram/services/messenger.service';

const logger = new Logger('ExceptionHandler');

export const HandlerProvider: Provider = {
  provide: EXCEPTION_HANDLER,
  inject: [SessionService, MessengerService],
  useFactory: (
    sessionService: SessionService,
    messengerService: MessengerService,
  ) => {
    if (Environment.NODE_ENV === 'development') {
      return new DevelopmentHandler(sessionService, messengerService, logger);
    }

    return new ProductionHandler(sessionService, messengerService, logger);
  },
};
