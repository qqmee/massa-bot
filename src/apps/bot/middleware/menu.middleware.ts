import { MenuMiddleware } from 'grammy-inline-menu';

import { buildMenu } from '@libs/menu';
import { MENU_TOP_JOIN_LAST_ROW, MENU_TREE } from '../menu/menu.const';
import { BotContext } from '../bot.interfaces';

let middleware: MenuMiddleware<BotContext>;

export const menuMiddleware = async () => {
  if (!middleware) {
    const menu = await buildMenu(MENU_TREE, 'root', MENU_TOP_JOIN_LAST_ROW);
    middleware = new MenuMiddleware('/', menu);
  }

  return middleware;
};
