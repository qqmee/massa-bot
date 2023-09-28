import { COUNTRIES } from '@bot/constants/countries.const';
import { Count } from '@shared/database/types/count.type';
import { StatsFormatterInterface } from './formatter.interface';
import { StatsCountry } from './types/country.type';

export class StatsCountryFormatter implements StatsFormatterInterface {
  public async format(data: Count[]): Promise<StatsCountry[]> {
    return data.map((row) => {
      const rowName = row.name || row.value;
      const isoCode = String(rowName).toLowerCase();
      const country = COUNTRIES[isoCode] ?? {};
      const flag = country?.flag || '';
      const countryNames = country?.name;

      return {
        countryNames,
        flag,
        isoCode,
        value: row.value,
      };
    });
  }
}
