import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  Inject,
} from '@nestjs/common';
import { GrammyArgumentsHost } from '@grammyjs/nestjs';

import { BotContext } from '@bot/bot.interfaces';
import { ExceptionHandler } from '@shared/exception-handler/interfaces/handler.interface';
import { EXCEPTION_HANDLER } from '@shared/exception-handler/constants/exception-handler.const';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  public constructor(
    @Inject(EXCEPTION_HANDLER)
    private readonly exceptionHandler: ExceptionHandler,
  ) {}

  public async catch(error: Error, host: ArgumentsHost): Promise<void> {
    const grammyHost = GrammyArgumentsHost.create(host);
    const ctx = grammyHost.getContext<BotContext>();

    const chatId = ctx?.chat?.id || ctx?.from?.id;
    this.exceptionHandler.handle(error, { botId: ctx.me.id, chatId });
  }
}
