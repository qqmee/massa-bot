import { addBackButtons } from './template/back-button.template';
import { MenuTree } from './components/menu-tree';
import { BotContext } from './types/context.type';
import { createFileTemplate } from './template/file.template';

export async function buildMenu(
  tree: MenuTree,
  i18nKeyMenu?: string,
  joinLastRow?: Array<string>,
) {
  const menu = await createFileTemplate(tree, i18nKeyMenu);

  for (const leaf of tree.getChilds()) {
    const submenu = await buildMenu(leaf);
    addBackButtons(submenu);

    const leafBasename = leaf.getBasename();

    const fullName = tree.isRoot()
      ? leafBasename
      : `${tree.getBasename()}-${leafBasename}`;

    menu.submenu((ctx: BotContext) => ctx.t(fullName), leafBasename, submenu, {
      joinLastRow: joinLastRow?.includes(fullName),
    });
  }

  return menu;
}
