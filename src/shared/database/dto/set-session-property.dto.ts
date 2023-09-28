import {
  IsIn,
  IsNumber,
  IsPositive,
  Validate,
  validateOrReject,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { Session } from '../types/session.type';
import { IsNumberOrStringOrBool } from '../validators/is-number-or-string-or-bool.validator';

export class SetSessionPropertyDto {
  @IsNumber()
  @IsPositive()
  readonly botId: number;

  @IsNumber()
  @IsPositive()
  readonly chatId: number;

  @IsNumber()
  @IsPositive()
  readonly userId: number;

  @IsIn(['isBlocked'])
  readonly property: Pick<Session, 'isBlocked'>;

  @Validate(IsNumberOrStringOrBool)
  readonly value: string | number | boolean;

  static async from(plain: { [key: string]: any }) {
    const self = plainToInstance(SetSessionPropertyDto, plain);
    await validateOrReject(self);

    return self;
  }
}
