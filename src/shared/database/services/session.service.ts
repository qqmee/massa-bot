import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

import { SessionEntity } from '../entity/session.entity';
import { SetSessionPropertyDto } from '../dto/set-session-property.dto';
import { getSessionKey } from '@bot/middleware/session.middleware';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repo: Repository<SessionEntity>,
  ) {}

  public setProperty(dto: SetSessionPropertyDto) {
    const sessionKey = getSessionKey(dto.botId, dto.userId, dto.chatId);

    return this.repo
      .createQueryBuilder()
      .update()
      .setParameters({
        p: dto.property,
        v: dto.value,
      })
      .set({ value: () => `JSON_SET(value, CONCAT('$.', :p), :v)` })
      .where({ key: Equal(sessionKey) })
      .execute();
  }
}
