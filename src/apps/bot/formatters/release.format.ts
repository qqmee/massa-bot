import { i18n } from '@bot/middleware/i18n.middleware';
import { Release } from '@shared/github/types/release.type';
import { formatter } from '@shared/telegram/util/formatter.util';

export function releaseFormat(locale: string, release: Release) {
  const assets = release.assets.map((asset) => {
    const matched = asset.name.match(/\_release\_(.*?)\./);
    const name = matched.length > 1 ? matched[1] : asset.name;

    return i18n.t(locale, 'release-detail-asset', {
      name: formatter(name, true),
      size: formatter(asset.size),
      url: formatter(asset.url, true),
    });
  });

  return i18n.t(locale, 'release-detail', {
    name: formatter(release.name),
    date: formatter(release.date),
    url: formatter(release.url),
    assets: assets.join('\n').trimEnd(),
  });
}
