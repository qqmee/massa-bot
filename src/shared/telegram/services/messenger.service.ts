import { Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';

import {
  Messenger,
  SendMessageOptions,
} from '../interfaces/messenger.interface';
import { TELEGRAM_BOT } from '../constants/telegram.const';

/**
 * Abstract for grammy api
 */
@Injectable()
export class MessengerService implements Messenger {
  public constructor(
    @Inject(TELEGRAM_BOT) private readonly bots: Map<number, Bot>,
  ) {}

  public async sendMessage({ chatId, botId, text }: SendMessageOptions) {
    const bot = this.bots.get(botId);

    if (!bot) throw new Error(`bot with id ${botId} not exists`);

    return bot.api.sendMessage(chatId, text, {
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });
  }
}
