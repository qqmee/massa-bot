import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';

import { UserStaker } from '../entity/user-staker.entity';
import { CreateUserStakerDto } from '../dto/create-user-staker.dto';
import { DeleteUserStakerDto } from '../dto/delete-user-staker.dto';
import { FindUserStakerDto } from '../dto/find-user-staker.dto';
import { EntityAlreadyExistsException } from '../exceptions/entity-already-exists.exception';

type FindResult = Pick<UserStaker, 'chatId' | 'botId' | 'address' | 'tag'>;

@Injectable()
export class UserStakerService {
  constructor(
    @InjectRepository(UserStaker)
    private readonly repo: Repository<UserStaker>,
  ) {}

  private async findOne(dto: CreateUserStakerDto) {
    return this.repo.findOne({
      where: {
        botId: Equal(dto.botId),
        chatId: Equal(dto.chatId),
        address: Equal(dto.address),
      },
    });
  }

  public async create(dto: CreateUserStakerDto) {
    const entity = this.repo.create(dto);

    // check if already exists
    const exists = await this.findOne(dto);
    if (exists) throw new EntityAlreadyExistsException();

    return this.repo.save(entity);
  }

  public async delete(dto: DeleteUserStakerDto) {
    const query = await this.repo.softDelete({
      botId: Equal(dto.botId),
      chatId: Equal(dto.chatId),
      address: Equal(dto.address),
      deleted: IsNull(),
    });

    return query.affected;
  }

  public find(dto: FindUserStakerDto): Promise<FindResult[]> {
    const qb = this.repo
      .createQueryBuilder()
      .select(['botId', 'chatId', 'address', 'tag']);

    if (dto.botId) {
      qb.andWhere('botId = :botId', { botId: dto.botId });
    }

    if (dto.chatId) {
      qb.andWhere('chatId = :chatId', { chatId: dto.chatId });
    }

    if (dto.chatIds) {
      qb.andWhere('chatId IN (:ids)', { ids: dto.chatIds });
    }

    return qb.execute();
  }
}
