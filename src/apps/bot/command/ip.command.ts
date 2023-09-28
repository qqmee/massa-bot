import { Ctx, Update, Command } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { BotContext } from '@bot/bot.interfaces';
import { NodeComponent } from '@bot/components/node.component';
import { formatter } from '@shared/telegram/util/formatter.util';
import { ExceptionFilter } from '../filters/exception.filter';
import { Command as CommandEnum } from '../enums/command.enum';
import { FindNodeDto } from '@shared/database/dto/find-node.dto';
import { MessengerService } from '@shared/telegram/services/messenger.service';
import { getIdentity } from '@shared/telegram/util/identity.util';

@Update()
@UseFilters(ExceptionFilter)
export class IpCommand {
  constructor(
    private readonly nodeComponent: NodeComponent,
    private readonly messengerService: MessengerService,
  ) {}

  @Command(CommandEnum.Ip)
  public async searchIP(@Ctx() ctx: BotContext) {
    const { botId, chatId } = getIdentity(ctx);
    const text = await this.getText(ctx);

    return this.messengerService.sendMessage({
      botId,
      chatId,
      text,
    });
  }

  private async getText(ctx: BotContext) {
    const dto = await this.createValueObject(ctx.match as string);

    if (!dto) {
      return formatter(ctx.t('ip-invalid'));
    }

    const ips = await this.nodeComponent.findIp(dto);
    if (!ips.length) {
      return formatter(ctx.t('ip-not-found'));
    }

    return this.renderSlice(ctx, ips, 20);
  }

  private async createValueObject(searchTerm: string) {
    try {
      return await FindNodeDto.from({ searchTerm });
    } catch {
      return null;
    }
  }

  private renderSlice(ctx: BotContext, ips: string[], size: number): string {
    const messages = ips.slice(0, size);
    messages.unshift('```');
    messages.push('```');

    if (ips.length > size) {
      messages.push(ctx.t('ip-more', { more: ips.length - size }));
    }

    return messages.join('\n');
  }
}
