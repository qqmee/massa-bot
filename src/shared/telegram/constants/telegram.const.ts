export const TELEGRAM_MIDDLEWARES = Symbol('TELEGRAM_MIDDLEWARES');

/**
 * {ru: TelegramCommand[], en: TelegramCommand[]}
 */
export const TELEGRAM_COMMANDS = Symbol('TELEGRAM_COMMANDS');

/**
 * ['ru', 'en']
 */
export const TELEGRAM_LOCALES = Symbol('TELEGRAM_LOCALES');

/**
 * Map of bot instances
 */
export const TELEGRAM_BOT = Symbol('TELEGRAM_BOT');
