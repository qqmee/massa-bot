import { Injectable } from '@nestjs/common';
import { CachedService, CACHED_HOSTING } from '@shared/cached';
import { GeoipService } from '@shared/geoip/geoip.service';

@Injectable()
export class RefsComponent {
  constructor(
    private readonly geoipService: GeoipService,
    private readonly cachedService: CachedService,
  ) {}

  public async getHosting() {
    return this.cachedService.get(CACHED_HOSTING, async () => {
      return (await this.geoipService.getCompanies())
        .filter((company) => company.refUrl)
        .reduce((acc, company) => {
          const isMIR = company.payments.includes('mir');
          const isBitcoin = company.payments.includes('bitcoin');

          if (company.type === 'hosting' && isMIR) {
            acc.push({ ...company, tag: 'mir' });
          }

          if (company.type === 'hosting' && isBitcoin) {
            acc.push({ ...company, tag: 'crypto' });
          }

          if (company.type === 'vpn') {
            acc.push({ ...company, tag: 'vpn' });
          }

          return acc;
        }, []);
    });
  }
}
