import { MenuTemplate } from 'grammy-inline-menu';

import { BotContext } from '@bot/bot.interfaces';
import { releaseFormat } from '@bot/formatters/release.format';

export const releaseMenu = new MenuTemplate<BotContext>(async (ctx) => {
  const locale = await ctx.i18n.getLocale();
  const release = await ctx.githubComponent.getRelease();

  return {
    text: releaseFormat(locale, release),
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true,
  };
});

export default releaseMenu;
