import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  validateOrReject,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { NodeField } from '../enum/node-field.enum';
import { REGEXP_RELEASE } from '@cron/constants/cron.const';
import { IP } from '@shared/massa/enums/ip.enum';

export class FindNodeDto {
  @IsEnum(NodeField, { each: true })
  @IsOptional()
  readonly select?: NodeField[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly searchTerm?: string;

  @IsEnum(IP)
  @IsOptional()
  readonly ipVersion?: IP;

  @Matches(REGEXP_RELEASE)
  @IsOptional()
  readonly version?: string;

  @IsBoolean()
  @IsOptional()
  readonly withoutAsn?: boolean;

  @IsString()
  @Matches(REGEXP_RELEASE)
  @IsOptional()
  readonly gtVersion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly limit?: number;

  static async from(plain: FindNodeDto) {
    const self = plainToInstance(FindNodeDto, plain);

    await validateOrReject(self, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    return self;
  }
}
