import { Injectable } from '@nestjs/common';

import { CachedService, CACHED_GITHUB_LATEST_RELEASE } from '@shared/cached';
import { GithubService } from '@shared/github/services/github.service';
import { Release } from '@shared/github/types/release.type';

@Injectable()
export class GithubComponent {
  constructor(
    private readonly githubService: GithubService,
    private readonly cachedService: CachedService,
  ) {}

  public async getRelease() {
    return this.cachedService.get<Release>(CACHED_GITHUB_LATEST_RELEASE, () => {
      return this.githubService.getLatestRelease();
    });
  }
}
