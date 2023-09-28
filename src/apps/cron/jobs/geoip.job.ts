import { Injectable, Logger } from '@nestjs/common';

import { AbstractJob } from './abstract.job';
import { NodeComponent } from '@bot/components/node.component';
import { GeoipService } from '@shared/geoip/geoip.service';
import { InfoService } from '@shared/database/services/info.service';

/**
 * Получение companyId, asn для IP от провайдера GeoIP
 * для нод с текущим мажорным релизом и без информации о релизе
 */
@Injectable()
export class GeoipJob extends AbstractJob {
  timeout = 5_000;
  logger = new Logger(GeoipJob.name);

  public constructor(
    private readonly nodeComponent: NodeComponent,
    private readonly geoipService: GeoipService,
    private readonly infoService: InfoService,
  ) {
    super();
  }

  public async doWork() {
    const { version } = await this.infoService.getCurrentRelease();

    const ips = await this.nodeComponent.findIp({
      withoutAsn: true,
      gtVersion: version,
      limit: 271,
    });

    if (ips.length === 0) return;

    const resolved = (await this.geoipService.resolve(ips)).map((row) => ({
      ip: row.ip,
      asn: row.asn,
      countryCode: row.isoCode,
      companyId: row.company?.id ?? null,
    }));

    await this.nodeComponent.updateGeoip(resolved);
    this.logger.log(`Resolved ips=${resolved.length}`);
  }
}
