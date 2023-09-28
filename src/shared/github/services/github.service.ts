import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { LATEST_RELEASE } from '../constants/endpoint.const';
import { GitHubApiLatestRelease } from '../types/api-latest-release.type';
import { Release } from '../types/release.type';
import { numberFormat } from '@bot/helpers/number.format';
import { yyyymmddhhmm } from '@bot/helpers/date.format';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  public async getLatestRelease(signal?: AbortSignal): Promise<Release> {
    const source$ = this.httpService.get(LATEST_RELEASE, { signal });

    const res = await lastValueFrom(source$);
    return this.prepareLatestRelease(res.data);
  }

  private prepareLatestRelease(release: GitHubApiLatestRelease) {
    const assets = release.assets.map((asset) => {
      return {
        name: asset.name,
        size: numberFormat(asset.size / 1024 / 1024) + ' MB',
        url: asset.browser_download_url,
      };
    });

    return {
      name: release.name,
      date: yyyymmddhhmm(release.published_at),
      url: release.html_url,
      changelog:
        release.body.replaceAll(/[\#|\*|\@]/g, '').replaceAll('.md', '') ||
        '- N/A - ',
      assets,
    };
  }
}
