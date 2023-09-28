import { formatter } from '@shared/telegram/util/formatter.util';
import { createPaginationMenu } from '@libs/menu/template/pagination.template';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';

export default createPaginationMenu(PaginationMenuEnum.Changelog, {
  limit: 500,
  fetchData: async (ctx, { offset, limit }) => {
    const release = await ctx.githubComponent.getRelease();
    const end = offset + limit;

    return {
      total: release.changelog.length,
      data: release.changelog.substring(offset, end),
    };
  },
  render: (_, { data }) => {
    return formatter(data, true);
  },
});
