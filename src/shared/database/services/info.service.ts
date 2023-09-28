import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { InfoEntity } from '../entity/info.entity';
import { Info } from '../enum/info.enum';
import { CurrentReleaseDto } from '../dto/current-release.dto';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(InfoEntity)
    private readonly repo: Repository<InfoEntity>,
  ) {}

  private async save(dto: InfoEntity) {
    const row = await this.findBySlug(dto.slug);

    if (row) {
      const { slug, ...values } = dto;

      await this.repo.update(
        { slug: Equal(slug) },
        {
          ...values,
          updated: new Date(),
        },
      );

      return this.findBySlug(slug);
    }

    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  private findBySlug(slug: Info) {
    return this.repo.findOneBy({ slug: Equal(slug) });
  }

  public async getCurrentRelease(): Promise<null | CurrentReleaseDto> {
    const row = await this.findBySlug(Info.CurrentRelease);
    if (!row) return null;

    return plainToInstance(CurrentReleaseDto, row.data);
  }

  public updateCurrentRelease(data: CurrentReleaseDto) {
    return this.save({ slug: Info.CurrentRelease, data });
  }
}
