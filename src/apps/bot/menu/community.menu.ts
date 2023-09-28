import { MenuTemplate } from 'grammy-inline-menu';

import { Environment } from '@env';
import { BotContext } from '../bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';

const communityMenu = new MenuTemplate<BotContext>((ctx) => {
  return {
    text: formatter(
      ctx.t('community-detail', {
        unofficial: formatter(Environment.BOT_COMMUNITIES, true),
      }),
    ),
    parse_mode: 'MarkdownV2',
  };
});

export default communityMenu;
