import { Bot, Context, Middleware, MiddlewareFn, SessionFlavor } from 'grammy';
import { ModuleMetadata } from '@nestjs/common';
import { Environment } from '@env';

type Locale = string;

export type TelegramBot = Bot<Context>;

export type TelegramBotMap = Map<number, TelegramBot>;

export type TelegramBotCommands = Map<Locale, TelegramCommand[]>;

export type TelegramBotLocales = Locale[];

export interface TelegramBotConfiguration {
  id: string;
  token: string;
}

export interface TelegramCommand {
  command: string;
  description: string;
}

export type TelegramModuleOptions = Middleware<Context>[];

export interface TelegramModuleOptionsFactory {
  createTelegramModuleOptions():
    | Promise<TelegramModuleOptions>
    | TelegramModuleOptions;
}

export interface TelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<TelegramModuleOptions> | TelegramModuleOptions;
  bots: typeof Environment.BOTS;
  commands: TelegramBotCommands;
  locales: typeof Environment.LOCALES;
}

export type SessionMiddleware = MiddlewareFn<Context & SessionFlavor<unknown>>;
