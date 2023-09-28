import { IsNumber, IsString, validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class DeleteUserStakerDto {
  @IsNumber()
  readonly botId: number;

  @IsNumber()
  readonly chatId: number;

  @IsString()
  readonly address: string;

  static async from(plain: DeleteUserStakerDto) {
    const self = plainToInstance(DeleteUserStakerDto, plain);
    await validateOrReject(self);

    return self;
  }
}
