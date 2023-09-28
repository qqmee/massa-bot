import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GeoipService } from './geoip.service';

@Global()
@Module({
  imports: [HttpModule.register({ timeout: 5_000, maxRedirects: 0 })],
  providers: [GeoipService],
  exports: [GeoipService],
})
export class GeoipModule {}
