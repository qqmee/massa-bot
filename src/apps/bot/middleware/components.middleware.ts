import { BotContext } from '../bot.interfaces';

export const componentsMiddleware = (components: object) => {
  return async (ctx: BotContext, next: any) => {
    for (const property in components) {
      ctx[property] = components[property];
    }

    return next();
  };
};
