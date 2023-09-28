import { getCompanyMD } from '@bot/helpers/formatter.helper';
import { Company } from '@shared/geoip/types/company.type';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';
import { formatter } from '@shared/telegram/util/formatter.util';
import { createPaginationMenu } from '@libs/menu/template/pagination.template';
import { PagerValidator } from '@bot/validators/pager.validator';

export default createPaginationMenu(PaginationMenuEnum.StatsFree, {
  limit: 15,
  fetchData: async (ctx, { offset, limit }) => {
    const validator = new PagerValidator().load({ offset, limit });
    await validator.validate();

    return ctx.statsComponent.getFreeCountries(validator);
  },
  render: async (ctx, { data }, currentPage) => {
    const locale = await ctx.i18n.getLocale();

    const text = data.map((country) => {
      const countryName = country.name?.[locale] || country.isoCode;
      const name = formatter(`${country.flag} ${countryName}`);

      if (!country.companies) {
        return name;
      }

      const companies = country.companies
        .map((company: Company) => `\\=\\> ${getCompanyMD(company)}`)
        .join('\n');

      return `${name} 🎉 🍾 🏆\n${companies}\n`;
    });

    if (currentPage > 1) {
      text.unshift(ctx.t('stats-free-ads') + '\n');
    }

    return text.join('\n');
  },
});
