import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createHash } from 'node:crypto';

@Injectable()
export class CachedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get<T>(
    cacheNS: string,
    fn: () => Promise<T> | T,
    ...cacheArgs: any[]
  ): Promise<T> {
    const key = this.getNsKey(cacheNS, cacheArgs);
    const cacheValue = await this.cacheManager.get<T>(key);

    if (cacheValue) {
      return cacheValue;
    }

    const data = await fn();
    const ttl = 2 * 60 * 1000; // 2 minutes
    await this.cacheManager.set(key, data, ttl);

    return data;
  }

  private getNsKey(key: string, data: unknown) {
    if (!data) return key;

    const hash = createHash('md5').update(JSON.stringify(data)).digest('hex');

    return `${key}_${hash}`;
  }
}
