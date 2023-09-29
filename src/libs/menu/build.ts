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

  if (tree.isUrl()) {
    return menu;
  }

  for (const leaf of tree.getChilds()) {
    const submenuOrUrl = await buildMenu(leaf);

    if (leaf.isUrl()) {
      menu.url(
        (ctx) => ctx.t(leaf.getBasename()),
        submenuOrUrl as unknown as string,
      );

      continue;
    }

    addBackButtons(submenuOrUrl);

    const leafBasename = leaf.getBasename();

    const fullName = tree.isRoot()
      ? leafBasename
      : `${tree.getBasename()}-${leafBasename}`;

    menu.submenu(
      (ctx: BotContext) => ctx.t(fullName),
      leafBasename,
      submenuOrUrl,
      {
        joinLastRow: joinLastRow?.includes(fullName),
      },
    );
  }

  return menu;
}
