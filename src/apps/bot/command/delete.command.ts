import { Ctx, Update, Command as GrammyCommand } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { getIdentity } from '@shared/telegram/util/identity.util';
import { BotContext } from '../bot.interfaces';
import { ExceptionFilter } from '../filters/exception.filter';
import { Command } from '../enums/command.enum';
import { StakerComponent } from '../components/staker.component';
import { DeleteUserStakerDto } from '@shared/database/dto/delete-user-staker.dto';
import { MessengerService } from '@shared/telegram/services/messenger.service';
import { formatter } from '@shared/telegram/util/formatter.util';

@Update()
@UseFilters(ExceptionFilter)
export class DeleteCommand {
  public constructor(
    private readonly stakerComponent: StakerComponent,
    private readonly messengerService: MessengerService,
  ) {}

  @GrammyCommand(Command.Delete)
  public async delete(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const text = await this.getText(ctx);

    return this.messengerService.sendMessage({
      botId,
      chatId,
      text: formatter(text),
    });
  }

  private async getText(ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);

    const dto = await DeleteUserStakerDto.from({
      botId,
      chatId,
      address: ctx.match as string,
    });

    const affected = await this.stakerComponent.delete(dto);
    if (affected) {
      return ctx.t('address-deleted');
    }

    return ctx.t('address-not-deleted');
  }
}
