import { MenuTemplate } from 'grammy-inline-menu';
import { mapValues } from 'lodash';

import { BotContext } from '@bot/bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';
import { getNumberPad, numberFormat } from '@bot/helpers/number.format';

const networkMenu = new MenuTemplate<BotContext>(async (ctx) => {
  const result = await ctx.statsComponent.getNetwork();

  const data = mapValues(result, (value, key) => {
    let formatted = numberFormat(value);

    if (key === 'throughput_tx') {
      formatted = `${value > 100 ? '🫡 ' : ''}${formatted}`;
    }

    if (key.startsWith('throughput_')) {
      return formatted;
    }

    return formatted.padEnd(getNumberPad(value));
  });
  return {
    text: formatter(ctx.t('stats-network-detail', data)),
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true,
  };
});

export default networkMenu;
