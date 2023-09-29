import { randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  Inject,
  Injectable,
  Logger,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { InputFile, webhookCallback } from 'grammy';

import { Environment } from '@env';
import { TELEGRAM_BOT, TELEGRAM_COMMANDS } from '../constants/telegram.const';
import {
  TelegramBot,
  TelegramBotCommands,
  TelegramBotMap,
} from '../telegram.interfaces';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  public constructor(
    @Inject(TELEGRAM_BOT) private readonly bots: TelegramBotMap,
    @Inject(TELEGRAM_COMMANDS) private readonly commands: TelegramBotCommands,
  ) {}

  /**
   * Fn should be called once on start Express Application (!= cron)
   */
  public async configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Configure consumer');

    for (const [, bot] of this.bots) {
      const path = this.generateRandomPath();

      consumer.apply(webhookCallback(bot, 'express')).forRoutes({
        method: RequestMethod.POST,
        path,
      });

      await this.setWebhook(bot, path);
      await this.setCommands(bot);
    }
  }

  private generateRandomPath() {
    return '/webhook/' + randomBytes(16).toString('hex');
  }

  private async setWebhook(bot: TelegramBot, path: string) {
    const webhook = `${Environment.WEBHOOK_URL}${path}`;
    this.logger.debug(`Set webhook @${bot.botInfo.username} / ${webhook}`);

    await bot.api.setWebhook(webhook, this.getWebhookOptions());
  }

  private getWebhookOptions() {
    if (Environment.SSL_ENABLED) {
      return {
        certificate: new InputFile(
          createReadStream(`${Environment.WORKDIR}/public.pem`),
        ),
      };
    }

    return {};
  }

  private async setCommands(bot: TelegramBot) {
    for (const [locale, commands] of this.commands) {
      this.logger.debug(`Set myCommands @${bot.botInfo.username} / ${locale}`);
      await bot.api.setMyCommands(commands, {
        language_code: locale,
      });
    }
  }
}
