import { createPaginationMenu } from '@libs/menu/template/pagination.template';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';
import { getNumberPad, numberFormat } from '@bot/helpers/number.format';
import { getCompanyMD } from '@bot/helpers/formatter.helper';
import { StatsCompany } from '@bot/components/stats/format/types/company.type';
import { StatsField } from '@shared/database/enum/stats-field.enum';
import { CountNodeDto } from '@shared/database/dto/count-node.dto';

export default createPaginationMenu(PaginationMenuEnum.StatsCompany, {
  limit: 15,
  fetchData: async (ctx, { offset, limit }) => {
    const dto = await CountNodeDto.from({
      field: StatsField.CompanyId,
      offset,
      limit,
    });

    return ctx.statsComponent.getCountByField<StatsCompany[]>(dto);
  },
  render: (ctx, { data }, currentPage) => {
    const text = data.map((row) => {
      const name = getCompanyMD(row.company);
      const value = numberFormat(row.value).padEnd(getNumberPad(row.value));
      return `${value} ${name}`;
    });

    if (!text.length) {
      return ctx.t('stats-no-data');
    }

    if (currentPage === 1) {
      text.unshift(ctx.t('stats-free-ads') + '\n');
    }

    return text.join('\n');
  },
});
