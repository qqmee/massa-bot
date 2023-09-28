import { Ctx, Command, Update } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { ExceptionFilter } from '@bot/filters/exception.filter';
import { BotContext } from '@bot/bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';
import { MessengerService } from '@shared/telegram/services/messenger.service';
import { getIdentity } from '@shared/telegram/util/identity.util';

@Update()
@UseFilters(ExceptionFilter)
export class WhoamiCommand {
  public constructor(private readonly messengerService: MessengerService) {}

  @Command('whoami')
  public async onWhoami(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const text = this.getText(ctx);

    return this.messengerService.sendMessage({
      botId,
      chatId,
      text,
    });
  }

  private getText(ctx: BotContext) {
    const text = [`ChatId: ${ctx.chat.id}`, `From: ${ctx.from.id}`];
    return formatter(text.join('\n'));
  }
}
