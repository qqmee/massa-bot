import { MenuTemplate } from 'grammy-inline-menu';
import { BotContext } from '@bot/bot.interfaces';

const notificationsMenu = new MenuTemplate<BotContext>((ctx) => {
  return ctx.t('notifications');
});

notificationsMenu.choose('notification', ['rolls', 'github'], {
  columns: 1,
  buttonText: (ctx, key) => {
    const icon = ctx.session[`notifications${formatKey(key)}`] ? '✅' : '🔕';
    return `${icon} ${ctx.t(`notifications-${key}`)}`;
  },
  do: (ctx, selected) => {
    const key = formatKey(selected);

    ctx.session[`notifications${key}`] = !ctx.session[`notifications${key}`];
    return true;
  },
});

function formatKey(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export default notificationsMenu;
