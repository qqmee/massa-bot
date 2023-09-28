import { IsInt, IsOptional, Min } from 'class-validator';
import { AbstractValidator } from './abstract.validator';

export class PagerValidator extends AbstractValidator {
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
