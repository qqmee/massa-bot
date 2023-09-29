import { Injectable, Logger } from '@nestjs/common';

import { Environment } from '@env';
import { MessageService } from '@shared/queue/services/message.service';
import { UsersService } from '@shared/database/services/users.service';
import { AbstractJob } from './abstract.job';
import { NotificationsField } from '@shared/database/enum/notifications-field.enum';
import { FindUserStakerDto } from '@shared/database/dto/find-user-staker.dto';
import { StakerComponent } from '@bot/components/staker.component';
import { groupBy } from '@bot/helpers/group-by.helper';
import { RejectAfterException } from '@libs/reject-after';
import { chunk } from '@bot/helpers/chunk.helper';
import { createMap } from '@bot/helpers/create-map.helper';

@Injectable()
export class StakersJob extends AbstractJob {
  timeout = 30 * 60 * 1000; // 30 minutes
  logger = new Logger(StakersJob.name);

  public constructor(
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly stakerComponent: StakerComponent,
  ) {
    super();
  }

  public async doWork(signal: AbortSignal) {
    if (!Environment.CRON_STAKERS) {
      return;
    }

    const users = await this.usersService.getForNotification(
      NotificationsField.Rolls,
    );

    if (!users.length) return;

    const dto = await FindUserStakerDto.from({
      chatIds: users.map((user) => user.chatId),
    });

    const stakers = await this.stakerComponent.find(dto);
    const groups = groupBy(stakers, (row) => row.chatId);

    this.logger.debug(`Users = ${Object.keys(groups).length}`);

    for (const user of users) {
      if (signal.aborted) {
        throw new RejectAfterException(
          `has been terminated by timeout ${this.timeout / 1000}s`,
        );
      }

      const { chatId } = user;

      if (!groups.hasOwnProperty(chatId)) {
        continue;
      }

      const rows = groups[chatId];
      const tags = createMap(rows, 'address', 'tag');

      const addresses = rows.map((row) => row.address);
      const info = await this.stakerComponent.infoBatchUnsafe(addresses);

      const bad = await this.stakerComponent.infoToTextArray(
        user.locale,
        info,
        tags,
        true,
      );

      if (bad.length === 0) {
        continue;
      }

      for (const block of chunk(bad, 6)) {
        const text = block.join('\n\n');

        await this.messageService.add({
          chatId: user.chatId,
          botId: user.botId,
          text,
        });
      }
    }
  }
}
