import { Injectable } from '@nestjs/common';

import { StatsCompanyFormatter } from './company.formatter';
import { DefaultFormatter } from './default.formatter';
import { StatsFormatterInterface } from './formatter.interface';
import { StatsCountryFormatter } from './country.formatter';
import { GeoipService } from '@shared/geoip/geoip.service';
import { StatsField } from '@shared/database/enum/stats-field.enum';

@Injectable()
export class StatsFormatFactory {
  public constructor(private readonly geoipService: GeoipService) {}

  public create(field: StatsField): StatsFormatterInterface {
    switch (field) {
      case StatsField.CompanyId:
        return new StatsCompanyFormatter(this.geoipService);
      case StatsField.CountryCode:
        return new StatsCountryFormatter();
    }

    return new DefaultFormatter();
  }
}
