import { MenuTemplate } from 'grammy-inline-menu';
import { BotContext } from '@bot/bot.interfaces';
import { PaginationMenuEnum } from '@bot/enums/pagination-menu.enum';

interface FetchDataOptions {
  limit?: number;
  offset?: number;
}

interface FetchData<FetchDataType> {
  total?: number;
  data: FetchDataType;
}

interface PaginationMenuOptions<FetchDataType> {
  limit?: number;
  fetchData: (
    ctx: BotContext,
    options: FetchDataOptions,
  ) => Promise<FetchData<FetchDataType>>;
  render: (
    ctx: BotContext,
    data: FetchData<FetchDataType>,
    currentPage: number,
  ) => string | Promise<string>;
}

function extractPageFromCallbackQuery(
  callbackQuery: string | undefined,
): number {
  // example:
  // 1) /release/release-changelog/:1
  // 2) /release/release-changelog/
  // random error case {1,2}
  // 1) /release/release-changelog/:300
  const match = callbackQuery?.match(/^[a-z\-\/]+(\/|:([\d]{1,2}))$/);

  const page = parseInt(match?.[2], 10);
  return page > 0 ? page : 1;
}

function createMenu<FetchDataType>(
  config: PaginationMenuOptions<FetchDataType>,
) {
  const { limit, fetchData, render } = config;

  return new MenuTemplate<BotContext>(async function (ctx) {
    const page = extractPageFromCallbackQuery(ctx.callbackQuery?.data);
    const options = limit ? { offset: (page - 1) * limit, limit } : {};

    const data = await fetchData(ctx, options);

    return {
      text: await render(ctx, data, page),
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    };
  });
}

const dictionary: Record<string, MenuTemplate<BotContext>> = {};

export const createPaginationMenu = <FetchDataType = unknown>(
  name: PaginationMenuEnum,
  config: PaginationMenuOptions<FetchDataType>,
): MenuTemplate<BotContext> => {
  if (name in dictionary) {
    return dictionary[name];
  }

  const menu = createMenu<FetchDataType>(config);

  if (config?.limit) {
    menu.pagination('', {
      getTotalPages: async function (ctx) {
        const { limit, fetchData } = config;

        const page = extractPageFromCallbackQuery(ctx.callbackQuery?.data);
        const offset = (page - 1) * limit;

        const { total } = await fetchData(ctx, { offset, limit });

        if (!total) return 1;
        return Math.ceil(total / limit);
      },
      getCurrentPage: (ctx: BotContext) => {
        return extractPageFromCallbackQuery(ctx.callbackQuery?.data);
      },
      setPage: () => {
        // do nothing
        // chill
      },
    });
  }

  dictionary[name] = menu;
  return menu;
};
