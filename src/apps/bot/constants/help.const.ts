import { Command } from '../enums/command.enum';

type RouteGroup = 'main' | 'node' | 'extra' | 'stats';

export const HELP_COMMANDS: Record<RouteGroup, Command[]> = {
  main: [
    Command.Start,
    Command.Help,
    Command.Hosting,
    Command.Community,
    Command.Locale,
    Command.Mirror,
  ],
  node: [Command.My, Command.Delete, Command.Add, Command.Mode],
  stats: [
    Command.Ip,
    Command.Free,
    Command.Country,
    Command.Company,
    Command.Version,
    Command.Stats,
  ],
  extra: [Command.Release],
};
