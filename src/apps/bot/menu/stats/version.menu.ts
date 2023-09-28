import { createPaginationMenu } from '@libs/menu/template/pagination.template';
import { Count } from '@shared/database/types/count.type';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';
import { getNumberPad, numberFormat } from '@bot/helpers/number.format';
import { formatter } from '@shared/telegram/util/formatter.util';
import { StatsField } from '@shared/database/enum/stats-field.enum';
import { CountNodeDto } from '@shared/database/dto/count-node.dto';

export default createPaginationMenu(PaginationMenuEnum.StatsVersion, {
  limit: 15,
  fetchData: async (ctx, { offset, limit }) => {
    const dto = await CountNodeDto.from({
      field: StatsField.Version,
      offset,
      limit,
    });

    return ctx.statsComponent.getCountByField<Count[]>(dto);
  },
  render: (ctx, { data }) => {
    const text = data.map((row) => {
      const value = numberFormat(row.value).padEnd(getNumberPad(row.value));
      return `${value} ${row.name}`;
    });

    if (!text.length) {
      return ctx.t('stats-no-data');
    }

    return formatter(text.join('\n'));
  },
});
