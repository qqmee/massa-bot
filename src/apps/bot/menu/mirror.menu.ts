import { MenuTemplate } from 'grammy-inline-menu';

import { Environment } from '@env';
import { BotContext } from '../bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';

const mirrorMenu = new MenuTemplate<BotContext>((ctx) => {
  return {
    text: formatter(
      ctx.t('mirror-detail', { mirror: Environment.BOT_MIRRORS }),
    ),
    parse_mode: 'MarkdownV2',
  };
});

export default mirrorMenu;
