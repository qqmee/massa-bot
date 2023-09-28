// https://github.com/mihneadb/node-directory-tree
// dev.to...
import * as fs from 'node:fs';
import * as path from 'node:path';

import { FILE_INDEX, MENU_TREE_ROOT } from '../constants';

export class MenuTree {
  readonly #path: string;
  readonly #basename: string;
  readonly #children: Array<MenuTree>;

  // filled for top-level
  readonly #routes: Set<string>;

  private constructor(
    rootPath: string,
    basename: string,
    children = [],
    routes = new Set<string>(),
  ) {
    this.#path = rootPath;
    this.#basename = basename;
    this.#children = children;
    this.#routes = routes;
  }

  public isRoot() {
    return this.#basename === MENU_TREE_ROOT;
  }

  public getChilds() {
    return this.#children;
  }

  public getBasename() {
    return this.#basename;
  }

  public getPath() {
    return this.#path;
  }

  public getRoutes() {
    return this.#routes;
  }

  /**
   * Scan given `path` fs for *.menu.js files & directories
   *
   * @param path __dirname of *.menu.js
   * @returns Tree
   */
  public static createFrom(dirname: string) {
    const root = new MenuTree(dirname, MENU_TREE_ROOT);

    const stack = [root];

    while (stack.length) {
      const currentNode = stack.pop();
      if (!currentNode) break;

      const children = fs.readdirSync(currentNode.#path);

      children: for (const child of children) {
        // example match[1] for /menu/stats/free.menu.js
        // value: free
        const match = /^([\-a-z0-9]+)\.menu\.js$/.exec(child);
        const basename = match?.[1] ?? path.basename(child);

        const childPath = `${currentNode.#path}/${child}`;
        const childNode = new MenuTree(childPath, basename);

        if (child === FILE_INDEX) {
          // skip index.menu.js file
          continue children;
        }

        if (fs.statSync(childNode.#path).isDirectory()) {
          stack.push(childNode);
        } else if (!match) {
          // example: *.d.ts, *.const.ts
          continue children;
        }

        currentNode.#children.push(childNode);

        const route = currentNode.isRoot()
          ? basename
          : `${currentNode.#basename}/${basename}`;

        root.#routes.add(route);
      }
    }

    return root;
  }

  /**
   * Mutable sorting for top-level menu
   */
  public sort(order?: ReadonlyArray<string>): MenuTree {
    this.#children.sort((a, b) => {
      return order.indexOf(a.getBasename()) - order.indexOf(b.getBasename());
    });

    return this;
  }
}
