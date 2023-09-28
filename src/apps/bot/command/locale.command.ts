import { Ctx, Update, Command as GrammyCommand } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { Environment } from '@env';
import { BotContext } from '../bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';
import { ExceptionFilter } from '../filters/exception.filter';
import { MessengerService } from '@shared/telegram/services/messenger.service';
import { getIdentity } from '@shared/telegram/util/identity.util';

@Update()
@UseFilters(ExceptionFilter)
export class LocaleCommand {
  public constructor(private readonly messengerService: MessengerService) {}

  /**
   * Command: /ru, /en
   */
  @GrammyCommand(Environment.LOCALES)
  public async changeLocale(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const text = this.getText(ctx);

    if (!text) return;

    return this.messengerService.sendMessage({
      botId,
      chatId,
      text,
    });
  }

  private getText(ctx: BotContext) {
    for (const locale of Environment.LOCALES) {
      if (ctx.hasCommand(locale)) {
        ctx.i18n.setLocale(locale);
        return formatter(ctx.t(`locale-${locale}-selected`));
      }
    }
  }
}
