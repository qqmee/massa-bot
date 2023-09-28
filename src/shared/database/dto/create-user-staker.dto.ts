import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator';
import { Transform, plainToInstance } from 'class-transformer';

export const REGEXP_ADDRESS = new RegExp('^(A[a-zA-Z0-9]{40,60})$');

export class CreateUserStakerDto {
  @IsNumber()
  readonly botId: number;

  @IsNumber()
  readonly chatId: number;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(40)
  @MaxLength(60)
  @Matches(REGEXP_ADDRESS)
  readonly address: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(40)
  @IsOptional()
  @Matches(new RegExp('^[\\w\\s]{1,40}$', 'i'))
  readonly tag?: string;

  static async from(plain: CreateUserStakerDto) {
    const self = plainToInstance(CreateUserStakerDto, plain);
    await validateOrReject(self);

    return self;
  }
}
