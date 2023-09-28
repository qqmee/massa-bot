import { MenuTemplate, createBackMainMenuButtons } from 'grammy-inline-menu';
import { BotContext } from '../types/context.type';

export function addBackButtons(menu: MenuTemplate<BotContext>) {
  menu.manualRow(
    createBackMainMenuButtons(
      (ctx) => ctx.t('action-back'),
      (ctx) => ctx.t('action-menu'),
    ),
  );
}
