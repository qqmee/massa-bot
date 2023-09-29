import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { NestjsGrammyModule, getBotName } from '@grammyjs/nestjs';

import {
  TELEGRAM_BOT,
  TELEGRAM_LOCALES,
  TELEGRAM_COMMANDS,
  TELEGRAM_MIDDLEWARES,
} from './constants/telegram.const';
import { TelegramBot, TelegramModuleAsyncOptions } from './telegram.interfaces';
import { TelegramService } from './services/telegram.service';
import { MessengerService } from './services/messenger.service';

@Global()
@Module({})
export class TelegramModule implements NestModule {
  public constructor(private readonly telegramService: TelegramService) {}

  public configure(consumer: MiddlewareConsumer) {
    return this.telegramService.configure(consumer);
  }

  public static forRootAsync(
    options: TelegramModuleAsyncOptions,
  ): DynamicModule {
    const BotModules = this.createBotImports(options);
    const MiddlewareProvider = this.createAsyncMiddlewareProvider(options);
    const ValueProviders = this.createValueProviders(options);
    const BotProvider = this.createAsyncBotProvider(options);

    return {
      module: TelegramModule,
      imports: [...BotModules, ...options.imports],
      providers: [
        ...ValueProviders,
        MiddlewareProvider,
        TelegramService,
        MessengerService,
        BotProvider,
      ],
      exports: [MessengerService, BotProvider],
    };
  }

  private static createBotImports({
    bots,
  }: TelegramModuleAsyncOptions): DynamicModule[] {
    return bots.map((config) => {
      return NestjsGrammyModule.forRoot({
        botName: config.id,
        token: config.token,
        useWebhook: true,
      });
    });
  }

  private static createAsyncMiddlewareProvider(
    options: TelegramModuleAsyncOptions,
  ): Provider {
    if (!options.useFactory) {
      throw new Error('Invalid configuration. Must provide useFactory');
    }

    return {
      provide: TELEGRAM_MIDDLEWARES,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  private static createValueProviders({
    commands,
    locales,
  }: TelegramModuleAsyncOptions): Provider[] {
    return [
      {
        provide: TELEGRAM_COMMANDS,
        useValue: commands,
      },
      {
        provide: TELEGRAM_LOCALES,
        useValue: locales,
      },
    ];
  }

  private static createAsyncBotProvider({
    bots,
  }: TelegramModuleAsyncOptions): Provider {
    const injectNames = bots.map((bot) => getBotName(bot.id));

    return {
      provide: TELEGRAM_BOT,
      inject: [TELEGRAM_MIDDLEWARES, ...injectNames],
      useFactory: async (middlewares, ...bots: TelegramBot[]) => {
        const map = new Map();

        for (const bot of bots) {
          for (const middleware of middlewares) {
            bot.use(middleware);
          }

          map.set(bot.botInfo.id, bot);
        }

        return map;
      },
    };
  }
}
