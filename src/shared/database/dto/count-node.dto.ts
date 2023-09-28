import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  validateOrReject,
} from 'class-validator';
import { StatsField } from '../enum/stats-field.enum';
import { plainToInstance } from 'class-transformer';

export class CountNodeDto {
  @IsEnum(StatsField)
  field: StatsField;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  static async from(plain: { [key: string]: any }) {
    const self = plainToInstance(CountNodeDto, plain);
    await validateOrReject(self, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    return self;
  }
}
