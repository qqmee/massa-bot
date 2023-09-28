import * as path from 'node:path';
import { MenuTree } from '@libs/menu';
import { Command } from '../enums/command.enum';

// top level menu order
export const MENU_TOP_ORDER = [
  'hosting',
  'stats',
  'community',
  'release',
  'display-node-mode',
  'notifications',
  'mirror',
  'locale',
  'help',
];

// top level menu group buttons
export const MENU_TOP_JOIN_LAST_ROW = ['display-node-mode', 'mirror', 'help'];

const FULL_PATH = path.join(__dirname);

export const MENU_TREE = MenuTree.createFrom(FULL_PATH).sort(MENU_TOP_ORDER);

export const MENU_ROUTES = MENU_TREE.getRoutes();

export const MENU_SHORTCUT = new Map([
  [Command.Start, '/'],
  [Command.Mode, '/display-node-mode/'],
  [Command.Stats, '/stats/network/'],
  [Command.Country, '/stats/country/'],
  [Command.Company, '/stats/company/'],
  [Command.Free, '/stats/free/'],
]);
