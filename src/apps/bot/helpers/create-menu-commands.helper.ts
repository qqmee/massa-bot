import { Environment } from '@env';
import { i18n } from '@bot/middleware/i18n.middleware';
import { Command } from '@bot/enums/command.enum';
import { TelegramBotCommands } from '@shared/telegram/telegram.interfaces';

const commands = Object.values(Command);

export function createMenuCommandDescriptions(): TelegramBotCommands {
  const map = new Map();

  for (const locale of Environment.LOCALES) {
    const list = commands.map((command) => ({
      command,
      description: i18n.t(locale, `command-${command}`),
    }));

    map.set(locale, list);
  }

  return map;
}
