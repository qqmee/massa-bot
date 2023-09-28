import { Context } from 'grammy';
import { Identity } from '../types/identity.type';

export const getIdentity = (ctx: Context): Identity => {
  return {
    userId: ctx.from.id,
    chatId: ctx.chat.id,
    botId: ctx.me.id,
  };
};
