import { I18n } from '@grammyjs/i18n';
import { Context } from 'grammy';

import { Environment } from '@env';

export const i18n = new I18n<Context>({
  directory: 'locales',
  defaultLocale: Environment.FALLBACK_LOCALE,
  useSession: true,
});
