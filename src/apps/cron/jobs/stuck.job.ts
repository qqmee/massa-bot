import { Inject, Injectable } from '@nestjs/common';

import { Environment } from '@env';
import { AbstractJob } from './abstract.job';

import { LOCKER } from '@cron/constants/cron.const';
import { Locker } from '@libs/locker';

import { MessageService, Message } from '@shared/queue';
import { i18n } from '@bot/middleware/i18n.middleware';
import { formatter } from '@shared/telegram/util/formatter.util';
import {
  distanceBetweenDate,
  ageDate,
  yyyymmddhhmm,
} from '@bot/helpers/date.format';
import { TELEGRAM_BOT } from '@shared/telegram/constants/telegram.const';
import { TelegramBotMap } from '@shared/telegram/telegram.interfaces';

@Injectable()
export class StuckJob extends AbstractJob {
  timeout = 1_000;

  public constructor(
    @Inject(LOCKER) private readonly locker: Locker,
    private readonly messageService: MessageService,
    @Inject(TELEGRAM_BOT)
    private readonly bots: TelegramBotMap,
  ) {
    super();
  }

  public async doWork() {
    const entries = this.locker.getEntries();
    const stuck = [];

    for (const [jobName, data] of entries) {
      if (!data.expire) {
        continue;
      }

      const now = new Date();

      if (now > data.expire) {
        stuck.push([jobName, data]);
      }
    }

    // stuck.push(['example', { started: new Date(), expire: new Date() }]);
    if (!stuck.length) return;

    const text =
      `Bro I am stuck\n\n` +
      stuck
        .map(([jobName, data]) => {
          const limit = data.expire
            ? distanceBetweenDate(data.started, data.expire)
            : 0;

          return i18n.t(Environment.FALLBACK_LOCALE, 'cronjob-stuck', {
            job: jobName,
            age: ageDate(data.started),
            started: yyyymmddhhmm(data.started),
            limit,
          });
        })
        .join('\n\n');

    const bots = this.bots.keys();
    const data: Message[] = [];

    for (const botId of bots) {
      for (const userId of Environment.BOT_ADMINS) {
        data.push({ botId, chatId: userId, text: formatter(text) });
      }
    }

    this.messageService.addBulk(data);
  }
}
