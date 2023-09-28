import { Ctx, Update, Command as GrammyCommand, Hears } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { getIdentity } from '@shared/telegram/util/identity.util';
import { formatter } from '@shared/telegram/util/formatter.util';
import { BotContext } from '../bot.interfaces';
import { ExceptionFilter } from '../filters/exception.filter';
import { Command } from '../enums/command.enum';
import { StakerComponent } from '../components/staker.component';
import {
  CreateUserStakerDto,
  REGEXP_ADDRESS,
} from '@shared/database/dto/create-user-staker.dto';
import { MessengerService } from '@shared/telegram/services/messenger.service';

@Update()
@UseFilters(ExceptionFilter)
export class AddCommand {
  public constructor(
    private readonly stakerComponent: StakerComponent,
    private readonly messengerService: MessengerService,
  ) {}

  /**
   * Cases
   *
   * 1) /add <address> <tag>
   * 2) <address>
   */
  @Hears(REGEXP_ADDRESS)
  @GrammyCommand(Command.Add)
  public async add(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const text = await this.getText(ctx);

    return this.messengerService.sendMessage({
      botId,
      chatId,
      text,
    });
  }

  private async getText(ctx: BotContext) {
    const locale = await ctx.i18n.getLocale();
    const { botId, chatId } = getIdentity(ctx);

    const dto = await this.createValueObject({
      ...this.parseInput(ctx),
      botId,
      chatId,
    });

    if (!dto) {
      return formatter(ctx.t('address-invalid'));
    }

    const info = await this.stakerComponent.infoBatchUnsafe([dto.address]);

    if (!info?.[0]?.status) {
      // unable to get info from rpc == address invalid
      return formatter(ctx.t('address-invalid'));
    }

    const textArray = await this.stakerComponent.infoToTextArray(locale, info);
    const created = await this.stakerComponent.create(dto);

    if (created) {
      return textArray.join('');
    }

    return formatter(ctx.t('address-exists'));
  }

  private async createValueObject(params: CreateUserStakerDto) {
    try {
      return await CreateUserStakerDto.from(params);
    } catch {
      return null;
    }
  }

  private parseInput(ctx: BotContext) {
    if (Array.isArray(ctx.match)) {
      return { address: ctx.match[1] };
    }

    const [address, ...tag] = ctx.match.split(' ');

    return {
      address,
      tag: tag.length > 0 ? tag.join(' ') : undefined,
    };
  }
}
