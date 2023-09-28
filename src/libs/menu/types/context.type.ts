import { Context } from 'grammy';

export type BotContext = Context & { t: (key: string) => string };
