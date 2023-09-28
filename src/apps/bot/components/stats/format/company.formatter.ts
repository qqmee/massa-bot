import { keyBy } from 'lodash';

import { Count } from '@shared/database/types/count.type';
import { StatsFormatterInterface } from './formatter.interface';
import { StatsCompany } from './types/company.type';
import { GeoipService } from '@shared/geoip/geoip.service';

export class StatsCompanyFormatter implements StatsFormatterInterface {
  constructor(private readonly geoipService: GeoipService) {}

  public async format(data: Count[]): Promise<StatsCompany[]> {
    const companyIds = data
      .map((row) => parseInt(row.name, 10))
      .filter(Boolean);

    if (companyIds.length === 0) {
      return [];
    }

    const companies = await this.geoipService.getCompanies(companyIds);
    const companiesMap = keyBy(companies, 'id');

    return data.map((row) => ({
      company: companiesMap?.[row.name],
      value: row.value,
    }));
  }
}
