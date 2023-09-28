import { ExceptionHandler } from '../interfaces/handler.interface';
import { formatter } from '@shared/telegram/util/formatter.util';
import { AbstractHandler } from './abstract.handler';
import { Context } from '../interfaces/context.interface';

export class DevelopmentHandler
  extends AbstractHandler
  implements ExceptionHandler
{
  protected async process(error: Error, context?: Context) {
    const text = this.getExceptionText(error);

    await this.messengerService.sendMessage({
      botId: context.botId,
      chatId: context.chatId,
      text: text,
    });
  }

  private getExceptionText(e: Error): string {
    const message = e?.stack ?? e?.message ?? e;
    const cause = (e?.cause as Error) || null;

    let text = 'Exception\n```\n';
    text += formatter(message.toString().substring(0, 1000), true);
    text += '\n```';

    if (cause) {
      const causeMessage = cause?.stack ?? cause?.message ?? cause;
      text += '\nCause\n```\n';
      text += formatter(causeMessage.toString().substring(0, 1000), true);
      text += '\n```';
    }

    return text;
  }
}
