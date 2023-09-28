import { Injectable } from '@nestjs/common';

import { Company } from '@shared/geoip/types/company.type';
import { CachedService, CACHED_STATS } from '@shared/cached';
import { NodeService } from '@shared/database/services/node.service';
import { StatsFormatFactory } from './format/format.factory';
import { COUNTRIES } from '@bot/constants/countries.const';
import { PagerValidator } from '@bot/validators/pager.validator';
import { MassaService } from '@shared/massa/services/massa.service';
import { MassaGetStatus, MassaGetStakers } from '@shared/massa/types';
import { GeoipService } from '@shared/geoip/geoip.service';
import { CountNodeDto } from '@shared/database/dto/count-node.dto';
import { StatsField } from '@shared/database/enum/stats-field.enum';

@Injectable()
export class StatsComponent {
  constructor(
    private readonly massaService: MassaService,
    private readonly geoipService: GeoipService,
    private readonly nodeService: NodeService,
    private readonly cachedService: CachedService,
    private readonly statsFormatFactory: StatsFormatFactory,
  ) {}

  public async getNetwork() {
    return this.cachedService.get(
      CACHED_STATS,
      async () => {
        const status = await this.massaService.getStatus();
        const stakers = await this.massaService.getStakers();

        return this.formatStats(status, stakers);
      },
      'network',
    );
  }

  private formatStats(status: MassaGetStatus, stakers: MassaGetStakers) {
    const rollValues = Object.values(stakers);
    const rolls = rollValues.reduce((acc, val) => acc + val[1], 0);

    // https://github.com/massalabs/massa/blob/6535ffa8f3deac3674ad29b12c4c541da9a5cea6/massa-node/base_config/config.toml#L227
    const timespan = 60_000;

    const tx = Math.round(
      (status.execution_stats.final_executed_operations_count / timespan) *
        1000 +
        Number.EPSILON,
    );

    const block =
      Math.round(
        ((status.execution_stats.final_block_count / timespan) * 1000 +
          Number.EPSILON) *
          1000,
      ) / 1000;

    return {
      rolls,
      stakers: rollValues.length,
      cycle: status.current_cycle,
      period: status.next_slot.period,
      cliques: status.consensus_stats.clique_count,
      throughput_block: block,
      throughput_tx: tx,
    };
  }

  public async getFreeCountries({ offset, limit }: PagerValidator) {
    return this.cachedService.get(
      CACHED_STATS,
      async () => {
        const countries = await this.nodeService.getCountryCodes();
        const data = Object.values(COUNTRIES).filter(
          (row) => !countries.includes(row.isoCode),
        );

        const paged = data.slice(offset, offset + limit);

        const companies = await this.geoipService.getCompanies();
        const companiesMap = this.groupCompanyByCountry(companies);

        return {
          total: data.length,
          data: paged.map((country) => {
            const companies = companiesMap[country.isoCode] ?? null;
            return { ...country, companies };
          }),
        };
      },
      'free',
      { offset, limit },
    );
  }

  private groupCompanyByCountry(
    companies: Company[],
  ): Partial<Record<keyof typeof COUNTRIES, Company>> {
    return companies.reduce((acc, company) => {
      if (company.type === 'hosting' && company.countries && company.refUrl) {
        for (const isoCode of company.countries) {
          if (!acc.hasOwnProperty(isoCode)) {
            acc[isoCode] = [];
          }

          acc[isoCode].push(company);
        }
      }

      return acc;
    }, {});
  }

  public async getCountByField<DataType>(dto: CountNodeDto) {
    return this.cachedService.get(
      CACHED_STATS,
      this.makeCountGetter<DataType>(dto),
      dto,
    );
  }

  private makeCountGetter<DataType>(dto: CountNodeDto) {
    return async () => {
      const { data, total } = await this.nodeService.getCountByField(dto);
      const formatter = this.createStatsFormatter(dto.field);

      const result = await formatter.format(data);

      return {
        total,
        data: result as DataType,
      };
    };
  }

  private createStatsFormatter(field: StatsField) {
    return this.statsFormatFactory.create(field);
  }
}
