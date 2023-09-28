import { ForbiddenException, HttpExceptionOptions } from '@nestjs/common';

export class UnableToSendMessageException extends ForbiddenException {
  public constructor(
    private readonly botId: number,
    private readonly chatId: number,
    options: HttpExceptionOptions,
  ) {
    super('unable-to-send-message', options);
  }

  public getBotId() {
    return this.botId;
  }

  public getChatId() {
    return this.chatId;
  }
}
