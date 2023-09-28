import { MenuTemplate } from 'grammy-inline-menu';

import { BotContext } from '@bot/bot.interfaces';
import { getCompanyMD } from '../helpers/formatter.helper';
import { formatter } from '@shared/telegram/util/formatter.util';

const hostingMenu = new MenuTemplate<BotContext>(async (ctx) => {
  const hosting = await ctx.refsComponent.getHosting();

  const t = hosting.reduce(
    (acc, company) => {
      const name = getCompanyMD(company);
      const value = company.promo
        ? `${name} ${formatter(company.promo)}`
        : name;

      acc[company.tag].push(value);
      return acc;
    },
    { mir: [], crypto: [], vpn: [] },
  );

  const text = ctx.t('ads-hosting', {
    mir: t.mir.join('\n'),
    crypto: t.crypto.join('\n'),
    vpn: t.vpn.join('\n'),
  });

  return {
    text,
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true,
  };
});

export default hostingMenu;
