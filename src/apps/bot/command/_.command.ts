import { Ctx, Update, On } from '@grammyjs/nestjs';
import { UseFilters } from '@nestjs/common';

import { menuMiddleware } from '@bot/middleware/menu.middleware';
import { BotContext } from '../bot.interfaces';
import { ExceptionFilter } from '../filters/exception.filter';
import { MENU_SHORTCUT, MENU_ROUTES } from '../menu/menu.const';
import { Command } from '../enums/command.enum';

@Update()
@UseFilters(ExceptionFilter)
export class OnMessage {
  /**
   * Menu Handler. Commands /start, /help, /mirror, ... etc
   */
  @On('message')
  async catchAll(@Ctx() ctx: BotContext) {
    const message = (ctx?.message?.text || '').trim();
    console.log('message', message);

    if (message.startsWith('/')) {
      if (message === '/start') {
        this.onStart(ctx);
      }

      // remove first "/"
      const path = this.resolvePath(message.substring(1));

      if (path) {
        const middleware = await menuMiddleware();
        return middleware.replyToContext(ctx, path);
      }
    }
  }

  /**
   * Unset flag
   */
  private onStart(ctx: BotContext) {
    const isBlocked = ctx.session.isBlocked;
    if (!isBlocked) return;

    console.log('unlock');
    ctx.session.isBlocked = false;
  }

  private resolvePath(message: string): string | void {
    const shortcut = MENU_SHORTCUT.get(message as Command);
    if (shortcut) return shortcut;

    if (MENU_ROUTES.has(message)) return `/${message}/`;
  }
}
