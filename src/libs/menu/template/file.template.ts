import * as fs from 'node:fs';
import { MenuTemplate } from 'grammy-inline-menu';

import { importMenu } from '../util/import-menu';
import { FILE_INDEX } from '../constants';
import { MenuTree } from '../components/menu-tree';
import { BotContext } from '../types/context.type';

export async function createFileTemplate(
  tree: MenuTree,
  i18nKeyRootMenu: string,
) {
  const path = tree.getPath();
  if (!tree.getChilds().length) {
    return importMenu(path);
  }

  const filePathIndex = `${path}/${FILE_INDEX}`;

  if (!fs.existsSync(filePathIndex)) {
    return new MenuTemplate<BotContext>((ctx) => {
      const name = tree.isRoot() ? i18nKeyRootMenu : tree.getBasename();

      return {
        text: ctx.t(name),
        disable_web_page_preview: true,
      };
    });
  }

  return importMenu(filePathIndex);
}
