import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { SessionEntity } from './session.entity';
import { DisplayNodeMode } from '../enum/display-mode.enum';

@ViewEntity({
  name: 'users',
  expression: (ds: DataSource) =>
    ds
      .createQueryBuilder()
      .select("`key`->>'$[0]'", 'botId')
      .addSelect("`key`->>'$[1]'", 'userId')
      .addSelect("`key`->>'$[2]'", 'chatId')
      .addSelect("`value`->>'$.__language_code'", 'locale')
      .addSelect("`value`->>'$.displayNodeMode'", 'displayNodeMode')
      .addSelect("IF(cast(`value`->>'$.isBlocked' as json), 1, 0)", 'isBlocked')
      .addSelect(
        "IF(cast(`value`->>'$.notificationsGithub' as json), 1, 0)",
        'notificationsGithub',
      )
      .addSelect(
        "IF(cast(`value`->>'$.notificationsRolls' as json), 1, 0)",
        'notificationsRolls',
      )
      .addSelect("`value`->>'$.createdAt'", 'createdAt')
      .from(SessionEntity, 's'),
})
export class UserEntity {
  @ViewColumn()
  botId: number;

  @ViewColumn()
  userId: number;

  @ViewColumn()
  chatId: number;

  @ViewColumn()
  locale: string;

  @ViewColumn()
  displayNodeMode: DisplayNodeMode;

  @ViewColumn()
  isBlocked: boolean;

  @ViewColumn()
  notificationsGithub: boolean;

  @ViewColumn()
  notificationsRolls: boolean;

  @ViewColumn()
  createdAt: Date;
}
