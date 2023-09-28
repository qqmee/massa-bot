import { MenuTemplate } from 'grammy-inline-menu';

import { Environment } from '@env';
import { BotContext } from '../bot.interfaces';

const localeMenu = new MenuTemplate<BotContext>((ctx) => {
  return ctx.t('locale');
});

localeMenu.select('locale', Environment.LOCALES, {
  columns: 1,
  buttonText: (ctx, key) => ctx.t(`locale-${key}`),
  isSet: (ctx, key) => ctx.session.__language_code === key,
  set: (ctx, key) => {
    ctx.i18n.setLocale(key);

    return true;
  },
});

export default localeMenu;
