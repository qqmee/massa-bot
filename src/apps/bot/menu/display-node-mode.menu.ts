import { MenuTemplate } from 'grammy-inline-menu';

import { BotContext } from '../bot.interfaces';
import { DisplayNodeMode } from '@shared/database/enum/display-mode.enum';
import { formatter } from '@shared/telegram/util/formatter.util';

const displayNodeModeMenu = new MenuTemplate<BotContext>((ctx) => {
  const currentValue = ctx.session.displayNodeMode ?? DisplayNodeMode.Tag;

  return {
    text: formatter(
      ctx.t('display-mode-detail', {
        current: ctx.t(`display-mode-${currentValue}`),
      }),
    ),
    parse_mode: 'MarkdownV2',
  };
});

displayNodeModeMenu.select(
  'display-node-mode',
  [DisplayNodeMode.Address, DisplayNodeMode.Tag],
  {
    columns: 1,
    buttonText: (ctx, key) => ctx.t(`display-mode-${key}`),
    isSet: (ctx, key) => ctx.session.displayNodeMode === key,
    set: (ctx, key: DisplayNodeMode) => {
      ctx.session.displayNodeMode = key;

      return true;
    },
  },
);

export default displayNodeModeMenu;
