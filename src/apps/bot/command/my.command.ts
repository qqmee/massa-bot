import { Ctx, Update, Command as GrammyCommand } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { getIdentity } from '@shared/telegram/util/identity.util';
import { formatter } from '@shared/telegram/util/formatter.util';
import { BotContext } from '../bot.interfaces';
import { ExceptionFilter } from '../filters/exception.filter';
import { Command } from '../enums/command.enum';
import { StakerComponent } from '../components/staker.component';
import { chunk } from '../helpers/chunk.helper';
import { AddressDto } from '@shared/massa/dto/address.dto';
import { DisplayNodeMode } from '@shared/database/enum/display-mode.enum';
import { createMap } from '../helpers/create-map.helper';
import { FindUserStakerDto } from '@shared/database/dto/find-user-staker.dto';
import { MessengerService } from '@shared/telegram/services/messenger.service';

@Update()
@UseFilters(ExceptionFilter)
export class MyCommand {
  public constructor(
    private readonly stakerComponent: StakerComponent,
    private readonly messengerService: MessengerService,
  ) {}

  @GrammyCommand(Command.My)
  public async my(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const textArray = await this.getTextArray(ctx);

    for (const text of textArray) {
      await this.messengerService.sendMessage({
        botId,
        chatId,
        text,
      });
    }
  }

  private async getTextArray(ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const dto = await FindUserStakerDto.from({
      botId,
      chatId,
    });

    const stakers = await this.stakerComponent.find(dto);
    if (!stakers.length) {
      return [formatter(ctx.t('address-not-found'))];
    }

    const addressList = stakers.map((row) => row.address);
    const infos = await this.stakerComponent.infoBatch(addressList);
    const chunks = chunk(infos.flat(), 6);

    const displayNodeMode = ctx.session.displayNodeMode;
    const tags =
      displayNodeMode === DisplayNodeMode.Address
        ? new Map()
        : createMap(stakers, 'address', 'tag');

    const textArray = [];

    for (const part of chunks) {
      const text = this.prepareTextInfoBatch(ctx, part, tags);

      textArray.push(formatter(text));
    }

    return textArray;
  }

  private prepareTextInfoBatch(
    ctx: BotContext,
    infos: AddressDto[],
    tags: Map<string, string>,
  ) {
    const text = [];

    for (const staker of infos) {
      if (!staker.status) {
        text.push(ctx.t('address-no-data', { address: staker.address }));
        continue;
      }

      // replace `address` with `tag` if exists
      const address = tags.get(staker.address) ?? staker.address;

      text.push(
        ctx.t('address-info', {
          ...staker,
          address,
          cycles: staker.cycles
            .slice(0, 3)
            .map((cycle) => {
              return ctx.t('address-info-cycle', cycle);
            })
            .join('\n'),
        }),
      );
    }

    return text.join('\n\n');
  }
}
