import { MenuTemplate } from 'grammy-inline-menu';

import { BotContext } from '../bot.interfaces';
import { formatter } from '@shared/telegram/util/formatter.util';
import { HELP_COMMANDS } from '@bot/constants/help.const';

const helpMenu = new MenuTemplate<BotContext>((ctx) => {
  // title
  let text = ctx.t('help-detail');

  for (const group in HELP_COMMANDS) {
    // subtitle: node or stats
    text += `\n\n${ctx.t(`help-detail-${group}`)}\n`;

    // commands for subtitle
    text += HELP_COMMANDS[group]
      .map((command) => `/${command} - ${ctx.t(`command-${command}`)}`)
      .join('\n');
  }

  return {
    text: formatter(text),
    parse_mode: 'MarkdownV2',
  };
});

export default helpMenu;
