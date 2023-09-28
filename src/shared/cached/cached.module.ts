import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { CachedService } from './cached.service';

@Global()
@Module({
  imports: [CacheModule.register({ isGlobal: true, max: 100 })],
  providers: [CachedService],
  exports: [CachedService],
})
export class CachedModule {}
