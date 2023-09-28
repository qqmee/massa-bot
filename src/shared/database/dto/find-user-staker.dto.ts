import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  validateOrReject,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class FindUserStakerDto {
  @IsNumber()
  @IsOptional()
  readonly botId?: number;

  @IsNumber()
  @IsOptional()
  readonly chatId?: number;

  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  readonly chatIds?: number[];

  static async from(plain: FindUserStakerDto) {
    const self = plainToInstance(this, plain);
    await validateOrReject(self);

    return self;
  }
}
