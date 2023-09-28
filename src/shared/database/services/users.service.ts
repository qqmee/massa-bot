import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entity/user.entity';
import { NotificationsField } from '../enum/notifications-field.enum';

export type UserNotification = Pick<
  UserEntity,
  'botId' | 'chatId' | 'locale' | 'displayNodeMode'
>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  public getForNotification(
    field: NotificationsField,
  ): Promise<UserNotification[]> {
    const qb = this.repo
      .createQueryBuilder()
      .distinct(true)
      .select(['botId', 'chatId', 'locale', 'displayNodeMode'])
      .where('isBlocked = 0');

    if (field === NotificationsField.GitHub) {
      qb.andWhere('notificationsGithub = 1');
    } else if (field === NotificationsField.Rolls) {
      qb.andWhere('notificationsRolls = 1');
    } else {
      throw new Error(`field '${field}' not whitelisted or implemented`);
    }

    return qb
      .getRawMany()
      .then((rows) =>
        rows.map((row) => ({ ...row, botId: +row.botId, chatId: +row.chatId })),
      );
  }
}
