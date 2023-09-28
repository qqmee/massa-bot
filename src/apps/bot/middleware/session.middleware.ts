import { session } from 'grammy';
import { ISession, TypeormAdapter } from '@grammyjs/storage-typeorm';
import { Repository } from 'typeorm';

import { Environment } from '@env';
import { Session } from '@shared/database/types/session.type';

function createInitialSessionData(): Session {
  return {
    createdAt: new Date(),
    __language_code: Environment.FALLBACK_LOCALE,
  };
}

export function getSessionKey(
  botId: string | number,
  userId: string | number,
  chatId: string | number,
) {
  return JSON.stringify([+botId, +userId, +chatId]);
}

export const sessionMiddleware = (repository: Repository<ISession>) => {
  return session({
    initial: createInitialSessionData,
    storage: new TypeormAdapter({ repository }),
    getSessionKey: (ctx) => {
      // Give every user their one personal session storage per chat with the bot
      // (an independent session for each group and their private chat)
      return ctx.me === undefined ||
        ctx.from === undefined ||
        ctx.chat === undefined
        ? undefined
        : getSessionKey(ctx.me.id, ctx.from.id, ctx.chat.id);
    },
  });
};
