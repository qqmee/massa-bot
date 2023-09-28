import { Injectable } from '@nestjs/common';

import { MessageService } from '@shared/queue/services/message.service';
import { GithubService } from '@shared/github/services/github.service';
import { releaseFormat } from '@bot/formatters/release.format';
import { UsersService } from '@shared/database/services/users.service';
import { InfoService } from '@shared/database/services/info.service';
import { Release } from '@shared/github/types/release.type';
import { REGEXP_RELEASE } from '../constants/cron.const';
import { AbstractJob } from './abstract.job';
import { NotificationsField } from '@shared/database/enum/notifications-field.enum';

@Injectable()
export class ReleaseJob extends AbstractJob {
  timeout = 2_000;

  public constructor(
    private readonly messageService: MessageService,
    private readonly githubService: GithubService,
    private readonly usersService: UsersService,
    private readonly infoService: InfoService,
  ) {
    super();
  }

  public async doWork() {
    const release = await this.githubService.getLatestRelease();
    const isOutdated = await this.isOutdated(release);
    if (!isOutdated) {
      return;
    }

    await this.infoService.updateCurrentRelease({
      date: release.date,
      url: release.url,
      version: release.name,
    });

    const users = await this.usersService.getForNotification(
      NotificationsField.GitHub,
    );

    const data = users.map((user) => ({
      ...user,
      text: releaseFormat(user.locale, release),
    }));

    this.messageService.addBulk(data);
  }

  private async isOutdated(release: Release) {
    if (!REGEXP_RELEASE.test(release.name)) {
      return false;
    }

    const currentRelease = await this.infoService.getCurrentRelease();
    if (currentRelease?.version === release.name) {
      return false;
    }

    return true;
  }
}
