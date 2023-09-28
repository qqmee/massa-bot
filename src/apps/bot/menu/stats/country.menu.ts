import { createPaginationMenu } from '@libs/menu/template/pagination.template';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';
import { getNumberPad, numberFormat } from '@bot/helpers/number.format';
import { StatsCountry } from '@bot/components/stats/format/types/country.type';
import { formatter } from '@shared/telegram/util/formatter.util';
import { CountNodeDto } from '@shared/database/dto/count-node.dto';
import { StatsField } from '@shared/database/enum/stats-field.enum';

export default createPaginationMenu(PaginationMenuEnum.StatsCountry, {
  limit: 15,
  fetchData: async (ctx, { offset, limit }) => {
    const dto = await CountNodeDto.from({
      field: StatsField.CountryCode,
      offset,
      limit,
    });

    return ctx.statsComponent.getCountByField<StatsCountry[]>(dto);
  },
  render: async (ctx, { data }) => {
    const locale = await ctx.i18n.getLocale();

    const text = data.map((row) => {
      const countryName = row.countryNames?.[locale] || row.isoCode;
      const name = `${row.flag} ${countryName}`;

      const value = numberFormat(row.value).padEnd(getNumberPad(row.value));
      return `${value} ${name}`;
    });

    if (!text.length) {
      return ctx.t('stats-no-data');
    }

    return formatter(text.join('\n'));
  },
});
