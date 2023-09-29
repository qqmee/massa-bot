import { Logger } from '@nestjs/common';

import { SessionService } from '@shared/database/services/session.service';
import { Context } from '../interfaces/context.interface';
import { SetSessionPropertyDto } from '@shared/database/dto/set-session-property.dto';
import { UnableToSendMessageException } from '@shared/queue/exceptions/uname-to-send-message.exception';
import { ExceptionHandler } from '../interfaces/handler.interface';
import { MessengerService } from '@shared/telegram/services/messenger.service';

export abstract class AbstractHandler implements ExceptionHandler {
  public constructor(
    protected readonly sessionService: SessionService,
    protected readonly messengerService: MessengerService,
    protected readonly logger: Logger,
  ) {}

  protected abstract process(error: Error, context?: Context): Promise<void>;

  public async handle(error: Error, context?: Context) {
    if (error instanceof UnableToSendMessageException) {
      // no await
      this.handleUserBlock(context);
      return;
    }

    this.logger.error(error, error.stack);

    await this.process(error, context);
  }

  /**
   * 403: Forbidden: bot was blocked by the user
   * OR user not found
   */
  protected async handleUserBlock(context: Context): Promise<void> {
    const dto = await SetSessionPropertyDto.from({
      botId: context.botId,
      userId: context.chatId,
      chatId: context.chatId,
      property: 'isBlocked',
      value: true,
    });

    await this.sessionService.setProperty(dto);
    return;
  }
}
