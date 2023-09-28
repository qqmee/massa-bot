import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

import { Environment } from '@env';
import { Company } from './types/company.type';
import { UnavailableException } from './exception/unavailable.exception';
import { Resolve } from './types/resolve.type';

@Injectable()
export class GeoipService {
  constructor(private readonly httpService: HttpService) {}

  public async getCompanies(ids?: number[]): Promise<Company[]> {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10_000);

    try {
      const source$ = this.httpService.post(
        `${Environment.GEOIP_RPC}/companies`,
        { ids },
        { signal: controller.signal },
      );

      const response = await lastValueFrom<AxiosResponse<Company[]>>(source$);
      return response.data;
    } catch (error) {
      throw new UnavailableException(`${GeoipService.name}.companies`, {
        cause: error,
      });
    }
  }

  public async resolve(ips: string[]): Promise<Resolve[]> {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10_000);

    try {
      const source$ = this.httpService.post(
        `${Environment.GEOIP_RPC}/batch`,
        { ips: [...new Set(ips)] },
        { signal: controller.signal },
      );

      const response = await lastValueFrom<AxiosResponse<Resolve[]>>(source$);
      return response.data;
    } catch (error) {
      throw new UnavailableException(`${GeoipService.name}.resolve`, {
        cause: error,
      });
    }
  }
}
