import { ForbiddenException } from '@nestjs/common';

import { Environment } from '@env';
import { ExceptionHandler } from '../interfaces/handler.interface';
import { UnavailableException } from '@shared/massa/exceptions/unavailable.exception';
import { formatter } from '@shared/telegram/util/formatter.util';
import { UnavailableException as GeoipUnavailableException } from '@shared/geoip/exception/unavailable.exception';
import { AbstractHandler } from './abstract.handler';
import { Context } from '../interfaces/context.interface';
import { i18n } from '@bot/middleware/i18n.middleware';
import { RejectAfterException } from '@libs/reject-after';

export class ProductionHandler
  extends AbstractHandler
  implements ExceptionHandler
{
  private locale = Environment.FALLBACK_LOCALE;

  protected async process(e: Error, context?: Context): Promise<void> {
    const text = formatter(this.getResponseText(e));

    await this.messengerService.sendMessage({
      botId: context.botId,
      chatId: context.chatId,
      text: text,
    });
  }

  private getResponseText(e: Error): string {
    if (e instanceof UnavailableException) {
      return i18n.t(this.locale, 'exception-rpc-unavailable');
    }

    if (e instanceof RejectAfterException) {
      return i18n.t(this.locale, 'exception-rpc-timeout');
    }

    if (e instanceof GeoipUnavailableException) {
      return i18n.t(this.locale, 'exception-gateway-unavailable', {
        gateway: e.message,
      });
    }

    if (e instanceof ForbiddenException) {
      return i18n.t(this.locale, 'exception-access-denied');
    }

    return i18n.t(this.locale, 'exception-unknown');
  }
}
