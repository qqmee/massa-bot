import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';

import { NodeEntity } from '../entity/node.entity';
import { Count } from '../types/count.type';
import { FindNodeDto } from '../dto/find-node.dto';
import { CountNodeDto } from '../dto/count-node.dto';
import { chunk } from '@bot/helpers/chunk.helper';
import { MAIN_RELEASE_TAG, REGEXP_RELEASE } from '@cron/constants/cron.const';

export type SaveBulk = Required<Pick<NodeEntity, 'ip' | 'nodeId'>> &
  Partial<Pick<NodeEntity, 'id' | 'version' | 'ipVersion' | 'lastSeen'>>;

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(NodeEntity) private readonly repo: Repository<NodeEntity>,
  ) {}

  public async find(
    dto: FindNodeDto,
  ): Promise<{ [T in (typeof dto.select)[number]]: any }[]> {
    const qb = this.repo.createQueryBuilder();

    if (dto.select) {
      qb.select(dto.select);
    }

    if (dto.ipVersion) {
      qb.andWhere('ipVersion = :ipVersion', { ipVersion: dto.ipVersion });
    }

    if (dto.version) {
      qb.andWhere(`(version = :version OR version = '')`, {
        version: dto.version,
      });
    }

    if (dto.searchTerm) {
      qb.andWhere('ip LIKE :searchTerm', { searchTerm: `${dto.searchTerm}%` });
    }

    if (dto.withoutAsn) {
      qb.andWhere('asn IS NULL');
    }

    if (dto.gtVersion) {
      const match = REGEXP_RELEASE.exec(dto.gtVersion);

      const left =
        "INET_ATON(SUBSTRING_INDEX(CONCAT(REPLACE(version, CONCAT(:tag, '.'), ''), '.0.0.0'), '.', 4))";
      const right =
        "INET_ATON(SUBSTRING_INDEX(CONCAT(:major, '.0.0.0'), '.', 4))";

      qb.andWhere(`(version = '' OR ${left} >= ${right})`, {
        tag: MAIN_RELEASE_TAG,
        major: match[2],
      });
    }

    return qb.execute();
  }

  public async insertBulk(rows: SaveBulk[]): Promise<void> {
    const chunks = chunk(rows, 400);

    for (const chunk of chunks) {
      const qb = this.repo
        .createQueryBuilder()
        .insert()
        .into(NodeEntity, ['nodeId', 'ip', 'version', 'ipVersion', 'lastSeen'])
        .values(chunk)
        .updateEntity(false);

      await qb.execute();
    }
  }

  public async updateLastSeen(ids: number[]) {
    await this.repo.update({ id: In(ids) }, { lastSeen: new Date() });
  }

  public async updateByField(
    field: keyof Pick<NodeEntity, 'id' | 'ip'>,
    data: Partial<NodeEntity>,
  ): Promise<void> {
    const { [field]: identifier, ...props } = data;

    await this.repo.update({ [field]: Equal(identifier) }, props);
  }

  public async getCountByField(
    dto: CountNodeDto,
  ): Promise<{ total: number; data: Count[] }> {
    const qb = this.repo
      .createQueryBuilder('n')
      .select(['COUNT(1) value', dto.field])
      // .where({ last_seen: MoreThanOrEqual(subMinutes(new Date(), 60)) })
      .groupBy(dto.field)
      .orderBy('value', 'DESC');

    if (dto.limit) qb.limit(dto.limit);
    if (dto.offset) qb.offset(dto.offset);

    const rows = await qb.getRawMany();

    const { total } = await this.repo
      .createQueryBuilder()
      .select(`COUNT(DISTINCT ${dto.field})`, 'total')
      .getRawOne();

    return {
      total,
      data: rows.map((row) => ({
        name: row[dto.field],
        value: +row.value,
      })),
    };
  }

  public async getCountryCodes(): Promise<string[]> {
    const result = await this.repo
      .createQueryBuilder()
      .select('DISTINCT countryCode')
      .getRawMany();

    return result.map((row) => row.countryCode);
  }
}
